import { Routes, RouterModule } from '@angular/router';
import { SurveyExecuteComponent } from './survey-execute.component';
import { TestSurveyComponent } from './test-survey/test-survey.component';
import { LiveSurveyComponent } from './live-survey/live-survey.component';


const routes: Routes = [
	{ path: ':id', component: SurveyExecuteComponent, data: { title: 'Execute Survey' } },
	{ path: ':id/test', component: TestSurveyComponent, data: { title: 'Execute Test Survey' } },
	{ path: ':id/live', component: LiveSurveyComponent, data: { title: 'Execute Live Survey' } }
];

export const ROUTES = RouterModule.forChild(routes);
