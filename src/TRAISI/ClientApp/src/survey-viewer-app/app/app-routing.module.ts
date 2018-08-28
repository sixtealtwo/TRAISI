import { NgModule } from '@angular/core';
import { RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';




@NgModule({
	imports: [
		RouterModule.forRoot(
			[
				{
					path: '',
					redirectTo: 'start',
					pathMatch: 'full'
				}
				]

		)
	],
	exports: [RouterModule],
	providers: []
})
export class AppRoutingModule {}
