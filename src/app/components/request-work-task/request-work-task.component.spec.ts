import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RequestWorkTaskComponent } from './request-work-task.component';
import { TaskService } from 'src/app/shared/services/task.service';
import { TranslateService, TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateStore } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

// Mock TranslateLoader
class FakeLoader implements TranslateLoader {
  getTranslation(lang: string) {
    return of({});
  }
}

describe('RequestWorkTaskComponent', () => {
  let component: RequestWorkTaskComponent;
  let fixture: ComponentFixture<RequestWorkTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ],
      declarations: [RequestWorkTaskComponent],
      providers: [TaskService, TranslateService, TranslateStore] 
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWorkTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return return undefined because we are in the firstpage and form is not valid' , ()=>{
    expect(component.requestTask()).toBeUndefined()
  })

  it('htttmlll' , ()=>{
    fixture.detectChanges()
    let elmcomponent:HTMLElement = fixture.nativeElement 
    expect(elmcomponent.querySelector('.testingp')?.textContent).toContain('hamo')
  })
});