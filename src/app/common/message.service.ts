import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
// import { Observable, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
// import { NgForm, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';


@Injectable({
	providedIn: 'root'
})
export class MessageService {

	constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router, public fb: FormBuilder) { }

	showTr : boolean = true;

	responseMessage : boolean = false;

	response : any;

	responseType : string = 'success';

	deleteMessage : string = '';

	mode : string = 'Add';

	buttonMode : string = 'Add';

	activateHeader: boolean = true;

	private sub: any;

	id: number;

	isActiveDiv : boolean = true;

	initMessage() {
		this.responseMessage = true;
		this.responseType = 'warning';
		this.isActiveDiv = false;
	}

	disableHeader() {
		this.activateHeader = false;
	}

	resetMessage(route = '', speed = 1500) {

		setTimeout(() => {

			this.responseMessage = false;

			this.activateHeader = true;

			this.responseType = 'warning';

			this.isActiveDiv = true;

			if(route !== ''){
				this.router.navigateByUrl('/'+route);
			}

		},speed);

	}

	setMessage(type, content = '', route = '', custom = '') {

		this.responseType = 'success';

		switch (type) {

			case "zz":
			this.response = custom;
			this.resetMessage(route);
			break;

			case "sc":
			this.responseType = 'danger';
			this.response = custom;
			this.resetMessage(route);
			break;

			case "a":
			this.response = 'Adding '+content.replace('-',' ')+', Please wait';
			break;

			case "d":
			this.response = 'Deleting '+content.replace('-',' ')+', Please wait';
			break;

			case "l":
			this.response = 'Logging in, Please wait';
			break;

			case "sl":
			this.response = 'Successfully Logged In';
			this.resetMessage(route);
			break;

			case "n":
			this.response = 'Creating account, Please wait';
			break;

			case "sn":
			this.response = 'Account created Successfully, Please verify account first to login';
			this.resetMessage(route);
			break;

			case "u":
			this.response = 'Updating '+content.replace('-', ' ')+', Please wait';
			break;

			case "fr":
			this.response = 'Generating password reset request, Please wait';
			break;

			case "fs":
			this.response = 'We have sent a verification code to the given email.';
			this.resetMessage(route);
			break;

			case "rp":
			this.response = 'Setting up new Password, Please wait';
			break;

			case "rps":
			this.response = 'Successfully updated, You Can Now Login With Your New Password.';
			this.resetMessage(route);
			break;

			case "sa":
			this.response = 'Successfully Added';
			this.resetMessage(route);
			break;

			case "sd":
			this.response = 'Successfully Deleted';
			this.resetMessage(route);
			break;

			case "su":
			this.response = 'Successfully Updated';
			this.resetMessage(route);
			break;

			case "ds":
			this.response = 'Discharging '+content.replace('-',' ');
			break;

			case "sds":
			this.response = 'Discharged Successfully';
			this.resetMessage(route);
			break;

			case 'uf':
			this.response = 'Failed to Activate Account';
			this.resetMessage(route);
			break;

			case 'dap':
			this.response = 'Patient Activated';
			this.resetMessage(route);
			this.router.navigateByUrl(route);
			break;

			default:
			this.responseType = 'danger';
			this.response = 'Something went wrong, Please try again.';
			this.resetMessage(route);
			break;
		}
	}
}
