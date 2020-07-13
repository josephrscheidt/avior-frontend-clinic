import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { PatientService } from './../service/patient.service';
import { InjuryService } from './../../injury/service/injury.service';
import { ClinicService } from './../../clinic/service/clinic.service';
import { TherapistService } from './../../therapist/service/therapist.service';
import { Patient } from './../patient';
import { TemplateService } from '../../template/service/template.service';
import { Injury } from './../../injury/injury';
import { Template } from './../../template/template';
import { Clinic } from './../../clinic/clinic';
import { Therapist } from './../../therapist/therapist';

@Component({
	selector: 'app-add-patient',
	templateUrl: './add-patient.component.html',
	styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {

	allTemplates = {};

	bodyParts = {};

	patientModel : any = {};

	selectedPatient : any ={};

	private sub: any;

	id: number;

	selectedInjury : any;

	selectedTemplate : any;

	clinic_id: string;

	patientForm: FormGroup;

	submitted = false;

	dashboard_url : string;

	patientResult: any = "";

	injuryTemplates:Template[];

	pendingOptions: any = [{name : 'Active', value : '1'},{name: 'Pending', value: '100'}];

	constructor(private elem: ElementRef, public message: MessageService, public common: CommonService, public fb: FormBuilder, public templateService: TemplateService, public patientService: PatientService, private route: ActivatedRoute, public injuryService: InjuryService, public clinicService: ClinicService, public therapistService: TherapistService, private router: Router) {}

	ngOnInit() {

		this.getInjuries();

		// this.getClinics();

		if(+localStorage.getItem('role') == 2){
			this.clinic_id = localStorage.getItem('clinic');
			this.id = +localStorage.getItem('id');
		}

		this.setPatientForm();

		this.getClinicTherapists(this.clinic_id);

		this.common.checkForEditable(this.route, () => {this.getPatient(this.common.id)}, () => {this.resetPatient()});

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}
	setPatientForm(){

		let clinic_id = localStorage.getItem('clinic');

		// let therapist_id = ( clinic_id != "null") ? parseInt(id) : '';

		this.patientForm = this.fb.group({
			id: [null, ],
			name: ['', Validators.required],
			injury_id: ['', Validators.required],
			email: ['', [Validators.required, Validators.pattern(this.common.emailRegEx)]],
			therapist: [this.id, Validators.required],
			template_id: ['', Validators.required],
			start_date: [new Date(), Validators.required],
			treatment_id: [''],
			clinicId: [parseInt(clinic_id), Validators.required],
			isActive: ['1', Validators.required]
		});


	}
	get pf() { return this.patientForm.controls; }

	onChangeInjury(newObj) {

		// this.selectedInjury = newObj;

		this.getInjuryTemplates(newObj);

	}

	getInjuryTemplates($injury_id) {

		this.patientService.getTemplates($injury_id).subscribe((res)=>{

			this.injuryTemplates = res as Template[];

			// this.patientForm.get('template_id').enable();

		});

	}

	getClinicTherapists(clinic_id) {

		this.patientService.getTherapists(clinic_id).subscribe();

	}

	onChangeTemplate(newObj) {

		this.selectedTemplate = newObj;

	}

	resetPatient(){
		this.patientService.selectedPatient = {
			id: null,
			role_id:null,
			clinic_id:null,
			name:"",
			email:"",
			address:null,
			start_date: null,
			treatment: null
		}
	}

	getPatient(patient_id : number){

		this.patientService.getPatient(patient_id).subscribe((res)=>{
			this.patientResult = res;

			//let start_date = new Date(this.patientResult.treatment.start_date).toISOString().substring(0,10);
			let start_date = new Date(this.patientResult.treatment.start_date);
			this.getInjuryTemplates(this.patientResult.treatment.injury_id);
			this.patientForm = this.fb.group({
				id: [patient_id, ],
				name: [this.patientResult.name, Validators.required],
				injury_id: [this.patientResult.treatment.injury_id, Validators.required],
				template_id: [this.patientResult.treatment.template_id, Validators.required],
				email: [this.patientResult.email, [Validators.required, Validators.pattern(this.common.emailRegEx)]],
				therapist: [this.patientResult.treatment.pt_id, Validators.required],
				start_date: [start_date, Validators.required ],
				treatment_id: [this.patientResult.treatment.id],
				clinicId: [this.clinic_id, Validators.required],
				isActive: [{value:this.patientResult.is_active, disabled:true}, Validators.required]
			});

			this.common.isActiveDiv = true;

			// console.log(this.patientForm.value);

		});
	}

	onSubmit() {
		this.submitted = true;

		// stop here if form is invalid
		if (this.patientForm.invalid) {
			return;
		}

		this.message.disableHeader();

		this.message.initMessage();

		if(!this.patientForm.value.id){
			this.message.setMessage('a', 'patient');
		}else{
			this.message.setMessage('u', 'patient');
		}

		this.patientService.editPatient(this.patientForm.value, this.clinic_id);

		this.submitted = false;

		if (this.patientForm.value.treatment_id) {
			window.analytics.track("Patient Edited", {
				user_id : localStorage.getItem('ajs_user_id'),
				traits : localStorage.getItem('ajs_user_traits'),
				template_id: this.patientForm.value.template_id,
				treatment_id: this.patientForm.value.treatment_id
			});
		}else {
			window.analytics.track("Patient Added", {
				therapist_id : localStorage.getItem('ajs_user_id'),
				traits : localStorage.getItem('ajs_user_traits'),
				template_id: this.patientForm.value.template_id
			});
		}
	}

	getInjuries(){
		// For the patient form to work properly we need two arrays populated and linked by injury id
		this.injuryService.getInjuries().subscribe((res)=>{
			let bodyPartList =[];
			if (!res) {
				this.injuryService.injuries.subscribe(res=>{
					bodyPartList = res as Injury[];
				})
			} else{
				bodyPartList = res as Injury[];
			}
      		for (let item of bodyPartList) {
        		this.allTemplates[item["id"]] = [];
        		this.bodyParts[item["id"]] = item["injury_name"];
      }
      this.getTemplates();
         });
  }

  getTemplates(){

    this.templateService.getTemplates().subscribe((res)=>{
	  let templates = [];
	  if (!res) {
		  this.templateService.templates.subscribe(res=>{
			  templates = res;
		  })
	  }else{
		  templates = res;
	  }

      for (let template of templates) {
		this.allTemplates[template["injury_id"]].push(template["about_desc"]);
	  }
    });
  }

	getClinics(){
		this.clinicService.getClinics().subscribe();
	}
}
