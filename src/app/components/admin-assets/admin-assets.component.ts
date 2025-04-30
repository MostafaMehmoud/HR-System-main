import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { adminAsset } from 'src/app/shared/interfaces/admin';
import { Asset } from 'src/app/shared/interfaces/response';
import { AdminService } from 'src/app/shared/services/admin.service';
import { GetOrdersService } from 'src/app/shared/services/get-orders.service';

@Component({
  selector: 'app-admin-assets',
  templateUrl: './admin-assets.component.html',
  styleUrls: ['./admin-assets.component.css']
})
export class AdminAssetsComponent {
  constructor(private _AdminService: AdminService, private _router: Router, private _ToastrService: ToastrService, private _GetOrdersService: GetOrdersService) { }



  AssetsList: adminAsset[] = []
  pageOpenOne: boolean = false
  ordersCount: number = 0
  todayDate: any = new Date()

  ngOnInit(): void {

    setTimeout(() => { this.pageOpenOne = true }, 0);

    this._AdminService.getAllAssets().subscribe({
      next: (data) => {
        this.ordersCount = data.count
        this.AssetsList = data.requestCustodies
        this.AssetsList = this.AssetsList.reverse()
        console.log(this.ordersCount);
        console.log(this.AssetsList);
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


  actionRequest(orderId: number, action: boolean, details: string, oneItem: HTMLElement) {
    if (localStorage.getItem('userToken') == (null || undefined)) {
      this._router.navigate(['login'])
    }
    this._AdminService.AssetsAction(orderId, action, details).subscribe({

      next: (Response) => {
        // تم ارسال الاستجابة بنجاح سواء بالرفض او القبول
        if (Response == true) {
          console.log(Response);
          // اذا كان الاستجابة المرسلة هي موافقة
          if (action == true) {
            this._ToastrService.success('تم قبول الطلب بنجاح ')
            oneItem.classList.add('beSmallAndHideR')
            setTimeout(() => { oneItem.classList.add('d-none') }, 500)

          }
          // اذا كان الاستجابة المرسلة هي رفض
          else {
            this._ToastrService.error('تم رفض الطلب')
            oneItem.classList.add('beSmallAndHideL')
            setTimeout(() => { oneItem.classList.add('d-none') }, 500)

          }
        }
      },

      error: (err) => {
        console.log(err);
      }

    })
  }

  fileDownload(fileId: any) {
    this._GetOrdersService.downloadFile(fileId).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      let fileType: string = blob.type

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
