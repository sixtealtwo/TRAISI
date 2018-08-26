import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
	TranslateModule,
	TranslateLoader,
	TranslatePipe
} from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastyModule } from 'ng2-toasty';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { ButtonsModule } from 'ngx-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import {
	AppTranslationService,
	TranslateLanguageLoader
} from './services/app-translation.service';

import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';

import { EqualValidator } from './directives/equal-validator.directive';
import { LastElementDirective } from './directives/last-element.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { BootstrapSelectDirective } from './directives/bootstrap-select.directive';
import { BootstrapDatepickerDirective } from './directives/bootstrap-datepicker.directive';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { ErrorComponent } from './error/error.component';
import { SharedModule } from './shared/shared.module';
import { TitleCasePipe } from '@angular/common';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SurveyViewerModule } from './survey-viewer/survey-viewer.module';

const monacoConfig: NgxMonacoEditorConfig = {
	baseUrl: './assets', // configure base path for monaco editor
	defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
	onMonacoLoad: () => {
		console.log((<any>window).monaco);
	} // here monaco object will be available as window.monaco use this function to extend monaco editor functionality.
};

const APP_PROVIDERS = [AppConfig];

@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		AppComponent,
		ErrorComponent,
		EqualValidator,
		LastElementDirective,
		AutofocusDirective,
		BootstrapTabDirective,
		BootstrapDatepickerDirective,
		BootstrapSelectDirective
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		//SurveyViewerModule,
		AppRoutingModule,
		HttpClientModule,
		SharedModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useClass: TranslateLanguageLoader
			}
		}),
		NgxDatatableModule,
		FroalaEditorModule.forRoot(),
		FroalaViewModule.forRoot(),
		ToastyModule.forRoot(),
		TooltipModule.forRoot(),
		PopoverModule.forRoot(),
		CarouselModule.forRoot(),
		ButtonsModule.forRoot(),
		ModalModule.forRoot(),
		MonacoEditorModule.forRoot(monacoConfig)
	],
	providers: [
		APP_PROVIDERS,
		AppTranslationService,
		LocalStoreManager,
		EndpointFactory,
		TranslatePipe,
		TitleCasePipe
	]
})
export class AppModule {}
