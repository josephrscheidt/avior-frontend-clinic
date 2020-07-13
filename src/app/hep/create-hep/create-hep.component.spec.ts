import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHepComponent } from './create-hep.component';

describe('CreateHepComponent', () => {
  let component: CreateHepComponent;
  let fixture: ComponentFixture<CreateHepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
