export interface TaskDetails {
        id: number
        kind: string
        direction: string
        duration: number
        fromDate: string
        toDate: string
        details: any
        cost: any
        travelTicket: any
        visas: string
        uploadFileId: any
        employeeId: string
        employeeNameAr: string
        employeeNameEn: string
        manageId: string
        manageNameAr: string
        manageNameEn: string
        departmentId: string
        departmentNameAr: string
        departmentNameEn: string
        jobId: string
        jobNameAr: string
        jobNameEn: string
        createDate: any
}

export interface empOrderTaskInterface {
        id: number
        kind: string
        direction: string
        duration: number
        fromDate: string
        toDate: string
        details: string
        cost: number
        travelTicket: string
        visas: string
        createDate: string
        approveStatus: string
        approveDetails: string
        uploadFileId: string
        approveById: string
        approveByNameAr: string
        approveByNameEn: string
        approveDate: string
}


export interface personalDataTask {
        empId: string
        nameAr: string
        nameEn: string
        manageId: string
        manageNameAr: string
        manageNameEn: string
        departmentId: string
        departmentNameAr: string
        departmentNameEn: string
        jobId: string
        jobNameAr: string
        jobNameEn: string
}
