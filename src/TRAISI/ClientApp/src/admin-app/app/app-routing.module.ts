import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';

import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { ErrorComponent } from './error/error.component';

@NgModule({
	imports: [
		RouterModule.forRoot(
			[
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
					path: 'survey',
					loadChildren: './survey-viewer/survey-viewer.module#SurveyViewerModule'
				},
				{
					path: 'error',
					component: ErrorComponent
				},
				{
					path: '**',
					component: ErrorComponent
				}
			],
			{
				useHash: false,
				preloadingStrategy: NoPreloading
			}
		)
	],
	exports: [RouterModule],
	providers: [AuthService, AuthGuard]
})
export class AppRoutingModule {}
