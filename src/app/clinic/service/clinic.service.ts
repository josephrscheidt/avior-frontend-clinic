import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Clinic } from './../clinic';
import { Config } from './../../config';
import { Observable, of, from } from 'rxjs';
import { tap, catchError} from 'rxjs/operators';
import { DataService } from './../../common/dataservice';
import { MessageService } from './../../common/message.service';

@Injectable({
	providedIn: 'root'
})
export class ClinicService extends DataService {

	apiURL: string = Config.API_URL+"clinic/";

	public selectedClinic: Clinic;

	clinics: Clinic[];

	constructor(private httpClient: HttpClient, private message: MessageService) { super() }

	public editClinic(clinic) {
		if (this.selectedClinic.id == null){
			this.createClinic(clinic).subscribe();
		}else{
			this.updateClinic(clinic).subscribe();
		}
	}

	public createClinic(clinic): Observable<Clinic>{
		return this.httpClient.post<Clinic>(`${this.apiURL}`,clinic)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to create clinic: " + err.error.message);
				return of(null);
			}),
			tap(res => {
				if(res) {
					this.selectedClinic = res;
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('sa', 'clinic', 'clinic');
					this.refresh();
				}
			})
	);
	}

	public updateClinic(clinic): Observable<Clinic> {
		return this.httpClient.put<Clinic>(`${this.apiURL}${clinic.id}`, clinic)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', "", "", "Failed to update clinic: " + err.error.message);
				return of(null);
			}),
			tap(res => {
				if(res) {
					this.selectedClinic = res;
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('su', 'clinic', 'clinic');
					this.refresh();
				}
			})
		);
	}

	public deleteClinic(id){
		return this.httpClient.delete(`${this.apiURL}${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', "", "", err.error.message);
				return of(null);
			}),
			tap(res => { if(res) {this.refresh()} })
		);
	}

	public getClinic(id: number): Observable<Clinic>{
		return this.httpClient.get<Clinic>(`${this.apiURL}edit/${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', "", "", err.error.message);
				return of(null);
			}),
			tap(res =>{ if(res) {this.selectedClinic = res} })
		);
	}

	public getClinics(): Observable<Clinic[]>{
		//Check to see if the cache exists and hasn't expired yet
		if(this.checkExpiration('clinics')){
			return of(null);
		}else{
			//Get new list of clinics from Database
			return this.httpClient.get<Clinic[]>(`${this.apiURL}`)
			.pipe(
				catchError(err => {
					this.message.initMessage();
					this.message.setMessage('sc', "", "", err.error.message);
					return of(null);
				 }),
				tap(res =>{ if(res) {this.cache('clinics', res)} })
			);
		}
	}
}
