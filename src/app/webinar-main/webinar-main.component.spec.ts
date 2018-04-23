import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarMainComponent } from './webinar-main.component';

describe('WebinarMainComponent', () => {
  let component: WebinarMainComponent;
  let fixture: ComponentFixture<WebinarMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
