import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllergenFilterPage } from './allergen-filter.page';

describe('AllergenFilterPage', () => {
  let component: AllergenFilterPage;
  let fixture: ComponentFixture<AllergenFilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllergenFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
