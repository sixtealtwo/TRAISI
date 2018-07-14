import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListComponent } from './item-list/item-list.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { FormsModule } from '@angular/forms';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { QuestionTypeChooserComponent } from '../survey-builder/components/question-type-chooser/question-type-chooser.component';
import { NullAstVisitor } from '@angular/compiler';


@NgModule({
	imports: [CommonModule, FormsModule, NgxDnDModule],
	providers: [],
	declarations: [ItemListComponent, SearchBoxComponent, QuestionTypeChooserComponent],
	exports: [ItemListComponent, SearchBoxComponent, QuestionTypeChooserComponent, NgxDnDModule]
})
export class SharedModule {}
