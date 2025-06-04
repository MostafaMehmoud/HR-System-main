import { Component, OnInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private _TranslateService: TranslateService, private _AuthService: AuthService, private _Router: Router) { }
  screenDown: boolean = false

  @HostListener('window:scroll') showScrollUp() {
    if (window.scrollY > window.innerHeight - 100) {
      this.screenDown = true
    }
    else {
      this.screenDown = false
    }
  }


  title = 'saudiaFormica';

  ngOnInit(): void {
    const favLanguage: string = localStorage.getItem('myLanguage')!;

    // if (favLanguage) {
    //   this._TranslateService.setDefaultLang(favLanguage);
    //   this._TranslateService.use(favLanguage);
    //   document.documentElement.dir = favLanguage === 'ar' ? 'rtl' : 'ltr';
    // } else {
    //   this._TranslateService.setDefaultLang('ar');
    //   this._TranslateService.use('ar');
    //   document.documentElement.dir = 'rtl';
    // }
    // this._TranslateService.onLangChange.subscribe(event => {
    //   const currentLang = event.lang;
    //   document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    // });


    // اذا كانت هناك لغة مختارة  اجعلها هي الاساسية 
    if (favLanguage) {
      this._TranslateService.setDefaultLang(favLanguage)
      this._TranslateService.use(favLanguage);
    }

    // اذا لم تكن هناك لغة مختارة اجعل العربية اللغة الاساسية 
    else {
      this._TranslateService.setDefaultLang('ar')
      this._TranslateService.use('ar');

    }

  }



  scrollUP() {
    window.scrollTo(0, 0)
  }
}
