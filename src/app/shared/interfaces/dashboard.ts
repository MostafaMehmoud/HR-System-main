export interface oneManage {
    id: string
    nameAr: string
    nameEn: string
}

export interface employeeDetails {
    employeeId: string
    employeeNameAr: string
    employeeNameEn: string
    blood: any
    employeePersonId: any
    employeePersonExpireDate: any
    mobile: any
    mobileEmergency: any
    companyId: string
    companyNameAr: any
    companyNameEn: any
    branchId: string
    branchNameAr: string
    branchNameEn: any
    manageId: string
    manageNameAr: any
    manageNameEn: any
    nationId: string
    nationNameAr: any
    nationNameEn: any
    departmentId: any
    departmentNameAr: any
    departmentNameEn: any
    jobId: string
    jobNameAr: any
    jobNameEn: any
    kafilId: string
    kafilNameAr: any
    kafilNameEn: any
    state: number
    birthDate: any
    birthPlace: any
    age: any
    motherName: any
    gender: number
    marrige: number
    healthId: any
    healthDate: any
    healthExpired: any
    healthPlace: any
    passportId: any
    passportDate: any
    passportPlace: any
    passportExpired: any
    insuranceId: any
    insuranceRecordNo: any
    insuranceValue: number
    insurancePer: number
    insuranceCompany: any
    insuranceSalary: any
    insuranceDangGP: any
    insuranceDate: any
    insuranceDateE: any
}

export interface empFullDetails {
    employeeId: string
    employeeNameAr: string
    employeeNameEn: string
    blood: string
    employeePersonId: string
    employeePersonExpireDate: string
    mobile: string
    mobileEmergency: string
    companyId: string
    companyNameAr: string
    companyNameEn: string
    branchId: string
    branchNameAr: string
    branchNameEn: string
    manageId: string
    manageNameAr: string
    manageNameEn: string
    nationId: string
    nationNameAr: string
    nationNameEn: string
    departmentId: string
    departmentNameAr: string
    departmentNameEn: string
    jobId: string
    jobNameAr: string
    jobNameEn: string
    kafilId: string
    kafilNameAr: string
    kafilNameEn: string
    state: number
    birthDate: string
    birthPlace: string
    age: string
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
    employeeCategoryNameAr: string
    employeeCategoryNameEn: string
    cardId: string
    cardDate: string
    cardPlace: string
    cardExpired: string
  }


export interface branch {
    employeesCount: number
    employeesWorkCount: number
    id: string
    nameAr: string
    nameEn: any
}

