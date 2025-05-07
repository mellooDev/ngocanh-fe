import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule, NgbModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { allIcons, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons'
import { TreeModule } from 'primeng/tree';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ToastModule } from 'primeng/toast';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ModalsModule, WidgetsModule } from 'src/app/_metronic/partials';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import {DividerModule} from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AccountManagementComponent } from './account-management/account-management.component';
import { LoggingManagementComponent } from './logging-management/logging-management.component';



@NgModule({
  declarations: [
    AccountManagementComponent,
    LoggingManagementComponent
  ],
  imports: [
    CommonModule,
    TreeModule,
    FormsModule,// Thêm FormsModule ở đây

    RouterModule.forChild([
      {
        path: 'account-management',
        component: AccountManagementComponent,
      },
      {
        path: 'logging-management',
        component: LoggingManagementComponent,
      },

    ]),
    WidgetsModule,
    ModalsModule,
    TableModule,
    FormsModule, // Thêm FormsModule ở đây
    NgbPaginationModule,
    ButtonModule,
    NgbTooltipModule,
    MatDialogModule,
    ToggleButtonModule,
    DividerModule,
    BreadcrumbModule,
    InputSwitchModule,
    CalendarModule,
    NgbDropdownModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    DropdownModule,
    MatIconModule,
    NgxBootstrapIconsModule.pick(allIcons),
    AngularEditorModule,
    ToastModule,
    RippleModule,
    CodemirrorModule,
    CheckboxModule
  ],
})
export class SystemManagementModule { }
