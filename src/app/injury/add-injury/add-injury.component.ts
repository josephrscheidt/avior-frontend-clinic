import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InjuryService } from './../service/injury.service';
import { CommonService } from './../../common/common.service';
import { MessageService } from './../../common/message.service';
import { Injury } from './../injury';

@Component({
	selector: 'app-add-injury',
	templateUrl: './add-injury.component.html',
	styleUrls: ['./add-injury.component.css']
})
export class AddInjuryComponent implements OnInit {

	injuryModel : any = {};


	content : string = 'body-part';

	constructor(private elem: ElementRef, public message: MessageService, public injuryService: InjuryService, private route: ActivatedRoute, private router: Router, public common : CommonService) { }

	ngOnInit() {

		this.common.checkForEditable(this.route, () => {this.getInjury(this.common.id)}, () => {this.resetInjury()});

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	resetInjury(){
		this.injuryService.selectedInjury = {
			id: null,
			injury_name: ""
		}
	}

	getInjury(id : number){
		
		this.injuryService.getInjury(id).subscribe((res)=>{
			
			this.injuryService.selectedInjury = res;

			this.common.isActiveDiv = true;

		});
	}

	onSubmit(form) {

		let injury = form.value;  

		this.injuryService.editInjury(injury);

	}
}
