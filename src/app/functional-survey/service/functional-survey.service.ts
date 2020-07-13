import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './../../common/message.service';
import { DataService } from './../../common/dataservice';


@Injectable({
	providedIn: 'root'
})

export class FunctionalSurveyService extends DataService {

	apiURL: string = Config.API_URL+"survey/";

	apiQuestionURL: string = Config.API_URL+"question/";

	surveys: any;

	questionTypes: any;


	constructor(private httpClient: HttpClient, private message: MessageService) { super(); }

	public createSurvey(survey){
		return this.httpClient.post(`${this.apiURL}`,survey)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to create survey: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res) {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Successfuly created survey');
					this.refresh();
				}
			})
		);
	}

	public updateSurvey(survey, surveyId){

		return this.httpClient.put(`${this.apiURL}${surveyId}`, survey)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to update survey: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res) {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Successfuly updated survey');
					this.refresh();
				}
			})
		);
	}

	public getDiagnosis(){
		return this.httpClient.get(`${Config.API_URL}template`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to get diagnosis: ' + err.error.message);
				return of(null);
			})
		);
	}

	public getSurveys(){
		if (this.checkExpiration('surveys')) {
			return of(null);
		}
		else{
			return this.httpClient.get(`${this.apiURL}`)
			.pipe(
				catchError(err => {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Failed to find surveys: ' + err.error.message);
					return of(null);
				}),
				tap(res =>{
					if(res) {
						this.cache('surveys', res);
					}
				})
			);
		}

	}

	public getSurvey(id: number){
		return this.httpClient.get(`${this.apiURL}edit/${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find survey: ' + err.error.message);
				return of(null);
			}),
		);
	}

	public deleteSurvey(id){
		return this.httpClient.delete(`${this.apiURL}${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to delete survey: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res) {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Successfuly deleted survey');
					this.refresh();
				}
			})
		);
	}

	/*Questions Services*/

	public getQuestionTypes(){
		if (this.checkExpiration('questionTypes')) {
			return of(null);
		}
		else {
			return this.httpClient.get(`${this.apiQuestionURL}types`)
			.pipe(
				catchError(err => {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Failed to find questions: ' + err.error.message);
					return of(null);
				}),
				tap(res =>{ if(res) {this.cache('questionTypes', res)} })
			);
		}

	}

	public createQuestion(question){
		return this.httpClient.post(`${this.apiQuestionURL}`,question)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to create question: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res) {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Successfuly created question');
					this.refresh();
				}
			})
		);
	}

	public updateQuestion(question, questionId){

		return this.httpClient.put(`${this.apiQuestionURL}${questionId}`, question)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to update question: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res) {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Successfuly updated question');
					this.refresh();
				}
			})
		);
	}

	public getQuestions(survey_id ){
		return this.httpClient.get(`${this.apiQuestionURL}${survey_id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find questions: ' + err.error.message);
				return of(null);
			}),
		);
	}

	public getQuestion(id: number){
		return this.httpClient.get(`${this.apiQuestionURL}edit/${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find question: ' + err.error.message);
				return of(null);
			}),
		);
	}

	public deleteQuestion(id){
		return this.httpClient.delete(`${this.apiQuestionURL}${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to delete question: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res) {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Successfuly deleted question');
					this.refresh();
				}
			})
		);
	}
}
