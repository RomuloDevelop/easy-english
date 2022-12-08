import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserNoPaymentComponent } from './user-no-payment.component';

describe('UserNoPaymentComponent', () => {
  let component: UserNoPaymentComponent;
  let fixture: ComponentFixture<UserNoPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserNoPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNoPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
