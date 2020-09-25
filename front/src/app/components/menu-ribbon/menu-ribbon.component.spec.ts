import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuRibbonComponent } from './menu-ribbon.component';

describe('MenuRibbonComponent', () => {
  let component: MenuRibbonComponent;
  let fixture: ComponentFixture<MenuRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
