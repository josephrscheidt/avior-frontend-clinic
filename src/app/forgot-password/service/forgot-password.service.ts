import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './../../config';
import { tap, catchError } from 'rxjs/operators';
import { MessageService } from './../../common/message.service';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ForgotPasswordService {
	
	apiURL: string = Config.API_URL;

	constructor(public message: MessageService, private httpClient: HttpClient) { }

	public sendEmail(email) {
		return this.httpClient.post(`${this.apiURL}forgotpassword`, email)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to send verification email: ' + err.error.message);
				return of(null);
			}),
			tap(res => {
				if(res){
					this.message.setMessage('fs', '', '');
					localStorage.setItem('rest_email', email);
				}
			})
		);
	}

	public resetPassword(formData) {
		return this.httpClient.post(`${this.apiURL}resetpassword`, formData)
		.pipe(
			catchError(err => {
				this.message.initMessage();
				this.message.setMessage('sc', '', '', 'Failed to update password: ' + err.error.message);
				return of(null);
			}),
			tap(res => { if(res) {this.message.setMessage('su', 'password', '')} })
		);
	}
}
