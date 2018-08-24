import {Routes, RouterModule} from '@angular/router';
import {SurveyViewerComponent} from './components/survey-viewer/survey-viewer.component';
import {SurveyViewerContainerComponent} from './components/survey-viewer-container/survey-viewer-container.component';
import {SurveyStartPageComponent} from './components/survey-start-page/survey-start-page.component';
import {SurveyTermsPageComponent} from './components/survey-terms-page/survey-terms-page.component';
import {SurveyErrorComponent} from './components/survey-error/survey-error.component';
import {AuthGuard} from "../services/auth-guard.service";

const routes: Routes = [
	{
		path: ':surveyName',
		component: SurveyViewerContainerComponent,
		data: {title: 'Survey Viewer'},
		children: [
			{path: '', redirectTo: 'start', pathMatch: 'full'},
			{path: 'start', component: SurveyStartPageComponent},
			{path: 'terms', component: SurveyTermsPageComponent, canActivate: [AuthGuard]},
			{path: 'viewer', redirectTo: 'viewer/1', pathMatch: 'full', canActivate: [AuthGuard],},
			{path: 'error', component: SurveyErrorComponent},
			{path: ':page', component: SurveyViewerComponent, canActivate: [AuthGuard],},
			{path: 'viewer/:viewId', component: SurveyViewerComponent, canActivate: [AuthGuard],}
		]
	}
];

export const ROUTES = RouterModule.forChild(routes);
