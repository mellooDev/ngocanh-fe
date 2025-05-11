import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-assign-instructions-management',
  templateUrl: './assign-instructions-management.component.html',
  styleUrl: './assign-instructions-management.component.scss',
  providers: [MessageService]
})
export class AssignInstructionsManagementComponent implements OnInit {

  items: any;

  constructor(private modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.items = [
      { icon: 'pi pi-home', label: 'Trang chủ', route: '/' },
      { label: 'Phân công hướng dẫn' },
    ];
  }

  onLoadListStudent(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
      windowClass: 'view-list-student-modal'
    })
  }
}
