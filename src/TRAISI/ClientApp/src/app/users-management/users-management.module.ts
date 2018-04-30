import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TranslateLanguageLoader } from '../services/app-translation.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Select2Module } from 'ng2-select2';
import { SearchBoxComponent } from '../components/search-box/search-box.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccountManagementModule } from '../account-management/account-management.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ROUTES } from './users-management.routes';

import { UsersManagementComponent } from './users-management/users-management.component';
import { RolesManagementComponent } from './roles-management/roles-management.component';
import { RoleEditorComponent } from './roles-management/role-editor.component';

import { GroupByPipe } from '../pipes/group-by.pipe';
import { BsDatepickerModule } from 'ngx-bootstrap';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		Select2Module,
		ROUTES,
		TranslateModule.forChild({
			loader: {provide: TranslateLoader, useClass: TranslateLanguageLoader}
		}),
		ModalModule,
		AccountManagementModule,
		NgxDatatableModule,
		TooltipModule
	],
	declarations: [UsersManagementComponent,
		SearchBoxComponent,
		RolesManagementComponent,
		RoleEditorComponent,
		GroupByPipe
	]
})
export class UsersManagementModule { }
