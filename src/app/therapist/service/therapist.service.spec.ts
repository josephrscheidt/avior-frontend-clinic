import { TestBed } from '@angular/core/testing';

import { TherapistService } from './therapist.service';

describe('TherapistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TherapistService = TestBed.get(TherapistService);
    expect(service).toBeTruthy();
  });
});
