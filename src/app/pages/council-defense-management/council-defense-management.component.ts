import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-council-defense-management',
  templateUrl: './council-defense-management.component.html',
  styleUrl: './council-defense-management.component.scss',
  providers: [MessageService],
})
export class CouncilDefenseManagementComponent {
  cities: any;
  studentStatus: any;
  date: Date[] | undefined;
  checked: boolean = false;

  students: any;
  lecturers: any;
  items: any;

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

  selectedStudents: any[] = [];
  selectedLecturers: any[] = [];

  constructor(
    private modalService: NgbModal,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.cities = [
      { name: 'Cập nhật sinh viên', code: 'updateStudent' },
      { name: 'Cập nhật giảng viên', code: 'updateLecturer' },
      { name: 'Xem chi tiết', code: 'viewDetail' },
      { name: 'Cập nhật TT bảo vệ', code: 'updateStudentDefense' },
      { name: 'Sửa', code: 'edit' },
      { name: 'Xóa', code: 'delete' },
    ];

    this.studentStatus = [
      { name: 'Bảo vệ thành công', code: 'successDefense' },
      { name: 'Bảo vệ thất bại', code: 'failureDefense' },
    ]

    this.lecturers = [
      { maGiangVien: '11021274', ten: 'Hoàng Văn Thuận', soLuongHD: 10 },
      { maGiangVien: '11021275', ten: 'Nguyễn Văn A', soLuongHD: 11 },
    ];

    this.students = [
      { maSinhVien: '11021274', ten: 'Hoàng Văn Thuận', lop: 'KTPM01' },
      { maSinhVien: '11021275', ten: 'Nguyễn Văn A', lop: 'KTPM02' },
    ];

    this.items = [{ icon: 'pi pi-home', label: 'Trang chủ', route: '/' }, { label: 'Xác nhận sinh viên đăng ký đề tài' }];
  }

  onLoadModalCreateSession(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
      windowClass: 'formCreateOrUpdate',
    });
  }

  onLoadModalEdit(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
    });
  }

  @ViewChild('viewDetailTemplate') viewDetailTemplate!: TemplateRef<any>;
  @ViewChild('editCouncil') editCouncil!: TemplateRef<any>;
  @ViewChild('deleteCouncil') deleteCouncil!: TemplateRef<any>;
  @ViewChild('addStudent') addStudent!: TemplateRef<any>;
  @ViewChild('addLecturer') addLecturer!: TemplateRef<any>;
  @ViewChild('updateStudentDefense') updateStudentDefense!: TemplateRef<any>;

  handleActionChange(code: any): void {

    switch (code) {
      case 'LDN':
        this.modalService.open(this.viewDetailTemplate, {
          centered: true,
          windowClass: 'formCreateOrUpdate',
        });
        break;

      case 'deleteCouncil':
        this.modalService.open(this.deleteCouncil, {
          centered: true,
        });
        break;

      case 'PRS':
        this.modalService.open(this.deleteCouncil, {
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

      case 'updateStudentDefense':
        this.modalService.open(this.updateStudentDefense, {
          centered: true,
          windowClass: 'add-student-modal',
        });
        break;
    }

    setTimeout(() => {
      this.selectedAction = null;
    });
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
