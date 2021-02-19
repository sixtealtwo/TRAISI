import {
	Component,
	Inject,
	Injector,
	Input,
	OnInit,
	TemplateRef,
	ViewChild,
	ViewContainerRef,
	ViewEncapsulation,
} from '@angular/core';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { SurveyQuestion, TimelineResponseData, TraisiValues } from 'traisi-question-sdk';
import { ScheduleInputState } from 'travel-diary-scheduler/models/schedule-input-state.model';
import { TravelDiarySchedulerLogic } from 'travel-diary-scheduler/services/travel-diary-scheduler-logic.service';
import { TravelDiaryScheduler } from 'travel-diary-scheduler/services/travel-diary-scheduler.service';

import templateString from './travel-diary-scheduler-dialog-input.component.html';
import styleString from './travel-diary-scheduler-dialog-input.component.scss';
@Component({
	selector: 'traisi-travel-diary-scheduler-dialog-input',
	template: '' + templateString,
	providers: [],
	encapsulation: ViewEncapsulation.None,
	entryComponents: [],
	styles: ['' + styleString],
})
export class TravelDiarySchedulerDialogInput {
	private _isMapLoaded: boolean = false;

	private _mapComponent: any;

	@ViewChild('inputModal', { static: true })
	public modal: ModalDirective;

	@ViewChild('mapTemplate', { read: ViewContainerRef })
	public mapTemplate: ViewContainerRef;

	public modalRef: BsModalRef;

	public isValid: boolean = false;

	private _model: TimelineResponseData;

	private _tempModel: TimelineResponseData;

	public onSaved: (data: TimelineResponseData) => void;

	public constructor(
		@Inject(TraisiValues.QuestionLoader) private _questionLoaderService,
		private _injector: Injector
	) {}

	/**
	 *
	 * @param model
	 */
	public show(model: TimelineResponseData): void {
		this._tempModel = Object.assign({}, model);
		this.isValid = false;
		this.modal.show();
		if (!this._isMapLoaded) {
			this._loadMapDisplay();
		}
	}

	/**
	 *
	 */
	public dialogSave(): void {
		this.onSaved(this._tempModel);
	}

	public hide(): void {
		this.modal.hide();
	}

	/**
	 *
	 * @param $event
	 */
	public modalShown($event: any): void {}

	/**
	 *
	 * @param value
	 */
	public locationResponseReceived = (value) => {
		this._tempModel.address = value['address'];
		this._tempModel.latitude = value['latitude'];
		this._tempModel.longitude = value['longitude'];
		this.isValid = true;
	};

	/**
	 * 
	 */
	private _loadMapDisplay(): void {
		let componentRef = null;
		let factories = this._questionLoaderService.componentFactories;
		let sub = Object.keys(this._questionLoaderService.componentFactories).forEach((key) => {
			let factory = this._questionLoaderService.componentFactories[key];
			if (factory.selector === 'traisi-map-question') {
				componentRef = this.mapTemplate.createComponent(factory, undefined, this._injector);
				let instance: SurveyQuestion<any> = <SurveyQuestion<any>>componentRef.instance;
				instance.containerHeight = 300;
				instance['loadGeocoder'] = false;
				instance.response.subscribe(this.locationResponseReceived);
				this._mapComponent = instance;
				this._isMapLoaded = true;
			}
		});
	}
}
