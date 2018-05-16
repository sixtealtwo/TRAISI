import { Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';

export const ROUTES: Routes = [{
	path: '', redirectTo: 'login', pathMatch: 'full'
	},

	{
		path: 'app',   loadChildren: './layout/layout.module#LayoutModule'
	},
	{
		path: 'login', loadChildren: './login/login.module#LoginModule', data: { title: 'TRAISI - Login' }
	},
	{
		path: 'error', component: ErrorComponent
	},
	{
		path: '**',    component: ErrorComponent
	}
];
