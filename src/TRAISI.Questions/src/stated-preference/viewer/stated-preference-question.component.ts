import { Component, OnInit, OnDestroy, Inject, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { doT } from 'dot-ts';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	OnOptionsLoaded,
	QuestionOption,
	ResponseData,
	StringResponseData,
	ResponseValidationState
} from 'traisi-question-sdk';

/**
 * Base question component definition for the question type "Stated Preference"
 *
 * @export
 * @class StatedPreferenceQuestionComponent
 * @extends {SurveyQuestion<ResponseTypes.String>}
 * @implements {OnInit}
 * @implements {OnVisibilityChanged}
 * @implements {OnSaveResponseStatus}
 */
@Component({
	selector: 'traisi-stated-preference-question',
	template: require('./stated-preference-question.component.html'),
	styles: [require('./stated-preference-question.component.scss')]
})
export class StatedPreferenceQuestionComponent extends SurveyQuestion<ResponseTypes.OptionSelect[]>
	implements OnInit, OnVisibilityChanged, OnSaveResponseStatus, OnOptionsLoaded {
	public options: QuestionOption[];

	public onQuestionShown(): void {}
	public onQuestionHidden(): void {}
	public onResponseSaved(result: any): void {}

	/**
	 *Creates an instance of StatedPreferenceQuestionComponent.
	 * @param {SurveyViewer} _surveyViewerService
	 * @memberof StatedPreferenceQuestionComponent
	 */
	constructor(@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewer) {
		super();
	}

	public onOptionsLoaded(options: QuestionOption[]): void {
		console.log(options);
	}

	public ngOnInit(): void {
		console.log(this.configuration);

		this.questionOptions.subscribe((options) => {
			console.log('got options');
			console.log(options);
		});
	}
}
