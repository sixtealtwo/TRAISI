import { Component, OnInit, ViewChild, ViewContainerRef, Inject, ViewEncapsulation, ElementRef } from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyStart } from '../../models/survey-start.model';
import { User } from 'shared/models/user.model';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { TranslateService } from '@ngx-translate/core';
import { SurveyViewScreening } from 'app/models/survey-view-screening.model';
import { NgForm, FormGroup, FormControl } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';

/**
 *
 *
 * @export
 * @class SurveyScreeningPageComponent
 * @implements {OnInit}
 */
@Component({
	selector: 'survey-screening-page',
	templateUrl: './survey-screening-page.component.html',
	styleUrls: ['./survey-screening-page.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SurveyScreeningPageComponent implements OnInit {
	public screeningQuestions: SurveyViewScreening;

	public isFinishedLoading: boolean = false;

	public formModel: any = {};

	@ViewChild('screeningForm')
	public formGroup: NgForm;

	public screeningFormGroup: FormGroup;

	private _surveyName: string;

	/**
	 *Creates an instance of SurveyScreeningPageComponent.
	 * @param {SurveyViewerService} _surveyViewerService
	 * @param {ActivatedRoute} _route
	 * @param {Router} _router
	 * @param {TranslateService} _translate
	 * @param {ElementRef} _elementRef
	 * @memberof SurveyScreeningPageComponent
	 */
	public constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _translate: TranslateService,
		private _elementRef: ElementRef
	) {}

	/**
	 *
	 *
	 * @memberof SurveyScreeningPageComponent
	 */
	public ngOnInit(): void {
		this._surveyViewerService.screeningQuestionsModel.subscribe(model => {
			this.screeningQuestions = model;
			this.isFinishedLoading = true;

			this.screeningFormGroup = new FormGroup({});

			for (let i = 0; i < model.questionsList.length; i++) {
				this.screeningFormGroup.addControl('' + i, new FormControl(''));
			}
		});

		this._route.parent.params.subscribe(params => {
			this._surveyName = params['surveyName'];
		});
	}

	/**
	 *
	 *
	 * @memberof SurveyScreeningPageComponent
	 */
	public onSubmitScreeningQuestions(): void {
		console.log(this.formGroup);
		if (this.formGroup.submitted && this.formGroup.valid) {
			this._router.navigate([this._surveyName, 'viewer']);

		}
	}

}
