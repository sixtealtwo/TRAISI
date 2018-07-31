import { Routes, RouterModule } from '@angular/router';
import { SurveyViewerComponent } from './components/survey-viewer/survey-viewer.component';
import {SurveyViewerContainerComponent} from "./components/survey-viewer-container/survey-viewer-container.component";

const routes: Routes = [
	{ path: 'survey/:surveyName', component: SurveyViewerContainerComponent, data: { title: 'Survey Viewer' } },

];

export const ROUTES = RouterModule.forChild(routes);
