import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapQuestionComponent } from './map-question.component';

describe('MapQuestionComponent', () => {
	let component: MapQuestionComponent;
	let fixture: ComponentFixture<MapQuestionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MapQuestionComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MapQuestionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
