import { NgModule, ModuleWithProviders } from '@angular/core';
import { LinkButtonComponent } from './link-button.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

// export const ngxMapWithConfig = NgxMapboxGLModule

@NgModule({
	declarations: [LinkButtonComponent],
	entryComponents: [LinkButtonComponent],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-link-button',
					id: 'link-button',
					component: LinkButtonComponent,
				}
			],
			multi: true,
		},
	],
	imports: [CommonModule, HttpClientModule, NgSelectModule, CommonModule, FormsModule],
})
export default class LinkButtonComponentModule {
	static moduleName = "link-button-module"; 
	static forRoot(): ModuleWithProviders<LinkButtonComponentModule> {
		return {
			ngModule: LinkButtonComponentModule,
			providers: [],
		};
	}
}

export const moduleName = "link-button";