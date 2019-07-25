/// <reference path="../../../../../../../../node_modules/@types/jasmine/index.d.ts" />

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetConditionalComponent } from './target-conditional.component';

describe('TargetConditionalComponent', () => {
	let component: TargetConditionalComponent;
	let fixture: ComponentFixture<TargetConditionalComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TargetConditionalComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TargetConditionalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
