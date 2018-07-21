import { Routes, RouterModule } from '@angular/router';
import { SurveyViewerComponent } from './components/survey-viewer/survey-viewer.component';

const routes: Routes = [
	{
		path: 'survey/:survey',
		component: SurveyViewerComponent,
		loadChildren: './survey-viewer.module#SurveyViewerModule'
	}
];

export const ROUTES = RouterModule.forChild(routes);
