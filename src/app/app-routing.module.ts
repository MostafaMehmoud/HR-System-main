import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { LoanComponent } from './components/loan/loan.component';
import { VacationComponent } from './components/vacation/vacation.component';
import { TerminationComponent } from './components/termination/termination.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { myGuardGuard } from './shared/my-guard.guard';
import { HelpComponent } from './components/help/help.component';
import { AllOrdersComponent } from './components/all-orders/all-orders.component';
import { OrderloanComponent } from './components/orderloan/orderloan.component';
import { OrderVacComponent } from './components/order-vac/order-vac.component';
import { OrderotherComponent } from './components/orderother/orderother.component';
import { BlankComponent } from './components/blank/blank.component';
import { AdminComponent } from './components/admin/admin.component';
import { AdminVacationComponent } from './components/admin-vacation/admin-vacation.component';
import { AdminLoanComponent } from './components/admin-loan/admin-loan.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { roleGuardGuard } from './shared/role-guard.guard';
import { LeavePermissionComponent } from './components/leave-permission/leave-permission.component';
import { LettersComponent } from './components/letters/letters.component';
import { AssetRequestComponent } from './components/asset-request/asset-request.component';
import { EmpAssetsComponent } from './components/emp-assets/emp-assets.component';
import { EmpLettersComponent } from './components/emp-letters/emp-letters.component';
import { EmpPermissionsComponent } from './components/emp-permissions/emp-permissions.component';
import { AdminAssetsComponent } from './components/admin-assets/admin-assets.component';
import { AdminLettersComponent } from './components/admin-letters/admin-letters.component';
import { AdminLeaveComponent } from './components/admin-leave/admin-leave.component';
import { TimeSheetComponent } from './components/time-sheet/time-sheet.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SendTimesheetComponent } from './components/send-timesheet/send-timesheet.component';
import { DisplayTimesheetComponent } from './components/display-timesheet/display-timesheet.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmpWorkTaskComponent } from './components/emp-work-task/emp-work-task.component';
import { RequestWorkTaskComponent } from './components/request-work-task/request-work-task.component';
import { AdminWorkTaskComponent } from './components/admin-work-task/admin-work-task.component';
import { EmpUpdateComponent } from './components/update-Employe/emp-update/emp-update.component';
import { MainSectionDataComponent } from './components/update-Employe/main-section-data/main-section-data.component';
import { PersonalSectionDataComponent } from './components/update-Employe/personal-section-data/personal-section-data.component';
import { DocsSectionDataComponent } from './components/update-Employe/docs-section-data/docs-section-data.component';
import { InsuranceSectionDataComponent } from './components/update-Employe/insurance-section-data/insurance-section-data.component';
import { ManagmentSectionDataComponent } from './components/update-Employe/managment-section-data/managment-section-data.component';
import { HomeDashboardComponent } from './components/home-dashboard/home-dashboard.component';
import { AddEmployeeComponent } from './components/update-Employe/add-employee/add-employee.component';
import { DefinitionsComponent } from './components/definitions/definitions.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ConfigLayoutComponent } from './components/config-layout/config-layout.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { BranchesComponent } from './components/branches/branches.component';
import { AddCompanyComponent } from './components/add-company/add-company.component';
import { EditCompanyComponent } from './components/edit-company/edit-company.component';

