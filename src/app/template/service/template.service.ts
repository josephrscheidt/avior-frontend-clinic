import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Template } from './../template';
import { Injury } from './../../injury/injury';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './../../common/message.service';
import { DataService } from './../../common/dataservice';

@Injectable({
	providedIn: 'root'
})
export class TemplateService extends DataService {
	
	selectedTemplate: Template;
	
	public templates;

	public injuries: Injury[];

	apiURL: string = Config.API_URL+"template/";

	name: string;
	
	about_points: AboutPoint[];
	
	did_points: DidPoint[];

	question_points: QuestionPoint[];

	expectation_points: ExpectationPoint[];
	
	progression_points: ProgressionPoint[];

	constructor(private httpClient: HttpClient, public message: MessageService) { super() }

	// public getInjuries(){
	// 	return this.httpClient.get<Injury[]>(`${Config.API_URL}injury`);
	// }

	public createTemplate(template) {
		console.log('Posting to api');
		return this.httpClient.post(`${this.apiURL}`,template)
		.pipe(
			catchError(err=>{
				console.log(err);
				return of(null);
			}),
			tap(res=>{
				if(res){
					console.log(res);
				}
			})
		)
	}

	public createTemplateQuestions(questions) {
		return this.httpClient.post(`${Config.API_URL}tempquestion`,questions);
	}

	public createTemplatePhase(phases, flag) {
		return this.httpClient.post(`${Config.API_URL}phases/${flag}`, phases);
	}

	public createExercise(exercise) {
		return this.httpClient.post(`${Config.API_URL}patient-exercise`, exercise);
	}

	public updateWeekDay(treatmentId, day) {
		return this.httpClient.post(`${Config.API_URL}patient-exercise-day/${treatmentId}`, day);
	}

	public assignTreatment(assignData) {
		return this.httpClient.post(`${Config.API_URL}template-assign`,assignData);
	}

	public getTemplateQuestions(treatment_id, flag = "0") {
		return this.httpClient.get(`${Config.API_URL}template-question/${treatment_id}/${flag}`);
	}

	public getTemplateExercises(treatmentId) {
		return this.httpClient.get(`${Config.API_URL}injury-exercise/${treatmentId}`);
	}

	public editTemplate(templateId) {
		return this.httpClient.get(`${this.apiURL}${templateId}`);
	}

	public editQuestion(questionId, flag) {
		return this.httpClient.get(`${Config.API_URL}gettempquestion/${questionId}/${flag}`);
	}

	public editExercise(exerciseId) {
		return this.httpClient.get(`${Config.API_URL}exercise/edit/${exerciseId}`);
	}

	public editTreatmentExercise(exerciseId) {
		return this.httpClient.get(`${Config.API_URL}patient-exercise/edit/${exerciseId}`);
	}

	public editPhase(phaseId, flag) {
		return this.httpClient.get(`${Config.API_URL}phase/${phaseId}/${flag}`);
	}
	
	public updateTemplate(template, templateId){
		return this.httpClient.put(`${this.apiURL}${templateId}`, template);
	}

	public updateExercise(exercise, exerciseId){
		return this.httpClient.put(`${Config.API_URL}patient-exercise/${exerciseId}`, exercise);
	}

	public updateTemplatePhase(phase, phaseId, flag){
		return this.httpClient.put(`${Config.API_URL}phases/${phaseId}/${flag}`, phase);
	}

	public updateTemplateQuestions(question, questionId){
		return this.httpClient.put(`${Config.API_URL}tempquestion/${questionId}`, question);
	}

	public setPhaseSequence(sequence, phaseId){
		return this.httpClient.put(`${Config.API_URL}set-phase-sequence/${phaseId}`, sequence);
	}

	public getTemplatePhases(tempalteId, flag = '0') {
		return this.httpClient.get(`${Config.API_URL}phases/${tempalteId}/${flag}`);
	}

	public getTemplate(templateId) {
		return this.httpClient.get(`${this.apiURL}${templateId}`);
	}

	public getTemplates(): Observable<Template[]>{
		if (this.checkExpiration('templates')){
			return of(null);
		}
		else{
			return this.httpClient.get<Template[]>(`${this.apiURL}`)
			.pipe(
				catchError(err => {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Failed to get templates: ' + err.error.message);
					return of(null);
				}),
				tap(res =>{ if(res) {this.cache('templates', res)} })
			);
		}
	}

	public deleteTemplate(id){
		return this.httpClient.delete(`${this.apiURL}${id}`);
	}

	public removeExercise(id){
		return this.httpClient.delete(`${Config.API_URL}patient-exercise/${id}`);
	}

	public deleteTreatmentQuestion(id){
		return this.httpClient.delete(`${Config.API_URL}treatment-question/${id}`);
	}

	public deleteTemplateQuestion(id){
		return this.httpClient.delete(`${Config.API_URL}tempquestion/${id}`);
	}

	public deleteTemplatePhase(id, flag){
		return this.httpClient.delete(`${Config.API_URL}phases/${id}/${flag}`);
	}
}

export class AboutPoint {
    about_point: []
}

export class DidPoint {
    did_point: []
}

export class QuestionPoint {
    question_point: []
}

export class ProgressionPoint {
    progression_point: []
}

export class ExpectationPoint {
    expectation_point: []
}