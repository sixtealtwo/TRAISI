import {Component, ComponentFactoryResolver, OnInit, ViewEncapsulation, Inject} from '@angular/core';
import {SurveyViewerService} from '../../services/survey-viewer.service';
import {QuestionLoaderService} from '../../services/question-loader.service';
import {
	ActivatedRoute,
	ActivatedRouteSnapshot,
	ActivationEnd,
	NavigationEnd,
	Router,
	RouterEvent,
	RouterStateSnapshot
} from '@angular/router';
import {SurveyErrorComponent} from '../survey-error/survey-error.component';
import {SurveyStartPageComponent} from '../survey-start-page/survey-start-page.component';

import {Title} from '@angular/platform-browser';

@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'app-survey-viewer-container',
	templateUrl: './survey-viewer-container.component.html',
	styleUrls: ['./survey-viewer-container.component.scss'],
	entryComponents: [SurveyErrorComponent, SurveyStartPageComponent]
})
export class SurveyViewerContainerComponent implements OnInit {
	private surveyName: string;

	/**
	 *
	 * @param surveyViewerService
	 * @param questionLoaderService
	 * @param route
	 * @param componentFactoryResolver
	 */
	constructor(
		@Inject('SurveyViewerService')private surveyViewerService: SurveyViewerService,
		private questionLoaderService: QuestionLoaderService,
		private route: ActivatedRoute,
		private componentFactoryResolver: ComponentFactoryResolver,
		private titleService: Title,
		private router: Router
	) {



	}

	/**
	 *
	 */
	ngOnInit() {
		this.router.events.subscribe((event: RouterEvent) => {

			if (event instanceof ActivationEnd) {
				let snapshot: ActivatedRouteSnapshot = (<ActivationEnd>event).snapshot;
				if (snapshot.data.hasOwnProperty('title')) {
					this.titleService.setTitle('TRAISI - ' + snapshot.data.title);
				}
			}

		}, error => {

		});

	}
}