const routes: Routes = [

  {
    path: '', component: MainComponent, title: 'main', canActivate: [myGuardGuard], children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'home' },
      { path: 'loan', component: LoanComponent, title: 'loan' },
      { path: 'vacations', component: VacationComponent, title: 'vacations' },
      { path: 'terminate', component: TerminationComponent, title: 'terminations' },
      { path: 'help', component: HelpComponent, title: 'help' },
      { path: 'leave', component: LeavePermissionComponent, title: 'leave' },
      { path: 'letters', component: LettersComponent, title: 'Letters' },
      { path: 'asset', component: AssetRequestComponent, title: 'Asset Request' },
      { path: 'work-task', component: RequestWorkTaskComponent, title: 'Work Task' },
      {
        path: 'allOrders', component: AllOrdersComponent, title: 'my orders', children: [
          { path: 'loan', component: OrderloanComponent, title: 'loan orders' },
          { path: 'vacation', component: OrderVacComponent, title: 'vacation orders' },
          { path: 'assets', component: EmpAssetsComponent, title: 'Assets' },
          { path: 'letters', component: EmpLettersComponent, title: 'Letters' },
          { path: 'permissions', component: EmpPermissionsComponent, title: 'Permissions' },
          { path: 'worktask', component: EmpWorkTaskComponent, title: 'Work Task' },
          { path: 'other', component: OrderotherComponent, title: 'other orders' },
          { path: '', component: BlankComponent, title: 'my orders' },
        ]
      },

    ]
  },

  { path: 'help', component: HelpComponent, title: 'help' },

  {
    path: 'my-profile', component: ProfileComponent, title: 'my Profile'
  },

  {
    path: '', component: AuthComponent, title: 'auth', children: [
      { path: 'login', component: LoginComponent, title: 'home' },
      { path: 'register', component: SignupComponent, title: 'Signup' },
    ]
  },

  {
    path: '', component: AdminComponent, title: 'Admin', canActivate: [roleGuardGuard], children: [
      { path: 'admin-home', component: AdminHomeComponent, title: 'admin home' },
      

      { path: 'admin-loan', component: AdminLoanComponent, title: 'loan orders' },
      { path: 'admin-vacation', component: AdminVacationComponent, title: 'vacation orders' },
      { path: 'admin-assets', component: AdminAssetsComponent, title: 'assets orders' },
      { path: 'admin-letters', component: AdminLettersComponent, title: 'letters orders' },
      { path: 'admin-permissions', component: AdminLeaveComponent, title: 'permissions orders' },
      { path: 'admin-worktask', component: AdminWorkTaskComponent, title: 'work Task orders' },
      { path: 'admin-blank', component: BlankComponent, title: 'my orders' },
      { path: 'admin-defination', component: DefinitionsComponent, title: 'definations' },
      { path: 'new-emp', component: AddEmployeeComponent, title: 'add new employee' },
      { path: 'employee-update', component: EmpUpdateComponent, title: 'employee Update', children: [
          { path: '', redirectTo:'main' ,pathMatch:'full' },
          { path: 'main', component: MainSectionDataComponent, title: 'update  main data' },
          { path: 'personal', component: PersonalSectionDataComponent, title: 'update  personal data' },
          { path: 'docs', component: DocsSectionDataComponent, title: 'update Docs data' },
          { path: 'insurance', component: InsuranceSectionDataComponent, title: 'update  insurance data' },
          { path: 'management', component: ManagmentSectionDataComponent, title: 'update  management data' },
        ]
      },
      { path: 'home-dashboard', component: HomeDashboardComponent, title: 'Dashboard' },
      { path: 'admin-dashboard', component: DashboardComponent, title: 'Admin dashboard' },
      {
        path: 'admin-timesheet', component: TimeSheetComponent, title: 'Time Sheet', children: [
          { path: 'display', component: DisplayTimesheetComponent, title: 'display' },
          { path: 'new', component: SendTimesheetComponent, title: 'new' },
        ]
      },

    ]
  },
  {
    path: 'configuration', 
    component: ConfigLayoutComponent, // المكون الذي يحتوي على الـ sidebar والـ navbar
    children: [
      { path: 'companies', component: CompaniesComponent },
      { path: 'branches', component: BranchesComponent },
      { path: 'add-company', component: AddCompanyComponent },
      { path: 'edit-company/:id', component: EditCompanyComponent } // المسار الجديد
      // أي صفحات أخرى تريد أن تحتوي على الـ sidebar والـ navbar
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
