import { Injectable, Inject } from '@angular/core';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { every as _every, some as _some } from 'lodash';
import { point } from '@turf/helpers';
import { SurveyViewQuestion } from 'app/models/survey-view-question.model';
import { Observable } from 'rxjs';
import { SurveyViewerStateService } from '../survey-viewer-state.service';
import { Stack } from 'stack-typescript';
import { QuestionConditionalOperator } from 'app/models/question-conditional-operator.model';
import { QuestionCondtionalOperatorType } from 'app/models/question-conditional-operator-type.enum';
import { QuestionConditionalType } from 'app/models/question-conditional-type.enum';
import { SurveyViewerResponseService } from '../survey-viewer-response.service';
import {
	SurveyRespondent,
	ResponseData,
	ResponseTypes,
	NumberResponseData,
	StringResponseData,
} from 'traisi-question-sdk';

@Injectable({
	providedIn: 'root',
})
export class ConditionalEvaluator {
	/**
	 *
	 * @param _state q
	 * @param _responderService
	 */
	constructor(private _responseService: SurveyViewerResponseService, private _state: SurveyViewerStateService) {}

	/**
	 *
	 * @param conditionalType
	 * @param sourceData
	 * @param targetData
	 * @param value
	 */
	public evaluateConditional(
		conditionalType: QuestionConditionalType,
		sourceData: Array<ResponseData<ResponseTypes>>,
		value: any
	): boolean {
		if (sourceData === undefined) {
			return false;
		}
		switch (conditionalType) {
			case QuestionConditionalType.Contains:
				return this.evaluateContains(sourceData as StringResponseData[], value);
			case QuestionConditionalType.DoesNotContain:
				return !this.evaluateContains(sourceData as StringResponseData[], value);
			case QuestionConditionalType.IsNotEqualTo:
				return this.evaluateEquals(sourceData as NumberResponseData[], value);
			case QuestionConditionalType.LessThan:
				return this.evaluatLessThan(sourceData as NumberResponseData[], value);
			case QuestionConditionalType.GreaterThan:
				return this.evaluatGreaterThan(sourceData as NumberResponseData[], value);
			case QuestionConditionalType.IsNotEqualTo:
				return !this.evaluateEquals(sourceData as NumberResponseData[], value);
			case QuestionConditionalType.IsAnyOf:
				return this.evaluateIsAnyOf(sourceData, value);
			case QuestionConditionalType.IsAnyOf:
				return this.evaluateIsAllOf(sourceData, value);
			case QuestionConditionalType.InRange:
				return this.evaluateInRange(sourceData, value);
			case QuestionConditionalType.OutsideRange:
				return !this.evaluateInRange(sourceData, value);
			case QuestionConditionalType.InBounds:
				return this.evaluateInBounds(sourceData, value);
			case QuestionConditionalType.OutOfBounds:
				return !this.evaluateInBounds(sourceData, value);
			default:
				return false;
		}
	}
	/**
	 *
	 * @param sourceData
	 * @param value
	 */
	private evaluateContains(sourceData: StringResponseData[], value: string): boolean {
		return sourceData[0].value.indexOf(value) >= 0;
	}

	/**
	 * Evaluates equals
	 * @param sourceData
	 * @param value
	 * @returns true if equals
	 */
	private evaluateEquals(sourceData: Array<NumberResponseData>, value: any): boolean {
		const val: boolean = sourceData[0].value === parseInt(value, 10);

		return val;
	}

	private evaluatLessThan(sourceData: Array<NumberResponseData>, value: any): boolean {
		const val: boolean = sourceData[0].value < parseInt(value, 10);

		return val;
	}

	private evaluatGreaterThan(sourceData: Array<NumberResponseData>, value: any): boolean {
		const val: boolean = sourceData[0].value > parseInt(value, 10);

		return val;
	}

