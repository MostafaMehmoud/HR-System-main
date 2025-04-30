import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Letter } from 'src/app/shared/interfaces/response';
import { GetOrdersService } from 'src/app/shared/services/get-orders.service';

@Component({
  selector: 'app-emp-letters',
  templateUrl: './emp-letters.component.html',
  styleUrls: ['./emp-letters.component.css']
})
export class EmpLettersComponent {
  constructor(private _GetOrdersService: GetOrdersService, private _router: Router) { }

  LettersList: Letter[] = []

  ngOnInit(): void {
    this._GetOrdersService.getLettersOrders().subscribe({
      next: (data) => {
        this.LettersList = data.requestLetters
        console.log(this.LettersList);
      },


      error: (err) => {
        console.log(err);
        if (err.error.message == 'Unauthorized') {
          localStorage.clear()
          this._router.navigate(['login'])
        }
      },
    })
  }


  fileDownload(fileId : any) {
    this._GetOrdersService.downloadFile(fileId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      let fileType:string = blob.type
      
      // 3. إنشاء عنصر <a>
      const a = document.createElement('a');

      // 4. ضبط خاصية href للرابط المؤقت
      a.href = url;

      // 5. ضبط خاصية download باسم الملف
      a.download = `attachment.${fileType.split('/')[1]}`; // استبدل 'filename.extension' باسم الملف وامتداده المطلوبين

      // 6. محاكاة النقر على الرابط لتنزيل الملف
      a.click();

      // 7. تحرير الذاكرة المستخدمة بواسطة رابط URL المؤقت
      window.URL.revokeObjectURL(url);
    })
  }


}
