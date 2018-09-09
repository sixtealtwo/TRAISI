import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import {
	TreeviewItem,
	DownlineTreeviewItem,
	TreeviewEventParser,
	OrderDownlineTreeviewEventParser
} from 'ngx-treeview';
import { QuestionConditionalSourceGroup } from '../../../models/question-conditional-source-group.model';
import { QuestionConditionalTargetGroup } from '../../../models/question-conditional-target-group.model';
import { QuestionTypeDefinition } from '../../../models/question-type-definition';
import { QuestionPartView } from '../../../models/question-part-view.model';
import { ModalDirective } from 'ngx-bootstrap';
import { MapComponent } from 'ngx-mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Control } from 'mapbox-gl';

@Component({
	selector: 'app-question-conditonals',
	templateUrl: './question-conditonals.component.html',
	styleUrls: ['./question-conditonals.component.scss'],
	providers: [{ provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }]
})
export class QuestionConditonalsComponent implements OnInit, AfterViewInit {
	public treedropdownConfig = {
		hasAllCheckBox: false,
		hasFilter: true,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public treedropdownSingleConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500
	};

	public sourceConditionals: QuestionConditionalSourceGroup[] = [];
	public targetConditionals: QuestionConditionalTargetGroup[] = [];

	private drawControl: Control;
	@Input()
	public questionType: QuestionTypeDefinition;
	@Input()
	public questionBeingEdited: QuestionPartView;

	@Input()
	public questionOptionsAfter: TreeviewItem[] = [];
	@Input()
	public questionsBefore: TreeviewItem[] = [];
	@Input()
	public thisQuestion: TreeviewItem[] = [];

	@ViewChild('locationModal') locationModal: ModalDirective;
	@ViewChild('mapbox') mapGL: MapComponent;

	constructor() {}

	ngOnInit() {
	}

	ngAfterViewInit() {
		if (this.questionType.responseType === 'Location') {
			this.mapGL.load.subscribe((map: mapboxgl.MapboxOptions) => {
				map.zoom = 9;
				map.center = [-79.3, 43.7];
			});
		}
	}

	private updateBounds(bounds: any) {
		console.log(bounds.features[0].geometry.coordinates[0]);
	}

	private configureMapSettings(): void {
		this.mapGL.zoom = [9];
		this.mapGL.minZoom = 7;
		this.mapGL.center = [-79.3, 43.7];
		this.mapGL.doubleClickZoom = false;
		this.mapGL.attributionControl = false;

		this.mapGL.mapInstance.setCenter( [-79.3, 43.7]);
		this.mapGL.mapInstance.setZoom(9);
	}

	public addSourceConditional() {
		let newSourceGroup: QuestionConditionalSourceGroup = new QuestionConditionalSourceGroup(
			this.sourceConditionals.length,
			'',
			this.getDefaultValue(),
			this.cloneTargetList(this.questionOptionsAfter)
		);
		this.sourceConditionals.push(newSourceGroup);
	}

	public deleteSourceConditional(i: number) {
		this.sourceConditionals = this.sourceConditionals.filter(s => s.index !== i);
	}

	locationBoundsShown() {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 0);
	}

	private getDefaultValue(): string {
		let responseValue: string;
		if (this.questionType.responseType === 'String') {
			responseValue = '';
		} else if (this.questionType.responseType === 'Boolean') {
			responseValue = 'false';
		} else if (this.questionType.responseType === 'Integer') {
			responseValue = '0';
		} else if (this.questionType.responseType === 'Decimal') {
			responseValue = '0.0';
		} else if (this.questionType.responseType === 'Location') {
			responseValue = null;
		} else if (this.questionType.responseType === 'Json') {
			responseValue = null;
		} else if (this.questionType.responseType === 'OptionSelect') {
			responseValue = '';
		} else if (this.questionType.responseType === 'OptionList') {
			responseValue = '';
		} else if (this.questionType.responseType === 'DateTime') {
			responseValue = '';
		}
		return responseValue;
	}

	private cloneTargetList(parentList: TreeviewItem[]): TreeviewItem[] {
		if (parentList === undefined) {
			return undefined;
		}
		let tree: TreeviewItem[] = [];
		for (let treeItem of parentList) {
			let treeItemCopy = new TreeviewItem({
				value: treeItem.value,
				text: treeItem.text,
				checked: false,
				children: this.cloneTargetList(treeItem.children)
			});
			tree.push(treeItemCopy);
		}
		return tree;
	}

	showLocationBoundsModal(conditional: QuestionConditionalSourceGroup)
	{
		this.drawControl = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
					polygon: true,
					trash: true
			}});
		this.mapGL.mapInstance.addControl(this.drawControl);
		this.mapGL.mapInstance.on('draw.update', e => this.updateBounds(e));
		this.mapGL.mapInstance.on('draw.create', e => this.updateBounds(e));
		this.locationModal.show();
	}

	saveBounds() {
		this.mapGL.mapInstance.removeControl(this.drawControl);
		this.locationModal.hide();
	}


	onSelectedChange(downlineItems: DownlineTreeviewItem[]) {
		console.log(downlineItems);
	}
}
