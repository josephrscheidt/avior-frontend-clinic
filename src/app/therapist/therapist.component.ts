import { Component, OnInit, ElementRef } from '@angular/core';
import { Therapist } from './therapist';
import { TherapistService } from './service/therapist.service';
import { NgForm } from "@angular/forms";
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';

@Component({
	selector: 'app-therapist',
	templateUrl: './therapist.component.html',
	styleUrls: ['./therapist.component.css']
})

export class TherapistComponent implements OnInit {
	p: number = 1;
	searchText : string = "";
	
	constructor(private elem: ElementRef, public therapistService: TherapistService, public common: CommonService, public message : MessageService) { }

	ngOnInit() {

		this.getTherapists();

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	getTherapists(){
		this.common.addLoaderRow(5);
		
		this.therapistService.getTherapists().subscribe((res)=>{
			
			this.common.hideLoaderRow();

		});
	}

	deleteTherapist(id : string,form : NgForm){

		if(confirm('Are you sure to delete this record ?')== true){

			this.therapistService.deleteTherapist(id).subscribe((res)=>{

				this.getTherapists();
				
			});
		}
	}
}
