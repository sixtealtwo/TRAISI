import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	SurveyResponder,
	QuestionConfiguration,
	SurveyViewer,
	OnSurveyQuestionInit,
	OnVisibilityChanged,
	OnSaveResponseStatus,
	StringResponseData,
	OnOptionsLoaded,
	QuestionOption
} from 'traisi-question-sdk';
import templateString from './range-question.component.html';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import { BehaviorSubject } from 'rxjs';
@Component({
	selector: 'traisi-range-question',
	template: templateString,
	styles: [require('./range-question.component.scss').toString()]
})
export class RangeQuestionComponent extends SurveyQuestion<ResponseTypes.Range> implements OnInit {
	public readonly QUESTION_TYPE_NAME: string = 'Range Question';

	@ViewChild('slider')
	private sliderElement: ElementRef;

	public sliderValue: BehaviorSubject<string>;

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(@Inject('SurveyViewerService') private surveyViewerService: SurveyViewer) {
		super();
		this.sliderValue = new BehaviorSubject<string>('');
	}

	public ngOnInit(): void {
		console.log(this.configuration);
		noUiSlider.create(this.sliderElement.nativeElement, {
			start: [0],
			step: parseInt(this.configuration['increment'], 10),
			range: {
				min: [parseInt(this.configuration['min'], 10)],
				max: [parseInt(this.configuration['max'], 10)]
			}
		});

		this.sliderElement.nativeElement.noUiSlider.on('update', this.sliderUpdate);
	}

	public sliderUpdate = (values, handle, unencoded, isTap, positions): void => {
		// this.sliderValue = values[0];
		this.sliderValue.next(new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'CAD' }).format(parseInt(values[0], 10)));
	};
}
