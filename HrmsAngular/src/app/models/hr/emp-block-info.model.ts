import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class EmpBlockInfoModel{
    id:number;
    empCode:string;
    isBlock:string;
    blockDate:string;
    blockDateNgb:NgbDateStruct;
    remark:string;
    companyID:number;
    status:string;
}
