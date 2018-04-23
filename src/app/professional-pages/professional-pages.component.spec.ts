import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalPagesComponent } from './professional-pages.component';

describe('ProfessionalPagesComponent', () => {
  let component: ProfessionalPagesComponent;
  let fixture: ComponentFixture<ProfessionalPagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionalPagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
