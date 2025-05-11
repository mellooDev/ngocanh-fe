import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { RegisterProjectService } from 'src/app/services/register-project.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-register-project',
  templateUrl: './register-project.component.html',
  styleUrl: './register-project.component.scss',
  providers: [MessageService],
})
export class RegisterProjectComponent implements OnInit, OnDestroy {
  roundIdCurrent: any;
  projectId: string;
  projectName: string;
  description: string;
  projectRoundId: string;
  studentId: string;
  lecturerId: string;
  defenseMode: string;
  projectCode: string;

  lecturerList: any;
  isLoading: boolean = false;

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
  items: any;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private modalService: NgbModal,
    private registerProjectService: RegisterProjectService,
    private authService: AuthHTTPService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.items = [
      { icon: 'pi pi-home', label: 'Trang chủ', route: '/' },
      { label: 'Đăng ký đề tài đồ án' },
    ];

    this.registerProjectService.roundId$.subscribe((res) => {
      console.log('round current: ', res);
      // this.roundIdCurrent = res;
    });

    this.roundIdCurrent = localStorage.getItem('currentRoundId');
    this.onLoadLecturer();
    this.getUserByToken();
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

  onLoadFormConfirm(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
    });
  }

  onLoadLecturer() {
    this.registerProjectService.getLecturerInRound(this.roundIdCurrent).subscribe((res) => {
      this.lecturerList = res.data;
    })
  }

  getUserByToken() {
    const token = <string>localStorage.getItem('v8.2.3-auth-token');
    this.authService.getUserByToken(token).subscribe(
      (res) => {
        if (res) {
          this.studentId = res.student_id;
          console.log('studentId: ', this.studentId);
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  generateCode() {
    if (!this.projectName) {
      this.projectCode = '';
      return;
    }

    const normalized = this.projectName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const words = normalized.trim().split(/\s+/);

    let code = '';

    for (const word of words) {
      if (/^[A-Za-z]+\d+$/.test(word)) {
        code += word.toUpperCase(); // giữ nguyên nếu là dạng chữ+số, như K19
      } else {
        code += word[0].toUpperCase(); // lấy chữ đầu
      }
    }

    this.projectCode = code;
  }

  onSubmit() {
    console.log('payload: ', {
      projectName: this.projectName,
      description: this.description,
      projectRoundId: this.roundIdCurrent,
      studentId: this.studentId,
      lecturerId: this.lecturerId,
      defenseMode: null,
      projectCode: this.projectCode,
    });
    this.isLoading = true;

    this.registerProjectService.studentPurposeProject(this.projectName, this.description, this.roundIdCurrent, this.studentId, this.lecturerId, "null").subscribe((res) => {
      if(res) {
        setTimeout(() => {

        }, 1500);
        this.isLoading = false;
        this.showNotification('success', 'Thông báo', res.message, 3000);
        this.modalService.dismissAll();
      }
    })
  }

  onBasicUploadAuto(event: FileUploadEvent) {
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'File Uploaded with Auto Mode',
    });
  }

  ngOnDestroy(): void {
    localStorage.removeItem('currentRoundId');
  }
}
