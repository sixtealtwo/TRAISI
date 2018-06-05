import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemListComponent} from './item-list/item-list.component';
import {SearchBoxComponent} from './search-box/search-box.component';
import {FormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	providers: [
	],
	declarations: [ItemListComponent, SearchBoxComponent],
	exports: [ItemListComponent, SearchBoxComponent]
})
export class SharedModule { }
