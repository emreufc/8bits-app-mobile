import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddnewitemPage } from './addnewitem.page';

describe('AddnewitemPage', () => {
  let component: AddnewitemPage;
  let fixture: ComponentFixture<AddnewitemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewitemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
