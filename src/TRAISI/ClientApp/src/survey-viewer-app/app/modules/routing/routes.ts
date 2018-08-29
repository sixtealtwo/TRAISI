import {Route, RouterModule, Routes} from '@angular/router';
import {SurveyViewerContainerComponent} from "../../components/survey-viewer-container/survey-viewer-container.component";
import {AppComponent} from "../../app.component";
import {SurveyStartPageComponent} from "../../components/survey-start-page/survey-start-page.component";
import {SurveyErrorComponent} from "../../components/survey-error/survey-error.component";
import {ModuleWithProviders} from '@angular/core';

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
				component: SurveyErrorComponent
			},
			{

				path: 'start',
				component: SurveyStartPageComponent
			}
		]

	}
]);
