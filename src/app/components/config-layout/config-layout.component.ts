import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-config-layout',
  templateUrl: './config-layout.component.html',
  styleUrls: ['./config-layout.component.css']
})
export class ConfigLayoutComponent implements OnInit, OnDestroy  {
  isRtl : boolean = false;

  constructor(private translateService: TranslateService) {}
  ngOnDestroy(): void {
    // عند مغادرة صفحة config-layout يمكننا إعادة الأنماط السابقة إذا أردنا
    document.body.style.background = 'rgb(153, 217, 243)';
    document.body.style.backgroundImage = 'url(main_bg.webp)';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.backgroundPosition = 'center';
    document.body.style.fontFamily = '"Almarai", sans-serif';
    document.body.style.fontWeight = '800';
    document.body.style.fontStyle = 'normal';
    document.body.style.minHeight = '100vh';
  }

  ngOnInit(): void { // إلغاء الأنماط السابقة عند الانتقال إلى صفحة config-layout
    // إزالة الخلفية بالكامل بشكل دقيق
  document.body.style.background = 'none';
  document.body.style.backgroundImage = 'none';
  document.body.style.backgroundColor = '#f5f5f5'; // أو أي لون خلفية خفيف مناسب
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.backgroundPosition = 'center';
  document.body.style.fontFamily = 'Segoe UI, Helvetica, Arial, sans-serif';
  document.body.style.fontWeight = '400';
  document.body.style.color = '#212529';
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.body.style.minHeight = '100vh';
    // تغيير اتجاه النص بناءً على اللغة
    this.setDirection();
  this.translateService.onLangChange.subscribe(() => {
    this.setDirection();
  });
  }setDirection(): void {
    const lang = this.translateService.currentLang;
    this.isRtl = lang === 'ar';
    document.documentElement.dir = this.isRtl ? 'rtl' : 'ltr';
  }
}