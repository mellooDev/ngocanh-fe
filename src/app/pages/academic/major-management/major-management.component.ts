import { data } from 'jquery';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'primeng/api';
import { MajorService } from 'src/app/services/major.service';

@Component({
  selector: 'app-major-management',
  templateUrl: './major-management.component.html',
  styleUrl: './major-management.component.scss',
  providers: [MessageService],
})
export class MajorManagementComponent implements OnInit {
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

  items: any;
  searchTerm: string = '';
  page: number = 1;
  pageSize: number = 10;
  dataList: any;

  constructor(
    private messageService: MessageService,
    private modalService: NgbModal,
    private majorService: MajorService
  ) {}

  ngOnInit(): void {
    this.items = [
      { icon: 'pi pi-home', label: 'Trang chủ', route: '/' },
      { label: 'Quản lý chuyên ngành' },
    ];
    this.onLoadMajors();
  }

  onLoadMajors() {
    const listReq: any = {
      filter: this.searchTerm,
      currentPage: this.page,
      perPage: this.pageSize,
    };
    this.majorService.getMajors(listReq).subscribe({
      next: (res) => {
        this.dataList = res.data;
      },
      error: (err) => {
        console.log('error: ', err.message);
      },
    });
  }

  onLoadCreateMajor(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
      windowClass: 'formCreateOrUpdate',
    });
  }

  onDeleteMajor(content: TemplateRef<any>) {
    this.modalService.open(content, {
      centered: true,
    });
  }
}
