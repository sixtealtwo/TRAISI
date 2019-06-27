import {NgModule} from '@angular/core';
import {RouterModule, PreloadAllModules, Routes} from '@angular/router';
import {AuthService} from 'shared/services';
import {AuthGuard} from './services/auth-guard.service';
import {ErrorComponent} from './error/error.component';

const AppRoutes: Routes = [
	{
		path: '',
		redirectTo: 'app',
		pathMatch: 'full'
	},
	/*{
		path: 'app/survey-viewer',
		canActivate: [AuthGuard],
		loadChildren:
			'./survey-viewer/survey-viewer.module#SurveyViewerModule'
	},*/
	{
		path: 'app',
		canActivate: [AuthGuard],
		loadChildren: './layout/layout.module#LayoutModule'
	},
	{
		path: 'login',
		loadChildren: './login/login.module#LoginModule'
	},
	{
		path: 'error',
		component: ErrorComponent
	},
	{
		path: '**',
		component: ErrorComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(
			AppRoutes,
			{
				useHash: false,
				preloadingStrategy: PreloadAllModules
			}
		)
	],
	exports: [RouterModule],
	providers: [AuthService, AuthGuard]
})

export class AppRoutingModule {}
