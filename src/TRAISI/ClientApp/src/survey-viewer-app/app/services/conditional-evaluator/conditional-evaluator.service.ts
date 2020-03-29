import { Injectable, Inject } from "@angular/core";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { every as _every, some as _some } from "lodash";
import { point } from "@turf/helpers";
import { SurveyResponderService } from "../survey-responder.service";
import { SurveyViewQuestion } from "app/models/survey-view-question.model";
import { Observable } from "rxjs";
import { SurveyViewerStateService } from "../survey-viewer-state.service";
import { Stack } from "stack-typescript";
import { QuestionConditionalOperator } from "app/models/question-conditional-operator.model";
import { QuestionCondtionalOperatorType } from "app/models/question-conditional-operator-type.enum";
import { QuestionConditionalType } from "app/models/question-conditional-type.enum";

@Injectable({
	providedIn: "root"
})
export class ConditionalEvaluator {
	/**
	 *
	 * @param _state q
	 * @param _responderService
	 */
	constructor(
		private _responderService: SurveyResponderService,
		private _state: SurveyViewerStateService
	) {}

	/**
	 *
	 * @param conditionalType
	 * @param sourceData
	 * @param targetData
	 * @param value
	 */
	public evaluateConditional(
		conditionalType: QuestionConditionalType,
		sourceData: any,
		targetData: any,
		value: any
	): boolean {
		if (sourceData === undefined) {
			return false;
		}
		switch (conditionalType) {
			case QuestionConditionalType.Contains:
				return this.evaluateContains(sourceData, value);
			case QuestionConditionalType.DoesNotContain:
				return !this.evaluateContains(sourceData, value);
			case QuestionConditionalType.IsNotEqualTo:
				return this.evaluateEquals(sourceData, value);
			case QuestionConditionalType.LessThan:
				return this.evaluatLessThan(sourceData, value);
			case QuestionConditionalType.GreaterThan:
				return this.evaluatGreaterThan(sourceData, value);
			case QuestionConditionalType.IsNotEqualTo:
				return !this.evaluateEquals(sourceData, value);
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
	private evaluateContains(sourceData: any[], value: string): boolean {
		console.log(sourceData);
		return sourceData[0].value.indexOf(value) >= 0;
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

	private evaluatLessThan(sourceData: any[], value: any): boolean {
		const val: boolean = sourceData[0].value < parseInt(value, 10);

		return val;
	}

	private evaluatGreaterThan(sourceData: any[], value: any): boolean {
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
	private evaluateIsAnyOf(
		sourceData: any[],
		conditionalData: string
	): boolean {
		let conditionals = JSON.parse(conditionalData);

		let isAny: boolean = false;

		sourceData.forEach(response => {
			if (response === undefined) {
				return false;
			}
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
	private evaluateIsAllOf(
		sourceData: any[],
		conditionalData: string
	): boolean {
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

	/**
	 * Evaluates the conditionals with precedence for AND
	 * @param conditionals List of conditionals
	 */
	public evaluateConditionalList(
		conditionals: Array<QuestionConditionalOperator>,
		respondentId: number
	): boolean {
		console.log(conditionals);
		let valueStack = new Stack<any>();
		let operatorStack = new Stack<QuestionCondtionalOperatorType>();
		for (let conditional of conditionals) {
			if (conditional.lhs !== null) {
				let questionId = this._state.viewerState.questionViewMap[
					conditional.lhs.sourceQuestionId
				].questionId;
				let response = this._responderService.getCachedSavedResponse(
					questionId,
					respondentId
				);
				let evalResult = this.evaluateConditional(
					conditional.lhs.condition,
					response,
					"",
					conditional.lhs.value
				);
				console.log(evalResult);
				valueStack.push(evalResult);
			}
			if (operatorStack.length == 0) {
				operatorStack.push(conditional.operatorType);
			} else {
				this.evaluateValue(valueStack, operatorStack);
				operatorStack.push(conditional.operatorType);
			}
			if (conditional.rhs !== null) {
				let questionId = this._state.viewerState.questionViewMap[
					conditional.rhs.sourceQuestionId
				].questionId;
				let response = this._responderService.getCachedSavedResponse(
					questionId,
					respondentId
				);
				let evalResult = this.evaluateConditional(
					conditional.lhs.condition,
					response,
					"",
					conditional.lhs.value
				);
				console.log(evalResult);
				valueStack.push(evalResult);
			}
		}
		
		// final evaluation, the result is the remaining stack value
		this.evaluateValue(valueStack, operatorStack);
		let result = valueStack.pop();
		return result;
	}

	private evaluateValue(
		valueStack: Stack<any>,
		operatorStack: Stack<QuestionCondtionalOperatorType>
	) {
		if(valueStack.length === 1) {
			return ;
		}
		let operator = operatorStack.pop();
		let lhs = valueStack.pop();
		let rhs = valueStack.pop();
		if (operator == QuestionCondtionalOperatorType.AND) {
			valueStack.push(lhs & rhs);
		} else {
			valueStack.push(lhs | rhs);
		}
	}

	/**
	 *
	 * @param question
	 * @param respondentId
	 */
	public shouldHide(
		question: SurveyViewQuestion,
		respondentId: number
	): Observable<{ shouldHide: boolean; question: SurveyViewQuestion }> {
		return new Observable(observer => {
			if (question.conditionals.length === 0) {
				observer.next({ shouldHide: false, question: question });
				observer.complete();
			} else {
				let sourceIds = [];
				for (let source of question.conditionals) {
					if (source.lhs !== null) {
						let sourceQuestion = this._state.viewerState
							.questionViewMap[source.lhs.sourceQuestionId];
						sourceIds.push(sourceQuestion.questionId);
					}
					if (source.rhs !== null) {
						let sourceQuestion = this._state.viewerState
							.questionViewMap[source.rhs.sourceQuestionId];
						sourceIds.push(sourceQuestion.questionId);
					}
				}

				this._responderService
					.readyCachedSavedResponses(sourceIds, respondentId)
					.subscribe({
						complete: () => {
							console.log('in complete');
							let evalTrue: boolean = this.evaluateConditionalList(
								question.conditionals,
								respondentId
							);
							
							// let evalTrue: boolean = question.targetConditionals.some(
							// 	evalConditional => {
							// 		let response = this._responderService.getCachedSavedResponse(
							// 			evalConditional.sourceQuestionId,
							// 			respondentId
							// 		);

							// 		if (
							// 			response === undefined ||
							// 			response.length === 0
							// 		) {
							// 			return true;
							// 		}
							// 		let evalResult = this.evaluateConditional(
							// 			evalConditional.conditionalType,
							// 			response,
							// 			"",
							// 			evalConditional.value
							// 		);
							// 		return evalResult;
							// 	}
							// );
							observer.next({
								shouldHide: !evalTrue,
								question: question
							});
							observer.complete();
						}
					});
			}
		});
	}
}
