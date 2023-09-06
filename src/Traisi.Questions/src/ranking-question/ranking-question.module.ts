import { NgModule, ModuleWithProviders } from '@angular/core';
import { RankingQuestionComponent } from './ranking-question.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

// export const ngxMapWithConfig = NgxMapboxGLModule

@NgModule({
	declarations: [RankingQuestionComponent],
	entryComponents: [RankingQuestionComponent],
	providers: [
		{
			provide: 'widgets',
			useValue: [
				{
					name: 'traisi-ranking-question',
					id: 'ranking',
					component: RankingQuestionComponent,
				}
			],
			multi: true,
		},
	],
	imports: [CommonModule, HttpClientModule, NgSelectModule, CommonModule, FormsModule],
})
export default class RankingQuestionComponentModule {
	static moduleName = "ranking-question"; 
	static forRoot(): ModuleWithProviders<RankingQuestionComponentModule> {
		return {
			ngModule: RankingQuestionComponentModule,
			providers: [],
		};
	}
}

export const moduleName = "ranking";