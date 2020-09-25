import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabRibbonComponent } from './tab-ribbon.component';

describe('TabRibbonComponent', () => {
  let component: TabRibbonComponent;
  let fixture: ComponentFixture<TabRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
