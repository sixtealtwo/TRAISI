import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyCompletePageComponent } from './survey-complete-page.component';

describe('SurveyCompletePageComponent', () => {
  let component: SurveyCompletePageComponent;
  let fixture: ComponentFixture<SurveyCompletePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyCompletePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
