import { Component, OnInit, ElementRef } from '@angular/core';
// import { Injury } from './injury';
import { InjuryService } from './service/injury.service';
import { CommonService } from './../common/common.service';
import { MessageService } from './../common/message.service';
import { NgForm } from "@angular/forms";

@Component({
	selector: 'app-injury',
	templateUrl: './injury.component.html',
	styleUrls: ['./injury.component.css']
})
export class InjuryComponent implements OnInit {
	p: number = 1;
	searchText : string = "";

	constructor(private elem: ElementRef, public injuryService: InjuryService, public commonService: CommonService, message: MessageService) { }

	ngOnInit() {

		this.getInjuries();

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	getInjuries(){

		this.commonService.addLoaderRow(3);

		this.injuryService.getInjuries().subscribe((res)=>{

			this.commonService.hideLoaderRow();

		});
	}

	deleteInjury(id : string,form : NgForm){

		if(confirm('Are you sure to delete this record ?')== true){
			this.injuryService.deleteInjury(id).subscribe((res)=>{
				this.getInjuries();
			});
		}

	}
}
