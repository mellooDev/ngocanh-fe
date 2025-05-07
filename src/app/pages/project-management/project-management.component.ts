import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss',
  providers: [MessageService]
})
export class ProjectManagementComponent implements OnInit {
  actions: any[] = [];
  selectedAction: any;
  items: any;

  editorConfig: AngularEditorConfig = {
        sanitize: false,
        editable: true,
        spellcheck: true,
        height: 'auto',
        minHeight: '14rem',
        maxHeight: 'auto',
        width: 'auto',
        minWidth: '0',
        translate: 'no',
        enableToolbar: true,
        showToolbar: true,
        placeholder: 'Enter text here...',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [],
        customClasses: [
          {
            name: 'quote',
            class: 'quote',
          },
          {
            name: 'redText',
            class: 'redText',
          },
          {
            name: 'titleText',
            class: 'titleText',
            tag: 'h1',
          },
        ],
      };

  constructor(private router: Router, private modalService: NgbModal, private messageService: MessageService) {}

  ngOnInit(): void {
    this.actions = [
      { name: 'Xem chi tiết', code: 'viewDetail' },
      { name: 'Đăng ký đề tài', code: 'registerProject' },
    ];

    this.items = [{ icon: 'pi pi-home', label: 'Trang chủ', route: '/' }, { label: 'Đăng ký đề tài đồ án' }];
  }

  onLoadFormRegister() {
    this.router.navigate(['/project-management/register-project']);
  }

  @ViewChild('viewDetailProject') viewDetailProject!: TemplateRef<any>;
  @ViewChild('confirmRegister') confirmRegister!: TemplateRef<any>;

  handleActionChange(code: any): void {

    switch (code) {
      case 'viewDetail':
        this.modalService.open(this.viewDetailProject, {
          centered: true,
          windowClass: 'formCreateOrUpdate',
        });
        break;

      case 'registerProject':
        this.modalService.open(this.confirmRegister, {
          centered: true,
        });
        break;
    }

    setTimeout(() => {
      this.selectedAction = null;
    });
  }
}
