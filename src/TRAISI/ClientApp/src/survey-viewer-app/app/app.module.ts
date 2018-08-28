import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CoreModule} from "./core/core-module.module";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule} from "@angular/forms";
import {LocalStoreManager} from "../../admin-app/app/services/local-store-manager.service";
import {EndpointFactory} from "../../admin-app/app/services/endpoint-factory.service";
import {AppRoutingModule} from "../../admin-app/app/app-routing.module";

@NgModule({
	declarations: [
		AppComponent,

	],
	imports: [
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		FormsModule,
		AppRoutingModule,
		CoreModule
	],
	providers: [

		LocalStoreManager,
		EndpointFactory,
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
