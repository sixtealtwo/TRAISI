import { NgModule, ModuleWithProviders } from '@angular/core';
import { KMLFileQuestionComponent } from './kml-file-question.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

// export const ngxMapWithConfig = NgxMapboxGLModule

@NgModule({
	declarations: [KMLFileQuestionComponent],
	entryComponents: [KMLFileQuestionComponent],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-kml-file-question',
					id: 'kml-file',
					component: KMLFileQuestionComponent,
				}
			],
			multi: true,
		},
	],
	imports: [CommonModule, HttpClientModule, NgSelectModule, CommonModule, FormsModule],
})
export default class TraisiKMLFileQuestion {
	static moduleName = "kml-file-question"; 
	static forRoot(): ModuleWithProviders<TraisiKMLFileQuestion> {
		return {
			ngModule: TraisiKMLFileQuestion,
			providers: [],
		};
	}
}
