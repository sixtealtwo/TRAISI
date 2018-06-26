import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TranslateLanguageLoader } from '../services/app-translation.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { GroupsManagementComponent } from './groups-management.component';
import { ROUTES } from './groups-management.routes';

@NgModule({
	imports: [
		CommonModule,
		ROUTES,
		FormsModule,
		SharedModule,
		TranslateModule.forChild({
			loader: { provide: TranslateLoader, useClass: TranslateLanguageLoader }
		})
	],
	declarations: [GroupsManagementComponent]
})
export class GroupsManagementModule {}
