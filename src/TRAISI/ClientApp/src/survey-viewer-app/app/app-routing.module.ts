import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import {AuthService} from "../../admin-app/app/services/auth.service";
import {AuthGuard} from "./services/survey-auth-guard.service";



@NgModule({
	imports: [
		RouterModule.forRoot(
			[
				{
					path: '',
					redirectTo: 'start',
					pathMatch: 'full'
				}
				]

		)
	],
	exports: [RouterModule],
	providers: [AuthService, AuthGuard]
})
export class AppRoutingModule {}
