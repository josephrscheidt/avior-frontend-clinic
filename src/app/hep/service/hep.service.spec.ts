import { TestBed } from '@angular/core/testing';

import { HepService } from './hep.service';

describe('HepService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HepService = TestBed.get(HepService);
    expect(service).toBeTruthy();
  });
});
