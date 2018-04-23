import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebinarPublisherComponent } from './webinar-publisher.component';

describe('WebinarPublisherComponent', () => {
  let component: WebinarPublisherComponent;
  let fixture: ComponentFixture<WebinarPublisherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebinarPublisherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebinarPublisherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
