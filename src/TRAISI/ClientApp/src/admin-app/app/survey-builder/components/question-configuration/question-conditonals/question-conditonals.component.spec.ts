import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionConditonalsComponent } from './question-conditonals.component';

describe('QuestionConditonalsComponent', () => {
  let component: QuestionConditonalsComponent;
  let fixture: ComponentFixture<QuestionConditonalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionConditonalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionConditonalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
