import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalSurveyComponent } from './functional-survey.component';

describe('FunctionalSurveyComponent', () => {
  let component: FunctionalSurveyComponent;
  let fixture: ComponentFixture<FunctionalSurveyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FunctionalSurveyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
