import { Component, ViewEncapsulation, OnInit, Injector, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { AlertService, DialogType, MessageSeverity } from '../services/alert.service';

import { Select2OptionData } from 'ng2-select2';

import { ItemListComponent} from "../shared/item-list/item-list.component";

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
	selector: 'app-surveys-management',
	templateUrl: './surveys-management.component.html',
	styleUrls: ['./surveys-management.component.scss'],
})
export class SurveysManagementComponent implements OnInit {

	public bsConfig: Partial<BsDatepickerConfig> = Object.assign({}, { containerClass: 'theme-default' });

	@ViewChild('editorModal')
	editorModal: ModalDirective;

	public itemData = [{name:'Survey1'},{name:'Survey1'},{name:'Survey1'}];

	public columns = [
    { prop: 'name' },
  ];


	ngOnInit(): void {
		console.log('ngOnInit');
	}

	newSurvey(): void
	{
		this.editorModal.show();

	}

	closeEditorModal(): void
	{
		this.editorModal.hide();
	}

	onEditorModalHidden(): void
	{
	}


}
