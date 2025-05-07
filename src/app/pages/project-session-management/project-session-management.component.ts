import { filter } from 'rxjs';
import {
  Component,
  OnInit,
  AfterViewInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import moment, { duration } from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcademicYearService } from 'src/app/services/academic-year.service';
import { ProjectSessionService } from 'src/app/services/project-session.service';
import { StudentService } from 'src/app/services/student.service';

declare var $: any;
@Component({
  selector: 'app-project-session-management',
  templateUrl: './project-session-management.component.html',
  styleUrl: './project-session-management.component.scss',
  providers: [MessageService],
})
export class ProjectSessionManagementComponent implements OnInit {
  cities: any;
  date: Date[] | undefined;
  checked: boolean = false;
  page: number = 1;
  pageSize: number = 10;
  recordsTotal = 0;
  studentName: string = '';
  studentCode: string = '';
  classCode: string = '';
  status: string = '';

  sessionName: string;
  sessionCode: string = '';
  studentList: any;

  students: any;
  lecturers: any;
  projectSessionList: any;
  startDate: Date | null = null;

  settings = {
    dangKyDeTai: false,
    dangKyKhacBoMon: false,
    baoCaoKhacTuan: false,
    nhanXetKhacTuan: false,
    suaDeTaiTbm: false,
  };

  selectedAction: any = null;
  selectedStudentIds = new Set<string>();
  selectedLecturerIds = new Set<string>();

  selectedYear: string = '';

  selectedStudents: any[] = [];
  selectedLecturers: any[] = [];

  academicYear: any;

  constructor(
    private modalService: NgbModal,
    private messageService: MessageService,
    private academicYearService: AcademicYearService,
    private projectSessionService: ProjectSessionService,
    private studentService: StudentService
  ) {}

  ngOnInit() {
    this.onLoadYear();
    this.onLoadSession();
    this.onLoadStudentList();
    this.cities = [
      { name: 'Cập nhật sinh viên', code: 'updateStudent' },
      { name: 'Cập nhật giảng viên', code: 'updateLecturer' },
      { name: 'Xem chi tiết', code: 'viewDetail' },
      { name: 'Sửa', code: 'edit' },
      { name: 'Xóa', code: 'delete' },
    ];

    this.lecturers = [
      { maGiangVien: '1234', ten: 'Lê Thị T', soLuongHD: 10 },
      { maGiangVien: '1222', ten: 'Nguyễn Văn A', soLuongHD: 11 },
    ];

    this.students = [
      { maSinhVien: '12521054', ten: 'Hà Ngọc Ánh', lop: '125211' },
      { maSinhVien: '11021275', ten: 'Nguyễn Văn A', lop: '125216' },
    ];
  }

  onLoadModalCreateSession(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
      windowClass: 'formCreateOrUpdate',
    });
  }

  onLoadSession() {
    this.projectSessionService
      .searchProjectSession('', '', '2024-2025', this.page, this.pageSize)
      .subscribe((res) => {
        this.projectSessionList = res.data;

        this.recordsTotal = res.recordsTotal
      });
  }

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.onLoadSession();
  }

  generateCode() {
    if (!this.sessionName) {
      this.sessionCode = '';
      return;
    }

    const normalized = this.sessionName
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

    this.sessionCode = code;
  }

  formatDate(date: Date | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0]; // yyyy-mm-dd
  }

  onSubmitSession() {
    const payload = {
      session: {
        project_session_name: this.sessionName,
        project_session_code: this.sessionCode,
        start_date: this.formatDate(this.startDate),
        type: 'graduation',
        major_id: null, // hoặc truyền nếu không phải graduation
        academic_year_id: this.selectedYear,
        description: this.sessionName,
        status: 'open',
      },
      rounds: [
        {
          round_number: 1,
          start_date: this.formatDate(this.startDate),
          description: 'Lần 1',
        },
      ],
      settings: [
        {
          allow_topic_registration: this.settings.dangKyDeTai ? 1 : 0,
          allow_cross_department_registration: this.settings.dangKyKhacBoMon
            ? 1
            : 0,
          allow_report_out_of_week: this.settings.baoCaoKhacTuan ? 1 : 0,
          allow_evaluator_out_of_week: this.settings.nhanXetKhacTuan ? 1 : 0,
          allow_topic_modification: this.settings.suaDeTaiTbm ? 1 : 0,
        },
      ],
    };

    console.log('data:', payload);

    this.projectSessionService.createProjectSession(payload).subscribe({
      next: (res) => {
        console.log('Tạo thành công:', res);
      },
      error: (err) => {
        console.error('Lỗi khi tạo:', err);
      },
    });
  }

  onLoadYear() {
    this.academicYearService.getYear().subscribe({
      next: (res) => {
        this.academicYear = res.data;
      },
      error: (err) => {
        console.log('error: ', err.message);
      },
    });
  }

  onLoadModalEdit(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
    });
  }

  @ViewChild('viewDetailTemplate') viewDetailTemplate!: TemplateRef<any>;
  @ViewChild('editTemplate') editTemplate!: TemplateRef<any>;
  @ViewChild('deleteTemplate') deleteTemplate!: TemplateRef<any>;
  @ViewChild('addStudent') addStudent!: TemplateRef<any>;
  @ViewChild('addLecturer') addLecturer!: TemplateRef<any>;

  handleActionChange(code: string): void {

    switch (code) {
      case 'LDN':
        this.modalService.open(this.viewDetailTemplate, {
          centered: true,
          windowClass: 'formCreateOrUpdate',
        });
        break;

      case 'IST':
        this.modalService.open(this.editTemplate, {
          centered: true,
          windowClass: 'formCreateOrUpdate',
        });
        break;

      case 'PRS':
        this.modalService.open(this.deleteTemplate, {
          centered: true,
          windowClass: 'formCreateOrUpdate',
        });
        break;

      case 'updateStudent':
        this.modalService.open(this.addStudent, {
          centered: true,
          windowClass: 'add-student-modal',
        });
        break;

      case 'updateLecturer':
        this.modalService.open(this.addLecturer, {
          centered: true,
          windowClass: 'add-student-modal',
        });
        break;
    }

    setTimeout(() => {
      this.selectedAction = null;
    });
  }

  onLoadStudentList() {
    this.studentService.searchStudents(this.studentName, this.studentCode, this.classCode, this.status, this.page, this.pageSize).subscribe((res) => {
      this.studentList = res.data;
      this.recordsTotal = res.recordsTotal;
    })
  }

  onCheckboxChange(checked: boolean, maSinhVien: string) {
    if (checked) {
      this.selectedStudentIds.add(maSinhVien);
    } else {
      this.selectedStudentIds.delete(maSinhVien);
    }
  }

  moveToSelected() {
    const toMove = this.students.filter((sv: any) =>
      this.selectedStudentIds.has(sv.maSinhVien)
    );
    this.selectedStudents.push(...toMove);
    this.students = this.students.filter(
      (sv: any) => !this.selectedStudentIds.has(sv.maSinhVien)
    );
    this.selectedStudentIds.clear();
  }

  moveToAvailable() {
    const toMove = this.selectedStudents.filter((sv: any) =>
      this.selectedStudentIds.has(sv.maSinhVien)
    );
    this.students.push(...toMove);
    this.selectedStudents = this.selectedStudents.filter(
      (sv: any) => !this.selectedStudentIds.has(sv.maSinhVien)
    );
    this.selectedStudentIds.clear();
  }
}
