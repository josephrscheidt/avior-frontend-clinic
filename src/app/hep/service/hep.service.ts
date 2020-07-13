import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from './../../config';
import { Exercise } from './../exercise';
import { AssignedExercise } from '../assigned-exercise';
import { DataService } from './../../common/dataservice';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './../../common/message.service';

@Injectable({
  providedIn: 'root'
})

export class HepService extends DataService{
  allExercises:any;
  exercises:any;
  assignedExercises:any;
  patientResult:any;
  aliasNames:any;

  constructor(public message: MessageService, private httpClient: HttpClient) {
    super();
  }

  public editExercise(exerciseId) {
    return this.httpClient.get(`${Config.API_URL}exercise/edit/${exerciseId}`)
    .pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to edit exercise: " + err.error.message);
				return of(null);
      })
    );
  }

  public editTreatmentExercise(exerciseId) {
    return this.httpClient.get(`${Config.API_URL}patient-exercise/edit/${exerciseId}`)
    .pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to edit exercise: " + err.error.message);
				return of(null);
      })
    );
  }

  public getAllExercises(): Observable<Exercise[]> {
    if (this.checkExpiration('allExercises')){
      return of(null);
    }else{
      return this.httpClient.get<Exercise[]>(`${Config.API_URL}exercise-all/`)
      .pipe(
        catchError(err => {
          this.message.initMessage();
          this.message.setMessage('sc', "", "", "Failed to get exercises: " + err.error.message);
          return of(null);
        }),
        tap(res =>{ if(res) {this.cache('allExercises', res)} })
      );
    }
  }

  public setExercises(exercises) {
    this.cache('exercises', exercises);
  }

  public getAssignedExercises(treatmentId, fetchNew=true): Observable<AssignedExercise[]> {
    if (this.checkExpiration('assignedExercises') && !fetchNew){
      return of(null);
    }else{
      return this.httpClient.get<AssignedExercise[]>(`${Config.API_URL}exercise-assigned/${treatmentId}`)
      .pipe(
        catchError(err => {
          this.message.initMessage();
          this.message.setMessage('sc', "", "", "Failed to get assigned exercise: " + err.error.message);
          return of(null);
        }),
        tap(res => { if(res) {this.cache('assignedExercises', res); } })
      );
    }
  }

  public removeExercise(id){
    return this.httpClient.delete(`${Config.API_URL}patient-exercise/${id}`)
    .pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to remove exercise: " + err.error.message);
				return of(null);
      })
    );
  }

  public createExercise(exercise) {
    return this.httpClient.post(`${Config.API_URL}patient-exercise`, exercise)
    .pipe(
			catchError(err => {
        this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to add exercise: " + err.error.message);
				return of(null);
      }),
      tap(res=>{if(res){ this.message.setMessage("sa", "exercise"); } })
    );
  }

  public updateExercise(exercise, exerciseId){
    return this.httpClient.put(`${Config.API_URL}patient-exercise/${exerciseId}`, exercise)
    .pipe(
			catchError(err => {
        this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to update exercise: " + err.error.message);
				return of(null);
      }),
      tap(res=>{ if(res) { this.message.setMessage("su", "assigned exercise"); } })
    );
  }

  public updateWeekDay(treatmentId, day) {
    return this.httpClient.post(`${Config.API_URL}patient-exercise-day/${treatmentId}`, day)
    .pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to update program frequency: " + err.error.message);
				return of(null);
      })
    );
	}

}
