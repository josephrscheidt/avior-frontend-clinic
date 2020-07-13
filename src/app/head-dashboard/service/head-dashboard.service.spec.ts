import { TestBed } from '@angular/core/testing';

import { HeadDashboardService } from './head-dashboard.service';

describe('HeadDashboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeadDashboardService = TestBed.get(HeadDashboardService);
    expect(service).toBeTruthy();
  });
});
