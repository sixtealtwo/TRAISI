import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './item-list/item-list.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { FormsModule } from '@angular/forms';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { NullAstVisitor } from '@angular/compiler';
import { RouterModule } from '../../../node_modules/@angular/router';
import { TooltipModule } from '../../../node_modules/ngx-bootstrap';

@NgModule({
	imports: [CommonModule, TooltipModule, FormsModule, RouterModule, NgxDnDModule],
	providers: [],
	declarations: [ItemListComponent, SearchBoxComponent],
	exports: [ItemListComponent, SearchBoxComponent, NgxDnDModule]
})
export class SharedModule {}
