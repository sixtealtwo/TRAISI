import { Component, OnInit, OnDestroy, Inject, EventEmitter, ViewChild, Injector, SkipSelf } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BUILDER_SERVICE, QUESTION_ID } from 'traisi-question-sdk';
import { TraisiSurveyBuilder, SURVEY_ID, SURVEY_BUILDER, QuestionOptionValue } from '../../../../TRAISI.SDK/Module/src/traisi-survey-builder.service';
import * as _ from 'lodash';

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
	ResponseValidationState,
	CustomBuilderOnInit,
	CustomBuilderOnHidden,
	CustomBuilderOnShown
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
	selector: 'traisi-stated-preference-builder',
	template: require('./stated-preference-builder.component.html'),
	styles: [require('./stated-preference-builder.component.scss')]
})
export class StatedPreferenceBuilderComponent implements CustomBuilderOnInit, CustomBuilderOnHidden, CustomBuilderOnShown, OnInit {

	public model: { input: string };

	/**
	 *Creates an instance of StatedPreferenceBuilderComponent.
	 * @param {*} _builderService
	 * @param {TraisiSurveyBuilder} _surveyBuilder
	 * @memberof StatedPreferenceBuilderComponent
	 */
	public constructor(
		@Inject(BUILDER_SERVICE) private _surveyBuilder: TraisiSurveyBuilder,
		@Inject(QUESTION_ID) private _questionId: number,
		@Inject(SURVEY_ID) private _surveyId: number
	) {
		this.model = { input: '' };
	}

	/**
	 *
	 *
	 * @memberof StatedPreferenceBuilderComponent
	 */
	public customBuilderInitialized(injector?: Injector): void {
		console.log('custom builder init called from stated preference builder component.');
		console.log(injector);
	}

	public customBuilderHidden(): void {
		console.log('SP hidden was called');
	}
	public customBuilderShown(): void {
		console.log('SP shown was called');
	}
	public ngOnInit(): void {
		console.log('on init called');

		this._surveyBuilder.getQuestionPartOptions(this._surveyId, this._questionId, 'en').subscribe((result) => {
			console.log('got options');
			console.log(result);

		});
	}

	public onSave(): void {

		console.log('on save');

		let c: QuestionOptionValue = {
			code: 'Response Options2', 
			name: 'Response Options',  
			order: 0,
			
			optionLabel: {
				'language': 'en',
				'value': 'value2'
			}
		};

		this._surveyBuilder.setQuestionPartOption(this._surveyId, this._questionId, c).subscribe(v => {
			console.log(v);
		},
			(error) => {
				console.log(error);
			})
	}
}
