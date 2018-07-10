/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from '../../app.component';
import { LoginComponent } from '../../login/login.component';

import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastyModule } from 'ng2-toasty';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { AuthService } from '../../services/auth.service';
import { AppTitleService } from '../../services/app-title.service';
import { AppTranslationService, TranslateLanguageLoader } from '../../services/app-translation.service';
import { ConfigurationService } from '../../services/configuration.service';
import { AlertService } from '../../services/alert.service';
import { LocalStoreManager } from '../../services/local-store-manager.service';
import { EndpointFactory } from '../../services/endpoint-factory.service';
import { NotificationService } from '../../services/notification.service';
import { NotificationEndpoint } from '../../services/notification-endpoint.service';
import { AccountService } from '../../services/account.service';
import { AccountEndpoint } from '../../services/account-endpoint.service';
import { UserInfoComponent } from './user-info.component';


describe('UserInfoComponent', () => {
	let component: UserInfoComponent;
	let fixture: ComponentFixture<UserInfoComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
                HttpClientModule,
                FormsModule,
                RouterTestingModule,
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
                ModalModule.forRoot()
            ],
		declarations: [ UserInfoComponent ],
		providers: [                AuthService,
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
			TranslatePipe]
		},)
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserInfoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