	/**
	 * Evaluates in bounds
	 * @param sourceData
	 * @param value
	 * @returns true if in bounds
	 */
	private evaluateInBounds(sourceData: any, boundsInfo: any): boolean {
		let bounds = JSON.parse(boundsInfo);

		if (bounds.features === undefined) {
			return false;
		}
		let p = point([sourceData[0].longitude, sourceData[0].latitude]);
		let contains = booleanPointInPolygon(p, bounds.features[0]);
		// point([sourceData[0].latitude, sourceData[0].longitude]);

		return contains;
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

		sourceData.forEach((response) => {
			if (response === undefined) {
				return false;
			}
			conditionals.forEach((conditional) => {
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

		return _every(conditionals, (x) => {
			return _some(sourceData, (y) => {
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

	/**
	 * Evaluates the conditionals with precedence for AND
	 * @param conditionals List of conditionals
	 */
	public evaluateConditionalList(
		conditionals: Array<QuestionConditionalOperator>,
		respondent: SurveyRespondent
	): boolean {
		// determine if any of the conditionals have missing responses
		// if responses are missing, then this question will be hidden

		for (let conditional of conditionals) {
			let questionId = conditional.lhs?.sourceQuestionId;
			if (questionId) {
				let question = this._state.viewerState.questionViewMap[conditional.lhs.sourceQuestionId];
				if (!this._responseService.hasStoredResponse(question, respondent)) {
					return false;
				}
			}
			questionId = conditional.rhs?.sourceQuestionId;
			if (questionId) {
				let question = this._state.viewerState.questionViewMap[conditional.lhs.sourceQuestionId];
				if (!this._responseService.hasStoredResponse(question, respondent)) {
					return false;
				}
			}
		}
		let valueStack = new Stack<any>();
		let operatorStack = new Stack<QuestionCondtionalOperatorType>();
		for (let conditional of conditionals) {
			if (conditional.lhs !== null) {
				// let questionId = this._state.viewerState.questionViewMap[conditional.lhs.sourceQuestionId].questionId;
				// let response = this._responderService.getCachedSavedResponse(questionId, respondentId);
				let question = this._state.viewerState.questionViewMap[conditional.lhs.sourceQuestionId];

				let response = this._responseService.getStoredResponse(question, respondent);
				// let evalResult = this.evaluateConditional(conditional.lhs.condition, response, conditional.lhs.value);
				valueStack.push(this.evaluateConditional(conditional.lhs.condition, response, conditional.lhs.value));
			}
			if (operatorStack.length === 0) {
				operatorStack.push(conditional.operatorType);
			} else {
				this.evaluateValue(valueStack, operatorStack);
				operatorStack.push(conditional.operatorType);
			}
			if (conditional.rhs !== null) {
				// let questionId = this._state.viewerState.questionViewMap[conditional.rhs.sourceQuestionId].questionId;
				// let response = this._responderService.getCachedSavedResponse(questionId, respondentId);
				let question = this._state.viewerState.questionViewMap[conditional.lhs.sourceQuestionId];
				let response = this._responseService.getStoredResponse(question, respondent);
				// console.log(response);
				// let evalResult = this.evaluateConditional(conditional.lhs.condition, response, conditional.lhs.value);
				valueStack.push(this.evaluateConditional(conditional.lhs.condition, response, conditional.lhs.value));
			}
		}
		// final evaluation, the result is the remaining stack value
		this.evaluateValue(valueStack, operatorStack);
		let result = valueStack.pop();
		return result;
	}

	/**
	 * Evaluates the next expression stored on the stack.
	 * @private
	 * @param {Stack<any>} valueStack
	 * @param {Stack<QuestionCondtionalOperatorType>} operatorStack
	 * @returns {void}
	 */
	private evaluateValue(valueStack: Stack<any>, operatorStack: Stack<QuestionCondtionalOperatorType>): void {
		if (valueStack.length === 1) {
			return;
		}
		let operator = operatorStack.pop();
		let lhs = valueStack.pop();
		let rhs = valueStack.pop();
		if (operator === QuestionCondtionalOperatorType.AND) {
			valueStack.push(lhs && rhs);
		} else {
			valueStack.push(lhs || rhs);
		}
	}

	/**
	 * Determines if a question should be visible for the associated respondent. A question is hidden
	 * when specific survey conditionals are met.
	 * @param question
	 * @param respondentId
	 */
	public shouldHide(
		question: SurveyViewQuestion,
		respondent: SurveyRespondent
	): Observable<{ shouldHide: boolean; question: SurveyViewQuestion }> {
		return new Observable((observer) => {
			if (question.conditionals.length === 0) {
				observer.next({ shouldHide: false, question: question });
				observer.complete();
			} else {
				let sourceQuestions = [];
				for (let source of question.conditionals) {
					if (source.lhs !== null) {
						let sourceQuestion = this._state.viewerState.questionViewMap[source.lhs.sourceQuestionId];
						sourceQuestions.push(sourceQuestion);
					}
					if (source.rhs !== null) {
						let sourceQuestion = this._state.viewerState.questionViewMap[source.rhs.sourceQuestionId];
						sourceQuestions.push(sourceQuestion);
					}
				}

				this._responseService.loadSavedResponses(sourceQuestions, respondent).subscribe({
					complete: () => {
						let evalTrue: boolean = this.evaluateConditionalList(question.conditionals, respondent);
						observer.next({
							shouldHide: !evalTrue,
							question: question,
						});
						observer.complete();
					},
				});
			}
		});
	}
}
