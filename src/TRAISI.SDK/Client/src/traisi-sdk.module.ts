import { NgModule } from '@angular/core';
import { PopupComponent } from './components/popup/popup.component';

@NgModule({
	entryComponents: [PopupComponent],
	exports: [PopupComponent],
	declarations: [PopupComponent]
})
export class TraisiSdkModule {
	public constructor() {
		console.log('inside Traii sdkl');
	}
}

