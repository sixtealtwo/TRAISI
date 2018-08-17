import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';

describe('ParametersComponent', () => {
	let component: CheckboxComponent;

	beforeEach(() => {
		component.options = [{
			id: 'test',
			status: false,
			label: 'testLabel'
		}];
	});

});
