import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
	SurveyStartPageComponent,
	SurveyStartPageComponent as SurveyWelcomePageComponent
} from './survey-start-page.component';

describe('SurveyStartPageComponent', () => {
  let component: SurveyWelcomePageComponent;
  let fixture: ComponentFixture<SurveyWelcomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyStartPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyStartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
