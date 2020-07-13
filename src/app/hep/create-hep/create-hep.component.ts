import { Component, OnInit, ChangeDetectorRef, TemplateRef, ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from './../../patient/service/patient.service';
import { HepService } from './../service/hep.service';
import { Exercise } from './../exercise';
import { AssignedExercise } from './../assigned-exercise';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as $ from 'jQuery';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
// import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-create-hep',
  templateUrl: './create-hep.component.html',
  styleUrls: ['./create-hep.component.css']
})
export class CreateHepComponent implements OnInit {

  templateName : any = "-";
  breadCrumb: any = "Treatment";
  clinic_id : string;
  role : string ;
  assigned: string = "0";

  submitted = false;
  numberError: boolean = false;
  exerciseFinish: boolean = false;
  finishButton: boolean = true;
  showExercises: boolean = false;
  responseExerciseMessage : boolean = false;
  responseExerciseType : string = 'success';
  responseExercise : any;
  curDate: any;

  response : any;
  exerciseDiv : boolean = false;
  exerciseTitle: string = '';
  weekDay: any;
  weekDays = [ "1", "2", "3", "4", "5", "6", "7" ];

  exerciseResult: any = "";
  exercises:any = {};

  templateExerciseForm: FormGroup;
  repForm: FormGroup;

  searchText:string;

  private sub: any;
  public modalRef: BsModalRef;

  constructor(private elem: ElementRef, public message: MessageService, public common: CommonService, private modalService: BsModalService, public patientService: PatientService, public fb: FormBuilder, private cd: ChangeDetectorRef, public hepService : HepService, private route: ActivatedRoute, private router: Router) { }

  public openModal(template: TemplateRef<any>, form, id = '', flg = "0") {
		if (form == "exercise" || form == "exercise-edit") {
			this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
		}
		switch (form) {

			case "exercise":
			this.setExerciseForm(flg);
			break;

			case "exercise-edit":
			this.editExercise(id, flg);
			break;
		}
	}

  ngOnInit() {
    this.clinic_id = localStorage.getItem('clinic');
    this.role = localStorage.getItem('role');
    this.curDate = new Date();
	this.common.loading = true;

    this.exerciseDiv = false;
    this.sub = this.route.params.subscribe(params => {
      this.getPatient(params['patientId']);
	});
	
	// Analytics Page View Event
	const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
	window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	// console.log(this.exercises);
  }

  getPatient(id : number){

		this.patientService.getPatient(id).subscribe((res)=>{

			this.hepService.patientResult = res;

			// localStorage.setItem('treatment_id', this.patientResult.treatment.id);

			// localStorage.setItem('patient_id', this.patientResult.id);

			// localStorage.setItem('template_id', this.patientResult.treatment.template_id);

			// localStorage.setItem('injury_id', this.patientResult.treatment.injury_id);

			this.templateName = this.hepService.patientResult.treatment.tbl_template ? this.hepService.patientResult.treatment.tbl_template.about_desc : '-';

			this.exerciseDiv = true;
			this.finishButton = false;
			this.exerciseFinish = true;

			this.addExercise();

		});

  }
  
  addExercise(){
		/* Initiate the form structure */
		let treatment_id = this.hepService.patientResult.treatment.id;

		this.setExercises(treatment_id, false);

		this.setRepForm();

		this.breadCrumb = "Assign Exercises";
		this.exerciseDiv = true;
		this.submitted = false;
  }
  
