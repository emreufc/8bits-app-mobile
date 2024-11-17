import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DietFilterPage } from './diet-filter.page';

describe('DietFilterPage', () => {
  let component: DietFilterPage;
  let fixture: ComponentFixture<DietFilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DietFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
