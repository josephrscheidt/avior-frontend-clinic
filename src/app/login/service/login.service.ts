import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Login } from './../login';
import { Config } from './../../config';
import { HepService } from './../../hep/service/hep.service';
import { MessageService } from './../../common/message.service';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

const TOKEN = 'TOKEN';

@Injectable({
	providedIn: 'root'
})

export class LoginService {

	apiURL: string = Config.API_URL+"login/";

	apiExcerciseURL: string = Config.API_URL + "therapist/createAlias/";

	constructor( private httpClient: HttpClient, public hepService: HepService, public message: MessageService) { }
	
	public login(user): Observable<Login>{
		return this.httpClient.post<Login>(`${this.apiURL}`, user)
		.pipe(
			catchError(err => {
				this.message.disableHeader();
				this.message.initMessage();
				this.message.setMessage('sc', '', '', err.error.message);
				return of(null);
			}),
			tap(res =>{
				if(res){
					let result = res;
					this.setToken(result.accessToken, result.userdata);
				}
			}),
			tap(res =>{
				if(res) {
					let clinic_id = res.userdata.clinic_id;
					this.message.disableHeader();
					this.message.initMessage();
					this.message.setMessage('sl', 'login', 'dashboard/' + clinic_id);
					window.analytics.identify(localStorage.getItem('id'), {
						userId: localStorage.getItem('id'),
						role_id: localStorage.getItem('role'),
						clinic_id: localStorage.getItem('clinic')
					})
					localStorage.removeItem('authentication');
				}
			})
		)

	}

	public getExercisePreferences (therapistId: string) {
		return this.httpClient.get(`${this.apiExcerciseURL}${therapistId}`);
	}


	setToken(accessToken: string, user): void {

		localStorage.setItem(TOKEN, accessToken);
		
		localStorage.setItem('id', user.id);
		
		localStorage.setItem('username', user.name);
		
		localStorage.setItem('email', user.email);
		
		localStorage.setItem('clinic', user.clinic_id);
		
		localStorage.setItem('role', user.role_id);

	}

	isLogged() {

		return localStorage.getItem(TOKEN) != null;

	}

	logout() {

		this.httpClient.post(`${Config.API_URL}logout`, localStorage.getItem('email')).subscribe((res) => {
			
			[ TOKEN, 'id', 'email', 'username', 'role', 'clinic' ].forEach((k) => {
				localStorage.removeItem(k);
			});

		});

	}
}