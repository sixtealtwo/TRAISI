import 'jquery-slimscroll';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ROUTES } from './layout.routes';

import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ChatSidebarComponent } from './chat-sidebar/chat-sidebar.component';
import { ChatMessageComponent } from './chat-sidebar/chat-message/chat-message.component';
import { SearchPipe } from './pipes/search.pipe';
import { TranslateLanguageLoader } from '../../../shared/services/app-translation.service';
import { ChatAppComponent } from '../chat-app/chat-app.component';

@NgModule({
	imports: [
		CommonModule,
		TooltipModule.forRoot(),
		BsDropdownModule.forRoot(),
		ModalModule.forRoot(),
		ROUTES,
		FormsModule,
		LoadingBarRouterModule,
		TranslateModule.forChild({
		loader: {provide: TranslateLoader, useClass: TranslateLanguageLoader}
		})
	],
	declarations: [
		LayoutComponent,
		SidebarComponent,
		NavbarComponent,
		ChatSidebarComponent,
		SearchPipe,
		ChatMessageComponent,
		ChatAppComponent
	]
})
export class LayoutModule {
}
