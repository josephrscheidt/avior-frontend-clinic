import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Signup } from './../signup';
import { Config } from './../../config';

@Injectable({
	providedIn: 'root'
})
export class SignupService {

	apiURL: string = Config.API_URL+"User/";

	constructor( private httpClient: HttpClient ) { }

	public signUp(user){
		return this.httpClient.post(`${this.apiURL}`, user);
	}

}
