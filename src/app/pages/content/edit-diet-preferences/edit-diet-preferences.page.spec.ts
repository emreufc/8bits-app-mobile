import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDietPreferencesPage } from './edit-diet-preferences.page';

describe('EditDietPreferencesPage', () => {
  let component: EditDietPreferencesPage;
  let fixture: ComponentFixture<EditDietPreferencesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDietPreferencesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
