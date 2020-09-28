import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelHolderComponent } from './panel-holder.component';

describe('PanelHolderComponent', () => {
  let component: PanelHolderComponent;
  let fixture: ComponentFixture<PanelHolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PanelHolderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
