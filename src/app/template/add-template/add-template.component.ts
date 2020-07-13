import { Component, OnInit, ChangeDetectorRef, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Template } from './../template';
import { TemplateService, AboutPoint, DidPoint, QuestionPoint } from './../service/template.service';
import { InjuryService } from './../../injury/service/injury.service';
import { PatientService } from './../../patient/service/patient.service';
import { Injury } from './../../injury/injury';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { CommonService } from './../../common/common.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-add-template',
	templateUrl: './add-template.component.html',
	styleUrls: ['./add-template.component.css']
})
export class AddTemplateComponent implements OnInit {

	templateModel : any = {about : [''], questions : [''], did_you_know : ['']};
	
	public imagePath;
	
	imgURL: any = "/assets/images/placeholder.png";
	
	public message: string;

	responseMessage : boolean = false;
	response : any;
	responseType : string = 'success';

	responseQuestionMessage : boolean = false;
	responseQuestion : any;
	responseQuestionType : string = 'success';

	responsePhaseMessage : boolean = false;
	responsePhase : any;
	responsePhaseType : string = 'success';

	responseExerciseMessage : boolean = false;
	responseExercise : any;
	responseExerciseType : string = 'success';

	responseQuestionDeleteMessage : boolean = false;
	responseQuestionDelete : any;
	responseQuestionDeleteType : string = 'success';
	
	role : string ;

	clinic_id : string;

	selectedFile: File;
	selectedInjury : any;
	id: number;
	private sub: any;
	selectedTemplate : any ={};
	aboutArray = [{point:''}];
	questionArray = [{}];
	didArray = [{}];
	image : any ;

	templateAssignDiv : boolean = false;

	templateDiv : boolean = true;

	questionDiv : boolean = false;

	phaseDiv : boolean = false;
	
	exerciseDiv : boolean = false;
	
	templateForm: FormGroup;
	
	templateQuestionForm: FormGroup;
	
	templatePhaseForm: FormGroup;
	
	templateExerciseForm: FormGroup;
	
	repForm: FormGroup;
	
	assignForm: FormGroup;
	
	deleteForm: FormGroup;

	deleteMessage: string;
	
	deleteType: string;
	
	questions: any;

	exercises: any = {};
	
	phases: any;
	
	result: any;
	
	phasesPoints: any;
	
	phasesProgressCriteria: any;
	
	questionResult: any = "";
	
	questionSets: any = "";
	
	templateResult: any = "";
	
	breadCrumb: any = "Treatment";

	phaseResult: any = "";
	
	patientResult: any = "";
	
	exerciseResult: any = "";
	
	submitted = false;
	
	deleteQuestionFlag : string = "1";

	qustionMode = "Add";

	phaseMode = "Add";
	
	allTemplates: any = [];
	
	injuryName: any;
	
	tempalteLength: any;
	
	exerciseTitle: string = '';
	
	questionButton: any = "Add Questions";
	
	templateButton: any = "Add Diagnosis";
	
	templateName : any = "-";

	public modalRef: BsModalRef;
	
	showExercises: boolean = false;
	
	assigned: string = "0";
	
	questionLoad: boolean = true;

	phaseLoad: boolean = true;
	
	numberError: boolean = false;

	exerciseFinish: boolean = false;
	
	finishButton: boolean = true;
	
	curDate: any;
	
	weekDay: any;

	weekDays = [ "1", "2", "3", "4", "5", "6", "7" ];

	searchText: string;

	key: any;
	constructor(private elem: ElementRef, public injuryService: InjuryService, public common: CommonService, private modalService: BsModalService, public patientService: PatientService, public fb: FormBuilder,private cd: ChangeDetectorRef, public templateService : TemplateService, private route: ActivatedRoute, private router: Router) { }
	
	// @HostListener('document:keypress', ['$event'])

	// onKeyPress($event: KeyboardEvent) {
	//     if(($event.ctrlKey || $event.metaKey) && $event.keyCode == 112 || $event.keyCode == 80){}
	// 	this.showExercises = false;

	// }

