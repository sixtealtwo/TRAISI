import { Routes, RouterModule } from '@angular/router';
import { SurveyViewerComponent } from './components/survey-viewer/survey-viewer.component';
import {SurveyViewerContainerComponent} from "./components/survey-viewer-container/survey-viewer-container.component";
import {SurveyStartPageComponent} from "./components/survey-start-page/survey-start-page.component";
import {SurveyTermsPageComponent} from "./components/survey-terms-page/survey-terms-page.component";
import {SurveyErrorComponent} from "./components/survey-error/survey-error.component";

const routes: Routes = [
	{ path: 'survey/:surveyName', component: SurveyViewerContainerComponent, data: { title: 'Survey Viewer' },
		children: [
			{ path: '', redirectTo: 'start', pathMatch: 'full' },
			{ path: 'start', component: SurveyStartPageComponent },
			{ path: 'terms', component: SurveyTermsPageComponent },
			{ path: 'error', component: SurveyErrorComponent },
			{ path: ':viewId', component: SurveyViewerComponent },
			]
	},

];

export const ROUTES = RouterModule.forChild(routes);
