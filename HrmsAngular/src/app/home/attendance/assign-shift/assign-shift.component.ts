import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Pagination } from '../../../shared/paginate';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AttendenceService } from '../../../services/Attendance/attendence.service';
import { ApiResponse } from '../../../models/response.model';
import { SearchEmployee } from '../../../models/hr/search-emp.model';
import { ShiftManagementInfoModel } from '../../../models/Attendance/shift-management-info.model';
import { NgbDateCustomParserFormatter } from '../../../shared/dateformat';

@Component({
  selector: 'app-assign-shift',
  templateUrl: './assign-shift.component.html',
  // styleUrls: ['./assign-shift.component.scss']
  styleUrls: ['../../../../vendor/libs/ng-select/ng-select.scss','./assign-shift.component.scss']
})
export class AssignShiftComponent extends Pagination implements OnInit {

  title="Assign Shift";
  isUpdating: boolean = false;
  gradeValue:number;
  compId:number;
  employeeFilterForm:FormGroup;
  shiftDayFilterForm:FormGroup;
  employeesFormArray:FormArray;
  shiftDaysFormArray:FormArray;



  lstdayName:any[]=[
    { dayName:'Saturday', id:8},
    { dayName:'Sunday', id:9},
    { dayName:'Monday', id:10},
    { dayName:'Tuesday', id:11},
    { dayName:'Wednesday', id:12},
    { dayName:'Thursday', id:13},
    { dayName:'Friday', id:14}
    ];

  constructor(
    private fb:FormBuilder,
    private toaster:ToastrService,
    private dateFormat:NgbDateCustomParserFormatter,
    private attService:AttendenceService
  ) {
    super();
  }
  ngOnInit() {
    this.compId =AuthService.getLoggedCompanyId();
    this.gradeValue = AuthService.getLoggedGradeValue();
    this.employeesFormArray = this.fb.array([]);
    this.shiftDaysFormArray = this.fb.array([]);
    this.createEmpFilterForm();
    this.createShiftDayFilterForm();
  }
  getEmployees(){
    this.attService.getEmployees(this.empFilterFormVal)
    .subscribe(
      (response:ApiResponse)=>{
        if(response.status){
          this.refresh();
          (response.result as SearchEmployee[]).forEach(
            (emp:SearchEmployee)=>{
              this.employeesFormArray.push(new FormGroup({
                isSelected: new FormControl(false,[]),
                empCode: new FormControl(emp.empCode,[]),
                empName: new FormControl(emp.empName,[]),
              }))
            }
          )
        }
      }
    )
  }
  onSelectEmp(selectedEmp:SearchEmployee){
    this.empFilterControl['empCode'].setValue(selectedEmp.empCode)
    if(selectedEmp.empCode!=null){
      this.refresh();
      this.employeesFormArray.push(new FormGroup({
        isSelected: new FormControl(false,[]),
        empCode: new FormControl(selectedEmp.empCode,[]),
        empName: new FormControl(selectedEmp.empName,[]),
      }))
    }
  }
  removeEmpRow(rowIndex:number){
    this.employeesFormArray.removeAt(rowIndex);
  }
  getShiftDay(){
    if(this.shiftDayFilterForm.invalid){
      this.toaster.error('Select All Required field','Invalid Submission');
      return;
    }
    this.attService.getDayOfShiftInfo(this.shiftDayFormVal.fromDate, this.shiftDayFormVal.toDate, this.shiftDayFormVal.shiftId, this.f.weekDay.value)
    .subscribe(
      (response:ApiResponse)=>{
        if(response.status){
          this.shiftDaysFormArray = this.fb.array([]);
          response.result.forEach(holyDay => {
            this.shiftDaysFormArray.push(new FormGroup({
              id:new FormControl(holyDay.id,[]),
              hYear:new FormControl(holyDay.hYear,[]),
              hDate:new FormControl(holyDay.hdate,[]),
              note:new FormControl(holyDay.note,[]),
              nextDate:new FormControl(holyDay.nextDate,[]),
              shiftId:new FormControl(this.shiftDayFormVal.shiftId,[])
            }))
          });
        }
      }
    )
  }
  insertShiftManagementInfo(){
    this.isUpdating = true;
    let empShiftInfo:ShiftManagementInfoModel[] = [];
    this.employeesFormArray.controls.forEach(empForm=>{
      let employee = empForm.value;
      this.shiftDaysFormArray.controls.forEach(shiftDayForm=>{
        let empShift:ShiftManagementInfoModel = new ShiftManagementInfoModel();
        let dayInfo = shiftDayForm.value;
        if(employee.isSelected){
          empShift.companyID = this.compId;
          empShift.empCode = employee.empCode;
          empShift.shiftID = dayInfo.shiftId;
          empShift.shiftIDRostaring = dayInfo.shiftId;
          empShift.shiftDate = this.dateFormat.getYyyymmddToDate(dayInfo.hYear).toLocaleDateString();
          empShift.ddmmyyyy = dayInfo.hYear;
          empShift.nextDate = dayInfo.nextDate;
          empShift.note = dayInfo.note;
          empShiftInfo.push(empShift);
        }
      })
    })
    if(empShiftInfo.length>0){
      this.attService.insertShiftManagementInfo(empShiftInfo)
    .subscribe(
      (response:ApiResponse)=>{
        if(response.status){
          this.toaster.success(response.result, 'Assigned');
        }else{
          this.toaster.error(response.result, 'Failed');
        }
        this.isUpdating = false;
      })
    }else{
      let selectedEmp = this.employeesFormArray.controls.filter(c=>c.get('isSelected').value==true)
      if(selectedEmp.length==0){
        this.toaster.error('No employee selected');
      }
      if(this.shiftDaysFormArray.controls.length==0){ this.toaster.error('Shift of day not found');}
    }
  }

  createEmpFilterForm(){
    this.employeeFilterForm = this.fb.group({
      empCode: [,[]],
      department:[,[]],
      designation:[,[]],
      location:[,[]],
      workStation:[,[]],
      note:[,[]],
      weekDay:[,[]],
      companyID:[this.compId,[]],
      gradeValue:[this.gradeValue,[]]
    })
  }

  get f(){
    return this.employeeFilterForm.controls
  }
  get empFilterFormVal(){
    return this.employeeFilterForm.value;
  }
  get empFilterControl(){
    return this.employeeFilterForm.controls;
  }
  onSelectAll(isSelectAll:boolean){
      this.employeesFormArray.controls.forEach(empForm=>{
        empForm.get('isSelected').patchValue(isSelectAll)
      })
  }
  refresh(){
    //this.createEmpFilterForm();
    this.employeesFormArray = this.fb.array([]);
  }
  createShiftDayFilterForm(){
    this.shiftDayFilterForm = this.fb.group({
      fromDate:[,[]],
      toDate:[,[]],
      shiftId:[,[Validators.required]]
    })
  }
  get shiftDayFormVal(){
    return this.shiftDayFilterForm.value;
  }
  get dayFilterControl(){
    return this.shiftDayFilterForm.controls;
  }
  reset(){
    this.createEmpFilterForm();
    this.employeesFormArray = this.fb.array([]);
  }

}