	public openModal(template: TemplateRef<any>, form, id = '', flg = "0") {
		if (form == "exercise" || form == "exercise-edit") {
			this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
		}else{	
			this.modalRef = this.modalService.show(template);
		}
		switch (form) {
			case "qus":
			this.setQuestionForm();
			break;

			case "qusedit":
			let mode = (this.patientResult != "") ? "1" : "0";

			this.editQuestion(id, mode);
			break;

			case "phase":
			this.setPhaseForm();
			break;

			case "phaseEdit":
			this.editPhase(id);
			break;

			case "exercise":
			this.setExerciseForm(flg);
			break;

			case "delete":
			this.deleteTemplateQuestion(id);
			break;

			case "deletePhase":
			this.deleteTemplatePhase(id);
			break;

			case "exercise-edit":
			this.editExercise(id, flg);
			break;
		}
	}

	ngOnInit() {

		this.role = localStorage.getItem('role');

		this.common.loading = true;
		
		this.curDate = new Date();

		this.clinic_id = localStorage.getItem('clinic');

		switch (this.role) {

			case "2":
			this.templateAssignDiv = false;
			this.templateDiv = false;
			this.questionDiv = false;
			this.phaseDiv = false;
			this.exerciseDiv = false;
			// this.setAssignTemplateForm();
			this.sub = this.route.params.subscribe(params => {
				this.getPatient(params['patientId']);
				this.assigned = params['assigned'];

			});
			

			// this.getInjuryTempaltes(this.patientResult.injury_id);
			// this.addExercise();
			break;

			default:
			localStorage.removeItem('template_id');
			this.addTemplate();
			this.common.checkForEditable(this.route, () => {this.editTemplate(this.common.id)}, () => {this.setTemplateForm()});
			break;
		
		}

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	addTemplate(){
		this.templateAssignDiv = false;
		this.templateDiv = true;
		this.questionDiv = false;
		this.exerciseDiv = false;
		this.phaseDiv = false;
		this.submitted = false;
		this.setTemplateForm();
		let template_id = localStorage.getItem('template_id');
		if(template_id){
			this.editTemplate(template_id);
		}
	}
	onPrint(){
		this.showExercises = false;
		console.log(this.exercises.assigned_exercises)
		for(var i =0; i < this.exercises.assigned_exercises.length; i++) {
			this.exercises.assigned_exercises[i].tbl_exercise.description = this.exercises.assigned_exercises[i].tbl_exercise.description.replace(/\<br><br>/g, "");
		}

		setTimeout(() => {
			window.print();
		}, 500);
	}
	wordCount(ele){
		if(parseInt(this.weekDay)){

			this.showExercises = ((ele.target.value) == "") ? false: true;
			this.numberError = false;
			
		}else{
			
			this.numberError = true;

		}

	}

	getInjuryTempaltes(injury_id) {

		this.patientService.getTemplates(injury_id).subscribe((res)=>{

			this.allTemplates = res as Template[];

			this.tempalteLength = this.allTemplates.length;
		});

	}

	addRepDay(ele){

		this.setRepDay(ele);

	}

	setRepDay(day){
		let treatmentId = localStorage.getItem('treatment_id');

		this.templateService.updateWeekDay(treatmentId, {week_day : day}).subscribe((res) => {

			this.numberError = false;
			this.weekDay = day;
		});
	}
	getPatient(id : number){

		this.patientService.getPatient(id).subscribe((res)=>{

			this.patientResult = res;

			localStorage.setItem('treatment_id', this.patientResult.treatment.id);

			localStorage.setItem('patient_id', this.patientResult.id);

			localStorage.setItem('template_id', this.patientResult.treatment.template_id);

			this.getInjuryTempaltes(this.patientResult.treatment.injury_id);

			this.injuryName = this.patientResult.treatment.tbl_injury.injury_name;

			this.templateName = this.patientResult.treatment.tbl_template ? this.patientResult.treatment.tbl_template.about_desc : '-';

			if(this.patientResult != ""){

				if(this.assigned == "1"){
					this.exerciseDiv = true;
					this.finishButton = false;
					this.exerciseFinish = true;

					this.addExercise();

				}else{
					this.phaseDiv = true;
					this.exerciseFinish = false;
					this.finishButton = true;
					// this.addQuestions();
					this.addPhases();
					// this.addExercise();
				}

			}else{

				this.setAssignTemplateForm();

			}

		});

	}

	closeDivs(divs) {
		this.templateAssignDiv = true;
		this.exerciseDiv = true;
		this.templateDiv = false;
		this.questionDiv = false;
		this.phaseDiv = false;
	}

	setAssignTemplateForm(){
		this.assignForm = this.fb.group({
			template : ['', Validators.required]
		});
	}

	setRepForm() {

		this.weekDay = (this.patientResult != "") ? (this.patientResult.treatment.week_day > "0") ? this.patientResult.treatment.week_day : '' : '';
		
		this.repForm = this.fb.group({
			week_day : [this.weekDay, Validators.required]
		});

	}

	setTemplateForm(){
		/* Initiate the form structure */
		this.templateForm = this.fb.group({
			injury_id: ['', Validators.required],
			about_desc: ['', Validators.required],
			image: ['', Validators.required],
			about_points: this.fb.array([this.fb.group({about:['', [Validators.required]]})]),
			did_points: this.fb.array([this.fb.group({did:['', [Validators.required]]})])
		});

		this.breadCrumb = "Create Diagnosis";

		this.getInjuries();

	}

	setQuestionForm(){
		this.templateQuestionForm = this.fb.group({
			template_id : [],
			week: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
			priority : [],
			question_points: this.fb.array([this.fb.group({question:['', [Validators.required]]})])
		});
	}

	setExerciseForm(mode){
		this.exerciseTitle = '';
		this.templateExerciseForm = this.fb.group({
			sets : [3, [Validators.required, Validators.pattern("^[0-9]*$")]],
			reps: [10, [Validators.required, Validators.pattern("^[0-9]*$")]],
			description : ['', Validators.required],
			perform : [''],
			flag : [mode]
		});
	}

	addExercise(){
		/* Initiate the form structure */
		let treatment_id = localStorage.getItem('treatment_id');

		this.setExercises(treatment_id);

		this.setRepForm();

		this.breadCrumb = "Assign Exercises";
		this.questionDiv = false;
		this.phaseDiv = false;
		this.exerciseDiv = true;
		this.templateAssignDiv = false;
		this.templateDiv = false;
		this.submitted = false;
	}

	setExercises(treatmentId){

		this.templateService.getTemplateExercises(treatmentId).subscribe((res) => {

			this.exercises = res;

		});

	}

	addQuestions(){
		/* Initiate the form structure */
		this.setQuestionForm();
		this.questionDiv = true;
		this.exerciseDiv = false;
		this.phaseDiv = false;
		this.templateAssignDiv = false;
		this.templateDiv = false;
		this.breadCrumb = "Add Questions";
		this.submitted = false;
		if(this.templateResult !== "" || this.templateResult !== null){

			if(this.patientResult != ""){

				this.getTemplateQuestions(this.patientResult.treatment.id);

			}else{

				this.getTemplateQuestions(this.templateResult.id);

			}
			this.breadCrumb = "Edit Questions";

		}else{

			this.breadCrumb = "Add Questions";

		}
		// this.fetchQuestions(1);
		// localStorage.setItem('template_id', '3');
	}

	setPhaseForm(){
		this.templatePhaseForm = this.fb.group({
			name : ['', [Validators.required]],
			template_id : [],
			start_week : ['', [Validators.pattern("^[0-9]*$")]],
			end_week : ['', [Validators.pattern("^[0-9]*$")]],
			expectation_points: this.fb.array([this.fb.group({expectation:['', [Validators.required]]})]),
			progression_points: this.fb.array([this.fb.group({progression:['', []]})])
		});
	}

	addPhases(){
		/* Initiate the form structure */
		this.setPhaseForm();
		this.breadCrumb = "Add Roadmaps";
		this.templateAssignDiv = false;
		this.exerciseDiv = false;
		this.phaseDiv = true;
		this.questionDiv = false;
		this.submitted = false;
		this.templateDiv = false;
		this.phaseLoad = true;

		if(this.templateResult !== "" || this.templateResult !== null){

			if(this.patientResult != ""){

				this.getTemplatePhases(this.patientResult.treatment.id);

			}else{

				this.getTemplatePhases(this.templateResult.id);
				// this.getTemplatePhases(10);

			}

			this.breadCrumb = "Edit Roadmaps";

		}else{

			this.breadCrumb = "Add Roadmaps";

		}
	}
	///////// This is new ////////
	get aboutPoints() {
		return this.templateForm.get('about_points') as FormArray;
	}

	get didPoints() {
		return this.templateForm.get('did_points') as FormArray;
	}

	get questionPoints() {
		return this.templateQuestionForm.get('question_points') as FormArray;
	}

	get progressionPoints() {
		return this.templatePhaseForm.get('progression_points') as FormArray;
	}

	get expectationPoints() {
		return this.templatePhaseForm.get('expectation_points') as FormArray;
	}

	/*addBox(control, subControl) {
		
		let points = this.multipleBoxes[subControl];

		points.count++;
		
		points.state = (points.count == points.limit) ? false : true;

		control.push(this.fb.group({[subControl]:['', [Validators.required]]}));
	}

	deleteBox(control, subControl, index) {
		
		let points = this.multipleBoxes[subControl];

		points.count--;
		
		points.state = (points.count < points.limit) ? true : false;

		control.removeAt(index);
		
		if(points.count <= 0){

			control.push(this.fb.group({[subControl]:['', [Validators.required]]}));

		}
	}*/

	///////////End ////////////////

	resetTemplate(){
		this.templateService.selectedTemplate = {
			id: null,
			injury_id: "",
			about_desc: "",
			about_image: "",
			q1_to_ask: "",
			q2_to_ask: "",
			q3_to_ask: "",
			q4_to_ask: ""
		}
	}

	onChangeObj(newObj) {
		this.selectedInjury = newObj;
	}

	getInjuries(){
		this.injuryService.getInjuries().subscribe((res)=>{
			// this.templateService.injuries = res as Injury[];
		});
	}

	onPhaseSubmit (){

		this.submitted = true;

		// stop here if form is invalid
		if (this.templatePhaseForm.invalid) {
			return;
		}

		this.responsePhaseMessage = true;
		this.responsePhaseType = 'warning';
		this.responsePhase = 'Adding Phase, Please wait';

		let template_id = (this.templateResult != "") ? (this.templateResult.id): localStorage.getItem('template_id');
		// let template_id = localStorage.getItem('template_id');

		let templatePhase = {'progress_criteria':[], 'points': []};

		templatePhase["treatment_id"] = (this.patientResult != "") ? (this.patientResult.treatment.id): "0";

		for (const field in this.templatePhaseForm.controls) {

			switch (field) {
				case "progression_points":
				this.templatePhaseForm.get(field).value.forEach((obj, key) => {
					templatePhase["progress_criteria"].push(obj.progression);
				});
				break;

				case "expectation_points":
				this.templatePhaseForm.get(field).value.forEach((obj, key) => {
					templatePhase["points"].push(obj.expectation);
				});
				break;

				case "template_id":
				templatePhase["template_id"] = template_id;
				break;

				default:
				templatePhase[field] = this.templatePhaseForm.get(field).value;
				break;
			}

		}

		if(this.phaseResult === "" || this.phaseResult === null){

			let flag = (this.patientResult != "") ? "1" : "0";

			this.templateService.createTemplatePhase(templatePhase, flag).subscribe((res)=>{

				this.responsePhaseType = 'success';

				this.responsePhase = 'Successfully Added!';

				setTimeout(() => {
					if(this.patientResult != ""){

						this.getTemplatePhases(this.patientResult.treatment.id);

					}else{

						this.getTemplatePhases(template_id);

					}	
					this.responsePhaseMessage = false;
					
					this.modalRef.hide();
				}, 1500);

			},(err) => {
				this.responseType = 'danger';
				this.response = err.error.message;
			});
		}else{

			this.responsePhase = 'Updating Roadmap. Please Wait';

			let flag = (this.patientResult != "") ? "1" : "0";

			this.templateService.updateTemplatePhase(templatePhase, this.phaseResult.id, flag).subscribe((res)=>{

				// let fetch_id = (this.patientResult != "") ? localStorage.getItem('treatment_id') : template_id;

				// this.getTemplatePhases(fetch_id);

				this.responsePhaseType = 'success';

				this.responsePhase = 'Successfully Updated!';

				this.phaseResult = "";

				setTimeout(() => {
					if(this.patientResult != ""){

						this.getTemplatePhases(this.patientResult.treatment.id);

					}else{

						this.getTemplatePhases(template_id);

					}	
					this.responsePhaseMessage = false;

					this.modalRef.hide();

				}, 1500);

			},(err) => {
				this.responseType = 'danger';
				this.response = err.error.message;
			});
		}

		this.submitted = false;
		
	}

	editTemplate(tempalteId){

		this.breadCrumb = "Edit Diagnosis";
		this.templateAssignDiv = false;
		this.templateDiv = true;
		this.questionDiv = false;
		this.exerciseDiv = false;
		this.phaseDiv = false;
		this.submitted = false;
		
		this.templateService.editTemplate(tempalteId).subscribe((res) => {
			
			this.templateResult = res;

			let abouts = this.common.loopThroughBoxes(this.templateResult.tbl_template_abouts, 'about', 'about_point');
			
			let dids = this.common.loopThroughBoxes(this.templateResult.tbl_did_you_knows, 'did', 'description');

			this.templateForm = this.fb.group({
				injury_id: [parseInt(this.templateResult.injury_id), Validators.required],
				image: [''],
				about_desc: [this.templateResult.about_desc, Validators.required],
				about_points: this.fb.array(abouts),
				did_points: this.fb.array(dids)
			});

			this.questionButton = "Edit Question";

			this.templateButton = "Edit Diagnosis";

			localStorage.setItem('template_id', this.templateResult.id);

			this.imgURL = this.templateResult.about_image;
		});

	}

	get tq() { return this.templateQuestionForm.controls; }
	
	get tf() { return this.templateForm.controls; }

	get atf() { return this.assignForm.controls; }
	
	get te() { return this.templateExerciseForm.controls; }
	
	get rf() { return this.repForm.controls; }
	
	get pf() { return this.templatePhaseForm.controls; }

	editQuestion(questionId, flag = "0") {
		this.submitted = false;
		this.templateService.editQuestion(questionId, flag).subscribe((res) => {

			this.questionResult = res;

			let questions = this.common.loopThroughBoxes(this.questionResult.tbl_questions, 'question', 'question');

			this.templateQuestionForm = this.fb.group({
				template_id : this.questionResult.template_id,
				week: this.questionResult.week,
				priority: 1,
				question_points: this.fb.array(questions)
			});

			this.qustionMode = "Update";

		});

	}

	editExercise(exerciseId, mode) {
		this.submitted = false;
		this.setExerciseForm(mode);
		
		if(mode == "0"){

			this.templateService.editExercise(exerciseId).subscribe((res) => {

				this.exerciseResult = res;

				this.templateExerciseForm = this.fb.group({
					sets : [3, [Validators.required, Validators.pattern("^[0-9]*$")]],
					reps: [10, [Validators.required, Validators.pattern("^[0-9]*$")]],
					description : [this.exerciseResult.description, Validators.required],
					perform : [""],
					flag : [mode]
				});
				this.exerciseTitle = this.exerciseResult.title;
			});
			
		}else{
			
			this.templateService.editTreatmentExercise(exerciseId).subscribe((res) => {

				this.exerciseResult = res;

				this.templateExerciseForm = this.fb.group({
					sets : [this.exerciseResult.sets, [Validators.required, Validators.pattern("^[0-9]*$")]],
					reps: [this.exerciseResult.reps, [Validators.required, Validators.pattern("^[0-9]*$")]],
					description : [this.exerciseResult.description, Validators.required],
					perform : [this.exerciseResult.perform],
					flag : [mode]
				});
				
				this.exerciseResult.title = this.exerciseResult.tbl_exercise.title;
				this.exerciseResult.purpose = this.exerciseResult.tbl_exercise.purpose;
				this.exerciseResult.image = this.exerciseResult.tbl_exercise.image;

				this.exerciseTitle = this.exerciseResult.title;
			});
		}

		localStorage.setItem('exercise_id', exerciseId);

	}

	editPhase(phaseId) {
		this.submitted = false;

		let flag = (this.patientResult != "") ? "1" : "0";
		
		this.templateService.editPhase(phaseId, flag).subscribe((res) => {

			this.phaseResult = res;

			let PhasesPoints = (this.patientResult != "") ? this.phaseResult.tbl_treatment_phases_points : this.phaseResult.tbl_phases_points;
			
			let PhasesProgressCriteria = (this.patientResult != "") ? this.phaseResult.tbl_treatment_phases_progress_criteria : this.phaseResult.tbl_phases_progress_criteria;
			
			let expectation = this.common.loopThroughBoxes(PhasesPoints, 'expectation', 'point');
			
			let progression = this.common.loopThroughBoxes(PhasesProgressCriteria, 'progression', 'pc_point', false);

			this.templatePhaseForm = this.fb.group({
				name : [this.phaseResult.name, [Validators.required]],
				template_id : this.phaseResult.template_id,
				start_week : [this.phaseResult.start_week, [Validators.pattern("^[0-9]*$")]],
				end_week : [this.phaseResult.end_week, [Validators.pattern("^[0-9]*$")]],
				expectation_points: this.fb.array(expectation),
				progression_points: this.fb.array(progression)
			});

			this.phaseMode = "Update";

		});

	}

	onAssignSubmit (){

		this.submitted = true;

		// stop here if form is invalid
		if (this.assignForm.invalid) {
			return;
		}

		let template_id = this.assignForm.controls['template'].value;
		let treatment_id = this.patientResult.treatment.id;
		let assignData = {
			'template_id' : template_id,
			'treatment_id' : treatment_id
		};

		this.templateService.assignTreatment(assignData).subscribe((res)=>{
			
			this.addQuestions();

			this.getTemplateQuestions(treatment_id);

		});	

		this.submitted = false;

	}

	onExerciseSubmit (){

		this.submitted = true;

		// stop here if form is invalid
		if (this.templateExerciseForm.invalid) {
			return;
		}

		this.responseExerciseMessage = true;

		this.responseExerciseType = 'warning';

		let exerciseData = {};
		
		for (const field in this.templateExerciseForm.controls) {
			
			exerciseData[field] = this.templateExerciseForm.get(field).value;
			
		}

		let treatment_id = localStorage.getItem('treatment_id');

		let exercise_id = localStorage.getItem('exercise_id');
		
		exerciseData['treatment_id'] = treatment_id;
		
		exerciseData['exercise_id'] = exercise_id;

		if(this.templateExerciseForm.value.flag == "0"){

			this.responseExercise = 'Assigning exercise, Please Wait';

			this.templateService.createExercise(exerciseData).subscribe((res)=>{

				this.responseExerciseType = 'success';

				this.responseExercise = 'Successfully Added!!';
				
				this.setExercises(treatment_id);

				setTimeout(() => {
					this.responseExerciseMessage = false;
					this.modalRef.hide();
				}, 1500);

			},(err) => {
				this.responseExerciseType = 'danger';
				this.response = err.error.message;
			});
		}else{

			this.responseExercise = 'Updating Assigned Exercise. Please Wait';

			this.templateService.updateExercise(exerciseData, exercise_id).subscribe((res)=>{

				this.responseExerciseType = 'success';

				this.responseExercise = 'Successfully Updated';

				this.templateExerciseForm.value.flag = "0";

				this.setExercises(treatment_id);

				setTimeout(() => {

					this.responseExerciseMessage = false;

					this.modalRef.hide();

				}, 1500);

			},(err) => {
				this.responseExerciseType = 'danger';
				this.response = err.error.message;
			});
		}

		this.submitted = false;

	}

	removeExercise(exerciseId, treatment_id ){

		if(confirm('Are you sure you want to remove this Exercise ?') == true){

			this.templateService.removeExercise(exerciseId).subscribe((res) => {

				this.setExercises(treatment_id);

			});

		}
	}

	deleteTemplateQuestion(questionId){

		this.deleteForm = this.fb.group({
			id : [questionId]
		});

		this.deleteMessage = "Are you sure you want to delete this Question?";

		this.deleteType = "question";
	}

	deleteTemplatePhase(phaseId){

		this.deleteForm = this.fb.group({
			id : [phaseId]
		});

		this.deleteMessage = "Are you sure you want to delete this phase?";

		this.deleteType = "phase";

	}

	onQuestionDelete(){

		this.responseQuestionDeleteMessage = true;

		this.responseQuestionDeleteType = 'warning';

		let template_id = localStorage.getItem('template_id');

		let deleteId = this.deleteForm.controls['id'].value;

		if (this.deleteType == "question") {
			
			this.responseQuestionDelete = 'Deleting Question Set. Please Wait';

			if (this.deleteQuestionFlag == "1") {

				this.templateService.deleteTreatmentQuestion(deleteId).subscribe((res) => {

					this.responseQuestionDeleteType = 'success';

					this.responseQuestionDelete = 'Successfully Deleted';
					setTimeout(() => {

						this.getTemplateQuestions(this.patientResult.treatment.id);

						this.responseQuestionDeleteMessage = false;

						this.modalRef.hide();

					}, 1500);

				});
			}else{
				this.templateService.deleteTemplateQuestion(deleteId).subscribe((res) => {

					this.responseQuestionDeleteType = 'success';

					this.responseQuestionDelete = 'Successfully Deleted';

					setTimeout(() => {

						this.getTemplateQuestions(template_id);

						this.responseQuestionDeleteMessage = false;

						this.modalRef.hide();

					}, 1500);

				});
			}

		}else{
			
			this.responseQuestionDelete = 'Deleting, Please Wait';

			let flag = (this.patientResult != "") ? "1" : "0";

			this.templateService.deleteTemplatePhase(deleteId, flag).subscribe((res) => {

				this.responseQuestionDeleteType = 'success';

				this.responseQuestionDelete = 'Successfully Deleted';
				setTimeout(() => {
					
					if(this.patientResult != ""){

						this.getTemplatePhases(this.patientResult.treatment.id);

					}else{

						this.getTemplatePhases(template_id);

					}	

					this.responseQuestionDeleteMessage = false;

					this.modalRef.hide();

				}, 1500);

			});

		}
	}
	
	onRepSubmit (){
		
		this.submitted = true;

		if (this.repForm.invalid) {
			this.numberError = true;
			return;
		}else{
			this.router.navigateByUrl('/patient/view/'+this.patientResult.id);
		}

	}

	onQuestionSubmit (){

		this.submitted = true;

		// stop here if form is invalid
		if (this.templateQuestionForm.invalid) {
			return;
		}

		this.responseQuestionMessage = true;

		this.responseQuestionType = 'warning';

		var templateQuestion = {'questions':[]};

		let template_id = (this.templateResult != "") ? (this.templateResult.id): localStorage.getItem('template_id');
		// let template_id = 1;

		templateQuestion["flag"] = (this.patientResult != "") ? "1" : "0";
		
		templateQuestion["treatment_id"] = (this.patientResult != "") ? (this.patientResult.treatment.id): "0";
		
		templateQuestion["template_id"] = template_id;

		for (const field in this.templateQuestionForm.controls) {
			switch (field) {
				case "question_points":
				this.templateQuestionForm.get(field).value.forEach((obj, key) => {
					templateQuestion["questions"].push(obj.question);
				});
				break;

				case "template_id":
				templateQuestion["template_id"] = template_id;
				break;

				case "priority":
				templateQuestion["priority"] = 1;
				break;

				default:
				templateQuestion[field] = this.templateQuestionForm.get(field).value;
				break;
			}
		}

		if(this.questionResult === "" || this.questionResult === null){

			this.responseQuestion = 'Adding Question Set. Please Wait';

			this.templateService.createTemplateQuestions(templateQuestion).subscribe((res)=>{
				
				this.getTemplateQuestions(template_id);

				this.responseQuestionType = 'success';

				this.responseQuestion = 'Successfully Added!';

				setTimeout(() => {
					this.responseQuestionMessage = false;
					this.modalRef.hide();
				}, 1500);

			},(err) => {
				this.responseType = 'danger';
				this.response = err.error.message;
			});
		}else{

			this.responseQuestion = 'Updating Question Set. Please Wait!';

			this.templateService.updateTemplateQuestions(templateQuestion, this.questionResult.id).subscribe((res)=>{

				let fetch_id = (this.patientResult != "") ? localStorage.getItem('treatment_id') : template_id;

				this.getTemplateQuestions(fetch_id);

				this.responseQuestionType = 'success';

				this.responseQuestion = 'Successfully Updated!';

				this.questionResult = "";

				setTimeout(() => {

					this.responseQuestionMessage = false;

					this.modalRef.hide();

				}, 1500);

			},(err) => {
				this.responseType = 'danger';
				this.response = err.error.message;
			});
		}

		this.submitted = false;

	}

	getTemplateQuestions(treatment_id){
		
		this.questionLoad = true;

		let flag = (this.patientResult != "") ? "1" : "0";

		this.deleteQuestionFlag = flag;

		this.breadCrumb = "Questions";

		this.templateService.getTemplateQuestions(treatment_id, flag).subscribe((r)=>{
			
			this.questions = r;

		});
		this.questionLoad = false;
	}

	getTemplatePhases(template_id) {

		this.phaseLoad = true;

		let flag = (this.patientResult != "") ? "1" : "0";

		this.deleteQuestionFlag = flag;

		this.breadCrumb = "Roadmaps";

		this.templateService.getTemplatePhases(template_id, flag).subscribe((r)=>{

			this.phases = r;
			// console.log(this.phases);

		});

		this.phaseLoad = false;

	}

	onSubmit(){

		this.submitted = true;

		// stop here if form is invalid
		if (this.templateForm.invalid) {
			return;
		}

		this.responseMessage = true;

		this.responseType = 'warning';

		let templateData = new FormData();
		let templateUpData = {about_point:[], did_you_know: []};

		templateData.append('image', this.image);

		for (const field in this.templateForm.controls) {
			switch (field) {
				case "about_points":
				this.templateForm.get(field).value.forEach((obj, key) => {
					templateData.append("about_point[]", obj.about);
					templateUpData['about_point'].push(obj.about);
				});
				break;

				case "did_points":
				this.templateForm.get(field).value.forEach((obj, key) => {
					templateData.append("did_you_know[]", obj.did);
					templateUpData['did_you_know'].push(obj.did);
				});
				break;

				// case "injury_id":
				// templateData.append(field, this.templateForm.get(field).value);
				// break;

				default:
				templateData.append(field, this.templateForm.get(field).value);
				templateUpData[field] = this.templateForm.get(field).value;
				break;
			}

		}

		if(this.templateResult === "" || this.templateResult === null){

			this.response = 'Adding Diagnosis. Please wait!';
			// template.append('injury_id', this.selectedInjury);
			this.templateService.createTemplate(templateData).subscribe((res)=>{
				this.result = res;
				localStorage.setItem('template_id', this.result.id);
				this.response = 'Successfully Added!';
				this.responseType = 'success';
				setTimeout(() => {
					this.responseMessage = false;
					this.addQuestions();
				}, 1500);
				// this.router.navigateByUrl('/template');				
			},(err) => {
				this.responseType = 'danger';
				this.response = err.error.message;
			});
		}else{
			// templateUpData.append('image', this.image);
			this.response = 'Updating Diagnosis. Please wait!';
			// template.append('injury_id', this.selectedInjury);
			this.templateService.updateTemplate(templateData, this.templateResult.id).subscribe((res)=>{
				this.result = res;
				localStorage.setItem('template_id', this.templateResult.id);
				this.response = 'Successfully Updated!';
				this.responseType = 'success';
				setTimeout(() => {
					this.responseMessage = false;
					this.addQuestions();
				}, 1500);
				// this.router.navigateByUrl('/template');				
			},(err) => {
				this.responseType = 'danger';
				this.response = err.error.message;
			});

		}
		
		this.submitted = false;

	}

	onFileChange(event) {
		const reader = new FileReader();
		if(event.target.files && event.target.files.length) {
			const [file] = event.target.files;
			this.image = file;
		}
	}

	preview(files) {
		if (files.length === 0)
			return;

		var mimeType = files[0].type;
		if (mimeType.match(/image\/*/) == null) {
			this.message = "Only images are supported.";
			return;
		}

		var reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]); 
		reader.onload = (_event) => { 
			this.imgURL = reader.result; 
		}
	}

	sequence(event, phase){

		if (event.keyCode !== 8) {
			
			let flag = (this.patientResult != "") ? "1" : "0";

			let sequence = { 'sequence' : event.target.value, flag : flag };

			this.templateService.setPhaseSequence(sequence, phase).subscribe((res) => {
				
				let template_id = localStorage.getItem('template_id');

				if(this.patientResult != ""){

					this.getTemplatePhases(this.patientResult.treatment.id);

				}else{

					this.getTemplatePhases(template_id);

				}

			},(err) => {

			});
		}
	}
}
