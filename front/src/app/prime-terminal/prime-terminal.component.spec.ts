import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeTerminalComponent } from './prime-terminal.component';

describe('PrimeTerminalComponent', () => {
  let component: PrimeTerminalComponent;
  let fixture: ComponentFixture<PrimeTerminalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrimeTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
