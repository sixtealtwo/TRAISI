import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {
	SurveyQuestion,
	ResponseTypes,
	QuestionConfiguration,
	SurveyViewer,
	QuestionOption,
	ResponseValidationState,
	ResponseData,
	TraisiValues,
} from 'traisi-question-sdk';
import templateString from './video-module.component.html';
import styleString from './video-module.component.scss';
import { NgForm } from '@angular/forms';
import { debounceTime, skip } from 'rxjs/operators';
import { VideoModuelConfiguration } from './video-module.configuration';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
	selector: 'video-module',
	template: '' + templateString,
	styles: ['' + styleString],
})
export class VideoModuleComponent extends SurveyQuestion<ResponseTypes.Json> implements OnInit {
	data: QuestionConfiguration[];

	/**
	 *
	 * @param surveyViewerService
	 */
	constructor(
		private sanitizer:DomSanitizer
	) {
		super();
	}

	public configLink: string = "";
	public sanitizedLink;

	public ngOnInit(): void {
	}

	public model = {};

	// @ViewChild('matrixForm')
	// public form: NgForm;

	private onSavedResponseData: (response: ResponseData<ResponseTypes.Json>[] ) => void = (
		response: ResponseData<ResponseTypes.Json>[] 
	) => {

	};

	public onOptionsLoaded(options: QuestionOption[]): void {
		// this.options = options;
		for (let i of options) {
			if (i['name'] === 'Video Link') {
				this.configLink = i['label'];
				this.sanitizedLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.configLink);
			}
		}
	}

	/**
	 * @param {*} event
	 * @param {*} id
	 */
	
	public traisiOnInit(): void {
		this.validationState.emit(ResponseValidationState.VALID);
	}
}
