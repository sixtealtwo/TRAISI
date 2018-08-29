import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {AlertService} from '../../shared/services/alert.service';
import {AppRoutingModule} from './modules/routing/routing.module';
import {SurveyViewerContainerComponent} from './components/survey-viewer-container/survey-viewer-container.component';
import {SurveyViewerEndpointService} from './services/survey-viewer-endpoint.service';
import {SurveyErrorComponent} from './components/survey-error/survey-error.component';
import {SurveyStartPageComponent} from './components/survey-start-page/survey-start-page.component';
import {LocalStoreManager} from '../../shared/services/local-store-manager.service';
import {AppTranslationService} from '../../shared/services/app-translation.service';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateLanguageLoader} from '../../shared/services/app-translation.service';
import {EndpointFactory} from '../../shared/services/endpoint-factory.service';
import {ConfigurationService} from '../../shared/services/configuration.service';
import {QuestionLoaderEndpointService} from './services/question-loader-endpoint.service';
import {QuestionContainerComponent} from './components/question-container/question-container.component';
import {QuestionPlaceholderComponent} from './components/question-placeholder/question-placeholder.component';
import {SurveyHeaderDisplayComponent} from './components/survey-header-display/survey-header-display.component';
import {SurveyTermsPageComponent} from './components/survey-terms-page/survey-terms-page.component';
import {SurveyViewerComponent} from './components/survey-viewer/survey-viewer.component';
import {SurveyCompletePageComponent} from './components/survey-complete-page/survey-complete-page.component';


@NgModule({
	declarations: [
		AppComponent,
		SurveyViewerContainerComponent,
		SurveyErrorComponent,
		SurveyStartPageComponent,
		QuestionContainerComponent,
		QuestionPlaceholderComponent,
		SurveyHeaderDisplayComponent,
		SurveyTermsPageComponent,
		SurveyViewerComponent,
		SurveyCompletePageComponent

	],
	imports: [
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: TranslateLanguageLoader
			}
		}),
		AppRoutingModule


	],
	providers: [
		EndpointFactory,
		QuestionLoaderEndpointService,
		ConfigurationService,
		AppTranslationService,
		LocalStoreManager,
		SurveyViewerEndpointService,
		AlertService
	],
	bootstrap: [SurveyViewerContainerComponent]
})
export class AppModule {
}
