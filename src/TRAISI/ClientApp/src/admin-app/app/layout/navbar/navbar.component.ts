import { Component, EventEmitter, OnInit, ElementRef, Input, Output, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AppConfig } from '../../app.config';
import { AppTranslationService } from '../../../../shared/services/app-translation.service';
import { ConfigurationService } from '../../../../shared/services/configuration.service';
import { Location, HashLocationStrategy } from '@angular/common';
import { Permission } from '../../../../shared/models/permission.model';
import { AccountService } from '../../services/account.service';
declare let jQuery: JQueryStatic;

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.template.html',
	styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit {
	@Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
	@Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
	@Output() logoutEvent: EventEmitter<any> = new EventEmitter();

	@Input() userName: string;
	@Input() onBuilder: boolean = false;
	$el: any;
	config: any;

	constructor(
		el: ElementRef,
		config: AppConfig,
		private router: Router,
		private accountService: AccountService,
		private translationService: AppTranslationService,
		public configurations: ConfigurationService,
		private location: Location
	) {
		this.$el = jQuery(el.nativeElement);
		this.config = config.getConfig();
	}

	toggleSidebar(state): void {
		this.toggleSidebarEvent.emit(state);
	}

	toggleChat(): void {
		this.toggleChatEvent.emit(null);
	}

	logout(): void {
		this.logoutEvent.emit();
	}

	refreshPage() {
		this.router.navigate([this.router.url]);
	}

	goBackPage() {
		this.location.back();
	}

	ngOnInit(): void {
		setTimeout(() => {
			const $chatNotification = jQuery('#chat-notification');
			$chatNotification
				.removeClass('hide')
				.addClass('animated fadeIn')
				.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
					$chatNotification.removeClass('animated fadeIn');
					setTimeout(() => {
						$chatNotification
							.addClass('animated fadeOut')
							.one(
								'webkitAnimationEnd mozAnimationEnd MSAnimationEnd' + ' oanimationend animationend',
								() => {
									$chatNotification.addClass('hide');
								}
							);
					}, 8000);
				});
			$chatNotification
				.siblings('#toggle-chat')
				.append('<i class="chat-notification-sing animated bounceIn"></i>');
		}, 4000);

		this.$el.find('.input-group-addon + .form-control').on('blur focus', function(e): void {
			jQuery(this)
				.parents('.input-group')
				[e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
		});

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.changeActiveNavigationItem(this.location);
			}
		});
	}

	ngAfterViewInit(): void {
		this.changeActiveNavigationItem(this.location);
	}

	changeActiveNavigationItem(location): void {
		let $newActiveLink;
		if (location._platformStrategy instanceof HashLocationStrategy) {
			$newActiveLink = this.$el.find('a[href="#' + location._baseHref + location.path().split('?')[0] + '"]');
		} else {
			$newActiveLink = this.$el.find('a[href="' + location._baseHref + location.path().split('?')[0] + '"]');
		}

		// collapse .collapse only if new and old active links belong to different .collapse
		if (!$newActiveLink.is('.active > .collapse > li > a')) {
			this.$el
				.find('.active .active')
				.closest('.collapse')
				.collapse('hide');
		}
		this.$el.find('.sidebar-nav .active').removeClass('active');

		$newActiveLink
			.closest('li')
			.addClass('active')
			.parents('li')
			.addClass('active');

		// uncollapse parent
		$newActiveLink
			.closest('.collapse')
			.addClass('in')
			.css('height', '')
			.siblings('a[data-toggle=collapse]')
			.removeClass('collapsed');
	}

	get canManageUsers() {
		return this.accountService.userHasPermission(Permission.manageUsersPermission);
	}

	get canViewRoles() {
		return this.accountService.userHasPermission(Permission.viewRolesPermission);
	}

	get canManageGroupUsers() {
		return this.accountService.userHasPermission(Permission.manageGroupUsersPermission);
	}
}
