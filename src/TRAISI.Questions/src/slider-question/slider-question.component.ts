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
import templateString from './slider-question.component.html';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import { BehaviorSubject } from 'rxjs';
@Component({
	selector: 'traisi-slider-question',
	template: templateString,
	styles: [require('./slider-question.component.scss').toString()]
})
export class SliderQuestionComponent extends SurveyQuestion<ResponseTypes.Decminal> implements OnInit {

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
		noUiSlider.create(this.sliderElement.nativeElement, {
			start: [0],
			step: parseInt(this.configuration['step'], 10),
			range: {
				min: [parseInt(this.configuration['min'], 10)],
				max: [parseInt(this.configuration['max'], 10)]
			}
		});

		this.sliderElement.nativeElement.noUiSlider.on('update', this.sliderUpdate);
	}

	public sliderUpdate = (values, handle, unencoded, isTap, positions): void => {
		// format slider value to currency
		this.sliderValue.next(new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'CAD' }).format(parseInt(values[0], 10)));
	};
}
