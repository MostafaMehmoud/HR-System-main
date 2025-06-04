import { TestBed } from '@angular/core/testing';

import { KafilService } from './kafil.service';

describe('KafilService', () => {
  let service: KafilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KafilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
