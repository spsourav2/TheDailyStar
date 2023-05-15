import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/hr/employee.service';
import { AuthService } from '../../services/auth.service';
import { NgbDateCustomParserFormatter } from '../../shared/dateformat';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../vendor/libs/ngx-perfect-scrollbar/ngx-perfect-scrollbar.scss','./dashboard.scss']
})
export class DashboardComponent implements OnInit {


  compId:number;
  employeeCounts:any[]=[];
  leaveCounts:any[]=[];
  absentCounts:any[]=[];
  getAllLateComer:any[]=[];
  myDate = new Date();
  today = (new Date()).getDay();
  chart:any;
  horizontalbar:any;
  emp:any;


  // SingleDataSet = [this.absentCounts, 30, 20];
  // date:any=this.dateFormat.getYyyymmddToDate;

  constructor(private employeeService:EmployeeService) { }

  ngOnInit() {
    this.compId = AuthService.getLoggedCompanyId();
    // this.getEmployeeCount();
    // this.getLeaveCount();
    // this.getAbsentCount();
    this.getAllEmployeeHistory();


    var employeeCountss
    this.employeeService
      .getEmployeeCount(this.compId,)
      .subscribe((result: any) => {
        if (result) {
         employeeCountss=result.result.id

        }
      });
    // this.getEmployee();

  }
  // getEmployee(){

  //   this.chart=new Chart('canvas',{
  //     type:'pie',
  //     data:{
  //       labels:['Payable','CashandBank','Receivable'],
  //       datasets:[{
  //           data: [this.absentCounts[0]],

  //         backgroundColor: ["#f86c6b", "#077dcc","#8e5ea2"],

  //       }]
  //     },
  //     options: {
  //       title: {
  //         display: true,
  //         text: 'Pie-Chart',
  //         fontWeight: "bold",
  //         fontSize: 18,
  //       },
  //       legend:{
  //         display:false
  //       }
  //     }
  //   });
  // }


  // getEmployeeCount() {
  //    var employeeCountss
  //   this.employeeService
  //     .getEmployeeCount(this.compId,)
  //     .subscribe((result: any) => {
  //       if (result) {
  //        this.employeeCounts=result.result.id


  //       }
  //     });


  // }


  getDateToYyyymmdd(date: Date = new Date()): string {
    let yyyymmdd: string;
    yyyymmdd = date.getFullYear().toString() + (date.getMonth()+1 ).toString().padStart(2, '0') + date.getDate().toString().padStart(2, '0')
    return yyyymmdd;
}
  // getLeaveCount() {
  //   this.employeeService
  //     .getLeaveCount(this.getDateToYyyymmdd(new Date()))
  //     .subscribe((result: any) => {
  //       if (result) {
  //        this.leaveCounts=result.result.leaveNumber


  //       }
  //     });
  // }


  // getAbsentCount() {
  //   this.employeeService
  //     .getAbsentCount(this.compId,this.getDateToYyyymmdd(new Date()))
  //     .subscribe((result: any) => {
  //       if (result) {
  //        this.absentCounts=result.result.emp;
  //       //  this.getEmployee()
  //       }
  //     });
  // }



  getAllEmployeeHistory() {
     let absents=0
     let employees=0
    this.employeeService
      .getAllLateComer(this.compId,this.getDateToYyyymmdd(new Date()))
      .subscribe((result: any) => {
        if (result) {
         this.getAllLateComer=result.result.lates;
         this.absentCounts=result.result.totalAbsent;
            absents=result.result.totalAbsent;
         this.employeeCounts=result.result.totalEmp;
          employees= result.result.totalEmp
         this.leaveCounts=result.result.leave;
         let absent = employees-absents


         this.chart=new Chart('canvas',{
          type:'pie',
          data:{
            labels:['Total Present','total Leave','Absent Today','Late Today'],
            datasets:[{
                data: [absent,this.leaveCounts,this.absentCounts,this.getAllLateComer],
              backgroundColor: ["#6994b1", "#c9a1da","#ff3333","#660000"],

            }]
          },
          options: {
            title: {
              display: true,
              text: '',
              fontWeight: "bold",
              fontSize: 18,
            },
            legend:{
              display:false
            }
          }
        });

        }
      });
  }

}
