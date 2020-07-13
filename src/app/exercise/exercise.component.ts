import { Component, OnInit, ElementRef } from '@angular/core';
// import { TemplateRef, ViewChild } from '@angular/core';


import { Exercise } from './exercise';
import { ExerciseService } from './service/exercise.service';
import { NgForm } from "@angular/forms";
import { CommonService } from './../common/common.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-exercise',
	templateUrl: './exercise.component.html',
	styleUrls: ['./exercise.component.css']
})

export class ExerciseComponent implements OnInit {
	model : any = {};
	hideShow = false;
	p: number = 1;
	searchText : string = "";
	constructor(private elem: ElementRef, public exerciseService: ExerciseService, public commonService: CommonService, private route: ActivatedRoute, private router: Router) {}
	
	ngOnInit(){
		this.commonService.loading = true;
		this.getExercises();
		
		let page = localStorage.getItem('pageNumber') ? parseInt(localStorage.getItem('pageNumber')) : 1;

		this.p = page;

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}
	
	getExercises(){
		this.commonService.addLoaderRow(6);

		this.exerciseService.getExercises().subscribe((res)=>{ this.commonService.hideLoaderRow() });
	}

	onEdit(exercise){
		
		localStorage.setItem('pageNumber', this.p.toString());
		
		this.router.navigateByUrl('/exercise/edit/'+exercise);
		
	}

	deleteExercise(id : string,form : NgForm){

		if(confirm('Are you sure to delete this record ?')== true){
			this.exerciseService.deleteExercise(id).subscribe((res)=>{
				this.getExercises();
			});
		}
	}

	/*showLoader() {
		$('tbody').append('<tr id = "loader"><td colspan = "5"><div class = "text-center h4">Loading...</div></td></tr>');
	}

	hideLoader() {
		$('#loader').remove();
	}*/
}