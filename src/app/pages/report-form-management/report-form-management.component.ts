import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ReportFormService } from 'src/app/services/report-form.service';

@Component({
  selector: 'app-report-form-management',
  templateUrl: './report-form-management.component.html',
  styleUrl: './report-form-management.component.scss',
  providers: [MessageService],
})
export class ReportFormManagementComponent implements OnInit {
  items: any;
  page: number = 1;
  pageSize: number = 10;
  recordsTotal: number = 0;
  searchTerm: string = '';

  fileList: any;

  constructor(private reportFormService: ReportFormService) {}

  ngOnInit(): void {
    this.getAllFiles();
    this.items = [
      { icon: 'pi pi-home', label: 'Trang chủ', route: '/' },
      { label: 'Quản lý biểu mẫu' },
    ];
  }

  getAllFiles() {
    const params = {
      keyword: this.searchTerm,
      page: this.page,
      pageSize: this.pageSize,
    };
    this.reportFormService.getFiles(params).subscribe((res) => {
      this.fileList = res.data;
      console.log('fileList: ', this.fileList);
    });
  }

  @ViewChildren('hiddenLink') hiddenLinks!: QueryList<ElementRef>;

  downloadFile(url: string, fileName: string) {
    // Tìm thẻ <a> tương ứng theo URL
    const linkEl = this.hiddenLinks.find(
      (el) => el.nativeElement.getAttribute('href') === url
    );

    if (linkEl) {
      linkEl.nativeElement.click();
    } else {
      // fallback nếu không tìm thấy
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.download = fileName;
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    }
  }
}