  closeDivs(divs) {
		this.exerciseDiv = true;
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
  
  editExercise(exerciseId, mode) {
		this.submitted = false;
		this.setExerciseForm(mode);
		
		if(mode == "0"){

			this.hepService.editExercise(exerciseId).subscribe((res) => {

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
			
			this.hepService.editTreatmentExercise(exerciseId).subscribe((res) => {

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
  
  setExercises(treatmentId, fetchNew?){
	  
		this.hepService.getAllExercises().subscribe(res => {
			let injury_id = this.hepService.patientResult.treatment.injury_id;
			var allEx;
			if (!res){
				this.hepService.allExercises.subscribe(res=>{allEx = res});
			}else{
				allEx = res;
			}

			let exerciseByGroup = {};
			let groupIds = [];
			for (let exercise of allEx){
				if (!groupIds.includes(exercise.group_id)){
					groupIds.push(exercise.group_id);
					exerciseByGroup[exercise.group_id] = [exercise];
				}else{
					exerciseByGroup[exercise.group_id].push(exercise);
				}
			}
			var temp = [];

			// console.log(exerciseByGroup);
			for (let group in exerciseByGroup){
				let a = exerciseByGroup[group].find(function(e){
					return e.injury_id == injury_id
				})
				let b = exerciseByGroup[group].find(function(e){
					return e.injury_id == 11
				})
				temp.push((a  || b)?(a?a:b):exerciseByGroup[group][0]);
			}
			// console.log(temp);

			this.hepService.getAssignedExercises(treatmentId, fetchNew).subscribe(res =>{
				var temp2;
				if (!res){
					this.hepService.assignedExercises.subscribe(res=>{temp2 = res as AssignedExercise});
				}else{
					temp2 = res as AssignedExercise[];
				}
				var item: any;
				for (item in temp2) {
					temp = $.grep(temp as Exercise[], function(e){
						return e.group_id != temp2[item]['tbl_exercise'].group_id;
					})
				}
				this.hepService.setExercises(temp);
			})
		})
  }

  removeExercise(exerciseId, treatment_id ){

		if(confirm('Are you sure you want to remove this Exercise ?') == true){

			this.hepService.removeExercise(exerciseId).subscribe((res) => {

				this.setExercises(treatment_id);

			});

		}
	}

  onExerciseSubmit (){

		this.submitted = true;

		// stop here if form is invalid
		if (this.templateExerciseForm.invalid) {
			return;
		}

		this.message.disableHeader();
		this.message.initMessage();

		let exerciseData = {};
		
		for (const field in this.templateExerciseForm.controls) {
			
			exerciseData[field] = this.templateExerciseForm.get(field).value;
			
		}

		let treatment_id = this.hepService.patientResult.treatment.id;

		let exercise_id = localStorage.getItem('exercise_id');
		
		exerciseData['treatment_id'] = treatment_id;
		
		exerciseData['exercise_id'] = exercise_id;

		if(this.templateExerciseForm.value.flag == "0"){

			this.message.setMessage("a", "exercise");

			this.hepService.createExercise(exerciseData).subscribe((res)=>{
				
				this.setExercises(treatment_id);

				setTimeout(() => {
					this.modalRef.hide();
				}, 1500);

			});
		}else{

			this.message.setMessage("u", "assigned exercise");

			this.hepService.updateExercise(exerciseData, exercise_id).subscribe((res)=>{

				this.templateExerciseForm.value.flag = "0";

				this.setExercises(treatment_id);

				setTimeout(() => {

					this.modalRef.hide();

				}, 1500);

			});
		}

		this.submitted = false;

	}
  
  setRepForm() {

		this.weekDay = (this.hepService.patientResult) ? (this.hepService.patientResult.treatment.week_day > "0") ? this.hepService.patientResult.treatment.week_day : '' : '';
		
		this.repForm = this.fb.group({
			week_day : [this.weekDay, Validators.required]
		});

  }
  
  onRepSubmit (){
		
		this.submitted = true;

		if (this.repForm.invalid) {
			this.numberError = true;
			return;
		}else{
			this.router.navigateByUrl('/patient/view/'+this.hepService.patientResult.id);
		}

  }
  
  addRepDay(ele){

		this.setRepDay(ele);

  }
  
	setRepDay(day){
		let treatmentId = this.hepService.patientResult.treatment.id;

		this.hepService.updateWeekDay(treatmentId, {week_day : day}).subscribe((res) => {

			this.numberError = false;
			this.weekDay = day;
		});
  }
  
  onPrint(){
		this.showExercises = false;
		this.hepService.assignedExercises.subscribe(res=>{
			this.exercises.assigned_exercises = res;
			for(var i =0; i < this.exercises.assigned_exercises.length; i++) {
				this.exercises.assigned_exercises[i].tbl_exercise.description = this.exercises.assigned_exercises[i].tbl_exercise.description.replace(/\<br><br>/g, "");
			}
		})

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

}
