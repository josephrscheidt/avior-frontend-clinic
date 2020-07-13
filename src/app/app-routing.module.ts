import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent }      from './login/login.component';
import { SignupComponent }      from './signup/signup.component';
import { DashboardComponent }      from './dashboard/dashboard.component';
import { ExerciseComponent }      from './exercise/exercise.component';
import { AddExerciseComponent }      from './exercise/add-exercise/add-exercise.component';
import { LayoutComponent }      from './layout/layout.component';
import { TemplateComponent }      from './template/template.component';
import { AddTemplateComponent }      from './template/add-template/add-template.component';
import { ClinicComponent } from './clinic/clinic.component';
import { AddClinicComponent } from './clinic/add-clinic/add-clinic.component';
import { InjuryComponent } from './injury/injury.component';
import { AddInjuryComponent } from './injury/add-injury/add-injury.component';
import { PatientComponent } from './patient/patient.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { TherapistComponent } from './therapist/therapist.component';
import { AddTherapistComponent } from './therapist/add-therapist/add-therapist.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth-guard.service';
import { PatientProfileComponent } from './patient/patient-profile/patient-profile.component';
import { FunctionalSurveyComponent } from './functional-survey/functional-survey.component';
import { QuestionsComponent } from './functional-survey/questions/questions.component';
import { InjuryListComponent } from './injury-list/injury-list.component';
import { HepComponent } from './hep/hep.component';
import { CreateHepComponent } from './hep/create-hep/create-hep.component';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';

const routes: Routes = [

	{ path: '', redirectTo: '/login', pathMatch: 'full'},
	{ path: 'login', component: LoginComponent },
	{ path: 'forgot-password', component: ForgotPasswordComponent },
	{ path: 'reset-password', component: ResetPasswordComponent },
	{ path: 'signup', component: SignupComponent },
	{
		path: 'dashboard',
		component: LayoutComponent,
		children: [
			{ path: ':clinic_id', component: DashboardComponent, pathMatch: 'full'},
			// { path: '', redirectTo: ':clinic_id', pathMatch: 'full'}
		],
		canActivate: [AuthGuard],
	},
	{
		path: 'head-dashboard',
		component: LayoutComponent,
		children: [
			{ path: ':clinic_id', component: HeadDashboardComponent, pathMatch: 'full'},
			// { path: '', redirectTo: ':clinic_id', pathMatch: 'full'}
		],
		canActivate: [AuthGuard],
	},
	{
		path: 'exercise',
		component: LayoutComponent,
		children: [
		{ path: '', component: ExerciseComponent, pathMatch: 'full' },
		{ path: 'add', component: AddExerciseComponent },
		{ path: 'edit/:id', component: AddExerciseComponent }
		],
		canActivate: [AuthGuard]
	},
	{
		path: 'diagnosis',
		component: LayoutComponent,
		children: [
		{ path: '', component: TemplateComponent, pathMatch: 'full' },
		{ path: 'add', component: AddTemplateComponent },
		{ path: 'edit/:id', component: AddTemplateComponent },
		{ path: 'assign/:patientId/:id/:assigned', component: AddTemplateComponent }
		],
		canActivate: [AuthGuard]
	},
	{
		path: 'clinic',
		component: LayoutComponent,
		children: [
		{ path: '', component: ClinicComponent, pathMatch: 'full' },
		{ path: 'add', component: AddClinicComponent },
		{ path: 'edit/:id', component: AddClinicComponent }
		],
		canActivate: [AuthGuard]
	},
	{
		path: 'body-part',
		component: LayoutComponent,
		children: [
		{ path: '', component: InjuryComponent, pathMatch: 'full' },
		{ path: 'add', component: AddInjuryComponent },
		{ path: 'edit/:id', component: AddInjuryComponent }
		],
		canActivate: [AuthGuard]
	},
	{
		path: 'patient',
		component: LayoutComponent,
		children: [
		{ path: '', component: PatientComponent, pathMatch: 'full' },
		{ path: 'add', component: AddPatientComponent },
		{ path: 'edit/:id', component: AddPatientComponent },
		{ path: 'view/:id', component: PatientProfileComponent }
		],
		canActivate: [AuthGuard]
	},
	{
		path: 'therapist',
		component: LayoutComponent,
		children: [
		{ path: '', component: TherapistComponent, pathMatch: 'full' },
		{ path: 'add', component: AddTherapistComponent },
		{ path: 'edit/:id', component: AddTherapistComponent }
		],
		canActivate: [AuthGuard]
	},
	{
		path: 'survey',
		component: LayoutComponent,
		children: [
		{ path: '', component: FunctionalSurveyComponent, pathMatch: 'full' },
		{ path: 'questions/:id', component: QuestionsComponent, pathMatch: 'full' }
		],
		canActivate: [AuthGuard]
	}, 
	{
		path: 'injury-list',
		component: LayoutComponent,
		children: [
			{ path: '', component: InjuryListComponent, pathMatch: 'full' }
		],
		canActivate: [AuthGuard]
	},
	{
		path: 'hep',
		component: LayoutComponent,
		children:[
			{ path: '', component: HepComponent, pathMatch: 'full' },
			{ path: ':patientId/:id', component: CreateHepComponent }
		],
		canActivate: [AuthGuard]
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

