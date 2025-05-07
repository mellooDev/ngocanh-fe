import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingManagementComponent } from './logging-management.component';

describe('LoggingManagementComponent', () => {
  let component: LoggingManagementComponent;
  let fixture: ComponentFixture<LoggingManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoggingManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoggingManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
