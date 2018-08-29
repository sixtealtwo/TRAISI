import { Routes, RouterModule } from '@angular/router';
import {SurveyBuilderComponent} from './survey-builder.component';


const routes: Routes = [
	{ path: ':id', component: SurveyBuilderComponent, data: { title: 'Survey Builder' } },
];

export const ROUTES = RouterModule.forChild(routes);
