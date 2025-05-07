import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-logging-management',
  templateUrl: './logging-management.component.html',
  styleUrl: './logging-management.component.scss'
})
export class LoggingManagementComponent implements OnInit {

  items: any;

  ngOnInit(): void {
    this.items = [{ icon: 'pi pi-home', label: 'Trang chủ', route: '/' }, { label: 'Xác nhận sinh viên đăng ký đề tài' }];
  }

}
