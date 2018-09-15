import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './modules/routing/routing.module';
import { SurveyViewerContainerComponent } from './components/survey-viewer-container/survey-viewer-container.component';
import { SurveyViewerEndpointService } from './services/survey-viewer-endpoint.service';
import { SurveyErrorComponent } from './components/survey-error/survey-error.component';
import { SurveyStartPageComponent } from './components/survey-start-page/survey-start-page.component';
import { AppTranslationService, TranslateLanguageLoader } from '../../shared/services/app-translation.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { EndpointFactory } from '../../shared/services/endpoint-factory.service';
import { QuestionLoaderEndpointService } from './services/question-loader-endpoint.service';
import { QuestionContainerComponent } from './components/question-container/question-container.component';
import { QuestionPlaceholderComponent } from './components/question-placeholder/question-placeholder.component';
import { SurveyHeaderDisplayComponent } from './components/survey-header-display/survey-header-display.component';
import { SurveyTermsPageComponent } from './components/survey-terms-page/survey-terms-page.component';
import { SurveyViewerComponent } from './components/survey-viewer/survey-viewer.component';
import { SurveyCompletePageComponent } from './components/survey-complete-page/survey-complete-page.component';
import { QuestionLoaderService } from './services/question-loader.service';
import { SurveyViewerService } from './services/survey-viewer.service';
import { SurveyResponderEndpointService } from './services/survey-responder-endpoint.service';
import { SurveyResponderService } from './services/survey-responder.service';
import 'jquery';
import { SafeHtmlPipe } from '../../shared/pipes/safe-html.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SurveyViewerTranslateLanguageLoader } from './services/survey-viewer-translation.service';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { LocalStoreManager } from '../../shared/services/local-store-manager.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
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
		SurveyCompletePageComponent,
		SafeHtmlPipe
	],
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: SurveyViewerTranslateLanguageLoader
			}
		}),
		AppRoutingModule.forRoot(),
		BsDatepickerModule.forRoot(),
		AlertModule.forRoot()
	],
	providers: [
		LocalStoreManager,
		EndpointFactory,
		QuestionLoaderEndpointService,
		AppTranslationService,
		{ provide: 'SurveyViewerService', useClass: SurveyViewerService },
		SurveyViewerEndpointService,
		ConfigurationService,
		QuestionLoaderService,
		SurveyResponderEndpointService,
		{ provide: 'SurveyResponderService', useClass: SurveyResponderService }
	],
	bootstrap: [SurveyViewerContainerComponent]
})
export class AppModule {}
