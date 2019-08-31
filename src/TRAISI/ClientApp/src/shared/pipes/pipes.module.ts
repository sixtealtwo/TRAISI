import { NgModule }      from '@angular/core';
import { SafeHtmlPipe } from './safe-html.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
	imports:        [],
	declarations:   [SafeHtmlPipe,SafePipe],
	exports:        [SafeHtmlPipe,SafePipe],
})

export class PipesModule {

  static forRoot() {
	 return {
		 ngModule: PipesModule,
		 providers: [],
	 };
  }
}
