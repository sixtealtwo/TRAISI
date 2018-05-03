import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemListComponent} from "./item-list/item-list.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ItemListComponent],
  exports: [ItemListComponent]
})
export class SharedModule { }
