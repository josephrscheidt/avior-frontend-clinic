import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './../../config';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './../../common/message.service';
import { DataService } from './../../common/dataservice';

const TOKEN = 'TOKEN';

@Injectable({
  providedIn: 'root'
})
export class HeadDashboardService extends DataService{

	apiURL: string = Config.API_URL+"goal/";
	
	clinicData: any;

	constructor(private httpClient: HttpClient, public message: MessageService) { 
		super();
	}

	public getDataByClinicID(id: number) {
		if (this.checkExpiration('clinicData')){
			return of(null);
		}else{
			return this.httpClient.get(`${Config.API_URL}analytics/${id}`)
			.pipe(
					catchError(err => {
						this.message.initMessage();
						this.message.setMessage('sc', '', '', 'Failed to find data: ' + err.error.message);
						return of(null);
					}),
					tap(res => { if(res) {this.cache('clinicData', res)}} )
				);
		}
	  }

	patient_pain(treatement_id,data) {
		return this.httpClient.post(`${Config.API_URL}patient-pain/`+treatement_id,data);
	}

	home_hep(data) {
		return this.httpClient.post(`${Config.API_URL}patient-hep/`,data);
	}

	hep_count() {
		let patient_id=localStorage.getItem('patient_id');
		let treatement_id=localStorage.getItem('treatement_id');
		return this.httpClient.get(`${Config.API_URL}get-patient-hep/${patient_id}/${treatement_id}`);
	}

	home_rate() {
		let week=localStorage.getItem('week');
		let treatement_id=localStorage.getItem('treatement_id');
		let patient_id=localStorage.getItem('patient_id');
		return this.httpClient.get(`${Config.API_URL}get-pain-level/${patient_id}/${treatement_id}/${week}`);
	}

	paingraphData() {
		// let week=localStorage.getItem('week');
		 let treatement_id=localStorage.getItem('treatement_id');
		return this.httpClient.get(`${Config.API_URL}get-patient-graph/${treatement_id}`);
	}
	
  }

