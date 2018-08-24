import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyTermsPageComponent } from './survey-terms-page.component';

describe('SurveyTermsPageComponent', () => {
  let component: SurveyTermsPageComponent;
  let fixture: ComponentFixture<SurveyTermsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyTermsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyTermsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
