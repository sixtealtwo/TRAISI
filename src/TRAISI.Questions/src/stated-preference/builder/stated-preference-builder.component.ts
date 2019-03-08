import { Component, OnInit, OnDestroy, Inject, EventEmitter, ViewChild, Injector, SkipSelf, ElementRef, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BUILDER_SERVICE, QUESTION_ID } from 'traisi-question-sdk';
import { TraisiSurveyBuilder, SURVEY_ID, SURVEY_BUILDER, QuestionOptionValue } from 'traisi-question-sdk';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
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
import { Observable, BehaviorSubject } from 'rxjs';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import demoConfig from './demo-config.model';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
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
	encapsulation: ViewEncapsulation.None,
	styles: [require('./stated-preference-builder.component.scss')]
})
export class StatedPreferenceBuilderComponent implements CustomBuilderOnInit, CustomBuilderOnHidden, CustomBuilderOnShown, OnInit, AfterViewInit {
	public modelOption: BehaviorSubject<QuestionOptionValue>;
	public modelJson: BehaviorSubject<any>;
	public editorOptions: JsonEditorOptions;
	@ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

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
		this.editorOptions = new JsonEditorOptions()
		this.modelJson = new BehaviorSubject<any>({});
		this.editorOptions.modes = ['code', 'tree', 'view'];
		// this.model = { input: '' };
		this.modelOption = new BehaviorSubject<QuestionOptionValue>({
			code: 'Response Options2',
			name: 'Response Options',
			order: 0,

			optionLabel: {
				'language': 'en',
				'value': 'value2'
			}
		});

		this.modelOption.pipe(map(optionValue => {
			try {
				let data = JSON.parse(optionValue.optionLabel.value);
				return data;
			}
			catch {
				return { 'error': true }
			}

		})).subscribe(value => {
			this.modelJson.next(value);
		});
	}

	public ngAfterViewInit(): void {
		// something
	}

	public onUseSampleConfig(): void {
		this.modelJson.next(demoConfig);
		setTimeout(() => {
			this.editor.expandAll();
		});
	}

	/**
	 *
	 *
	 * @memberof StatedPreferenceBuilderComponent
	 */
	public customBuilderInitialized(injector?: Injector): void {
	}

	public customBuilderHidden(): void {
		console.log('SP hidden was called');
	}
	public customBuilderShown(): void {
		console.log('SP shown was called');
	}
	public ngOnInit(): void {

		this._surveyBuilder.getQuestionPartOptions(this._surveyId, this._questionId, 'en').subscribe((result) => {
			if (result.length > 0) {
				(<BehaviorSubject<QuestionOptionValue>>this.modelOption).next(result[0]);
			}
			else {
				(<BehaviorSubject<QuestionOptionValue>>this.modelOption).next(result[0]);
			}

		});
	}

	public inputChanged(event): void {

		this.modelOption.value.optionLabel.value = event;
	}

	public onSave(): void {

		this.modelOption.value.optionLabel.value = this.editor.getText();
		this._surveyBuilder.setQuestionPartOption(this._surveyId, this._questionId, this.modelOption.value).subscribe(v => {
			console.log('finished save');
			console.log(v);
		},
			(error) => {
				console.log(error);
			})
	}
}
