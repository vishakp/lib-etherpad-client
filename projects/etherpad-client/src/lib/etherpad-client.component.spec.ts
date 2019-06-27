import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtherpadClientComponent } from './etherpad-client.component';

describe('EtherpadClientComponent', () => {
  let component: EtherpadClientComponent;
  let fixture: ComponentFixture<EtherpadClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtherpadClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtherpadClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
