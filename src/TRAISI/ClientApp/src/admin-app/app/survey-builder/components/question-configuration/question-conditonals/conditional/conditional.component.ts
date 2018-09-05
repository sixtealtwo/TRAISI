import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import {
	TreeviewItem,
	DownlineTreeviewItem,
	TreeviewEventParser,
	OrderDownlineTreeviewEventParser,
	DropdownTreeviewComponent,
	TreeviewSelection
} from 'ngx-treeview';
import { QuestionConditionalSourceGroup } from '../../../../models/question-conditional-source-group.model';
import { MapComponent } from 'ngx-mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';

@Component({
	selector: 'app-conditional',
	templateUrl: './conditional.component.html',
	styleUrls: ['./conditional.component.scss'],
	providers: [{ provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }]
})
export class ConditionalComponent implements OnInit, AfterViewInit {
	public dropDownListSelectedId: string;
	public dropDownListItems: Array<string> = [];

	public treedropdownConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public copiedOptionList: any[] = [];

	@Input()
	public responseType: string;

	@Input()
	public sourceGroup: QuestionConditionalSourceGroup;

	@Input()
	public optionList: TreeviewItem[];

	@ViewChild('optionTargets')
	public optionTargetsTreeDropdown: DropdownTreeviewComponent;

	@ViewChild('questionOptions')
	public questionOptionsTreeDropdown: DropdownTreeviewComponent;

	@ViewChild('mapbox') mapGL: MapComponent;

	public optionSelectValues: any[] = [];
	constructor() {}

	ngOnInit() {
		this.setConditionsForQuestionType();
		if (this.responseType === 'OptionList') {
			this.optionList.forEach(element => {
				let copiedItem = new TreeviewItem({
					value: element.value,
					text: element.text,
					checked: false
				});
				this.copiedOptionList.push(copiedItem);
			});
		}
		this.configureMapSettings();
	}

	ngAfterViewInit() {
		//this.optionTargetsTreeDropdown.i18n.getText = (e) => this.targetsDropdown(e);
		this.mapGL.load.subscribe((map: mapboxgl.MapboxOptions) => {
			this.mapGL.mapInstance.addControl(new MapboxDraw({
				displayControlsDefault: false,
				controls: {
						polygon: true,
						trash: true
				}}));
			this.mapGL.mapInstance.on('draw.update', e => this.updateBounds(e));
			this.mapGL.mapInstance.on('draw.create', e => this.updateBounds(e));
		});
	}

	private configureMapSettings(): void {
		this.mapGL.zoom = [9];
		this.mapGL.minZoom = 7;
		this.mapGL.center = [-79.3, 43.5];
		this.mapGL.doubleClickZoom = false;
		this.mapGL.attributionControl = false;
	}

	updateBounds(bounds: any) {
		console.log(bounds.features[0].geometry.coordinates[0]);
	}

	locationBoundsShown() {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 0);
	}

	targetsDropdown(e: TreeviewSelection) {
		if (e.checkedItems.length === 1) {
			return e.checkedItems[0].text;
		} else if (e.checkedItems.length > 1) {
			return `${e.checkedItems.length} targets`;
		} else {
			return 'Select targets';
		}
	}

	private setConditionsForQuestionType() {
		if (this.responseType === 'String') {
			this.dropDownListItems = ['Contains', 'Does Not Contain'];
		} else if (this.responseType === 'Boolean') {
			this.dropDownListItems = ['Is Equal To'];
		} else if (this.responseType === 'Integer') {
			this.dropDownListItems = ['Is Equal To', 'Is Not Equal To', 'Greater Than', 'Less Than'];
		} else if (this.responseType === 'Decimal') {
			this.dropDownListItems = ['Is Equal To', 'Is Not Equal To', 'Greater Than', 'Less Than'];
		} else if (this.responseType === 'Location') {
			this.dropDownListItems = ['In Bounds'];
		} else if (this.responseType === 'Json') {
			this.dropDownListItems = ['Contains', 'Does Not Contain'];
		} else if (this.responseType === 'OptionList') {
			this.dropDownListItems = ['Is Any Of', 'Is All Of'];
		} else if (this.responseType === 'DateTime') {
			this.dropDownListItems = ['In Range'];
		}
	}

	valueChanged(e) {
		this.dropDownListSelectedId = this.dropDownListItems.filter(dd => dd === e)[0];
	}

	onSelectedChange(downlineItems: DownlineTreeviewItem[]) {}

	onSelectedChangeOptions(downlineItems: DownlineTreeviewItem[]) {}

	// property conversions based on type

	get booleanValue(): boolean {
		return this.sourceGroup.value === 'true';
	}
	set booleanValue(value: boolean) {
		if (value === true) {
			this.sourceGroup.value = 'true';
		} else {
			this.sourceGroup.value = 'false';
		}
	}

	get numberValue(): number {
		return +this.sourceGroup.value;
	}
	set numberValue(value: number) {
		this.sourceGroup.value = `${value}`;
	}

	get optionSelectValue() {
		return this.sourceGroup.value;
	}
	set optionSelectValue(value: any) {
		this.sourceGroup.value = value;
	}
}
