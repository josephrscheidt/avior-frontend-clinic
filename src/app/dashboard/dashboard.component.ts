import { Component, OnInit, TemplateRef, ElementRef } from '@angular/core';
import { DashboardService } from './service/dashboard.service';
import { CommonService } from './../common/common.service';
import { PatientService } from './../patient/service/patient.service';
import { MessageService } from './../common/message.service';
// import * as Chart from 'chart.js'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { NgForm, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { TemplateService } from './../template/service/template.service';
// import { PatientProfileComponent } from './../patient/patient-profile/patient-profile.component';
// import { Location } from '@angular/common';
// import { AuthGuard } from './../guards/auth-guard.service';
import * as $ from 'jQuery';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

	role : number ;

	therapist_id : any ;

	clinic_id: any;

	p: number = 1;

	searchText : string = "";

	chartData : any;

	additionalSearchText: string;

	public discharges : any;

	patientIdString: string;

	dischargeForm: FormGroup;

	public modalRef: BsModalRef;

	public patientFullDetails : any = {};

	public profile : any = {};

	public discharge_reason : string = "";

	public trial_route: any;

	public dischargeRoute: Routes;

	public activationId: any;

	public activationTemplate: any;

	public submitted : boolean = false;

	// patientOptions: any = [{name : 'Show All Patients', value : this.displayAllPatients()},{name: 'Show My Patients', value: this.displayMyPatients()}];

	constructor(private elem: ElementRef, public message: MessageService, public dashboardService : DashboardService, public common: CommonService, public patientService: PatientService, private route: ActivatedRoute, private modalService: BsModalService, public fb: FormBuilder, public templateService: TemplateService, public router: Router) { }
	
	
	public openModalPending(template: TemplateRef<any>, patientId='', flg = "0") {

		this.modalRef = this.modalService.show(template);
		this.activationId = patientId;
		this.activationTemplate = template;
		this.getPatientDetails(patientId);
	}

	public openModal(template: TemplateRef<any>, form, patientId= '', id = '', flg = "0") {

		this.patientIdString = patientId.toString();

		this.getPatientDetails(patientId);

		this.modalRef = this.modalService.show(template);
		
		switch (form) {
		  case "discharge":
		  this.setDischargeForm();
		  break;
		}
	
	  }

	  setDischargeForm(){

		this.getDischarges();
	
		this.dischargeForm = this.fb.group({
		  discharge_reason: ['', [Validators.required]],
		  discharge_text: ['']
		});
	  }

	  getDischarges(){
		this.patientService.getDischarges().subscribe();
	  }

	  onDischarge(){
		this.submitted = true;
	
		if (this.dischargeForm.invalid) {
		  return;
		}

		this.message.disableHeader();
	
		this.message.initMessage();
	
		let discharge = this.dischargeForm.value;
	
		this.message.setMessage('ds', this.profile.name);
	
		let patient = this.profile.id;
	
		this.patientService.dischargePatient(patient, discharge).subscribe((res)=>{
	
		  this.message.setMessage('sds', this.profile.name);
	
		  setTimeout(() => {
	
			this.getPatientDetails(this.profile.id);
	
			this.modalRef.hide();
	
		  }, 1500);
	
		});

		this.getPatients();
	  }
	 
	  get df() { return this.dischargeForm.controls; }

	  dischargeChange(id){
		if(id == 3){
		  $('#dischargeText').show();
		}else{
		  $('#dischargeText').hide();
		}
	  }
	
	  getPatientDetails(id){
		this.patientService.getPatientDetails(id).subscribe((res) => {
	
		  this.patientFullDetails = res;
	
		  this.profile = this.patientFullDetails.profile;

		  if (this.profile.is_active != 100){

			this.discharge_reason = this.profile.is_active ? "" : this.profile.tbl_discharge_reason.reason;

		  }

		  });
	  }

	  enablePendingPatient(){	
		this.message.disableHeader();
		this.message.initMessage();
		this.message.setMessage('u', 'patient');

		this.getPatientDetails(this.activationId);

		this.patientService.enablePendingPatient(this.profile, this.activationId).subscribe(res=>{

			setTimeout(() => {
	
				this.getPatientDetails(this.profile.id);
		
				this.modalRef.hide();
		
			  }, 1500);
			
			this.getPatients();

		});
	

			
	}

	ngOnInit() {

		this.role = parseInt(localStorage.getItem('role'));

		this.therapist_id = localStorage.getItem('id');

		this.clinic_id = parseInt(localStorage.getItem('clinic'));

		this.getPatients();

		this.additionalSearchText = this.therapist_id;

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	getPatients(){

		this.common.addLoaderRow(5);

		this.patientService.getAllPatients(this.clinic_id).subscribe(res => { this.common.hideLoaderRow(); });

	}

}
