import { Component, OnInit, ElementRef } from '@angular/core';
import { Clinic } from './clinic';
import { ClinicService } from './service/clinic.service';
import { NgForm } from "@angular/forms";
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';

@Component({
	selector: 'app-clinic',
	templateUrl: './clinic.component.html',
	styleUrls: ['./clinic.component.css']
})
export class ClinicComponent implements OnInit {
	
	p: number = 1;
	searchText : string = "";

	constructor(private elem: ElementRef, public clinicService: ClinicService, public commonService: CommonService, public message : MessageService) { }

	ngOnInit() {
		this.commonService.addLoaderRow(3);

		this.clinicService.getClinics().subscribe((res)=>{
			this.commonService.hideLoaderRow();

		});

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
	}

	onEdit(clinic : Clinic){
		this.clinicService.selectedClinic = clinic;
	}

	deleteClinic(id : string,form : NgForm){

		if(confirm('Are you sure to delete this record ?')== true){
			this.clinicService.deleteClinic(id).subscribe((res)=>{
				this.clinicService.refresh();
				this.commonService.addLoaderRow(3);

				this.clinicService.getClinics().subscribe((res)=>{
				
					this.commonService.hideLoaderRow();

				});
			});
		}
	}
}
