import { Component, ComponentFactoryResolver, OnInit, ViewEncapsulation, Inject, TemplateRef } from '@angular/core';
import { SurveyViewerService } from '../../services/survey-viewer.service';
import { QuestionLoaderService } from '../../services/question-loader.service';
import { SurveyErrorComponent } from '../survey-error/survey-error.component';
import { SurveyStartPageComponent } from '../survey-start-page/survey-start-page.component';
import { SurveyNavigator } from 'app/modules/survey-navigation/services/survey-navigator/survey-navigator.service';
import { SurveyViewerStateService } from 'app/services/survey-viewer-state.service';
import { SurveyViewerState } from 'app/models/survey-viewer-state.model';
@Component({
	encapsulation: ViewEncapsulation.None,
	selector: 'traisi-survey-navigator',
	templateUrl: './survey-navigator.component.html',
	styleUrls: ['./survey-navigator.component.scss'],
	entryComponents: [SurveyErrorComponent, SurveyStartPageComponent],
})
export class SurveyNavigatorComponent implements OnInit {
	public get viewerState(): SurveyViewerState {
		return this._viewerStateService.viewerState;
	}

	public constructor(public navigator: SurveyNavigator, private _viewerStateService: SurveyViewerStateService) {}

	public ngOnInit(): void {
	}

	public navigateNext(): void {
		this.navigator.navigateNext().subscribe((state) => {});
	}

	public navigatePrevious(): void {
		this.navigator.navigatePrevious().subscribe((state) => {});
	}
}
