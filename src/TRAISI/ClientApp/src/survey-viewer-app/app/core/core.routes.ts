import {Routes, RouterModule} from '@angular/router';
import {SurveyViewerComponent} from '../components/survey-viewer/survey-viewer.component';
import {SurveyViewerContainerComponent} from '../components/survey-viewer-container/survey-viewer-container.component';
import {SurveyStartPageComponent} from '../components/survey-start-page/survey-start-page.component';
import {SurveyTermsPageComponent} from '../components/survey-terms-page/survey-terms-page.component';
import {SurveyErrorComponent} from '../components/survey-error/survey-error.component';
import {SurveyAuthGuard} from "../../../admin-app/app/survey-viewer/services/survey-auth-guard.service";

const routes: Routes = [
	{
		path: ':surveyName',
		component: SurveyViewerContainerComponent,
		data: {title: 'Survey Viewer'},
		children: [
			{path: '', redirectTo: 'start', pathMatch: 'full'},
			{path: 'start', component: SurveyStartPageComponent},
			{path: 'terms', component: SurveyTermsPageComponent, canActivate: [SurveyAuthGuard]},
			{path: 'viewer', redirectTo: 'viewer/1', pathMatch: 'full', canActivate: [SurveyAuthGuard],},
			{path: 'error', component: SurveyErrorComponent},
			{path: ':page', component: SurveyViewerComponent, canActivate: [SurveyAuthGuard],},
			{path: 'viewer/:viewId', component: SurveyViewerComponent, canActivate: [SurveyAuthGuard],}
		]
	}
];

export const ROUTES = routes;

