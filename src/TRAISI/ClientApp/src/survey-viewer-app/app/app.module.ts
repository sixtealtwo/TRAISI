import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { SurveyViewerEndpointFactory } from './services/survey-viewer-endpoint-factory.service';
import { AppRoutingModule } from './modules/routing/routing.module';
import { SurveyViewerContainerComponent } from './components/survey-viewer-container/survey-viewer-container.component';
import { SurveyViewerEndpointService } from './services/survey-viewer-endpoint.service';
import { SurveyErrorComponent } from './components/survey-error/survey-error.component';
import { SurveyStartPageComponent } from './components/survey-start-page/survey-start-page.component';
import { AppTranslationService, TranslateLanguageLoader } from '../../shared/services/app-translation.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
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
import { SafeHtmlPipe } from 'shared/pipes/safe-html.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SurveyViewerTranslateLanguageLoader } from './services/survey-viewer-translation.service';
import { ConfigurationService } from '../../shared/services/configuration.service';
import { LocalStoreManager } from '../../shared/services/local-store-manager.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ModalModule, ModalBackdropComponent } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { DynamicModule } from 'ng-dynamic-component';
import { SpecialPageBuilderComponent } from './components/special-page-builder/special-page-builder.component';
import { Header1Component } from './components/special-page-builder/header1/header1.component';
import { Header2Component } from './components/special-page-builder/header2/header2.component';
import { MainSurveyAccess1Component } from './components/special-page-builder/main-survey-access1/main-survey-access1.component';
import { TextBlock1Component } from './components/special-page-builder/text-block1/text-block1.component';
import { Footer1Component } from './components/special-page-builder/footer1/footer1.component';
import { PrivacyConfirmationComponent } from './components/special-page-builder/privacy-confirmation/privacy-confirmation.component';
import { SafePipe } from 'shared/pipes/safe.pipe';
import { SurveyViewerStateService } from './services/survey-viewer-state.service';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SurveyViewerConditionalEvaluator } from './services/survey-viewer-conditional-evaluator.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import { AdminToolbarComponent } from './components/admin-toolbar/admin-toolbar.component';
import { SurveyThankYouPageComponent } from './components/survey-thankyou-page/survey-thankyou-page.component';
import { SurveyQuestionViewDirective } from 'traisi-question-sdk';
import { SurveyQuestionInternalViewDirective } from 'traisi-question-sdk';
import { SurveyGroupStartPageComponent } from './components/survey-group-start-page/survey-group-start-page.component';
import { SurveyScreeningPageComponent } from './components/survey-screening-page/survey-screening-page.component';


@NgModule({
	entryComponents: [ModalBackdropComponent],
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
		SafeHtmlPipe,
		SafePipe,
		SpecialPageBuilderComponent,
		PrivacyConfirmationComponent,
		Header1Component,
		Header2Component,
		SurveyScreeningPageComponent,
		MainSurveyAccess1Component,
		TextBlock1Component,
		AdminToolbarComponent,
		SurveyThankYouPageComponent,
		SurveyQuestionViewDirective,
		SurveyGroupStartPageComponent,
		SurveyQuestionInternalViewDirective,
		Footer1Component
	],
	imports: [
		BrowserModule,
		CommonModule,
		RouterModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		ModalModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: SurveyViewerTranslateLanguageLoader
			}
		}),
		AppRoutingModule.forRoot(),
		BsDatepickerModule.forRoot(),
		AlertModule.forRoot(),
		PopoverModule.forRoot(),
		QuillModule,
		DynamicModule.withComponents([
			Header1Component,
			Header2Component,
			MainSurveyAccess1Component,
			TextBlock1Component,
			Footer1Component
		]),
		TooltipModule.forRoot(),
		TimepickerModule.forRoot()
	],
	providers: [
		LocalStoreManager,
		SurveyViewerEndpointFactory,
		QuestionLoaderEndpointService,
		AppTranslationService,
		{ provide: 'SurveyViewerService', useClass: SurveyViewerService },
		SurveyViewerEndpointService,
		ConfigurationService,
		QuestionLoaderService,
		SurveyViewerConditionalEvaluator,
		{ provide: 'SurveyResponderService', useClass: SurveyResponderService },
		SurveyViewerStateService,
		SurveyResponderEndpointService,

		{ provide: 'QuestionLoaderService', useClass: QuestionLoaderService }
	],
	bootstrap: [SurveyViewerContainerComponent]
})
export class AppModule {}
