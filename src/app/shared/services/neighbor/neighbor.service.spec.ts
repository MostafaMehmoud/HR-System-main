import { TestBed } from '@angular/core/testing';

import { NeighborService } from './neighbor.service';

describe('NeighborService', () => {
  let service: NeighborService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeighborService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
