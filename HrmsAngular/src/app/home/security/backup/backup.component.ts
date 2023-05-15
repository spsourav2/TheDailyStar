import { Component, OnInit } from '@angular/core';
import { AppInfoService } from '../../../services/security/app-info.service';
import { ApiResponse } from '../../../models/response.model';
import { ToastrService } from 'ngx-toastr';
import { HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { nextContext } from '@angular/core/src/render3';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.scss', '../../../../vendor/libs/angular2-ladda/ladda.scss']
})
export class BackupComponent implements OnInit {

  isBackupSuccess: boolean = false;
  isProcess: boolean = false;
  backupFilePath: string = null;
  constructor(private appInfoService: AppInfoService, private toaster: ToastrService) { }
  ngOnInit() {
  }

  onBackup() {
    this.isProcess = true;
    this.appInfoService.backupDatabase()
      .subscribe((response: any) => {
        if (response.status) {
          this.backupFilePath = response.result;
          this.isBackupSuccess = true;
          this.toaster.success('Database Backup success.', 'Success');
        } else {
          this.toaster.error('Failed to backup database', 'Error occurred');
        }
        this.isProcess = false;
      }, err => {
        this.isProcess = false;
        this.toaster.error('Failed to backup database', 'Error occurred');
      }
      )
  }

  onDownload() {
    if (this.backupFilePath) {
      const link = document.createElement('a');
      link.href = environment.apiUrl + '/security/backup/download?filePath=' + this.backupFilePath;
      link.click();
    }else{
      this.toaster.error('Backup file not found','Not found')
    }

    //this.appInfoService.downloadBackupFile('D:\\TblDbBackup\\test.bak').subscribe();

  }

}
