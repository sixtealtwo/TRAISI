import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule} from "../shared/shared.module";

import { TranslateLanguageLoader } from '../services/app-translation.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Select2Module } from 'ng2-select2';
import { SearchBoxComponent } from '../components/search-box/search-box.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccountManagementModule } from '../account-management/account-management.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ROUTES } from './surveys-management.routes';

import { SurveysManagementComponent } from './surveys-management.component';
import {BsDatepickerModule, BsDropdownModule} from 'ngx-bootstrap';

@NgModule({
	imports: [
		CommonModule,
		BsDatepickerModule.forRoot(),
		FormsModule,
		Select2Module,
    SharedModule,
		ROUTES,
		TranslateModule.forChild({
			loader: { provide: TranslateLoader, useClass: TranslateLanguageLoader }
		}),
		ModalModule,
		AccountManagementModule,
		NgxDatatableModule,
		TooltipModule,
    BsDropdownModule.forRoot()
	],
	declarations: [
		SurveysManagementComponent
	]
})
export class SurveysManagementModule { }
