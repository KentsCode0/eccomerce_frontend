import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConformPopupComponent } from './conform-popup.component';

describe('ConformPopupComponent', () => {
  let component: ConformPopupComponent;
  let fixture: ComponentFixture<ConformPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConformPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConformPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
