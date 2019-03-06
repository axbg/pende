import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesPanelComponent } from './files-panel.component';

describe('FilesPanelComponent', () => {
  let component: FilesPanelComponent;
  let fixture: ComponentFixture<FilesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
