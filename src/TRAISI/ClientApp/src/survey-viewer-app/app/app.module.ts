import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {AlertService} from "../../shared/services/alert.service";


@NgModule({
	declarations: [
		AppComponent,

	],
	imports: [
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,

	],
	providers: [
		AlertService
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
