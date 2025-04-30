import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/shared/services/admin.service';
import { GetOrdersService } from 'src/app/shared/services/get-orders.service';
import { Permission } from 'src/app/shared/interfaces/response';
import { adminPermission } from 'src/app/shared/interfaces/admin';

@Component({
  selector: 'app-admin-leave',
  templateUrl: './admin-leave.component.html',
  styleUrls: ['./admin-leave.component.css']
})
export class AdminLeaveComponent {
  constructor(private _AdminService: AdminService, private _router: Router, private _ToastrService: ToastrService, private _GetOrdersService: GetOrdersService) { }

  PermissionList: adminPermission[] = []
  pageOpenOne: boolean = false
  ordersCount: number = 0

  ngOnInit(): void {

    setTimeout(() => { this.pageOpenOne = true }, 0);

    this._AdminService.getAllPermissions().subscribe({
      next: (data) => {
        this.ordersCount = data.count
        this.PermissionList = data.requestPermissions
        this.PermissionList = this.PermissionList.reverse()
        console.log(this.ordersCount);
        console.log(this.PermissionList);
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

    this._AdminService.PermissionsAction(orderId, action, details).subscribe({

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
