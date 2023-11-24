import { NgModule, ModuleWithProviders } from '@angular/core';
import { VideoModuleComponent } from './video-module.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

// export const ngxMapWithConfig = NgxMapboxGLModule

@NgModule({
	declarations: [VideoModuleComponent],
	entryComponents: [VideoModuleComponent],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-video-module',
					id: 'video',
					component: VideoModuleComponent,
				}
			],
			multi: true,
		},
	],
	imports: [CommonModule, HttpClientModule, NgSelectModule, CommonModule, FormsModule],
})
export default class VideoModuleComponentModule {
	static moduleName = "video-module"; 
	static forRoot(): ModuleWithProviders<VideoModuleComponentModule> {
		return {
			ngModule: VideoModuleComponentModule,
			providers: [],
		};
	}
}

export const moduleName = "video";