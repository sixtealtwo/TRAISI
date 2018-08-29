import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SurveyViewerComponent} from './survey-viewer.component';

describe('SurveyViewerComponent', () => {
	let component: SurveyViewerComponent;
	let fixture: ComponentFixture<SurveyViewerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SurveyViewerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SurveyViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
