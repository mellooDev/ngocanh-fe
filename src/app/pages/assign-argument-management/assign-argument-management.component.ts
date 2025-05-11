import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-assign-argument-management',
  templateUrl: './assign-argument-management.component.html',
  styleUrl: './assign-argument-management.component.scss',
  providers: [MessageService]
})
export class AssignArgumentManagementComponent implements OnInit {

  items: any;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.items = [
      { icon: 'pi pi-home', label: 'Trang chủ', route: '/' },
      { label: 'Phân công phản biện' },
    ];
  }

  onLoadListLecturer(content: TemplateRef<any>) {
      this.modalService.open(content, {
        centered: true,
        windowClass: 'view-list-lecturer-modal'
      })
    }
}
