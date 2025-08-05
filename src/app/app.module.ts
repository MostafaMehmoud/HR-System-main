import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthNavComponent } from './components/auth-nav/auth-nav.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { MainComponent } from './components/main/main.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { LoanComponent } from './components/loan/loan.component';
import { VacationComponent } from './components/vacation/vacation.component';
import { TerminationComponent } from './components/termination/termination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HelpComponent } from './components/help/help.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { OrderVacComponent } from './components/order-vac/order-vac.component';
import { OrderloanComponent } from './components/orderloan/orderloan.component';
import { OrderotherComponent } from './components/orderother/orderother.component';
import { BlankComponent } from './components/blank/blank.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminLoanComponent } from './components/admin-loan/admin-loan.component';
import { AdminVacationComponent } from './components/admin-vacation/admin-vacation.component';
import { ToastrModule } from 'ngx-toastr';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LeavePermissionComponent } from './components/leave-permission/leave-permission.component';
import { LettersComponent } from './components/letters/letters.component';
import { AssetRequestComponent } from './components/asset-request/asset-request.component';
import { EmpAssetsComponent } from './components/emp-assets/emp-assets.component';
import { EmpLettersComponent } from './components/emp-letters/emp-letters.component';
import { EmpPermissionsComponent } from './components/emp-permissions/emp-permissions.component';
import { AdminAssetsComponent } from './components/admin-assets/admin-assets.component';
import { AdminLettersComponent } from './components/admin-letters/admin-letters.component';
import { AdminLeaveComponent } from './components/admin-leave/admin-leave.component';
import { FakeNavComponent } from './components/fake-nav/fake-nav.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { EnterKeyFocusDirective } from './shared/enter-key-focus.directive';
import { CalcTimePipe } from './shared/calc-time.pipe';
import { CalcLatePipe } from './shared/calc-late.pipe';
import { CalcEarlyPipe } from './shared/calc-early.pipe';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileNavComponent } from './components/profile-nav/profile-nav.component';
import { DisplayTimesheetComponent } from './components/display-timesheet/display-timesheet.component';
import { SendTimesheetComponent } from './components/send-timesheet/send-timesheet.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { FullTimePipe } from './shared/full-time.pipe';
import { FullTime2Pipe } from './shared/full-time2.pipe';
import { Time12hoursPipe } from './shared/time12hours.pipe';
import { MinToHoursPipe } from './shared/min-to-hours.pipe';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ContentLoaderModule } from '@ngneat/content-loader';
import { NgxPaginationModule } from "ngx-pagination";
import { EmpWorkTaskComponent } from "./components/emp-work-task/emp-work-task.component";
import { AdminWorkTaskComponent } from "./components/admin-work-task/admin-work-task.component";
import { RequestWorkTaskComponent } from './components/request-work-task/request-work-task.component';
import { EmpUpdateComponent } from './components/update-Employe/emp-update/emp-update.component';
import { MainSectionDataComponent } from './components/update-Employe/main-section-data/main-section-data.component';
import { PersonalSectionDataComponent } from './components/update-Employe/personal-section-data/personal-section-data.component';
import { ManagmentSectionDataComponent } from './components/update-Employe/managment-section-data/managment-section-data.component';
import { DocsSectionDataComponent } from './components/update-Employe/docs-section-data/docs-section-data.component';
import { InsuranceSectionDataComponent } from './components/update-Employe/insurance-section-data/insurance-section-data.component';
import { HomeDashboardComponent } from './components/home-dashboard/home-dashboard.component';
import { AddEmployeeComponent } from './components/update-Employe/add-employee/add-employee.component';
import { DefinitionsComponent } from './components/definitions/definitions.component';
import { HomeIconsComponent } from './components/home-icons/home-icons.component';
import { HeadersInterceptor } from "./shared/core/headers.interceptor";
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ConfigLayoutComponent } from './components/config-layout/config-layout.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { BranchesComponent } from './components/branches/branches.component';
import { AddCompanyComponent } from "./components/add-company/add-company.component";
import { EditCompanyComponent } from './components/edit-company/edit-company.component';
import { AddEditComponent } from './shared/components/modals/add-edit/add-edit.component';
import { JobComponent } from './components/job/job.component';
import { ReligionsComponent } from './components/religions/religions.component';
import { ManagementComponent } from './components/management/management.component';
import { NeighborComponent } from './components/neighbor/neighbor.component';
import { NationalityComponent } from './components/nationality/nationality.component';
import { DepartmentComponent } from './components/department/department.component';
import { QualificationsComponent } from './components/qualifications/qualifications.component';
import { CountriesComponent } from './components/countries/countries.component';
import { CitiesComponent } from './components/cities/cities.component';
import { KafilComponent } from './components/kafil/kafil.component';
import { FilterToolbarComponent } from './shared/components/modals/filter-toolbar/filter-toolbar.component';




export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [SidebarComponent,
    EditCompanyComponent,
    AddCompanyComponent,
    ConfigLayoutComponent,
    CompaniesComponent,
    BranchesComponent,
    AppComponent,
    AuthNavComponent,
    MainNavComponent,
    LoginComponent,
    SignupComponent,
    MainComponent,
    AuthComponent,
    HomeComponent,
    LoanComponent,
    VacationComponent,
    TerminationComponent,
    HelpComponent,
    AllOrdersComponent,
    OrderVacComponent,
    OrderloanComponent,
    OrderotherComponent,
    BlankComponent,
    AdminComponent,
    AdminLoanComponent,
    AdminVacationComponent,
    AdminHomeComponent,
    AdminNavComponent,
    LeavePermissionComponent,
    LettersComponent,
    AssetRequestComponent,
    EmpAssetsComponent,
    EmpLettersComponent,
    EmpPermissionsComponent,
    AdminAssetsComponent,
    AdminLettersComponent,
    AdminLeaveComponent,
    FakeNavComponent,
    TimeSheetComponent,
    EnterKeyFocusDirective,
    CalcTimePipe,
    CalcLatePipe,
    CalcEarlyPipe,
    ProfileComponent,
    ProfileNavComponent,
    DisplayTimesheetComponent,
    SendTimesheetComponent,
    FullTimePipe,
    FullTime2Pipe,
    Time12hoursPipe,
    MinToHoursPipe,
    DashboardComponent,
    EmpWorkTaskComponent,
    AdminWorkTaskComponent,
    RequestWorkTaskComponent,
    EmpUpdateComponent,
    MainSectionDataComponent,
    PersonalSectionDataComponent,
    ManagmentSectionDataComponent,
    DocsSectionDataComponent,
    InsuranceSectionDataComponent,
    HomeDashboardComponent,
    AddEmployeeComponent,
    DefinitionsComponent,
    HomeIconsComponent,
    SidebarComponent,
    ConfigLayoutComponent,
    CompaniesComponent,
    BranchesComponent,
    EditCompanyComponent,
    AddEditComponent,
    JobComponent,
    ReligionsComponent,
    ManagementComponent,
    NeighborComponent,
    NationalityComponent,
    DepartmentComponent,
    QualificationsComponent,
    CountriesComponent,
    CitiesComponent,
    KafilComponent,
    FilterToolbarComponent
  ],
  imports: [
    BrowserModule, NgxPaginationModule,
    FormsModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SweetAlert2Module.forRoot(),
    ContentLoaderModule,
    NgxPaginationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true }
  ],
  exports: [AddEditComponent , FilterToolbarComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
