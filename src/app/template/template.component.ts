import { Component, OnInit, ElementRef } from '@angular/core';
import { Template } from './template';
import { TemplateService } from './service/template.service';
import { NgForm } from "@angular/forms";
import { CommonService } from './../common/common.service';

@Component({
	selector: 'app-template',
	templateUrl: './template.component.html',
	styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
	p: number = 1;
	searchText : string = "";
	
	constructor(private elem: ElementRef, public templateService: TemplateService, public common: CommonService) { }
	
	ngOnInit() {

		this.common.loading = true;
		
		this.getTemplates();

		// Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});

	}

	getTemplates(){
		
		this.common.addLoaderRow(4);

		this.templateService.getTemplates().subscribe((res)=>{
			
			this.common.hideLoaderRow();

		});
	}

	deleteTemplate(id : string,form : NgForm){

		if(confirm('Are you sure to delete this record ?')== true){

			this.templateService.deleteTemplate(id).subscribe((res)=>{

				this.getTemplates();
				
			});
		}
	}
}
