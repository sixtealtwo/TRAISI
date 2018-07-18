import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyWelcomePageComponent } from './survey-welcome-page.component';

describe('SurveyWelcomePageComponent', () => {
  let component: SurveyWelcomePageComponent;
  let fixture: ComponentFixture<SurveyWelcomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyWelcomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyWelcomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
