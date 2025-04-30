export interface UpdateData {
}

export interface oneEmployee {
    employeeId: string
    nameAr: string
    nameEn: string
    state: number
  }
  export interface modifiedEmployee {
    employeeId: string
    employeeNameAr: string
    employeeNameEn: string
    blood: string
    employeePersonId: string
    employeePersonExpireDate: string
    mobile: string
    mobileEmergency: string
    companyId: string
    branchId: string
    manageId: string
    nationId: string
    departmentId: string
    jobId: string
    kafilId: string
    state: number
    birthDate: string
    birthPlace: string
    motherName: string
    gender: number
    marrige: number
    healthId: string
    healthDate: string
    healthExpired: string
    healthPlace: string
    passportId: string
    passportDate: string
    passportPlace: string
    passportExpired: string
    insuranceId: string
    insuranceRecordNo: string
    insuranceValue: number
    insurancePer: number
    insuranceCompany: number
    insuranceSalary: number
    insuranceDangGP: number
    insuranceDate: string
    insuranceDateE: string
    employeeCategoryId: string
    cardId: string
    cardDate: string
    cardPlace: string
    cardExpired: string
  }
  
  export interface addedEmployeeInterface {
    employeeNameAr:string
    employeeNameEn:string
    employeeId:string
  }