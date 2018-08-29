import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { WidgetModule } from '../layout/widget/widget.module';
import { NgxEchartsModule } from 'ngx-echarts';

export const routes = [
	{ path: '', component: DashboardComponent, pathMatch: 'full' }
];


@NgModule({
	imports: [ CommonModule, RouterModule.forChild(routes), WidgetModule, NgxEchartsModule ],
	declarations: [ DashboardComponent ]
})
export class DashboardModule {
	static routes = routes;
}
