import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { TherapistService } from './../service/therapist.service';
import { ClinicService } from './../../clinic/service/clinic.service';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service';
import { Therapist } from './../therapist';
import { Clinic } from './../../clinic/clinic';

@Component({
	selector: 'app-add-therapist',
	templateUrl: './add-therapist.component.html',
	styleUrls: ['./add-therapist.component.css']
})

export class AddTherapistComponent implements OnInit {

	therapistForm: FormGroup;

	submitted = false;

	therapist_id: number;

	constructor(private elem: ElementRef, public therapistService: TherapistService, public fb: FormBuilder, private route: ActivatedRoute, public clinicService: ClinicService, private router: Router, public common : CommonService, public message : MessageService) { }

	ngOnInit() {

		this.therapistForm = this.fb.group({
			name: ['', Validators.required],
			clinic_id: ['', Validators.required],
			email: ['', [Validators.required, Validators.pattern(this.common.emailRegEx)]],
			id: [null, Validators.required],
			role_id: [2, Validators.required],
		});

		this.common.isActiveDiv = false;
		this.message.responseMessage = false;
		this.message.response = '';
		this.message.responseType = 'warning';
		
		this.clinicService.getClinics().subscribe();
		this.route.params.subscribe(params => {
			this.therapist_id = +params['id']; // (+) converts string 'id' to a number

			if(this.therapist_id){
				this.therapistService.getTherapist(this.therapist_id).subscribe(res => {
					this.common.setMode('Edit');
					this.therapistForm = this.fb.group({
						name: [this.therapistService.selectedTherapist.name, Validators.required],
						clinic_id: [this.therapistService.selectedTherapist.clinic_id, Validators.required],
						email: [this.therapistService.selectedTherapist.email, [Validators.required, Validators.pattern(this.common.emailRegEx)]],
						id: [this.therapist_id, Validators.required],
						role_id: [2, Validators.required],

					});
				})
			}else{
				this.resetTherapist();
				this.common.setMode('Add');
				this.therapistForm = this.fb.group({
					name: [this.therapistService.selectedTherapist.name, Validators.required],
					clinic_id: [this.therapistService.selectedTherapist.clinic_id, Validators.required],
					email: [this.therapistService.selectedTherapist.email, [Validators.required, Validators.pattern(this.common.emailRegEx)]],
					id: [this.therapist_id, Validators.required],
					role_id: [2, Validators.required],
				});
			}
			this.common.isActiveDiv = true;
		});

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	onChangeClinic(newObj) {
		this.clinicService.selectedClinic = newObj;
	}

	resetTherapist(){
		this.therapistService.selectedTherapist = {
			id: null,
			role_id:null,
			clinic_id:null,
			name:"",
			email:""
		}
	}

	get f() { return this.therapistForm.controls; }

	onSubmit() {
		
		this.submitted = true;

		// stop here if form is invalid
		if (this.therapistForm.invalid) {
			return;
		}

		this.message.disableHeader();

		this.message.initMessage();

		if (this.therapistForm.value.id) {
			this.message.setMessage('u', 'therapist');
		}else{
			this.message.setMessage('a', 'therapist');
		}
		
		this.therapistService.editTherapist(this.therapistForm.value);
			
	}

	resetForm(form){
		if (form)
			form.reset();

		this.resetTherapist();
	}

}
