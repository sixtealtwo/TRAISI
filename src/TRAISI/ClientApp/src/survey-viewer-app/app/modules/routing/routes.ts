import {Route, RouterModule, Routes} from '@angular/router';
import {SurveyViewerContainerComponent} from "../../components/survey-viewer-container/survey-viewer-container.component";
import {AppComponent} from "../../app.component";
import {SurveyStartPageComponent} from "../../components/survey-start-page/survey-start-page.component";
import {SurveyErrorComponent} from "../../components/survey-error/survey-error.component";
import {ModuleWithProviders} from '@angular/core';
import {SurveyTermsPageComponent} from '../../components/survey-terms-page/survey-terms-page.component';
import {SurveyViewerComponent} from '../../components/survey-viewer/survey-viewer.component';

export const ROUTES: ModuleWithProviders<RouterModule> = RouterModule.forRoot([

	{
		path: 'error',
		component: SurveyErrorComponent

	},
	{
		path: ':surveyName',
		children: [
			{
				path: '',
				redirectTo: 'start',
				pathMatch: 'full'
			}, {

				path: 'error',
				component: SurveyErrorComponent,
				data: {title: 'Survey Not Found'}
			},
			{

				path: 'start',
				component: SurveyStartPageComponent,
				data: {title: 'Survey Start'}
			},
			{

				path: 'terms',
				component: SurveyTermsPageComponent,
				data: {title: 'Survey Terms and Conditions'}
			},
			{

				path: 'viewer',
				component: SurveyViewerComponent,
				data: {title: 'Survey Viewer'}
			}
		]

	}
]);
