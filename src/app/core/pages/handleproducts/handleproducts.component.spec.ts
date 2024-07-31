import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HandleproductsComponent } from './handleproducts.component';

describe('HandleproductsComponent', () => {
  let component: HandleproductsComponent;
  let fixture: ComponentFixture<HandleproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HandleproductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HandleproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
