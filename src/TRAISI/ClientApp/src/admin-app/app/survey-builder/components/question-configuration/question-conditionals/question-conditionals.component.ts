import { Component, OnInit, Input, ViewChild, AfterViewInit, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import {
	TreeviewItem,
	DownlineTreeviewItem,
	TreeviewEventParser,
	OrderDownlineTreeviewEventParser,
	TreeviewConfig
} from 'ngx-treeview';
import { QuestionConditionalSourceGroup } from '../../../models/question-conditional-source-group.model';
import { QuestionConditionalTargetGroup } from '../../../models/question-conditional-target-group.model';
import { QuestionTypeDefinition } from '../../../models/question-type-definition';
import { QuestionPartView } from '../../../models/question-part-view.model';
import { ModalDirective } from 'ngx-bootstrap';
import { MapComponent } from 'ngx-mapbox-gl';
import * as MapboxDraw from '@mapbox/mapbox-gl-draw';
import { Control } from 'mapbox-gl';
import { SourceConditionalComponent } from './source-conditional/conditional.component';
import { QuestionConditional } from '../../../models/question-conditional.model';
import { QuestionOptionConditional } from '../../../models/question-option-conditional.model';
import { TargetConditionalComponent } from './target-conditional/target-conditional.component';
import { QuestionOptionValue } from '../../../models/question-option-value.model';

@Component({
	selector: 'app-question-conditionals',
	templateUrl: './question-conditionals.component.html',
	styleUrls: ['./question-conditionals.component.scss'],
	providers: [{ provide: TreeviewEventParser, useClass: OrderDownlineTreeviewEventParser }]
})
export class QuestionConditionalsComponent implements OnInit, AfterViewInit {
	public treedropdownConfig: TreeviewConfig = {
		hasAllCheckBox: false,
		hasFilter: true,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500,
		hasDivider: false
	};

	public treedropdownSingleConfig: TreeviewConfig = {
		hasAllCheckBox: false,
		hasFilter: false,
		hasCollapseExpand: false,
		decoupleChildFromParent: false,
		maxHeight: 500,
		hasDivider: false
	};

	public sourceConditionals: QuestionConditionalSourceGroup[] = [];
	public targetConditionals: QuestionConditionalTargetGroup[] = [];

	private currentLocationConditional: QuestionConditionalSourceGroup | QuestionConditionalTargetGroup;

	private drawControl: MapboxDraw;
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
	@Input()
	public questionOptions: Map<string, QuestionOptionValue[]> = new Map<string, QuestionOptionValue[]>();

	@Input()
	public sourceQuestionConditionals: QuestionConditional[] = [];
	@Input()
	public sourceQuestionOptionConditionals: QuestionOptionConditional[] = [];

	@Input()
	public targetQuestionConditionals: QuestionConditional[] = [];
	@Input()
	public targetQuestionOptionConditionals: QuestionOptionConditional[] = [];

	@ViewChild('locationModal')
	locationModal: ModalDirective;
	@ViewChild('mapbox')
	mapGL: MapComponent;
	@ViewChildren('sConditionals')
	conditionalFields: QueryList<SourceConditionalComponent>;
	@ViewChildren('tConditionals')
	tConditionalFields: QueryList<TargetConditionalComponent>;

	constructor(private changeDetectRef: ChangeDetectorRef) {}

	public ngOnInit(): void {}

	ngAfterViewInit() {
		if (this.questionType.responseType === 'Location') {
			this.mapGL.load.subscribe((map: mapboxgl.MapboxOptions) => {
				map.zoom = 9;
				map.center = [-79.3, 43.7];
			});
		}
		this.loadPriorSourceConditionals();
		this.changeDetectRef.detectChanges();
	}

	private configureMapSettings(): void {
		this.mapGL.zoom = [9];
		this.mapGL.minZoom = 7;
		this.mapGL.center = [-79.3, 43.7];
		this.mapGL.doubleClickZoom = false;
		this.mapGL.attributionControl = false;

		this.mapGL.mapInstance.setCenter([-79.3, 43.7]);
		this.mapGL.mapInstance.setZoom(9);
	}

	public getUpdatedConditionals(): [QuestionConditional[], QuestionOptionConditional[]] {
		let updatedQConditionals: QuestionConditional[] = [];
		let updatedQOConditionals: QuestionOptionConditional[] = [];

		let qi: number = 0;
		let oi: number = 0;
		let qmax: number = this.sourceQuestionConditionals.length;
		let omax: number = this.sourceQuestionOptionConditionals.length;

		this.conditionalFields.forEach(field => {
			field.updateConditionalsValues();
			field.sourceQuestionConditionalsList.forEach(qConditional => {
				if (this.validConditionValue(qConditional.value)){
					let conditionWithoutSpaces = qConditional.condition.replace(/ /g, '');
					// ensure condition doesn't already exist
					let existing: QuestionConditional = updatedQConditionals.filter(
						c =>
							c.condition === conditionWithoutSpaces &&
							c.value === qConditional.value &&
							c.targetQuestionId === qConditional.targetQuestionId
					)[0];
					if (!existing) {
						if (qi < qmax) {
							qConditional.id = this.sourceQuestionConditionals[qi++].id;
						}
						qConditional.condition = conditionWithoutSpaces;
						updatedQConditionals.push(qConditional);
					}
				}
			});

			field.sourceQuestionOptionConditionalsList.forEach(oConditional => {
				if (this.validConditionValue(oConditional.value)) {
					let conditionWithoutSpaces = oConditional.condition.replace(/ /g, '');
					// ensure condition doesn't already exist
					let existing: QuestionOptionConditional = updatedQOConditionals.filter(
						c =>
							c.condition === conditionWithoutSpaces &&
							c.value === oConditional.value &&
							c.targetOptionId === oConditional.targetOptionId
					)[0];
					if (!existing) {
						if (oi < omax) {
							oConditional.id = this.sourceQuestionOptionConditionals[oi++].id;
						}
						oConditional.condition = conditionWithoutSpaces;
						updatedQOConditionals.push(oConditional);
					}
				}
			});
		});

		qi = 0;
		oi = 0;
		qmax = this.targetQuestionConditionals.length;
		omax = this.targetQuestionOptionConditionals.length;

		return [updatedQConditionals, updatedQOConditionals];
	}

	private validConditionValue(value: string): boolean {
		let valid: boolean = true;
		if (this.questionType.responseType === 'Location') {
			if (value === null) {
				valid = false;
			} else {
				if (JSON.parse(value).features.length === 0) {
					valid = false;
				}
			}
		} else if (this.questionType.responseType === 'Json') {
			if (value === null) {
				valid = false;
			}
		} else if (this.questionType.responseType === 'OptionList') {
			if (value === '') {
				valid = false;
			}
		}
		return valid;
	}

	public loadPriorSourceConditionals() {
		let sourceConditionalsMap: Map<string, string[]> = new Map<string, string[]>();

		// process both conditionals lists to map checked values into map where key is 'condition|value' and value is list of ids
		this.sourceQuestionConditionals.forEach(conditional => {
			// put spaces in condition between capitals
			let conditionSpaced: string = conditional.condition.replace(/([A-Z])/g, ' $1').trim();
			// create key
			let conditionalKey: string = `${conditionSpaced}|${conditional.value}`;
			if (!sourceConditionalsMap.has(conditionalKey)) {
				sourceConditionalsMap.set(conditionalKey, []);
			}
			let conditionalIds = sourceConditionalsMap.get(conditionalKey);
			conditionalIds.push(`question~${conditional.targetQuestionId}`);
		});
		this.sourceQuestionOptionConditionals.forEach(conditional => {
			// put spaces in condition between capitals
			let conditionSpaced: string = conditional.condition.replace(/([A-Z])/g, ' $1').trim();
			// create key
			let conditionalKey: string = `${conditionSpaced}|${conditional.value}`;
			if (!sourceConditionalsMap.has(conditionalKey)) {
				sourceConditionalsMap.set(conditionalKey, []);
			}
			let conditionalIds = sourceConditionalsMap.get(conditionalKey);
			conditionalIds.push(`option~${conditional.targetOptionId}`);
		});

		// go through map and create conditionals
		sourceConditionalsMap.forEach((ids: string[], conditionalKey: string) => {
			let keySplit = conditionalKey.split('|');
			let newSourceGroup: QuestionConditionalSourceGroup = new QuestionConditionalSourceGroup(
				this.sourceConditionals.length,
				keySplit[0],
				keySplit[1],
				this.cloneTargetList(this.questionOptionsAfter, ids, false)
			);
			this.sourceConditionals.push(newSourceGroup);
		});

	}

	public loadPriorTargetConditionals() {
		let targetConditionalsMap: Map<string, string[]> = new Map<string, string[]>();

		// process both conditionals lists to map checked values into map where key is 'condition|value' and value is list of ids
		this.targetQuestionConditionals.forEach(conditional => {
			// put spaces in condition between capitals
			let conditionSpaced: string = conditional.condition.replace(/([A-Z])/g, ' $1').trim();
			// create key
			let conditionalKey: string = `question~${conditional.sourceQuestionId}|${conditionSpaced}|${conditional.value}`;
			if (!targetConditionalsMap.has(conditionalKey)) {
				targetConditionalsMap.set(conditionalKey, []);
			}
			let conditionalIds = targetConditionalsMap.get(conditionalKey);
			conditionalIds.push(`question|${conditional.targetQuestionId}`);
		});
		this.targetQuestionOptionConditionals.forEach(conditional => {
			// put spaces in condition between capitals
			let conditionSpaced: string = conditional.condition.replace(/([A-Z])/g, ' $1').trim();
			// create key
			let conditionalKey: string = `question~${conditional.sourceQuestionId}|${conditionSpaced}|${conditional.value}`;
			if (!targetConditionalsMap.has(conditionalKey)) {
				targetConditionalsMap.set(conditionalKey, []);
			}
			let conditionalIds = targetConditionalsMap.get(conditionalKey);
			conditionalIds.push(`option~${conditional.targetOptionId}`);
		});

		// go through map and create conditionals
		targetConditionalsMap.forEach((ids: string[], conditionalKey: string) => {
			let keySplit = conditionalKey.split('~');
			let newTargetGroup: QuestionConditionalTargetGroup = new QuestionConditionalTargetGroup(
				this.targetConditionals.length,
				keySplit[0],
				keySplit[1],
				keySplit[2],
				this.cloneTargetList(this.thisQuestion, ids, false)
			);
			this.targetConditionals.push(newTargetGroup);
		});
	}

	public addSourceConditional() {
		let newSourceGroup: QuestionConditionalSourceGroup = new QuestionConditionalSourceGroup(
			this.sourceConditionals.length,
			'',
			this.getDefaultValue(),
			this.cloneTargetList(this.questionOptionsAfter, [], false)
		);
		this.sourceConditionals.push(newSourceGroup);
	}

	public addTargetConditional() {
		let newTargetGroup: QuestionConditionalTargetGroup = new QuestionConditionalTargetGroup(
			this.sourceConditionals.length,
			null,
			'',
			this.getDefaultValue(),
			this.cloneTargetList(this.thisQuestion, [], false)
		);
		this.sourceConditionals.push(newTargetGroup);
	}

	public deleteSourceConditional(i: number) {
		this.sourceConditionals = this.sourceConditionals.filter(s => s.index !== i);
	}

	public deleteTargetConditional(i: number) {
		this.targetConditionals = this.targetConditionals.filter(s => s.index !== i);
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
			responseValue = this.thisQuestion[0].children[0].value;
		} else if (this.questionType.responseType === 'OptionList') {
			responseValue = '';
		} else if (this.questionType.responseType === 'DateTime') {
			let startDate = new Date();
			let endDate = new Date();
			endDate.setDate(startDate.getDate() + 1);
			responseValue = JSON.stringify([startDate, endDate]);
		}
		return responseValue;
	}

	private cloneTargetList(parentList: TreeviewItem[], checkedValues: string[], forceCheck: boolean): TreeviewItem[] {
		if (parentList === undefined) {
			return undefined;
		}
		let tree: TreeviewItem[] = [];
		for (let treeItem of parentList) {
			let checkValue: string;
			if ((<string>treeItem.value).startsWith('question')) {
				let split = (<string>treeItem.value).split('~');
				checkValue = `${split[0]}~${split[2]}`;
			} else {
				let split = (<string>treeItem.value).split('~');
				checkValue = `${split[0]}~${split[2]}`;
			}
			let treeItemCopy = new TreeviewItem({
				value: treeItem.value,
				text: treeItem.text,
				checked: checkedValues.includes(checkValue) || forceCheck,
				children: this.cloneTargetList(treeItem.children, checkedValues, checkedValues.includes(checkValue))
			});
			tree.push(treeItemCopy);
		}
		return tree;
	}

	showLocationBoundsModal(conditional: QuestionConditionalSourceGroup | QuestionConditionalTargetGroup) {
		this.currentLocationConditional = conditional;
		this.drawControl = new MapboxDraw({
			displayControlsDefault: false,
			controls: {
				polygon: true,
				trash: true
			}
		});
		this.mapGL.mapInstance.addControl(this.drawControl);
		// this.mapGL.mapInstance.on('draw.update', e => this.updateBounds(e));
		// this.mapGL.mapInstance.on('draw.create', e => this.updateBounds(e));
		if (conditional.value) {
			this.drawControl.add(JSON.parse(conditional.value));
		}
		this.locationModal.show();
	}

	// private updateBounds(bounds: any) {}

	saveBounds() {
		this.currentLocationConditional.value = JSON.stringify(this.drawControl.getAll());
		let conditionalComponent = this.conditionalFields.filter(
			c => c.sourceGroup === this.currentLocationConditional
		)[0];

		this.mapGL.mapInstance.removeControl(this.drawControl);
		this.locationModal.hide();
	}

	onSelectedChange(downlineItems: DownlineTreeviewItem[]) {

	}
}
