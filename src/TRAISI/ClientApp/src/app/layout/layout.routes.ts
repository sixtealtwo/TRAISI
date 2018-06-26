import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
const routes: Routes = [
	{
		path: '',
		component: LayoutComponent,
		children: [
			{ path: '', redirectTo: 'dashboard', pathMatch: 'full' },
			{
				path: 'dashboard',
				loadChildren: '../dashboard/dashboard.module#DashboardModule'
			},
			{
				path: 'account',
				loadChildren:
					'../account-management/account-management.module#AccountManagementModule'
			},
			{
				path: 'users',
				loadChildren:
					'../users-management/users-management.module#UsersManagementModule'
			},
			{
				path: 'surveys',
				loadChildren:
					'../surveys-management/surveys-management.module#SurveysManagementModule'
			},
			{
				path: 'groups',
				loadChildren:
					'../groups-management/groups-management.module#GroupsManagementModule'
			},
			{
				path: 'survey-builder/:id',
				loadChildren:
					'../survey-builder/survey-builder.module#SurveyBuilderModule'
			},
			{
				path: 'survey-viewer',
				loadChildren:
					'../survey-viewer/survey-viewer.module#SurveyViewerModule'
			},
		]
	}
];

export const ROUTES = RouterModule.forChild(routes);
