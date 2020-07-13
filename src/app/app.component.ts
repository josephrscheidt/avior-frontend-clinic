import { Component, TemplateRef, OnInit, ViewChild, } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
// import { ExerciseService } from './exercise/service/exercise.service';
// import { NgForm } from "@angular/forms";
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Router, NavigationEnd } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'angular-crud';

	constructor(private router: Router) {
  }

}
