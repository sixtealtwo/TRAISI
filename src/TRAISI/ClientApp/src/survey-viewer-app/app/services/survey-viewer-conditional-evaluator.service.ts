import { Injectable, Inject } from '@angular/core';
import { SurveyViewerStateService } from './survey-viewer-state.service';
import { SurveyResponderService } from './survey-responder.service';
import booleanContains from '@turf/boolean-point-in-polygon';
import { every as _every, some as _some } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class SurveyViewerConditionalEvaluator {
	/**
	 *
	 * @param _state q
	 * @param _responderService
	 */
	constructor() {}

	/**
	 *
	 * @param conditionalType
	 * @param sourceData
	 * @param targetData
	 * @param value
	 */
	public evaluateConditional(conditionalType: string, sourceData: any, targetData: any, value: any): boolean {

		if(sourceData === undefined)
		{
			return false;
		}
		switch (conditionalType) {
			case 'contains':
				return this.evaluateContains(sourceData, value);
			case 'doesNotContain':
				return !this.evaluateContains(sourceData, value);
			case 'isEqualTo':
				return this.evaluateEquals(sourceData, value);
			case 'contains':
				return this.evaluateContains(sourceData, value);
			case 'isNotEqualTo':
				return !this.evaluateEquals(sourceData, value);
			case 'isAnyOf':
				return this.evaluateIsAnyOf(sourceData, value);
			case 'isAllOf':
				return this.evaluateIsAllOf(sourceData, value);
			case 'inRange':
				return this.evaluateInRange(sourceData, value);
			case 'outsideRange':
				return !this.evaluateInRange(sourceData, value);
			case 'inBounds':
				return this.evaluateInBounds(sourceData, value);
			case 'outOfBounds':
				return this.evaluateInBounds(sourceData, value);
			default:
				return false;
		}
	}
	/**
	 *
	 * @param sourceData
	 * @param value
	 */
	private evaluateContains(sourceData: any[], value: string): boolean {
		const val: boolean = sourceData[0].value.indexOf(value) >= 0;

		return val;
	}

	/**
	 * Evaluates equals
	 * @param sourceData
	 * @param value
	 * @returns true if equals
	 */
	private evaluateEquals(sourceData: any[], value: any): boolean {
		const val: boolean = sourceData[0].value === parseInt(value, 10);

		return val;
	}

	/**
	 * Evaluates in bounds
	 * @param sourceData
	 * @param value
	 * @returns true if in bounds
	 */
	private evaluateInBounds(sourceData: any, value: any): boolean {
		booleanContains(null, null);
		return false;
	}

	/**
	 * Evaluates is any of
	 * @param sourceData
	 * @param value
	 * @returns true if is any of
	 */
	private evaluateIsAnyOf(sourceData: any[], conditionalData: string): boolean {
		let conditionals = JSON.parse(conditionalData);

		let isAny: boolean = false;
		sourceData.forEach(response => {
			conditionals.forEach(conditional => {
				if (response.code === conditional.code) {
					isAny = true;
				}
			});
		});
		return isAny;
	}

	/**
	 * Evaluates is all of
	 * @param sourceData
	 * @param value
	 * @returns true if is all of
	 */
	private evaluateIsAllOf(sourceData: any[], conditionalData: string): boolean {
		let conditionals = JSON.parse(conditionalData);


		return _every(conditionals, x => {
			return _some(sourceData, y => {
				return x.code === y.code;
			});
		});
	}

	/**
	 * Evaluates in range
	 * @param sourceData
	 * @param value
	 * @returns true if in range
	 */
	private evaluateInRange(sourceData: any[], rangeData: string): boolean {
		let dateIn = new Date(sourceData[0].value);
		let dateRange = JSON.parse(rangeData);

		let dateLower = new Date(dateRange[0]);
		let dateUpper = new Date(dateRange[1]);

		if (dateLower <= dateIn && dateIn <= dateUpper) {
			return true;
		} else {
			return false;
		}
	}
}
