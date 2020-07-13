import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef} from '@angular/core';
import { LoginService } from './../../login/service/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { MessageService } from './../../common/message.service';
import { PatientService } from './../../patient/service/patient.service';
import { ClinicService } from './../../clinic/service/clinic.service';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordService } from './../../forgot-password/service/forgot-password.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

	resetPasswordForm: FormGroup;

	newPasswordForm: FormGroup;

	submitted : boolean = false;

	submittedPassword : boolean = false;
	
	onKeyupCheck : boolean = false;

	constructor(public message: MessageService, public fb: FormBuilder, public forgotPasswordService: ForgotPasswordService, public loginService: LoginService, private router: Router, public common: CommonService, public patientService: PatientService, private route: ActivatedRoute, public clinicService: ClinicService) { }

	@ViewChild('closeAccountDetails') closeAccountDetails: ElementRef;

	username : string ;
	
	role : string ;

	id: number;

	newPassword : string;

	clinic_id : string;

	phaseResult: any = "";

 	 private sub: any;

	patientResult: any = "";

	clinicResult: any = '';

	headers = {};

	passwordMatch : boolean = false;

	ngOnInit() {

		this.username = localStorage.getItem('username');
		
		this.role = localStorage.getItem('role');

		this.clinic_id = localStorage.getItem('clinic');

		this.setNewPasswordForm();

		if(this.role == "1"){

			this.headers = {"Body Parts":"body-part", "Clinics":"clinic", "Diagnosis":"diagnosis", 
			"Exercises":"exercise", 'Surveys':"survey", "Therapists":"therapist"};

		}
		if(this.role == "2"){
			this.headers = {"Dashboard":"dashboard/"+this.clinic_id, "Usage":"head-dashboard/"+this.clinic_id, "Educational Components":"injury-list"};

			// this.headers = {"Dashboard":"dashboard/"+this.clinic_id, "Usage":"head-dashboard/"+this.clinic_id, "Educational Components":"injury-list", "Saved Exercise Programs":"hep"};

			this.getClinic(parseInt(this.clinic_id));
		}
		
	}

	logout() {

		this.loginService.logout();

		this.router.navigateByUrl('/login');
	}

	getClinic(id: number){
		this.clinicService.getClinic(id).subscribe();
	}

	setResetPasswordForm(){
		this.submittedPassword = false;
		this.passwordMatch = true;
		let email = localStorage.getItem('email');
		this.resetPasswordForm = this.fb.group({
			email : [{value: email, disabled : true}, [Validators.required, Validators.pattern(this.common.emailRegEx)]],
			password : [{value: this.newPassword, disabled: true}, {validators: [Validators.required, Validators.pattern(this.common.passwordRegEx)]}],
			otp : ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
		});
	}

	setNewPasswordForm(){
		this.newPasswordForm = new FormGroup({
			newPassword: new FormControl("", {validators: [Validators.required, Validators.pattern(this.common.passwordRegEx)], updateOn:'change'}),
			repeatPassword: new FormControl("", {validators: Validators.required, updateOn: 'change'})
		}, this.common.checkPasswords);
	}

	checkPasswords(group: FormGroup) { // here we have the 'passwords' group
	let pass = group.get('newPassword').value;
	let confirmPass = group.get('repeatPassword').value;

	return pass === confirmPass ? null : { notSame: true }     
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

		this.message.disableHeader();

		this.message.initMessage();

		this.message.setMessage('rp');
		
		// let email = localStorage.getItem('rest_email');
		
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

		this.forgotPasswordService.resetPassword(formData).subscribe( () => {
			setTimeout(()=>{
				this.closeAccountDetails.nativeElement.click();
			},2000);
		});
	}
	get rpf(){ return this.resetPasswordForm.controls; }

	get npf() {return this.newPasswordForm.controls; }

	onSendVerification() {
		this.message.disableHeader();
		
		this.message.initMessage();

		this.message.setMessage('fr');

		let value = {email: this.resetPasswordForm.controls['email'].value};

		this.forgotPasswordService.sendEmail(value).subscribe();
	}
	onConfirmPassword(){
		this.submittedPassword = true;

		// stop here if form is invalid
		if (this.newPasswordForm.invalid) {
			return;
		}

		this.newPassword = this.newPasswordForm.get('newPassword').value;

		this.setResetPasswordForm();

	}
}


