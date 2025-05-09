import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { RegisterProjectService } from 'src/app/services/register-project.service';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss',
  providers: [MessageService],
})
export class ProjectManagementComponent implements OnInit {
  actions: any[] = [];
  selectedAction: any;
  items: any;
  studentId: any;
  selectedProjectId: any; // Biến lưu tạm projectId
  selectedProjectName: string | null = null; // Biến lưu tạm projectId
  isLoading: boolean = false;

  page: number = 1;
  pageSize: number = 10;
  roundId: any;

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
  listProject: any;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private messageService: MessageService,
    private authService: AuthHTTPService,
    private cdr: ChangeDetectorRef,
    private registerProjectService: RegisterProjectService
  ) {}

  ngOnInit(): void {
    this.getUserByToken();

    // this.registerProjectService.searchStudentRound(this.studentId).subscribe((res) => {
    //   this.roundId = res.data[0].round_id;

    //   console.log('round id: ', this.roundId);
    // })

    // this.onLoadList();
    this.actions = [
      { name: 'Xem chi tiết', code: 'viewDetail' },
      { name: 'Đăng ký đề tài', code: 'registerProject' },
    ];

    this.items = [
      { icon: 'pi pi-home', label: 'Trang chủ', route: '/' },
      { label: 'Đăng ký đề tài đồ án' },
    ];
  }

  getUserByToken() {
    const token = <string>localStorage.getItem('v8.2.3-auth-token');
    this.authService.getUserByToken(token).subscribe(
      (res) => {
        if (res) {
          this.studentId = res.student_id;
          console.log('studentId: ', this.studentId);

          this.registerProjectService.searchStudentRound(this.studentId).subscribe((res) => {
            this.roundId = res.data[0].round_id;
            console.log('roundId: ', this.roundId);

            // Chỉ gọi khi đã có đủ
            this.onLoadList();
          });
        }
        this.cdr.detectChanges();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onLoadList() {
    this.registerProjectService.getProjectForStudent(this.studentId, this.roundId, this.page, this.pageSize).subscribe((res) => {
      this.listProject = res.data;
    })
  }

  showNotification(severity: string, summary: string, detail: string, lifetime: number) {
    this.messageService.add({ severity: severity, summary: summary, detail: detail, life: lifetime })
  }

  // component.ts
hasAnyRegisteredProject(): boolean {
  return this.listProject?.some((p: any) => p.student_id !== null);
}


  onLoadFormRegister() {
    this.router.navigate(['/project-management/register-project']);
  }

  @ViewChild('viewDetailProject') viewDetailProject!: TemplateRef<any>;
  @ViewChild('confirmRegister') confirmRegister!: TemplateRef<any>;

  handleActionChange(code: any, projectId?: string, projectName?: string): void {
    switch (code) {
      case 'viewDetail':
        this.modalService.open(this.viewDetailProject, {
          centered: true,
          windowClass: 'formCreateOrUpdate',
        });
        break;

      case 'registerProject':
        this.selectedProjectId = projectId || null;
        this.selectedProjectName = projectName || null;
        this.modalService.open(this.confirmRegister, {
          centered: true,
        });
        break;
    }

    setTimeout(() => {
      this.selectedAction = null;
    });
  }

  registerProject() {

    this.isLoading = true;
    console.log(this.selectedProjectId, this.studentId);

    setTimeout(() => {
      this.registerProjectService.studentRegisProject(this.selectedProjectId, this.studentId).subscribe((res) => {
        this.isLoading = false;
        if(res) {
          this.showNotification('success', 'Thông báo', 'Đăng ký đề tài thành công', 3000);
        }
      })
    }, 3000);

  }
}
