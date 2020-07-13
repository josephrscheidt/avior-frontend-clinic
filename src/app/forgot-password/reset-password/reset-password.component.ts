import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../common/common.service';
import { MessageService } from '../../common/message.service';
import { ForgotPasswordService } from './../service/forgot-password.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
	
	resetPasswordForm: FormGroup;

	submitted : boolean = false;
	
	onKeyupCheck : boolean = false;

	constructor(public message:MessageService, private elem: ElementRef, public fb: FormBuilder, public common: CommonService, public forgotPasswordService: ForgotPasswordService) { }

	ngOnInit() {
		this.setResetPasswordForm();

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}

	get rpf(){ return this.resetPasswordForm.controls; }

	setResetPasswordForm(){
		let email = localStorage.getItem('rest_email');
		this.resetPasswordForm = this.fb.group({
			email : [{value: email, disabled : true}, [Validators.required, Validators.pattern(this.common.emailRegEx)]],
			password : ['', {validators: [Validators.required, Validators.pattern(this.common.passwordRegEx)], updateOn: 'change'}],
			otp : ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
		});
	}
	onPasswordChange(ele){
		let v = ele.value
		let mat = v.match(this.common.passwordRegEx);
		this.onKeyupCheck = (!mat);
	}
	onSubmit(){
		this.submitted = true;

		// stop here if form is invalid
		if (this.resetPasswordForm.invalid) {
			return;
		}

		this.message.disableHeader()

		this.message.initMessage();

		this.message.setMessage('rp');
		
		let email = localStorage.getItem('rest_email');
		
		let formData = {};

		for (const field in this.resetPasswordForm.controls) {

			switch (field) {

				case "otp" :
				formData["confirmationcode"] = this.resetPasswordForm.get(field).value;
				break;

				default:
				formData[field] = this.resetPasswordForm.get(field).value;
				break;

			}
			localStorage.setItem('authentication', formData['password']);
		}


		this.forgotPasswordService.resetPassword(formData).subscribe((res)=> {

			this.message.setMessage('rps', '', 'login');

		}, (err) => {

			this.message.responseType = 'danger';

			this.message.response = err.error.message;
			
			this.message.resetMessage('', 3000);

		});
	}

}
