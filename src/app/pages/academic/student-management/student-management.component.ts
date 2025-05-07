import { Component, TemplateRef, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrl: './student-management.component.scss',
  providers: [MessageService],
})
export class StudentManagementComponent implements OnInit {
  isLoading: any;
  editorConfig: AngularEditorConfig = {
    sanitize: false,
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '10rem',
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
  studentList: any;
  page: number = 1;
  pageSize: number = 10;
  recordsTotal: number = 0;
  studentName: string = '';
  studentCode: string = '';
  classCode: string = '';
  status: string = '';

  constructor(
    private messageService: MessageService,
    private studentService: StudentService,
    private modalService: NgbModal
  ) {}

  items: any;

  ngOnInit(): void {
    this.items = [{ icon: 'pi pi-home', label: 'Trang chủ', route: '/' }, { label: 'Quản lý sinh viên' }];
    this.onLoadStudentList();
  }

  onLoadStudentList() {
    this.studentService.searchStudents(this.studentName, this.studentCode, this.classCode, this.status, this.page, this.pageSize).subscribe((res) => {
      this.studentList = res.data;
      this.recordsTotal = res.recordsTotal;
    })
  }

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.onLoadStudentList();
  }

  onLoadCreateStudent(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
      windowClass: 'formCreateOrUpdate',
    });
  }

  onDeleteStudent(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
    });
  }
}
