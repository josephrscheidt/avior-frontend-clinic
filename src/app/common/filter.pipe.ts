import { Pipe, PipeTransform } from '@angular/core';

import {VectorSpaceFactory} from './vector-space'

import {correct} from "misspellings";




@Pipe({
	name: 'filter'
})

export class FilterPipe implements PipeTransform {


	transform(items: any[], searchText: string, fields: string): any[] {

		let vectorSpaceFactory = new VectorSpaceFactory;

		let fieldsSeparate = fields.split('|');

		if(!items) return [];

		if(!searchText) return items;

		searchText = searchText.toLowerCase().trim();

		searchText = correct(searchText);

		let releventResults = items.filter( it => {

			let searchData = [];

			let fieldToCheck;
			let fieldToInterpret;
			fieldsSeparate.forEach((field)=>{

				let splitedFields = field.split('.');

				switch (splitedFields.length) {
					case 2:

					if(it[splitedFields[0]]){
						if((splitedFields[0] ==='tbl_treatment') && (splitedFields[1] === 'pt_id')){
							it[splitedFields[0]][splitedFields[1]] = it[splitedFields[0]][splitedFields[1]] + "";
						}

						fieldToCheck = it[splitedFields[0]][splitedFields[1]];
						fieldToInterpret = 'it.'+[splitedFields[0]]+'.'+[splitedFields[1]];

					}
					break;

					case 3:
					if(it[splitedFields[0]][splitedFields[1]]){
						fieldToCheck = it[splitedFields[0]][splitedFields[1]][splitedFields[2]];
						fieldToInterpret = 'it.'+[splitedFields[0]]+'.'+[splitedFields[1]]+'.'+[splitedFields[2]];
					}
					break;

					default:

					fieldToCheck = it[splitedFields[0]];
					fieldToInterpret = 'it.'+[splitedFields[0]];

					break;
				}

				if (fieldToCheck != null || fieldToCheck != undefined) {
					searchData.push(fieldToInterpret+'.toLowerCase().includes(searchText)');
				}
			});

			return eval(searchData.join(' || '));

		});


		if (releventResults[0] && releventResults[0].role_id){
			return sortPatientList(releventResults);
		}

		if(searchText == '' || releventResults.length == 0 || releventResults[0].description == null){
			return releventResults;
		}

		let processedQuery = vectorSpaceFactory.createDocumentFromString(searchText);
		let queryVector = vectorSpaceFactory.createVectorSpaceModel(processedQuery, processedQuery, releventResults);
		for (let i = 0 ; i < releventResults.length; i++){
			let result = releventResults[i];
			let resultTitle = vectorSpaceFactory.createDocumentFromString(result.title);
			let resultVector = vectorSpaceFactory.createVectorSpaceModel(processedQuery, resultTitle, releventResults);
			let cosineSimilarity = vectorSpaceFactory.calculateSimilarityIndex(queryVector, resultVector);
			result.rank = cosineSimilarity;
		}

		releventResults = releventResults.sort(function(a, b){
			if (a.rank > b.rank){
				return -1;
			}
			else if (a.rank < b.rank){
				return 1;
			}
			else{
				return 0;
			}
		})
		return releventResults;
	}



}
let sortPatientList = (patients) => {
	let activePatients = [];
	let pendingPatients = [];
	let dischargedPatients = [];

	for (let i = 0; i < patients.length; i++){
		let patient = patients[i];
		if (patient.is_active == 0){
			dischargedPatients.push(patient);
		}
		else if (patient.is_active == 1){
			activePatients.push(patient);
		}
		else if (patient.is_active == 100){
			pendingPatients.push(patient);
		}
	}
	sortAlphabetically(activePatients, 'name');
	sortAlphabetically(dischargedPatients, 'name');
	sortAlphabetically(pendingPatients, 'name');
	let sortedPatientList = activePatients.concat(pendingPatients,dischargedPatients);
	return sortedPatientList;
}

let sortAlphabetically = (array, property) => {
	array.sort(function(a, b) {
    var textA = a[property].toUpperCase();
    var textB = b[property].toUpperCase();
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
});
}
