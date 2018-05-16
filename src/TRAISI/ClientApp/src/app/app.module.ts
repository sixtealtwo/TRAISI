import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastyModule } from 'ng2-toasty';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppTitleService } from './services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from './services/app-translation.service';
import { ConfigurationService } from './services/configuration.service';
import { AlertService } from './services/alert.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { EndpointFactory } from './services/endpoint-factory.service';
import { NotificationService } from './services/notification.service';
import { NotificationEndpoint } from './services/notification-endpoint.service';
import { AccountService } from './services/account.service';
import { AccountEndpoint } from './services/account-endpoint.service';

import { EqualValidator } from './directives/equal-validator.directive';
import { LastElementDirective } from './directives/last-element.directive';
import { AutofocusDirective } from './directives/autofocus.directive';
import { BootstrapTabDirective } from './directives/bootstrap-tab.directive';
import { BootstrapToggleDirective } from './directives/bootstrap-toggle.directive';

import { BootstrapDatepickerDirective } from './directives/bootstrap-datepicker.directive';

import { AppComponent } from './app.component';
import { AppConfig } from './app.config';
import { ErrorComponent } from './error/error.component';
import {SharedModule} from './shared/shared.module';

const APP_PROVIDERS = [
	AppConfig
];

@NgModule({
	bootstrap: [AppComponent],
	declarations: [
		AppComponent,
		ErrorComponent,
		EqualValidator,
		LastElementDirective,
		AutofocusDirective,
		BootstrapTabDirective,
		BootstrapToggleDirective,
		BootstrapDatepickerDirective

	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
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
		ToastyModule.forRoot(),
		TooltipModule.forRoot(),
		PopoverModule.forRoot(),
		CarouselModule.forRoot(),
		ModalModule.forRoot(),
		ChartsModule
		],
	providers: [
		APP_PROVIDERS,
		AlertService,
		ConfigurationService,
		AppTitleService,
		AppTranslationService,
		NotificationService,
		NotificationEndpoint,
		AccountService,
		AccountEndpoint,
		LocalStoreManager,
		EndpointFactory,
		TranslatePipe
	]
})
export class AppModule {}
