import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WidgetModule } from '../layout/widget/widget.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateLanguageLoader } from '../../../shared/services/app-translation.service';

export const routes = [{ path: '', component: DashboardComponent, pathMatch: 'full' }];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		WidgetModule,
		NgxEchartsModule,
		TranslateModule.forChild({
			loader: { provide: TranslateLoader, useClass: TranslateLanguageLoader }
		})
	],
	declarations: [DashboardComponent]
})
export class DashboardModule {
	static routes = routes;
}
