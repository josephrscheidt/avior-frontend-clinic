import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Therapist } from './../therapist';
import { Clinic } from './../../clinic/clinic';
import { Config } from './../../config';
import { Observable, of, from } from 'rxjs';
import { map, tap, catchError} from 'rxjs/operators';
import { DataService } from './../../common/dataservice';
import { MessageService } from './../../common/message.service';

@Injectable({
	providedIn: 'root'
})
export class TherapistService extends DataService {

	apiURL: string = Config.API_URL+"therapist/";

	public selectedTherapist: Therapist;

	therapists: Therapist[];

	constructor(private httpClient: HttpClient, private message: MessageService) { super() }


	public editTherapist(therapist) {
		if (!therapist.id){
			this.createTherapist(therapist).subscribe();
		}else{
			this.updateTherapist(therapist).subscribe();
		}
	}

	public createTherapist(therapist): Observable<Therapist>{
		return this.httpClient.post<Therapist>(`${this.apiURL}`,therapist)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to create therapist: " + err.error.message);
				return of(null);
			}),
			tap(res => { 
				if(res) {
					this.message.setMessage('sa', 'therapist', 'therapist');
					this.refresh();
				}
			})
		);
	}

	public updateTherapist(therapist): Observable<Therapist>{
		return this.httpClient.put<Therapist>(`${this.apiURL}${therapist.id}`, therapist)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to update therapist: " + err.error.message);
				return of(null);
			}),
			tap(res => { this.refresh(); })
		);
	}

	public deleteTherapist(id){
		return this.httpClient.delete(`${this.apiURL}${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', "", "", err.error.message);
				return of(null);
			}),
			tap(res => { 
				if(res) {
					this.message.setMessage('su', 'therapist', 'therapist');
					this.refresh(); 
				}
			})
		);
	}

	public getTherapist(id: number): Observable<Therapist>{
		return this.httpClient.get<Therapist>(`${this.apiURL}edit/${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', "", "", err.error.message);
				return of(null);
			}),
			tap(res =>{ if(res) {this.selectedTherapist = res} })
		);
	}

	public getTherapists(): Observable<Therapist[]>{
		//Check to see if the cache exists and hasn't expired yet
		if(this.checkExpiration('therapists')){
			return of(null);
		}else{
			//Get new list of therapists from Database
			return this.httpClient.get<Therapist[]>(`${this.apiURL}`)
			.pipe(
				catchError(err => {
					this.message.initMessage();
					this.message.setMessage('sc', "", "", err.error.message);
					return of(null);
					}),
				tap(res =>{ if(res && res != []) {this.cache('therapists', res)} })
			);
		}	
	}

}
