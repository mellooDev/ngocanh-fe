import {
  Component,
  TemplateRef,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { ApproveProjectService } from 'src/app/services/approve-project.service';

@Component({
  selector: 'app-lecturer-approve-project',
  templateUrl: './lecturer-approve-project.component.html',
  styleUrl: './lecturer-approve-project.component.scss',
  providers: [MessageService],
})
export class LecturerApproveProjectComponent implements OnInit {
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
  isLoading = false;
  confirmStatus: 'accept' | 'reject' = 'accept';
  items: any;
  pendingList: any;
  lecturerId: any;
  projectRoundId: any;
  page: number = 1;
  pageSize: number = 10;
  recordsTotal: number = 0;
  description: any;

  selectedRequest: any;
  selectedRequestId: any;

  ngOnInit(): void {
    this.items = [
      { icon: 'pi pi-home', label: 'Trang chủ', route: '/' },
      { label: 'Xác nhận sinh viên đăng ký đề tài' },
    ];
    this.getUserByToken();
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private messageService: MessageService,
    private approveProjectService: ApproveProjectService,
    private authService: AuthHTTPService,
    private cdr: ChangeDetectorRef
  ) {}

  getUserByToken() {
    const token = <string>localStorage.getItem('v8.2.3-auth-token');
    this.authService.getUserByToken(token).subscribe(
      (res) => {
        if (res) {
          this.lecturerId = res.lecturer_id;
          console.log('lecturerId: ', this.lecturerId);

          this.approveProjectService
            .searchLecturerRound(this.lecturerId)
            .subscribe((res) => {
              this.projectRoundId = res.data[0].round_id;
              console.log('roundId: ', this.projectRoundId);
              this.getListPendingProject();
            });
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getListPendingProject() {
    this.approveProjectService
      .getPendingProjectForLecturer(
        this.projectRoundId,
        this.lecturerId,
        this.page,
        this.pageSize
      )
      .subscribe((res) => {
        this.pendingList = res.data;
        console.log('pendingList: ', this.pendingList);
      });
  }

  onLoadFormDetail(content: TemplateRef<any>, item: any) {
    this.selectedRequest = item;
    this.selectedRequestId = item.project_request_id;
    this.description = item.project_description;
    this.modalService.open(content, {
      centered: true,
      windowClass: 'formDetailClass',
    });
  }
  showNotification(
    severity: string,
    summary: string,
    detail: string,
    lifetime: number
  ) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: lifetime,
    });
  }

  onLoadFormAccept(content: TemplateRef<any>) {
    this.confirmStatus = 'accept';
    this.modalService.open(content, {
      centered: true,
    });
  }

  onLoadFormReject(content: TemplateRef<any>) {
    this.confirmStatus = 'reject';
    this.modalService.open(content, {
      centered: true,
      size: 'lg',
    });
  }

  onLoadFormUpdate(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
      size: 'lg',
    });
  }

  onSubmit(event: Event, myForm: NgForm) {
    event.preventDefault();
    this.isLoading = true;
    if (myForm.invalid) {
      console.log('form invalid');
      return;
    }

    if (this.confirmStatus === 'accept') {
      console.log('project_request_id: ', this.selectedRequestId);


      this.approveProjectService.lecturerApproveProject(this.selectedRequestId).subscribe((res) => {
        this.isLoading = false;

        this.showNotification(
          'success',
          'Thông báo',
          res.message,
          3000
        );
        this.modalService.dismissAll();
      })
    }

    if (this.confirmStatus === 'reject') {
      setTimeout(() => {
        this.isLoading = false;
        this.modalService.dismissAll();

        this.showNotification(
          'success',
          'Thông báo',
          'Từ chối đề tài thành công',
          3000
        );
      }, 2000);
    }
  }
}
