import { Component, OnInit, ViewChild, ViewContainerRef, Inject, ViewEncapsulation, ElementRef } from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyStart } from '../../models/survey-start.model';
import { User } from 'shared/models/user.model';
import { AlertComponent } from 'ngx-bootstrap/alert';
import { TranslateService } from '@ngx-translate/core';
import { SurveyViewThankYouModel } from '../../models/survey-view-thankyou.model';
import { flatMap } from 'rxjs/operators';
import { SurveyViewType } from '../../models/survey-view-type.enum';

@Component({
	selector: 'traisi-survey-thankyou-page',
	templateUrl: './survey-thankyou-page.component.html',
	styleUrls: ['./survey-thankyou-page.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class SurveyThankYouPageComponent implements OnInit {

	private surveyId: number;

	public model: SurveyViewThankYouModel;

	public finishedLoading: boolean = false;
	public pageThemeInfo: any = {};

	constructor(
		@Inject('SurveyViewerService') private surveyViewerService: SurveyViewerService,
		private translate: TranslateService
	) {}

	public ngOnInit(): void {
		this.surveyViewerService.activeSurveyId
			.pipe(
				flatMap((id) => {
					this.surveyId = id;
					return this.surveyViewerService.getSurveyViewerThankYou(this.surveyId, SurveyViewType.RespondentView, 'en');
				})
			)
			.pipe(
				flatMap((terms) => {
					this.model = terms;
					return this.surveyViewerService.pageThemeInfoJson;
				})
			)
			.subscribe((value) => {
				this.pageThemeInfo = value;
				this.finishedLoading = true;
			});
	}

}
