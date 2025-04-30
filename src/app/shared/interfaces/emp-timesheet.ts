export interface EmpTimesheet {
    id: number
    employeeId: string
    employeeNameAr: any
    employeeNameEn: any
    date: string
    start: string
    leave: string
    earlyByMinute: number
    lateByMinute: number
    workingTimeByMinute: number
    projectId: number
    absent: boolean
}
