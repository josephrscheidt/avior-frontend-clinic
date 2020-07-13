import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ReactiveFormsModule, FormControl, FormArray, NgForm } from '@angular/forms';
import { ClinicService } from './../service/clinic.service';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service';


@Component({
	selector: 'app-add-clinic',
	templateUrl: './add-clinic.component.html',
	styleUrls: ['./add-clinic.component.css']
})

export class AddClinicComponent implements OnInit {

	clinicForm: FormGroup;

	clinic_id: number;

	submitted = false;

	constructor(private elem: ElementRef, public clinicService: ClinicService, private route: ActivatedRoute, public fb: FormBuilder, private router: Router, public common : CommonService, public message : MessageService) { }

	ngOnInit() {

		this.clinicForm = this.fb.group({
			clinic_name: ['', Validators.required],
			google_review_link: [''],
		});

		this.common.isActiveDiv = false;
		this.message.responseMessage = false;
		this.message.response = '';
		this.message.responseType = 'warning';

		this.route.params.subscribe(params => {
			this.clinic_id = +params['id']; // (+) converts string 'id' to a number

			if(this.clinic_id){
				this.clinicService.getClinic(this.clinic_id).subscribe(res => {
					this.common.setMode('Edit');
					this.clinicForm = this.fb.group({
						id: [this.clinic_id],
						clinic_name: [this.clinicService.selectedClinic.clinic_name, Validators.required],
						google_review_link: [this.clinicService.selectedClinic.google_review_link],
					});
				})
			}else{
				this.resetClinic();
				this.common.setMode('Add');
				this.clinicForm = this.fb.group({
					id: [null],
					clinic_name: [this.clinicService.selectedClinic.clinic_name, Validators.required],
					google_review_link: [this.clinicService.selectedClinic.google_review_link],
				});
			}
		});
		this.common.isActiveDiv = true;

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}

	resetClinic(){
		this.clinicService.selectedClinic = {
			id: null,
			clinic_name: "",
			google_review_link: ""
		}
	}

	get f() { return this.clinicForm.controls; }

	resetForm(form){
		if (form)
			form.reset();

		this.resetClinic();
	}

	onSubmit() {

		this.submitted = true;

		// stop here if form is invalid
		if (this.clinicForm.invalid) {
			return;
		}
		
		this.clinicService.editClinic(this.clinicForm.value);
	}
}