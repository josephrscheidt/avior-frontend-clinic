import { Component, OnInit, ElementRef } from '@angular/core';
import { Patient } from './patient';
import { PatientService } from './service/patient.service';
import { NgForm } from "@angular/forms";
import { CommonService } from './../common/common.service';

@Component({
	selector: 'app-patient',
	templateUrl: './patient.component.html',
	styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
	p: number = 1;
	searchText : string = "";

	role : string ;
	
	therapist_id : any ;
	
	constructor(private elem: ElementRef, public patientService: PatientService, public common: CommonService) { }

	ngOnInit() {

		this.role = localStorage.getItem('role');
		
		this.therapist_id = localStorage.getItem('id');

		this.getPatients();

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}
	
	getPatients(){
		
		this.common.addLoaderRow(5);
		
		let clinicId = (this.role == "2") ? +localStorage.getItem('clinic') : 0;
		
		this.patientService.getAllPatients(clinicId).subscribe((res)=>{

			this.common.hideLoaderRow();

		});
	}

	deletePatient(id : string,form : NgForm){

		if(confirm('Are you sure to delete this record ?')== true){
			this.patientService.deletePatient(id).subscribe((res)=>{
				this.getPatients();
			});
		}
	}
}
