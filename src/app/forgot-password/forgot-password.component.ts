import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../common/common.service';
import { MessageService } from '../common/message.service';
import { ForgotPasswordService } from './service/forgot-password.service';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

	forgotPasswordForm : FormGroup;
	
	submitted : boolean = false;

	constructor(public message:MessageService, private elem: ElementRef, public fb: FormBuilder, public common: CommonService, public forgotPasswordService: ForgotPasswordService) { }

	ngOnInit() {
		this.setForgotPasswordForm();

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}

	get fpf(){ return this.forgotPasswordForm.controls; }

	setForgotPasswordForm(){
		this.forgotPasswordForm = this.fb.group({
			email : ['', [Validators.required, Validators.email]]
		});
	}

	onSubmit(){
		this.submitted = true;
		
		// stop here if form is invalid
		if (this.forgotPasswordForm.invalid) {
			return;
		}

		this.message.disableHeader();

		this.message.initMessage();

		this.message.setMessage('fr');

		this.forgotPasswordService.sendEmail(this.forgotPasswordForm.value).subscribe((res)=> {

			this.message.setMessage('fs', '', 'reset-password');

			localStorage.setItem('rest_email', this.forgotPasswordForm.controls['email'].value);

		}, (err) => {

			this.message.setMessage('sc', '', '', err.error.message);

		});
	}
}
