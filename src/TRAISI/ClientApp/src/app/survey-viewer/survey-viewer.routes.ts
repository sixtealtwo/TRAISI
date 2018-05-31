import { Routes, RouterModule } from '@angular/router';
import {SurveyViewerComponent} from './components/survey-viewer.component';


const routes: Routes = [
	{ path: '', component: SurveyViewerComponent, data: { title: 'Survey Viewer' } },
];

export const ROUTES = RouterModule.forChild(routes);
