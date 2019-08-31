import { NgModule }      from '@angular/core';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
	imports:        [],
	declarations:   [],
	exports:        [],
})

export class PipesModule {

  static forRoot() {
	 return {
		 ngModule: PipesModule,
		 providers: [],
	 };
  }
}
