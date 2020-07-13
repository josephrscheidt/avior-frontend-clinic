import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, MatButtonModule, MatSelectModule, MatIconModule, MatDatepickerModule, MatRadioModule } from '@angular/material';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InjuryComponent } from './injury/injury.component';
import { TemplateComponent } from './template/template.component';
import { AddTemplateComponent } from './template/add-template/add-template.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { AddExerciseComponent } from './exercise/add-exercise/add-exercise.component';
import { ClinicComponent } from './clinic/clinic.component';
import { AddClinicComponent } from './clinic/add-clinic/add-clinic.component';
import { AddInjuryComponent } from './injury/add-injury/add-injury.component';
import { PatientComponent } from './patient/patient.component';
import { AddPatientComponent } from './patient/add-patient/add-patient.component';
import { TherapistComponent } from './therapist/therapist.component';
import { AddTherapistComponent } from './therapist/add-therapist/add-therapist.component';
import { AuthGuard } from './guards/auth-guard.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { FilterPipe } from './common/filter.pipe';
import { KeysPipe } from './common/keys.pipe';
import { PatientProfileComponent } from './patient/patient-profile/patient-profile.component';
import { FunctionalSurveyComponent } from './functional-survey/functional-survey.component';
import { QuestionsComponent } from './functional-survey/questions/questions.component';
import { InjuryListComponent } from './injury-list/injury-list.component';
import { HepComponent } from './hep/hep.component';
import { CreateHepComponent } from './hep/create-hep/create-hep.component';
import { HeadDashboardComponent } from './head-dashboard/head-dashboard.component';

declare global {
  interface Window { analytics: any; }
}

declare global {
  interface Window { analytics: any; }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExerciseComponent,
    SignupComponent,
    DashboardComponent,
    InjuryComponent,
    TemplateComponent,
    AddTemplateComponent,
    FooterComponent,
    HeaderComponent,
    LayoutComponent,
    AddExerciseComponent,
    ClinicComponent,
    AddClinicComponent,
    AddInjuryComponent,
    PatientComponent,
    AddPatientComponent,
    TherapistComponent,
    AddTherapistComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    FilterPipe,
    KeysPipe,
    PatientProfileComponent,
    FunctionalSurveyComponent,
    QuestionsComponent,
    InjuryListComponent,
    HepComponent,
    CreateHepComponent,
    HeadDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    AngularFontAwesomeModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatRadioModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],

})

export class AppModule { }
