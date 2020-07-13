import { Component, OnInit, ChangeDetectorRef, TemplateRef, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service'
;import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PatientService } from './../service/patient.service';
import { TemplateService } from './../../template/service/template.service';
import * as Chart from 'chart.js'
declare var $ :any;


@Component({
	selector: 'app-patient-profile',
	templateUrl: './patient-profile.component.html',
	styleUrls: ['./patient-profile.component.css']
})

export class PatientProfileComponent implements OnInit {

  dischargeForm: FormGroup;

  templateExerciseForm: FormGroup;

  public modalRef: BsModalRef;

  public patientFullDetails : any = {};

  public profile : any = {};

  public exerciseResult : any = {};

  public currentGoal : any = [];

  public completedGoal : any = [];

  public assigned_exercises : any = [];

  public startdate : any;

  public injury_name : any;

  public template_id : any;

  public graphData : any;

  public treatment : any;

  public function : any;

  public pain : any;

  public discharges : any;

  public submitted : boolean = false;

  public discharge_reason : string = "";

  public exerciseTitle : string = "";

  showExercises: boolean = false;

  exercises: any = {};

  therapist_id:string;




  constructor(private elem: ElementRef, public message: MessageService, public common: CommonService, private route: ActivatedRoute, public patientService: PatientService, private modalService: BsModalService, public fb: FormBuilder, public templateService: TemplateService) { }

  public openModal(template: TemplateRef<any>, form, id = '', flg = "0") {


    this.modalRef = this.modalService.show(template);

    switch (form) {
      case "discharge":
      this.setDischargeForm();
      break;

      case "exercise-edit":
      this.editExercise(id, flg);
      break;

    }

  }

  ngOnInit() {

    this.common.checkForEditable(this.route, () => {this.getPatientDetails(this.common.id)}, () => {});

    this.therapist_id = localStorage.getItem('id');

    // Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
    window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
  
  }

  setDischargeForm(){

    this.getDischarges();

    this.dischargeForm = this.fb.group({
      discharge_reason: ['', [Validators.required]],
      discharge_text: ['']
    });
  }

  dischargeChange(id){
    if(id == 3){
      $('#dischargeText').show();
    }else{
      $('#dischargeText').hide();
    }
  }

  getDischarges(){
    this.patientService.getDischarges().subscribe();
  }

  get df() { return this.dischargeForm.controls; }

  getPatientDetails(id){
    this.patientService.getPatientDetails(id).subscribe((res) => {

      this.patientFullDetails = res;

      this.profile = this.patientFullDetails.profile;

      this.discharge_reason = this.profile.is_active ? "" : this.profile.tbl_discharge_reason.reason;

      this.startdate = new Date(this.profile.tbl_treatment.start_date).toDateString();

      this.template_id = this.profile.tbl_treatment ? this.profile.tbl_treatment.template_id : '-';

      this.treatment = this.profile.tbl_treatment ? this.profile.tbl_treatment.id : 0;

      this.injury_name = this.profile.tbl_treatment.tbl_template ? this.profile.tbl_treatment.tbl_template.about_desc : '-';

      this.currentGoal = this.patientFullDetails.currentGoal;

      this.completedGoal = this.patientFullDetails.completedGoal;

      this.assigned_exercises = this.patientFullDetails.assigned_exercises;

      this.pain = this.patientFullDetails.pain;

      this.function = this.patientFullDetails.function;

      // console.log("Pain: ", this.treatment);

      this.painGraphData(this.treatment);

      let dates = [];

      let counts = {};

      for(let goal of this.completedGoal){

        dates.push(this.common.formatDate(goal.updatedAt));

      }

      let count = 0;
      $.each(dates, function (key, value) {
        count++;
        if (!counts.hasOwnProperty(value)) {
          counts[value] = count;
        } else {
          counts[value] = count;
        }
      });

      let labels = Object.keys(counts);

      let points = Object.values(counts);

      this.drawChart('goalChart', points, labels);

    });
  }

	enablePendingPatient(){
		this.message.initMessage();
		this.message.setMessage('u');

		this.patientService.enablePendingPatient(this.profile, this.common.id)
		.subscribe(
			res => {
				this.message.setMessage('su', '', 'dashboard/' + this.profile.clinic_id);
			},
			err =>{
				this.message.setMessage('uf')
			});
	}

  painGraphData(treatment){

    this.patientService.painGraphData(treatment).subscribe((res) => {

      this.graphData  = res;

      this.drawChart('painChart', this.graphData['pains'], this.graphData['weeks']);

      this.drawChart('functionChart', this.graphData['functions'], this.graphData['weeks']);

    },(err) => {

    });
  }
  drawChart(ele, data, labels){
    let max = 10;
    let steps = 5;

    switch (ele) {
      case "functionChart":
      max = 100;
      steps = 50;
      break;

      case "goalChart":
      // max = 25;
      max = Math.max(...data);
      if(max < 25){
        max = 25;
      }
      break;
    }
    if(ele == "functionChart"){
      max = 100;
      steps = 50;
    }

    let canvas :any = document.getElementById(ele) as HTMLElement;

    new Chart(canvas, {

      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          borderColor: '#FFF',
          borderWidth: 2,
          fill: false,
          pointBackgroundColor: "#FFF",
          data: data,
          spanGaps: true
        }]
      },
      options: {
        legend: {
          display: false,
          labels: {
            fontColor: '#ffffff'
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              color: "transparent",
              display: true,
              drawBorder: false,
            },
            ticks: {
              fontColor: "rgba(255, 255, 255, 0.75)" // this here
            },
          }],
          yAxes: [{
            gridLines: {
              color: "rgba(255, 255, 255, 0.5)"
            },
            type: 'linear',
            scaleLabel: {
              display: false
            },
            ticks: {
              fontColor: "#fff",
              max: max,
              min: 0,
              stepSize: steps
            }
          }]
        }
      }
    });
  }

  onDischarge(){
    this.submitted = true;

    if (this.dischargeForm.invalid) {
      return;
    }

		// this.message.disableHeader();

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

    }, (err) => {

      this.message.setMessage('sc', this.profile.name, '', err.error.message);

    });
  }

editExercise(exerciseId, mode) {
  this.submitted = false;
  this.setExerciseForm(mode);


  this.templateService.editTreatmentExercise(exerciseId).subscribe((res) => {

    this.exerciseResult = res;

    this.templateExerciseForm = this.fb.group({
      sets : [this.exerciseResult.sets, [Validators.required, Validators.pattern("^[0-9]*$")]],
      reps: [this.exerciseResult.reps, [Validators.required, Validators.pattern("^[0-9]*$")]],
      description : [this.exerciseResult.description, Validators.required],
      perform : [this.exerciseResult.perform, Validators.required],
      flag : [mode]
    });

    this.exerciseResult.title = this.exerciseResult.tbl_exercise.title;
    this.exerciseResult.purpose = this.exerciseResult.tbl_exercise.purpose;
    this.exerciseResult.image = this.exerciseResult.tbl_exercise.image;

  });

  this.exerciseTitle = this.exerciseResult.title;
}

setExerciseForm(mode){
  this.templateExerciseForm = this.fb.group({
    sets : ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    reps: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    description : ['', Validators.required],
    perform : ['', Validators.required],
    flag : [mode]
  });
}

onPrint(){
  this.showExercises = false;
  for(var i =0; i < this.assigned_exercises.length; i++) {
    this.assigned_exercises[i].tbl_exercise.description = this.assigned_exercises[i].tbl_exercise.description.replace(/\<br><br>/g, "");
  }

  setTimeout(() => {
    window.print();
  }, 500);
}

}
