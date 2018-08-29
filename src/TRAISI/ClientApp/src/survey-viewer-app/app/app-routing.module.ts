import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import {AuthGuard} from "../../admin-app/app/services/auth-guard.service";
import {SurveyViewerContainerComponent} from "./components/survey-viewer-container/survey-viewer-container.component";




@NgModule({
	imports: [
		RouterModule.forRoot(
			[
				{
					path: '',
					pathMatch: 'full',
					component: SurveyViewerContainerComponent
				}
				]

		)
	],
	exports: [RouterModule],
	providers: []
})
export class AppRoutingModule {}


