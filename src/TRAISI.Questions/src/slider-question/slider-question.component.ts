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
	QuestionOption,
	ResponseData,
	RangeResponseData,
	ResponseValidationState
} from 'traisi-question-sdk';
import templateString from './slider-question.component.html';
import noUiSlider from 'nouislider';
import 'nouislider/distribute/nouislider.css';
import { BehaviorSubject } from 'rxjs';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
@Component({
	selector: 'traisi-slider-question',
	template: templateString,
	styles: [require('./slider-question.component.scss').toString()]
})
export class SliderQuestionComponent extends SurveyQuestion<ResponseTypes.Decminal> implements OnInit {
	@ViewChild('slider', { static: true })
	private sliderElement: ElementRef;

	public sliderValue: BehaviorSubject<string>;

	private _isLoaded: boolean = false;

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

		this.savedResponse.subscribe(this.onSavedResponseData);
	}

	private onSavedResponseData: (response: ResponseData<ResponseTypes.Decminal>[] | 'none') => void = (
		response: ResponseData<ResponseTypes.Range>[] | 'none'
	) => {
		if (response !== 'none') {
			let rangeResponse = <RangeResponseData>response[0];

			console.log(rangeResponse);
			this.sliderValue.next(new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'CAD' }).format(rangeResponse['value']));

			this.sliderElement.nativeElement.noUiSlider.set(rangeResponse['value']);

			setTimeout(() => {
				this.sliderElement.nativeElement.noUiSlider.on('update', this.sliderUpdate);
			});
			// this.sliderElement.nativeElement.noUiSlider.on('update', this.sliderUpdate);
			this.validationState.emit(ResponseValidationState.VALID);
		} else {
		}
	};

	public sliderUpdate = (values, handle, unencoded, isTap, positions): void => {
		// this.sliderValue = values[0];

		let value = parseInt(values[0], 10);
		this.response.emit({ value: value });
		this.sliderValue.next(new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'CAD' }).format(value));
	};
}
