import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { decode } from 'js-base64';
import { AuthService } from 'src/app/modules/auth';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Input() appHeaderDefaulMenuDisplay: boolean;
  @Input() isRtl: boolean;

  itemClass: string = 'ms-1 ms-lg-3';
  btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
  userAvatarClass: string = 'symbol-35px symbol-md-40px';
  btnIconClass: string = 'fs-2 fs-md-1';
  token: string;
  isLogin: boolean;

  nameNavbar: string;


  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private authHTTPService: AuthHTTPService) {}

  ngOnInit(): void {
    this.getUserByToken();
  }


  getUserByToken() {
    this.token = <string>localStorage.getItem('v8.2.3-auth-token');
    if(this.token != undefined || this.token != null) {
      this.authHTTPService.getUserByToken(this.token).subscribe(res => {
        if(res) {
          this.isLogin = true;
        } else {
          this.isLogin = false
        }
        this.cdr.detectChanges()
      })
    }
    const decodedToken = this.decodeJWT(this.token);

    console.log('decodeToken: ', decodedToken);

    this.nameNavbar = decodedToken.fullname;

  }

  decodeJWT(token: string): any {
    if (!token) {
      throw new Error('Token is empty');
    }


    // Phần thứ hai của JWT là payload (nằm giữa hai dấu chấm)
    const payload = token.split('.')[1];
    if (!payload) {
      throw new Error('Invalid token format');
    }

    // Giải mã payload từ Base64URL
    // const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

    return JSON.parse(decode(payload.replace(/-/g, '+').replace(/_/g, '/')));
    // Chuyển payload thành đối tượng JSON
    // return JSON.parse(decodedPayload);
  }
}
