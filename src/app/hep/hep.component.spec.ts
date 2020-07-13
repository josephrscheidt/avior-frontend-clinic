import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HepComponent } from './hep.component';

describe('HepComponent', () => {
  let component: HepComponent;
  let fixture: ComponentFixture<HepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
