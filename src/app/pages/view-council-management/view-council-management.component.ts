import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-council-management',
  templateUrl: './view-council-management.component.html',
  styleUrl: './view-council-management.component.scss',
  providers: [MessageService]
})
export class ViewCouncilManagementComponent implements OnInit {

  items: any;

  ngOnInit(): void {
    this.items = [{ icon: 'pi pi-home', label: 'Trang chủ', route: '/' }, { label: 'Danh sách giáo viên phản biện' }];
  }

}
