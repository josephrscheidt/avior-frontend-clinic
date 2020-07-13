import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormBuilder, Validators, FormGroup, AbstractControl} from '@angular/forms';
// import { NgForm, FormGroup, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';


@Injectable({
	providedIn: 'root'
})
export class CommonService {

	constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute, private router: Router, public fb: FormBuilder) { }

	theHtmlString : SafeHtml;

	emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,4}$/;

	passwordRegEx = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*]?)[a-zA-Z0-9!@#$%^&*]{6,12}$/;

	showTr : boolean = true;

	responseMessage : boolean = false;

	response : any;

	responseType : string = 'success';

	deleteMessage : string = '';

	mode : string = 'Add';

	buttonMode : string = 'Add';

	private sub: any;

	id: number;

	isActiveDiv : boolean = true;

	loading: boolean = true;

	aliasNames: any 

	multipleBoxes = {
		'about' : {state : true, count : 1, limit : 5},
		'did' : {state : true, count : 1, limit : 5},
		'question' : {state : true, count : 1, limit : null},
		'expectation' : {state : true, count : 1, limit : null},
		'progression' : {state : true, count : 1, limit : 5},
		'answer' : {state : true, count : 1, limit : null},
		'score' : {state : true, count : 1, limit : null}
	};

	addLoaderRow(colspan){
		this.theHtmlString =  this.sanitizer.bypassSecurityTrustHtml("<td colspan = '"+colspan+"'><div class = 'h3 text-center'>Loading...</div></td>");
	}

	hideLoaderRow(){
		this.theHtmlString = '';
		this.showTr = false;
	}

	checkForEditable( route, editMethod, resetMethod){
		this.isActiveDiv = false;
		this.responseMessage = false;
		this.response = '';
		this.responseType = 'warning';

		this.sub = route.params.subscribe(params => {
			this.id = +params['id']; // (+) converts string 'id' to a number

			// In a real app: dispatch action to load the details here.
			if(this.id){
				editMethod(this.id);
				this.setMode('Edit');
			}else{
				resetMethod();
				this.setMode('Add');
			}
		});
		this.isActiveDiv = true;
		return of(null);
	}

	setMode(type) {
		if(type == 'Edit'){
			this.mode = 'Edit';
			this.buttonMode = 'Update';
		}else{
			this.mode = 'Add';
			this.buttonMode = 'Add';
		}
	}

	titleCaseWord(word: string) {
		if (!word) return word;
		return word[0].toUpperCase() + word.substr(1).toLowerCase();
	}

	addBox(control, subControl, require = true) {

		let points = this.multipleBoxes[subControl];

		points.count++;

		points.state = (points.count == points.limit) ? false : true;

		control.push(this.fb.group({[subControl]:['', require ? [Validators.required] : []]}));
	}

	deleteBox(control, subControl, index, require = true) {

		let points = this.multipleBoxes[subControl];

		if(points.limit != null){

			points.count--;

		}

		points.state = (points.count < points.limit || points.limit == null) ? true : false;

		control.removeAt(index);

		if(points.count <= 0){

			control.push(this.fb.group({[subControl]:['', require ? [Validators.required] : [] ]}));

		}
	}

	onLoad() {
		this.loading = false;
	}

	loopThroughBoxes(control, subControl, subObject, require = true){
		// console.log(control);
		let obj = [];

		if(control.length){

			control.forEach((aObj) =>{

				obj.push(this.fb.group({[subControl]:[aObj[subObject], require ? [Validators.required] : []]}));

			});
		}else{

			obj.push(this.fb.group({[subControl]:['', require ? [Validators.required] : []]}));
		}

		return obj;
	}

	formatDate(date) {

		var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

		if (month.length < 2) month = '0' + month;
		if (day.length < 2) day = '0' + day;

		return [month, day].join('-');
	}

	checkPasswords(group: FormGroup) { // here we have the 'passwords' group
  		let pass = group.get('newPassword').value;
  		let confirmPass = group.get('repeatPassword').value;

  		return pass === confirmPass ? null : { notSame: true }     
}
}
