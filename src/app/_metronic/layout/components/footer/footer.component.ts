import { Component, Input, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { AuthHTTPService } from '../../../../modules/auth/services/auth-http';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  @Input() appFooterContainerCSSClass: string = '';

  rows = [
    { website: 'http://www.utehy.edu/vn/', address: 'Cơ sở Khoái Châu: Khoái Châu - Hưng Yên', phone: '0221.3689.888' },
    { website: 'http://www.utehy.edu/vn/', address: 'Cơ sở Mỹ Hào: Mỹ Hào - Hưng Yên', phone: '0221.3689.555' },
    { website: 'http://www.utehy.edu/vn/', address: 'Cơ sở Hải Dương: Lương Bằng - Hải Dương', phone: '0221.3689.333' },

    { customField: 'Nơi làm việc: CỔNG THÔNG TIN SỐ HÓA KHOA CÔNG NGHỆ THÔNG TIN' }
  ];

  transform = 'translateY(0%)';
  transition = 'transform 0.5s ease';
  currentIndex = 0;
  intervalId: any;

  currentDateStr: string = new Date().getFullYear().toString();
  constructor(
    private authService: AuthHTTPService,
    private cdr: ChangeDetectorRef
  ) {}
  isLogin: boolean;
  token: string;

  ngOnInit() {
    this.getUserByToken();
    this.startSlide();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startSlide() {
    this.intervalId = setInterval(() => {
      this.currentIndex++;
      this.transition = 'transform 0.5s ease';
      this.transform = `translateY(-${this.currentIndex * 50}px)`;

      // Nếu trượt đến dòng clone (cuối cùng) thì reset lại
      if (this.currentIndex === this.rows.length) {
        setTimeout(() => {
          this.transition = 'none'; // Tắt transition để reset không giật
          this.currentIndex = 0;
          this.transform = `translateY(0px)`;
        }, 500); // Sau khi trượt xong (500ms) mới reset
      }
    }, 3000); // Mỗi 3 giây trượt 1 lần
  }

  getUserByToken() {
    this.token = <string>localStorage.getItem('v8.2.3-auth-token');
    if (this.token != undefined || this.token != null) {
      this.authService.getUserByToken(this.token).subscribe((res) => {
        if (res) {
          this.isLogin = true;
        } else {
          this.isLogin = false;
        }
        this.cdr.detectChanges();
      });
    }
  }
}
