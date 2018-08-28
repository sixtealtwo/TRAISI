import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuestionContainerComponent} from "../components/question-container/question-container.component";
import {QuestionPlaceholderComponent} from "../components/question-placeholder/question-placeholder.component";
import {SurveyStartPageComponent} from "../components/survey-start-page/survey-start-page.component";
import {Survey} from "../../../admin-app/app/models/survey.model";
import {SurveyTermsPageComponent} from "../components/survey-terms-page/survey-terms-page.component";
import {SurveyViewerComponent} from "../components/survey-viewer/survey-viewer.component";
import {SurveyViewerContainerComponent} from "../components/survey-viewer-container/survey-viewer-container.component";
import {SurveyHeaderDisplayComponent} from "../components/survey-header-display/survey-header-display.component";
import {SurveyCompletePageComponent} from "../components/survey-complete-page/survey-complete-page.component";
import {SurveyErrorComponent} from "../components/survey-error/survey-error.component";
import {SurveyViewerService} from "../../../admin-app/app/survey-viewer/services/survey-viewer.service";
import {SurveyResponderService} from "../../../admin-app/app/survey-viewer/services/survey-responder.service";
import {FormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ROUTES} from "./core.routes";
import {RouterModule} from "@angular/router";
import {SurveyAuthGuard} from "../../../admin-app/app/survey-viewer/services/survey-auth-guard.service";
import {AlertService} from "../../../admin-app/app/services/alert.service";
import {ConfigurationService} from "../../../admin-app/app/services/configuration.service";
import {LocalStoreManager} from "../../../admin-app/app/services/local-store-manager.service";
import {EndpointFactory} from "../../../admin-app/app/services/endpoint-factory.service";
import {AuthService} from "../../../admin-app/app/services/auth.service";


@NgModule({
	imports: [
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
	],
	declarations: [
		QuestionContainerComponent,
		QuestionPlaceholderComponent,
		SurveyStartPageComponent,
		SurveyTermsPageComponent,
		SurveyViewerComponent,
		SurveyViewerContainerComponent,
		SurveyHeaderDisplayComponent,
		SurveyCompletePageComponent,
		SurveyErrorComponent
	],
	providers: [
		SurveyAuthGuard,
		LocalStoreManager,
		EndpointFactory,
		AlertService,
		AuthService,
		{provide: 'SurveyViewerService', useClass: SurveyViewerService},
		{provide: 'SurveyResponderService', useClass: SurveyResponderService}
	],
	exports: [RouterModule]

})
export class CoreModule {
}
