import { TestBed } from '@angular/core/testing';

import { FunctionalSurveyService } from './functional-survey.service';

describe('FunctionalSurveyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FunctionalSurveyService = TestBed.get(FunctionalSurveyService);
    expect(service).toBeTruthy();
  });
});
