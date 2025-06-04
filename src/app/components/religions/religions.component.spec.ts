import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReligionsComponent } from './religions.component';

describe('ReligionsComponent', () => {
  let component: ReligionsComponent;
  let fixture: ComponentFixture<ReligionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReligionsComponent]
    });
    fixture = TestBed.createComponent(ReligionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
