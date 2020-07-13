import { Component, OnInit, ChangeDetectorRef, TemplateRef, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FunctionalSurveyService } from './../service/functional-survey.service';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-questions',
	templateUrl: './questions.component.html',
	styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

	public modalRef: BsModalRef;
	
	questionForm: FormGroup;
	
	deleteForm: FormGroup;
	
	p: number = 1;

	searchText : string = "";
	
	submitted : boolean = false;
	
	questionResult : any = "";

	content : string = "question";
	
	questions : any = "";
	
	survey : any = "";
	
	survey_id : number;

	constructor(public message: MessageService, private elem: ElementRef, public common: CommonService, private modalService: BsModalService, public fb: FormBuilder, private route: ActivatedRoute, private router: Router, public surveyService: FunctionalSurveyService) { }

	public openModal(template: TemplateRef<any>, form, id = '') {
		this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
		switch (form) {
			case "add":
			this.setQuestionForm();
			break;

			case "edit":
			this.editQuestionForm(id);
			break;

			case "delete":
			this.deleteQuestion(id);
			break;
		}
	}

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.survey_id = +params['id'];
		});

		this.getQuestions(this.survey_id);

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
		
	}
	
	get answerPoints() {
		return this.questionForm.get('answers') as FormArray;
	}

	get scorePoints() {
		return this.questionForm.get('scores') as FormArray;
	}

	getQuestions(survey_id){
		this.common.addLoaderRow(3);

		this.surveyService.getQuestions(survey_id).subscribe((res)=>{

			this.survey = res;
			
			this.questions = this.survey.tbl_survey_questions;

			this.common.hideLoaderRow();

		});
	}

	setQuestionForm(){
		
		this.common.setMode('Add');

		this.getQuestionTypes();

		this.questionResult = "";
		
		this.questionForm = this.fb.group({
			question_text: ['', [Validators.required]],
			question_type: ['', [Validators.required]],
			survey_id: [this.survey_id],
			answers: this.fb.array([this.fb.group({answer:['', [Validators.required]]})]),
			scores: this.fb.array([this.fb.group({score:['', [Validators.required, Validators.pattern(/^[1-9]\.?[0-9]*$/g)]]})])
		});

	}

	get qf() { return this.questionForm.controls; }

	editQuestionForm(id){
		
		this.setQuestionForm();

		this.surveyService.getQuestion(id).subscribe((res) => {

			this.questionResult = res;

			this.getQuestionTypes();

			let answers = this.common.loopThroughBoxes(this.questionResult.tbl_survey_answers, 'answer', 'answer_choice');
			
			let scores = this.common.loopThroughBoxes(this.questionResult.tbl_survey_answers, 'score', 'answer_score');

			this.questionForm = this.fb.group({
				question_text: [this.questionResult.question_text, [Validators.required]],
				question_type: [parseInt(this.questionResult.question_type), [Validators.required]],
				survey_id: [this.survey_id],
				answers: this.fb.array(answers),
				scores: this.fb.array(scores)
			});

		});

		this.common.setMode('Edit');
	}

	getQuestionTypes() {
		
		this.surveyService.getQuestionTypes().subscribe();

	}	

	onSubmit(){
		this.submitted = true;

		if (this.questionForm.invalid) {
			return;
		}

		this.message.initMessage();

		let question = {'answers':[], 'scores': []};

		for (const field in this.questionForm.controls) {

			switch (field) {
				case "answers":
				this.questionForm.get(field).value.forEach((obj, key) => {
					question["answers"].push(obj.answer);
				});
				break;

				case "scores":
				this.questionForm.get(field).value.forEach((obj, key) => {
					question["scores"].push(obj.score);
				});
				break;

				default:
				question[field] = this.questionForm.get(field).value;
				break;
			}

		}

		if(this.questionResult === "" || this.questionResult === null){

			this.message.setMessage('a', this.content);

			this.surveyService.createQuestion(question).subscribe((res)=>{

				this.message.setMessage('sa', this.content);

				this.reload();

			}, (err) => {

				this.message.setMessage('sc', this.content, '', err.error.message);

			});

		}else{

			this.message.setMessage('u', this.content);

			this.surveyService.updateQuestion(question, this.questionResult.id).subscribe((res)=>{

				this.message.setMessage('su', this.content);

				this.reload();

			}, (err) => {

				this.message.setMessage('sc', this.content, '', err.error.message);

			});
		}
		
		this.submitted = false;

	}

	deleteQuestion(questionId){

		this.deleteForm = this.fb.group({
			id : [questionId]
		});

		this.common.deleteMessage = "Are you sure you want to delete Question?";

	}

	onDelete(){

		this.message.initMessage();

		let deleteId = this.deleteForm.controls['id'].value;

		this.message.setMessage('d', this.content);

		this.surveyService.deleteQuestion(deleteId).subscribe((res) => {

			this.message.setMessage('sd', this.content);
			
			this.reload();

		},(err) => {

			this.message.setMessage('sc', this.content, '', err.error.message);

		});

	}

	reload(){

		setTimeout(() => {
			
			this.getQuestions(this.survey_id);

			this.modalRef.hide();

		}, 1500);

	}
}
