import { Component, OnInit, ElementRef } from '@angular/core';
import { log } from 'util';
import { KeysPipe } from '../common/keys.pipe';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../common/common.service';
import { NgForm, FormBuilder, FormGroup, FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

import { PatientService } from '../patient/service/patient.service';
import { TemplateService } from '../template/service/template.service';
import { InjuryService } from '../injury/service/injury.service';
import { ClinicService } from '../clinic/service/clinic.service';
import { TherapistService } from '../therapist/service/therapist.service';
import { Patient } from '../patient/patient';
import { Injury } from '../injury/injury';
import { Template } from '../template/template';
import { Clinic } from '../clinic/clinic';
import { Therapist } from '../therapist/therapist';

@Component({
  selector: 'app-injury-list',
  templateUrl: './injury-list.component.html',
  styleUrls: ['./injury-list.component.css']
})
export class InjuryListComponent implements OnInit {

  allTemplates = {};

  bodyParts = {};

  constructor(private elem: ElementRef, public common: CommonService, public patientService: PatientService, public templateService: TemplateService, private route: ActivatedRoute, public injuryService: InjuryService, public clinicService: ClinicService, public therapistService: TherapistService, private router: Router) { }

  ngOnInit() {

    this.getInjuries();

    // Analytics Page View Event
		const pageName = this.elem.nativeElement.tagName.toLowerCase().replace('app-','');
		window.analytics.page(pageName, {"traits": localStorage.getItem('ajs_user_traits')});
  }

  getInjuries(){
		this.injuryService.getInjuries().subscribe((res)=>{
      var bodyPartList = [];
      if (!res) {
        this.injuryService.injuries.subscribe(res=>{
          bodyPartList = res as Injury[];
        })
      }else{
        bodyPartList = res as Injury[];
      }
      for (let item of bodyPartList) {
        this.allTemplates[item["id"]] = [];
        this.bodyParts[item["id"]] = item["injury_name"];
      }
      this.getTemplates();
         });
  }

  getTemplates(){
   
    this.templateService.getTemplates().subscribe((res)=>{
      var templates = [];
      if (!res) {
        this.templateService.templates.subscribe(res=>{
          templates = res as Template[];
        })
      }else{
        templates = res as Template[];
      }
      for (let template of templates) {
        this.allTemplates[template["injury_id"]].push(template["about_desc"]);
      }

    });
  }

}
