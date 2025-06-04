import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KafilComponent } from './kafil.component';

describe('KafilComponent', () => {
  let component: KafilComponent;
  let fixture: ComponentFixture<KafilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KafilComponent]
    });
    fixture = TestBed.createComponent(KafilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
