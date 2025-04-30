export interface Response {
    accessToken: string
    employeeInfo: EmployeeInfo
}

export interface EmployeeInfo {
    empId: string
    nameAr: string
    nameEn: string
    isAdmin: boolean
}


export interface loanInterface {
    id: string
    advancePaymentValue: number
    installmentValue: number
    numberOfInstallment: number
    lastInstallmentValue: number
    startDate: string
    approveStatus: string
}

export interface vacationInterface {
    id: number
    startDate: string
    numberOfDays: number
    details: string
    vacationType: string
    approveStatus: string
    approveDetails: string
    availableDays: string
}

export interface adminOrderLoan {
    id: number
    advancePaymentValue: number
    installmentValue: number
    numberOfInstallment: number
    lastInstallmentValue: number
    startDate: string
    employeeId: string
    employeeNameAr: string
    employeeNameEn: string
}

export interface adminOrderVacation {
    id: number
    startDate: string
    numberOfDays: number
    details: string
    vacationType: string
    employeeId: string
    employeeNameAr: string
    employeeNameEn: string
    totalAllowanceDays: number
    availableDays: number
    takenDays: number
    uploadFileId: string
}


export interface Asset {
    id: number
    details: string
    isEmployeeAgree: boolean
    approveStatus: string
    approveDetails: any
    uploadFileId: any
}


export interface Permission {
    id: number
    startDate: string
    endDate: string
    details: any
    approveStatus: string
    approveDetails: any
    uploadFileId: any
}


export interface Letter {
    id: number
    destinationName: string
    isRequiredCCC: boolean
    details: string
    letterType: string
    approveStatus: string
    approveDetails: any
    uploadFileId: string
}

