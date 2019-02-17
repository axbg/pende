import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTabComponent } from './control-tab.component';

describe('ControlTabComponent', () => {
  let component: ControlTabComponent;
  let fixture: ComponentFixture<ControlTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
