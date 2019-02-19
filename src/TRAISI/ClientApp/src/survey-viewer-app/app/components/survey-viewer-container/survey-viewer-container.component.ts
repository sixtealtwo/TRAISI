import { Component, ComponentFactoryResolver, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { QuestionLoaderService } from '../../services/question-loader.service';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	ActivationEnd,
	NavigationEnd,
	Router,
	RouterEvent,
	RouterStateSnapshot
} from '@angular/router';
import { SurveyErrorComponent } from '../survey-error/survey-error.component';
import { SurveyStartPageComponent } from '../survey-start-page/survey-start-page.component';

import { Title } from '@angular/platform-browser';
import { SurveyUser } from 'shared/models/survey-user.model';

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'app-survey-viewer-container',
	templateUrl: './survey-viewer-container.component.html',
	styleUrls: ['./survey-viewer-container.component.scss'],
	entryComponents: [SurveyErrorComponent, SurveyStartPageComponent]
})
export class SurveyViewerContainerComponent implements OnInit {
	private surveyName: string;

	public hasGeneratedShortcode: boolean;

	/**
	 * Creates an instance of survey viewer container component.
	 * @param _surveyViewerService
	 * @param _titleService
	 * @param _router
	 */
	constructor(
		@Inject('SurveyViewerService') private _surveyViewerService: SurveyViewerService,
		private _titleService: Title,
		private _router: Router
	) {
		this.hasGeneratedShortcode = false;
	}

	/**
	 *
	 */
	public ngOnInit(): void {
		this._router.events.subscribe(
			(event: RouterEvent) => {
				if (event instanceof ActivationEnd) {
					let snapshot: ActivatedRouteSnapshot = (<ActivationEnd>event).snapshot;
					if (snapshot.data.hasOwnProperty('title')) {
						this._titleService.setTitle('TRAISI - ' + snapshot.data.title);
					}
				}
			},
			(error) => {}
		);
	}
}
