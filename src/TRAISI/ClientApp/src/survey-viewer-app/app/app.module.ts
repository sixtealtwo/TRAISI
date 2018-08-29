import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {AlertService} from "../../shared/services/alert.service";
import {AppRoutingModule} from "./modules/routing/routing.module";
import {RouterModule} from "@angular/router";
import {SurveyViewerContainerComponent} from "./components/survey-viewer-container/survey-viewer-container.component";
import {CoreModule} from "./modules/core/core.module";
import {SurveyViewerService} from "./services/survey-viewer.service";
import {AuthService} from "../../shared/services/auth.service";
import {SurveyViewerEndpointService} from "./services/survey-viewer-endpoint.service";
import {SurveyErrorComponent} from "./components/survey-error/survey-error.component";


@NgModule({
	declarations: [
		AppComponent,
		SurveyErrorComponent

	],
	imports: [
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		RouterModule.forRoot(
			[
				{
					path: '',
					redirectTo: 'test',
					pathMatch: 'full'
				},
				{
					path: 'test',
					component: SurveyErrorComponent
				}
			]),

	],
	providers: [

		AlertService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
