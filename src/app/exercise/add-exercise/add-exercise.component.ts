import { Component, OnInit, ElementRef } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { ExerciseService } from './../service/exercise.service';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service';
import { Exercise } from './../exercise';
import { InjuryService } from './../../injury/service/injury.service'
import { Injury } from './../../injury/injury';

@Component({
	selector: 'app-add-exercise',
	templateUrl: './add-exercise.component.html',
	styleUrls: ['./add-exercise.component.css']
})
export class AddExerciseComponent implements OnInit {

	exerciseModel : any = {};

	public imagePath;

	imgURL: any = "/assets/images/placeholder.png";

	mode: string = 'Add';

	public response: string;

	selectedFile: File;

	// selectedInjury : any;

	id: number;

	private sub: any;

	content : string = 'exercise';

	// selectedExercise : any ={};

	exerciseForm: FormGroup;

	image: any;

	submitted = false;

	// exerciseResult: any = "";

	constructor(private elem: ElementRef, public message: MessageService, public common: CommonService, public fb: FormBuilder, public exerciseService: ExerciseService, private route: ActivatedRoute, private router: Router, public injuryService: InjuryService) { }

	ngOnInit() {
		this.getInjuries();
		this.setExerciseForm();

		this.common.isActiveDiv = false;
		this.message.responseMessage = false;
		this.message.response = '';
		this.message.responseType = 'warning';

		this.route.params.subscribe(params => {
			this.id = +params['id']; // (+) converts string 'id' to a number

			if(this.id){
				this.exerciseService.getExercise(this.id).subscribe(res => {
					this.common.setMode('Edit');
					this.setExerciseForm();
				})
			}else{
				this.resetExercise();
				this.common.setMode('Add');
				this.setExerciseForm();
			}
		});
		this.common.isActiveDiv = true;

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	setExerciseForm(exercise:Exercise = this.exerciseService.selectedExercise){
		this.exerciseForm = this.fb.group({
			injury_id : [(exercise === undefined)?"":exercise.injury_id, Validators.required],
			title : [(exercise === undefined)?"":exercise.title, Validators.required],
			description : [(exercise === undefined)?"":exercise.description, Validators.required],
			purpose : [(exercise === undefined)?"":exercise.purpose, Validators.required],
			image : [""]
			// image : [(exercise === undefined)?this.imgURL:exercise.image, Validators.required]
		});
		this.imgURL = (exercise === undefined)?this.imgURL:exercise.image;
	}
	get ef() { return this.exerciseForm.controls; }

	resetExercise(){
		this.exerciseService.selectedExercise = {
			id: null,
			title: "",
			injury_id: "",
			description: "",
			purpose: "",
			image: "",
		}
		this.setExerciseForm();
	}

	onChangeObj(newObj) {
		this.injuryService.selectedInjury = newObj;
	}

	// getExercises(){
	// 	this.exerciseService.getExercises().subscribe();
	// }

	getExercise(id : number){

		this.exerciseService.getExercise(id).subscribe(res => { this.setExerciseForm() });

	}

	onSubmit() {

		this.submitted = true;

		// stop here if form is invalid
		if (this.exerciseForm.invalid) {
			return;
		}

		let exercise = new FormData();

		exercise.append('image', this.image);

		for (const field in this.exerciseForm.controls) {
			
			switch (field) {
				default:
				exercise.append(field, this.exerciseForm.get(field).value);
				break;
			}

		}

		this.exerciseService.editExercise(exercise);

		// if(this.exerciseService.selectedExercise === null){

		// 	this.common.setMessage('a', this.content);

		// 	this.exerciseService.createExercise(exercise).subscribe((res)=>{

		// 		this.common.setMessage('sa', this.content, 'exercise');

		// 	}, (err) => {

		// 		this.common.setMessage('sc', this.content, '', err.error.message);

		// 	});

		// }else{

		// 	this.common.setMessage("u", this.content);

		// 	this.exerciseService.updateExercise(exercise).subscribe((res)=>{

		// 		this.common.setMessage("su", this.content, 'exercise');

		// 	}, (err) => {

		// 		this.common.setMessage('sc', this.content, '', err.error.message);

		// 	});
		// }

		this.submitted = false;

	}

	getInjuries(){
		this.injuryService.getInjuries().subscribe();
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
			this.response = "Only images are supported.";
			return;
		}

		var reader = new FileReader();
		this.imagePath = files;
		reader.readAsDataURL(files[0]);
		reader.onload = (_event) => {
			this.imgURL = reader.result;
		}
	}
}
