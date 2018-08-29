import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import routes from "./routes";
import {SurveyErrorComponent} from "../../components/survey-error/survey-error.component";
import {AuthService} from "../../../../shared/services/auth.service";
import {SurveyStartPageComponent} from "../../components/survey-start-page/survey-start-page.component";

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forRoot(
			[

				{
					path: 'error',
					component: SurveyErrorComponent

				},
				{
					path: ':surveyName',
					children: [
						{
							path: '',
							redirectTo: 'start',
							pathMatch: 'full'
						}, {

							path: 'error',
							component: SurveyErrorComponent
						},
						{

							path: 'start',
							component: SurveyStartPageComponent
						}
					]

				}
			]),
	],
	declarations: [],
	providers: [AuthService],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
