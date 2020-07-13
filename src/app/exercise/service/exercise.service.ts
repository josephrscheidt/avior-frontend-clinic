import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Exercise } from './../exercise';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './../../common/message.service';
import { DataService } from './../../common/dataservice';

@Injectable({
	providedIn: 'root'
})

export class ExerciseService extends DataService {

	apiURL: string = Config.API_URL+"exercise/";

	public selectedExercise: Exercise;

	exercises: Exercise[];

	public firstPage: string = "";

	public prevPage: string = "";

	public nextPage: string = "";

	public lastPage: string = "";

	constructor(private httpClient: HttpClient, private message: MessageService) {
		super();
	}

	public groupExercises(){
		return this.httpClient.post(`${this.apiURL}group/`,{});
	}

	public editExercise(exercise) {
		if (this.selectedExercise.id == null){
			this.createExercise(exercise).subscribe();
		}else{
			this.updateExercise(exercise).subscribe();
		}
	}

	public createExercise(exercise){
		return this.httpClient.post(`${this.apiURL}`,exercise)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to create exercise: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res) {
					this.selectedExercise = res;
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('sa', 'exercise', 'exercise');
					this.refresh();
				}
			})
		);
	}

	public updateExercise(exercise){
		return this.httpClient.put(`${this.apiURL}${this.selectedExercise.id}`, exercise)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to upadate exercise: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res) {
					this.selectedExercise = res;
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('su', 'exercise', 'exercise');
					this.refresh();
				}
			})
		);
	}

	public deleteExercise(id){
		return this.httpClient.delete(`${this.apiURL}${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to delete exercise: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{ if(res) {this.refresh()} })
		);
	}

	public getExercise(id: number): Observable<Exercise> {
		return this.httpClient.get<Exercise>(`${this.apiURL}edit/${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find exercise: ' + err.error.message);
				return of(null);
			}),
			tap(res => { if(res) {this.selectedExercise = res } })
		);
	}

	public getExercises(): Observable<Exercise[]>{
		if (this.checkExpiration('exercises')){
			return of(null);
		}
		else{
			return this.httpClient.get<Exercise[]>(`${this.apiURL}`)
			.pipe(
				catchError(err => {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Failed to get exercises: ' + err.error.message);
					return of(null);
				}),
				tap(res =>{ this.cache('exercises', res) })
			);
		}
	}


}
