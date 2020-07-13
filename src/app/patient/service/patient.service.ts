import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Patient } from './../patient';
import { Injury } from './../../injury/injury';
import { Template } from './../../template/template';
import { Therapist } from './../../therapist/therapist';
import { Clinic } from './../../clinic/clinic';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './../../common/message.service';
import { DataService } from './../../common/dataservice';

@Injectable({
	providedIn: 'root'
})
export class PatientService extends DataService{

	apiURL: string = Config.API_URL+"patient/";

	public selectedPatient: Patient;

	injuries: any;

	templates: any;

	therapists: any;

	clinics: any;

	myPatients: any;

	allPatients: any;

	searchPatients: Patient[];

	discharges:any;

	constructor(private httpClient: HttpClient, public message: MessageService) {
		super();
	}

	public editPatient(patient, clinic_id){
		if(!patient.id){
			this.createPatient(patient, clinic_id).subscribe();
		}else{
			this.updatePatient(patient, clinic_id).subscribe();
		}
	}

	public createPatient(patient, clinic_id){
		return this.httpClient.post(`${this.apiURL}`,patient)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to create patient: ' + err.error.message);
				return of(null)
			}),
			tap(res => {
				if (res){
					this.message.setMessage('sa', 'therapist', 'dashboard/' + clinic_id);
					this.refresh('allPatients'); 
				}
			})
		);
	}

	public updatePatient(patient, clinic_id){
		return this.httpClient.put(`${this.apiURL}${patient.id}`, patient)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to update patient: ' + err.error.message);
				return of(null);
			}),
			tap(res => { 
				if (res){
					this.message.setMessage('su', 'therapist', 'dashboard/' + clinic_id);
					this.refresh('allPatients'); 
				}
			})
		);
	}

	public enablePendingPatient(patient, patientId){
		return this.httpClient.put(`${this.apiURL}pending/${patientId}`, patient)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to activate patient: ' + err.error.message);
				return of(null);
			}),
			tap(res => {
				if(res) {
					this.refresh('allPatients');
					this.message.setMessage('su', 'patient');
				} 
			})
		);
	}

	public deletePatient(id){
		return this.httpClient.delete(`${this.apiURL}${id}`)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to delete patient ' + err.error.message);
				return of(null);
			}),
			tap(res => { if(res) {this.refresh('allPatients')} })
		);
	}

	public getPatient(id: number){
		return this.httpClient.get<Patient>(`${this.apiURL}edit/${id}`)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find patient: ' + err.error.message);
				return of(null);
			}),
			tap(res => { if(res) {this.selectedPatient = res} })
		);
	}

	public getAllPatients(clinic_id: number): Observable<Patient[]>{
		if (this.checkExpiration('allPatients')){
			return of(null);
		}
		else{
			return this.httpClient.get<Patient[]>(`${this.apiURL}all/${clinic_id}`)
			.pipe(
				catchError(err =>{
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Failed to find all patients: ' + err.error.message);
					return of(null);
				}),
				tap(res => { if(res) {this.cache('allPatients', this.sortPatientList(res))} })
			);
		}
	}


	public getTemplates(injury_id: number){
		return this.httpClient.get(`${Config.API_URL}templateInjury/${injury_id}`)
		.pipe(
			catchError(err =>{
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find templates: ' + err.error.message);
				return of(null);
			})
		);
	}


	public getPatients(therapistId){
		if (this.checkExpiration('myPatients')){
			return of(null);
		}
		else{
			return this.httpClient.get<Patient[]>(`${this.apiURL}${therapistId}`)
			.pipe(
				catchError(err =>{
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Failed to find patients: ' + err.error.message);
					return of(null);
				}),
				tap(res => { if(res) {this.cache('myPatients', this.sortPatientList(res))} })
			);
		}
	}

	public getTherapists(clinicId){
		if (this.checkExpiration('therapists')){
			return of(null);
		}
		else{
			return this.httpClient.get(`${Config.API_URL}clinic-therapist/${clinicId}`)
			.pipe(
				catchError(err =>{
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Failed to find therapists: ' + err.error.message);
					return of(null);
				}),
				tap(res => { if(res) {this.cache('therapists', res)} })
			);
		}
	}


	public getPatientDetails(id){
		return this.httpClient.get(`${Config.API_URL}patient-profile/${id}`)
		.pipe(
			catchError(err =>{
				// this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find patient details ' + err.error.message);
				return of(null);
			}),
			// tap(res=>{if(res) {console.log(res); } })
		);
	}


	public getLevelAndFunction(therapist, clinic){
		return this.httpClient.get(`${Config.API_URL}get-level-and-function/${therapist}/${clinic}`)
		.pipe(
			catchError(err =>{
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failure : ' + err.error.message);
				return of(null);
			})
		);
	}


	public painGraphData(treatment:any) {
		return this.httpClient.get(`${Config.API_URL}get-patient-graph/${treatment}`);
	}

	public getDischarges() {
		if (this.checkExpiration('discharges')){
			return of(null);
		}
		return this.httpClient.get(`${Config.API_URL}get-discharges`)
		.pipe(
			catchError(err =>{
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find discharge reasons: ' + err.error.message);
				return of(null);
			}),
			tap(res=>{if(res) {this.cache('discharges', res); } })
		);
	}

	public dischargePatient(patient, discharge) {
		return this.httpClient.put(`${Config.API_URL}discharge-patient/${patient}`,discharge)
		.pipe(
			catchError(err =>{
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to discharge patient: ' + err.error.message);
				return of(null);
			}),
			tap(res => {if(res) {this.refresh('allPatients');} })
		);
	}
	sortPatientList (patients) {
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
		this.sortAlphabetically(activePatients, 'name');
		this.sortAlphabetically(dischargedPatients, 'name');
		this.sortAlphabetically(pendingPatients, 'name');
		let sortedPatientList = activePatients.concat(pendingPatients,dischargedPatients);
		return sortedPatientList;
	}

	sortAlphabetically (array, property) {
			array.sort(function(a, b) {
			var textA = a[property].toUpperCase();
			var textB = b[property].toUpperCase();
			return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
		});
		}
}
