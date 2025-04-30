export interface Profile {
    employeeInfo: EmployeeInfo
    contractInfo: ContractInfo
    identityInfo: IdentityInfo
    passportInfo: PassportInfo
    carInfo: CarInfo
}


export interface EmployeeInfo {
    id: string
    nameAr: string
    nameEn: string
    bloodType: string
    mobile: string
    mobileEmergency: string
    jobNameAr: string
    jobNameEn: string
    depatmentNameAr: string
    depatmentNameEn: string
    image: any
}

export interface ContractInfo {
    startDate: any
    endDate: any
}

export interface IdentityInfo {
    identityNumber: string
    expiredDate: string
}

export interface PassportInfo {
    passportNumber: string
    expiredDate: string
}

export interface CarInfo {
    carNumber: any
    contractCarEndDate: any
    checkCarEndDate: any
}