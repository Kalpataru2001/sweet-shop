import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SweetCardComponent } from './sweet-card.component';

describe('SweetCardComponent', () => {
  let component: SweetCardComponent;
  let fixture: ComponentFixture<SweetCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SweetCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SweetCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
