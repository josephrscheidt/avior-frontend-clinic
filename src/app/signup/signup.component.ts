import { Component, OnInit, ElementRef } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { Signup } from './signup';
import { SignupService } from './service/signup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
	model: any = {};

	signupForm: FormGroup;

	submitted = false;

	constructor(public message:MessageService, private elem: ElementRef, public signupService: SignupService, public fb: FormBuilder, private route: ActivatedRoute, private router: Router, public common: CommonService) { }

	ngOnInit() {

		this.signupForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required],
			// contact_no: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
		});

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	get f() { return this.signupForm.controls; }

	onSubmit(){

		this.submitted = true;

		// stop here if form is invalid
		if (this.signupForm.invalid) {
			return;
		}

		let user = this.signupForm.value;

		user.role = '1';

		this.message.disableHeader();

		this.message.initMessage();

		this.message.setMessage('n');

		this.signupService.signUp(user).subscribe((res)=>{

			this.message.setMessage('sn', 'signup', 'login');

		}, (err) => {

			this

			this.message.responseType = 'danger';

			this.message.response = err.error.message;

			this.message.resetMessage();

		});

	}

}
