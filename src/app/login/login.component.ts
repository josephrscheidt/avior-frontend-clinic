import { Component, TemplateRef, ViewChild, OnInit, ElementRef } from '@angular/core';
import { NgForm } from "@angular/forms";
// import { Login } from './login';
import { LoginService } from './service/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	model : any = {};

	constructor(private elem: ElementRef, public loginService: LoginService, public message: MessageService, public common: CommonService) { }

	onSubmit(form?:NgForm){

		// let user = form.value;
		let user = {"email":"XXXXXXXXXXX", "password":"XXXXXXXXXXX"};

		this.message.disableHeader();

		this.message.initMessage();

		this.message.setMessage('l');

		this.loginService.login(user).subscribe();

	}

	ngOnInit() {
		this.model.email = localStorage.getItem('email');
		this.model.password = localStorage.getItem('authentication');

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}
}
