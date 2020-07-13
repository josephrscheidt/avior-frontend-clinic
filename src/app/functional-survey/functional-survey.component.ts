import { Component, OnInit, ChangeDetectorRef, TemplateRef, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionalSurveyService } from './service/functional-survey.service';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-functional-survey',
	templateUrl: './functional-survey.component.html',
	styleUrls: ['./functional-survey.component.css']
})
export class FunctionalSurveyComponent implements OnInit {
	
	public modalRef: BsModalRef;
	
	surveyForm: FormGroup;
	
	deleteForm: FormGroup;
	
	diagnoses: any;
	
	p: number = 1;

	searchText : string = "";
	
	submitted : boolean = false;
	
	surveyResult : any = "";

	content : string = "survey";
	
	surveys : any = "";
	
	constructor(private elem: ElementRef, public message: MessageService, public common: CommonService, private modalService: BsModalService, public fb: FormBuilder, private route: ActivatedRoute, private router: Router, public surveyService: FunctionalSurveyService) { }

	public openModal(template: TemplateRef<any>, form, id = '') {
		this.modalRef = this.modalService.show(template);
		switch (form) {
			case "add":
			this.setSurveyForm();
			break;

			case "edit":
			this.editSurveyForm(id);
			break;

			case "delete":
			this.deleteSurvey(id);
			break;
		}
	}

	ngOnInit() {
		this.getSurveys();

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}
	
	getSurveys(){
		this.common.addLoaderRow(3);

		this.surveyService.getSurveys().subscribe((res)=>{

			this.common.hideLoaderRow();

		});
	}

	setSurveyForm(){
		
		this.common.setMode('Add');

		this.getDiagnosis();
		
		this.surveyResult = "";

		this.surveyForm = this.fb.group({
			survey_title: ['', [Validators.required]],
			survey_description: ['', [Validators.required]],
			diagnosis_id: ['', [Validators.required]]
		});

	}

	get sf() { return this.surveyForm.controls; }

	editSurveyForm(id){
		
		this.setSurveyForm();

		this.surveyService.getSurvey(id).subscribe((res) => {

			this.surveyResult = res;

			this.getDiagnosis();

			this.surveyForm = this.fb.group({
				survey_title: [this.surveyResult.survey_title, [Validators.required]],
				survey_description: [this.surveyResult.survey_description, [Validators.required]],
				diagnosis_id: [parseInt(this.surveyResult.diagnosis_id), [Validators.required]]
			});

		});

		this.common.setMode('Edit');
	}

	getDiagnosis() {
		
		this.surveyService.getDiagnosis().subscribe((res)=>{
			
			this.diagnoses = res;

		});

	}	

	onSubmit(){
		this.submitted = true;

		if (this.surveyForm.invalid) {
			return;
		}

		this.message.disableHeader();

		this.message.initMessage();

		let survey = this.surveyForm.value;  

		if(this.surveyResult === "" || this.surveyResult === null){

			this.message.setMessage('a', this.content);

			this.surveyService.createSurvey(survey).subscribe((res)=>{

				this.message.setMessage('sa', this.content);

				this.reload();

			}, (err) => {

				this.message.setMessage('sc', this.content, '', err.error.message);

			});

		}else{

			this.message.setMessage('u', this.content);

			this.surveyService.updateSurvey(survey, this.surveyResult.id).subscribe((res)=>{

				this.message.setMessage('su', this.content);

				this.reload();

			}, (err) => {

				this.message.setMessage('sc', this.content, '', err.error.message);

			});
		}
		
		this.submitted = false;

	}

	deleteSurvey(surveyId){

		this.deleteForm = this.fb.group({
			id : [surveyId]
		});

		this.common.deleteMessage = "Are you sure you want to delete Survey?";

	}

	onDelete(){

		this.message.disableHeader();

		this.message.initMessage();

		let deleteId = this.deleteForm.controls['id'].value;

		this.message.setMessage('d', this.content);

		this.surveyService.deleteSurvey(deleteId).subscribe((res) => {

			this.message.setMessage('sd', this.content);
			
			this.reload();

		},(err) => {

			this.message.setMessage('sc', this.content, '', err.error.message);

		});

	}

	reload(){

		setTimeout(() => {
			
			this.getSurveys();

			this.modalRef.hide();

		}, 1500);

	}
}
