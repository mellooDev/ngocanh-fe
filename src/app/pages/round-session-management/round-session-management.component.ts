import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { AcademicYearService } from 'src/app/services/academic-year.service';
import { ProjectSessionService } from 'src/app/services/project-session.service';
import { RoundSessionService } from 'src/app/services/round-session.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-round-session-management',
  templateUrl: './round-session-management.component.html',
  styleUrl: './round-session-management.component.scss',
  providers: [MessageService]
})
export class RoundSessionManagementComponent {
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

  selectedRoundId: any;

  sessionName: string;
  roundNumber: number = 1;
  sessionCode: string = '';
  studentList: any;

  students: any;
  lecturers: any;
  roundSessionList: any;
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
  roundStudents: any[] = [];

  studentListByRound: { [key: string]: any[] } = {};
roundStudentsByRound: { [key: string]: any[] } = {};
selectedStudentIdsByRound: { [key: string]: Set<string> } = {};


  constructor(
    private modalService: NgbModal,
    private messageService: MessageService,
    private academicYearService: AcademicYearService,
    private projectSessionService: ProjectSessionService,
    private studentService: StudentService,
    private roundSessionService: RoundSessionService
  ) {}

  ngOnInit() {
    this.onLoadYear();
    this.onLoadRound();

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

  onLoadRound() {
    this.roundSessionService
      .searchRound(this.sessionName, this.roundNumber, this.page, this.pageSize)
      .subscribe((res) => {
        this.roundSessionList = res.data;

        this.recordsTotal = res.recordsTotal;
      });
  }

  // onLoadStudentRound() {
  //   this.roundSessionService.getRoundStudent(this.selectedRoundId, this.page, this.pageSize).subscribe((res) => {
  //     this.roundStudents = res.data;
  //   })
  // }

  onLoadStudentList(roundId: string) {
    this.studentService.searchStudents(this.studentName, this.studentCode, this.classCode, this.status, this.page, this.pageSize).subscribe(res => {
      this.studentListByRound[roundId] = res.data;

      console.log('selectedRoundId: ', this.selectedRoundId);

      console.log('data left: ', this.studentListByRound[roundId]);

    });
  }

  onLoadStudentRound(roundId: string) {
    this.roundSessionService.getRoundStudent(roundId, this.page, this.pageSize).subscribe(res => {
      this.roundStudentsByRound[roundId] = res.data;
    });
  }


  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.onLoadRound();
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

  handleActionChange(code: string, roundId?: string): void {
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
        if(roundId) {
          this.selectedRoundId = roundId;
        }
        this.onLoadStudentList(this.selectedRoundId);
    this.onLoadStudentRound(this.selectedRoundId);
        console.log('round id: ', this.selectedRoundId);

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

  // onLoadStudentList() {
  //   this.studentService
  //     .searchStudents(
  //       this.studentName,
  //       this.studentCode,
  //       this.classCode,
  //       this.status,
  //       this.page,
  //       this.pageSize
  //     )
  //     .subscribe((res) => {
  //       // Dữ liệu API trả về
  //       const allStudents = res.data;

  //       // Lọc ra những sinh viên chưa nằm trong roundStudents
  //       const selectedStudentIds = new Set(this.roundStudents.map((sv: any) => sv.student_code));
  //       this.studentList = allStudents.filter(
  //         (sv: any) => !selectedStudentIds.has(sv.student_code)
  //       );

  //       this.recordsTotal = res.recordsTotal;
  //     });
  // }


  // onCheckboxChange(checked: boolean, studentCode: string) {
  //   if (checked) {
  //     this.selectedStudentIds.add(studentCode);
  //   } else {
  //     this.selectedStudentIds.delete(studentCode);
  //   }
  // }

  onCheckboxChange(checked: boolean, studentCode: string, roundId: string) {
    if (!this.selectedStudentIdsByRound[roundId]) {
      this.selectedStudentIdsByRound[roundId] = new Set();
    }

    if (checked) {
      this.selectedStudentIdsByRound[roundId].add(studentCode);
    } else {
      this.selectedStudentIdsByRound[roundId].delete(studentCode);
    }
  }

  moveToSelected(roundId: string) {
    const selectedIds = this.selectedStudentIdsByRound[roundId] || new Set();
    const studentList = this.studentListByRound[roundId] || [];
    const roundStudents = this.roundStudentsByRound[roundId] || [];

    const toMove = studentList.filter(sv => selectedIds.has(sv.student_code));
    this.roundStudentsByRound[roundId] = [...roundStudents, ...toMove];
    this.studentListByRound[roundId] = studentList.filter(sv => !selectedIds.has(sv.student_code));
    this.selectedStudentIdsByRound[roundId].clear();
  }



  // moveToSelected() {
  //   const toMove = this.studentList.filter((sv: any) =>
  //     this.selectedStudentIds.has(sv.student_code)
  //   );
  //   this.roundStudents.push(...toMove);
  //   this.studentList = this.studentList.filter(
  //     (sv: any) => !this.selectedStudentIds.has(sv.student_code)
  //   );
  //   this.selectedStudentIds.clear();
  // }

  moveToAvailable() {
    const toMove = this.roundStudents.filter((sv: any) =>
      this.selectedStudentIds.has(sv.student_code)
    );
    this.studentList.push(...toMove);
    this.roundStudents = this.roundStudents.filter(
      (sv: any) => !this.selectedStudentIds.has(sv.student_code)
    );
    this.selectedStudentIds.clear();
  }

  submitStudents(roundId: string) {
    const roundStudents = this.roundStudentsByRound[roundId] || [];
    const studentsPayload = roundStudents.map(sv => ({ student_id: sv.id }));

    console.log({
      roundId,
      students: studentsPayload
    });

    this.roundSessionService.addStudent(roundId, studentsPayload).subscribe();
  }



  // submitStudents() {
  //   const payload = {
  //     students: this.roundStudents.map((sv: any) => ({
  //       student_id: sv.id // tùy theo tên biến bạn dùng
  //     }))
  //   };

  //   console.log(payload); // ✅ Log ra đúng định dạng bạn cần
  //   // Gửi payload này tới API nếu cần
  // }

}
