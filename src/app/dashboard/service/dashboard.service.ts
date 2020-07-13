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
export class DashboardService extends DataService{

  // apiURL: string = Config.API_URL+"analytics/";

  // clinicData: any;

  constructor(private httpClient: HttpClient, private message: MessageService) {
    super();
  }

  // public getDataByClinicID(id: number) {
  //   return this.httpClient.get(`${this.apiURL}${id}`)
  //   .pipe(
	// 		catchError(err => {
	// 			this.message.initMessage();
	// 			this.message.setMessage('sc', '', '', 'Failed to find data: ' + err.error.message);
	// 			return of(null);
	// 		}),
	// 		tap(res => { if(res) {this.cache('clinicData', res)}} )
	// 	);
  // }
}
