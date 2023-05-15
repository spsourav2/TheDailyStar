import { Helper } from './../../shared/helper';
import { Component, Input, HostBinding, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { LayoutService } from '../../layout/layout.service';
import { AuthService } from '../../services/auth.service';
import { TempStorageData } from '../../models/security/client-side-storage.model';
import { AppInfoService } from '../../services/security/app-info.service';

@Component({
  selector: 'app-layout-navbar',
  templateUrl: './layout-navbar.component.html',
  styles: [':host { display: block; }'],
  styleUrls: ['../../../vendor/libs/angular2-ladda/ladda.scss']
})
export class LayoutNavbarComponent implements OnInit {
  isExpanded = false;
  isRTL: boolean;
  isBackupToday: boolean = false;
  isProcessingBackup: boolean = false;
  gradeName: string;
  @Input() sidenavToggle = true;

  @HostBinding('class.layout-navbar')
  private hostClassMain = true;
  picture: any;
  userName: string;
  loginID: string;
  constructor(private appService: AppService,
    private layoutService: LayoutService,
    private authService: AuthService,
    private appInfoService: AppInfoService
  ) {
    this.isRTL = appService.isRTL;
  }
  ngOnInit() {
    let isRemember = localStorage.getItem('isRemembered');
    if (isRemember == 'true') {
      this.picture = localStorage.getItem('picture');
      this.userName = localStorage.getItem('userName');
      this.loginID = localStorage.getItem('loginID');
      this.gradeName = Helper.getEmpGradeName(Number(localStorage.getItem('gradeValue')));
    } else {
      this.picture = sessionStorage.getItem('picture');
      this.userName = sessionStorage.getItem('userName');
      this.loginID = sessionStorage.getItem('loginID');
      this.gradeName = Helper.getEmpGradeName(Number(sessionStorage.getItem('gradeValue')))
    }

    // this.checkTodaysBackup();
  }

  currentBg() {
    return `bg-${this.appService.layoutNavbarBg}`;
  }

  toggleSidenav() {
    this.layoutService.toggleCollapsed();
  }

  locked() {
    if (sessionStorage.getItem('isRemembered') == 'true') {
      localStorage.setItem('locked', 'true');
    } else {
      sessionStorage.setItem('locked', 'true');
    }
    this.appService.redirect('user/locked');
  }

  logout() {
    this.authService.logout(this.loginID)
      .subscribe((response: any) => {
        if (localStorage.getItem('isRemembered') == 'true') {
          localStorage.removeItem('loginID');
          localStorage.removeItem('empCode');
          localStorage.removeItem('userID');
          localStorage.removeItem('userName');
          localStorage.removeItem('userTypeID');
          localStorage.removeItem('picture');
          localStorage.removeItem('companyID');
          localStorage.removeItem('gradeValue');
          localStorage.removeItem('locked');
          localStorage.removeItem('isRemembered');
        } else {
          sessionStorage.removeItem('loginID');
          sessionStorage.removeItem('empCode');
          sessionStorage.removeItem('userID');
          sessionStorage.removeItem('userName');
          sessionStorage.removeItem('userTypeID');
          sessionStorage.removeItem('picture');
          sessionStorage.removeItem('companyID');
          sessionStorage.removeItem('gradeValue');
          sessionStorage.removeItem('locked');
          sessionStorage.removeItem('isRemembered');
        }
        localStorage.removeItem('token');
        this.appService.redirect('user/login');
      })
  }

  checkTodaysBackup() {
    this.appInfoService.checkTodaysBackup()
      .subscribe((isBackup: boolean) => {
        this.isBackupToday = isBackup;
      })
  }
  onBackup() {
    this.isProcessingBackup = true;
    this.appInfoService.backupDatabase()
      .subscribe((response: any) => {
        this.isProcessingBackup = false;
        if (response.status) {
          this.isBackupToday = true;
        }
      }
      )
  }
}
