import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SurveyHeaderDisplayComponent} from './survey-header-display.component';

describe('SurveyHeaderDisplayComponent', () => {
	let component: SurveyHeaderDisplayComponent;
	let fixture: ComponentFixture<SurveyHeaderDisplayComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SurveyHeaderDisplayComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SurveyHeaderDisplayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
