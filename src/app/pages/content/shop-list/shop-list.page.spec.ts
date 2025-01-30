import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopListPage } from './shop-list.page';

describe('ShopListPage', () => {
  let component: ShopListPage;
  let fixture: ComponentFixture<ShopListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
