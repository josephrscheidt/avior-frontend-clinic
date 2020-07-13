import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injury } from './../injury';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './../../common/message.service';
import { DataService } from './../../common/dataservice';

@Injectable({
	providedIn: 'root'
})
export class InjuryService extends DataService{

	apiURL: string = Config.API_URL+"injury/";

	public selectedInjury: Injury;

	public injuries;


	constructor(public message: MessageService, private httpClient: HttpClient) { super () }

	public editInjury(injury) {
		if (this.selectedInjury.id == null) {
			this.createInjury(injury).subscribe();
		}else{
			this.updateInjury(injury).subscribe();
		}
	}

	public createInjury(injury){
		return this.httpClient.post(`${this.apiURL}`,injury)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to create injury: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{ 
				if(res) {
					this.selectedInjury = res;
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('sa', 'injury', 'body-part');
					this.refresh(); 
				}
			})
		);
	}

	public updateInjury(injury){
		return this.httpClient.put(`${this.apiURL}${this.selectedInjury.id}`, injury)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to update injury: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{ 
				if(res) {
					this.selectedInjury = res;
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('su', 'injury', 'body-part');
					this.refresh(); 
				}
			})
		);
	}

	public deleteInjury(id){
		return this.httpClient.delete(`${this.apiURL}${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to delete injury: ' + err.error.message);
				return of(null);
			}),
			tap(res =>{ if(res) {this.refresh()} })
		);
	}

	public getInjury(id: number): Observable<Injury>{
		return this.httpClient.get<Injury>(`${this.apiURL}edit/${id}`)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to find injury: ' + err.error.message);
				return of(null);
			}),
			tap(res => { if(res) {this.selectedInjury = res} })
		);
	}

	public getInjuries(): Observable<Injury[]> {
		if (this.checkExpiration('injuries')){
			return of(null);
		}
		else{
			return this.httpClient.get<Injury[]>(`${this.apiURL}`)
			.pipe(
				catchError(err => {
					this.message.initMessage();
					this.message.setMessage('sc', '', '', 'Failed to get injuries: ' + err.error.message);
					return of(null);
				}),
				tap(res =>{ if(res) {
					this.cache('injuries', res);
				} })
			);
		}
	}
}
