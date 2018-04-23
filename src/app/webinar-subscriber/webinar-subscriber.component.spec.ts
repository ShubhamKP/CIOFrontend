import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarSubscriberComponent } from './webinar-subscriber.component';

describe('WebinarSubscriberComponent', () => {
  let component: WebinarSubscriberComponent;
  let fixture: ComponentFixture<WebinarSubscriberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarSubscriberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
