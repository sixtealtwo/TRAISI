import { Component, ViewEncapsulation, OnInit, OnDestroy, ViewChildren, AfterViewInit, QueryList, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, AlertDialog, DialogType, AlertMessage, MessageSeverity } from './services/alert.service';
import { NotificationService } from './services/notification.service';
import { AppTranslationService } from './services/app-translation.service';
import { AccountService } from './services/account.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { AppTitleService } from './services/app-title.service';
import { AuthService } from './services/auth.service';
import { ConfigurationService } from './services/configuration.service';
import { Permission } from './models/permission.model';

declare let alertify: any;

@Component({
	selector: 'app-root',
	template: `<router-outlet><ng2-toasty></ng2-toasty></router-outlet>`
})
export class AppComponent implements OnInit {
		isAppLoaded: boolean;
	isUserLoggedIn: boolean;

	appTitle = 'TRAISI';
	stickyToasties: number[] = [];

	constructor(storageManager: LocalStoreManager, private toastyService: ToastyService, private toastyConfig: ToastyConfig,
		private accountService: AccountService, private alertService: AlertService,
		private notificationService: NotificationService, private appTitleService: AppTitleService,
		private authService: AuthService, private translationService: AppTranslationService,
		public configurations: ConfigurationService, public router: Router) {

		storageManager.initialiseStorageSyncListener();

		translationService.addLanguages(['en', 'fr', 'de', 'pt', 'ar', 'ko']);
		translationService.setDefaultLanguage('en');


		this.toastyConfig.theme = 'bootstrap';
		this.toastyConfig.position = 'top-right';
		this.toastyConfig.limit = 100;
		this.toastyConfig.showClose = true;

		this.appTitleService.appName = this.appTitle;
	}

	ngOnInit() {
		this.isUserLoggedIn = this.authService.isLoggedIn;

		// 1 sec to ensure all the effort to get the css animation working is appreciated :|, Preboot screen is removed .5 sec later
		setTimeout(() => this.isAppLoaded = true, 1000);

		this.alertService.getDialogEvent().subscribe(alert => this.showDialog(alert));
		this.alertService.getMessageEvent().subscribe(message => this.showToast(message, false));
		this.alertService.getStickyMessageEvent().subscribe(message => this.showToast(message, true));

		setTimeout(() => {
			if (this.isUserLoggedIn) {
				this.alertService.resetStickyMessage();

				if (!this.authService.isSessionExpired) {
					this.alertService.showMessage('Login', `Welcome back ${this.userName}!`, MessageSeverity.default);
				} else {
					this.alertService.showStickyMessage('Session Expired', 'Your Session has expired. Please log in again', MessageSeverity.warn);
					this.authService.logout();
					this.authService.redirectLogoutUser();
				}
			}
		}, 2000);

		this.authService.reLoginDelegate = () => this.router.navigate(['/login']);

		this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
			this.isUserLoggedIn = isLoggedIn;

			setTimeout(() => {
				if (!this.isUserLoggedIn) {
					this.alertService.showMessage('Session Ended!', '', MessageSeverity.default);
				}
			}, 500);
		});

		this.router.events.subscribe(event => {
			if (event instanceof NavigationStart) {
				const url = (<NavigationStart>event).url;

				if (url !== url.toLowerCase()) {
					this.router.navigateByUrl((<NavigationStart>event).url.toLowerCase());
				}
			}
		});
	}

	showDialog(dialog: AlertDialog) {

		alertify.set({
			labels: {
				ok: dialog.okLabel || 'OK',
				cancel: dialog.cancelLabel || 'Cancel'
			}
		});

		switch (dialog.type) {
			case DialogType.alert:
				alertify.alert(dialog.message);
				break;
			case DialogType.confirm:
				alertify
					.confirm(dialog.message, (e) => {
						if (e) {
							dialog.okCallback();
						} else {
							if (dialog.cancelCallback) {
								dialog.cancelCallback();
							}
						}
					});

				break;
			case DialogType.prompt:
				alertify
					.prompt(dialog.message, (e, val) => {
						if (e) {
							dialog.okCallback(val);
						} else {
							if (dialog.cancelCallback) {
								dialog.cancelCallback();
							}
						}
					}, dialog.defaultValue);

				break;
		}
	}

	showToast(message: AlertMessage, isSticky: boolean) {

		if (message == null) {
			for (const id of this.stickyToasties.slice(0)) {
				this.toastyService.clear(id);
			}

			return;
		}

		const toastOptions: ToastOptions = {
			title: message.summary,
			msg: message.detail,
			timeout: isSticky ? 0 : 4000
		};


		if (isSticky) {
			toastOptions.onAdd = (toast: ToastData) => this.stickyToasties.push(toast.id);

			toastOptions.onRemove = (toast: ToastData) => {
				const index = this.stickyToasties.indexOf(toast.id, 0);

				if (index > -1) {
					this.stickyToasties.splice(index, 1);
				}

				toast.onAdd = null;
				toast.onRemove = null;
			};
		}


		switch (message.severity) {
			case MessageSeverity.default: this.toastyService.default(toastOptions); break;
			case MessageSeverity.info: this.toastyService.info(toastOptions); break;
			case MessageSeverity.success: this.toastyService.success(toastOptions); break;
			case MessageSeverity.error: this.toastyService.error(toastOptions); break;
			case MessageSeverity.warn: this.toastyService.warning(toastOptions); break;
			case MessageSeverity.wait: this.toastyService.wait(toastOptions); break;
		}
	}


	getYear() {
		return new Date().getUTCFullYear();
	}


	get userName(): string {
		return this.authService.currentUser ? this.authService.currentUser.userName : '';
	}

	get fullName(): string {
		return this.authService.currentUser ? this.authService.currentUser.fullName : '';
	}

	get canViewCustomers(): boolean {
		return this.accountService.userHasPermission(Permission.viewUsersPermission);
	}

	get canViewProducts(): boolean {
		return this.accountService.userHasPermission(Permission.viewUsersPermission);
	}

	get canViewOrders(): boolean {
		return true;
	}
}

