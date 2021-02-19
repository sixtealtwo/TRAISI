import { Component, Inject, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TimelineResponseData, TraisiValues } from 'traisi-question-sdk';
import { ScheduleInputState } from 'travel-diary-scheduler/models/schedule-input-state.model';
import { TravelDiarySchedulerLogic } from '../../services/travel-diary-scheduler-logic.service';
import { TravelDiaryScheduler } from 'travel-diary-scheduler/services/travel-diary-scheduler.service';
import { TravelDiarySchedulerDialogInput } from '../travel-diary-scheduler-dialog-input/travel-diary-scheduler-dialog-input.component';

import templateString from './travel-diary-scheduler-item.component.html';
import styleString from './travel-diary-scheduler-item.component.scss';
import { TravelDiarySchedulerConfiguration } from 'travel-diary-scheduler/models/config.model';
import { TravelDiaryScheduleRespondentDataService } from 'travel-diary-scheduler/services/travel-diary-scheduler-respondent-data.service';
import { PurposeLocation } from 'travel-diary-scheduler/models/purpose-location.model';
import { Purpose } from 'travel-diary/models/travel-diary-configuration.model';
@Component({
	selector: 'traisi-travel-diary-scheduler-item',
	template: '' + templateString,
	providers: [],
	encapsulation: ViewEncapsulation.None,
	entryComponents: [],
	styles: ['' + styleString],
})
export class TravelDiarySchedulerItemComponent implements OnInit {
	@Input()
	public model: TimelineResponseData;

	@Input()
	public scheduleIndex: number;

	@ViewChild('addressInputDialogTemplate', { read: TemplateRef })
	public addressInputDialogTemplate: TemplateRef<any>;

	@ViewChild('dialogInput')
	public dialogInput: TravelDiarySchedulerDialogInput;

	public dataCollected: boolean = false;

	public isInputValid: boolean = false;

	public state: ScheduleInputState = {};

	public modalRef: BsModalRef | null;

	public get scheduleItems(): TimelineResponseData[] {
		return this._scheduler.scheduleItems;
	}

	public get modes(): any[] {
		return this._scheduler.configuration.mode;
	}
	public get purposes(): any[] {
		return this._scheduler.configuration.purpose;
	}

	public get configuration(): TravelDiarySchedulerConfiguration {
		return this._scheduler.configuration;
	}

	public get definedSchoolLocations(): any[] {
		return this._respondentData.respondentData.schoolLocations;
	}

	public get definedWorkLocations(): any[] {
		return this._respondentData.respondentData.workLocations;
	}

	/**
	 *
	 * @param _scheduler
	 * @param _schedulerLogic
	 * @param _modalService
	 */
	public constructor(
		private _scheduler: TravelDiaryScheduler,
		private _schedulerLogic: TravelDiarySchedulerLogic,
		private _modalService: BsModalService,
		private _respondentData: TravelDiaryScheduleRespondentDataService
	) {}

	public ngOnInit(): void {
		this.state = { model: this.model, scheduleIndex: this.scheduleIndex };
		this._schedulerLogic.inputState = this.state;
	}

	/**
	 *
	 * @param purpose
	 */
	public onPurposeChanged(purpose: Purpose | PurposeLocation): void {
		if (this.isPurposeWithAddress(purpose)) {
			this.model.address = purpose.address;
			this.model.purpose = purpose.purpose;
		} else {
			console.log(purpose);
			console.log(this.model.purpose);
			this.model.purpose = purpose.id;
			if (this.model.purpose.toLocaleLowerCase() === 'other') {
				// show dialog for collecting address
				this.openModal(this.addressInputDialogTemplate);
			} else {
				// simply update the state
				this.updateState();
			}
		}
	}

	/**
	 * Determines the type of purpose passed
	 */
	private isPurposeWithAddress(purpose: Purpose | PurposeLocation): purpose is PurposeLocation {
		if (purpose['address'] !== undefined) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 *
	 */
	public onModeChanged(): void {
		this.updateState();
	}

	/**
	 *
	 * @param time
	 */
	public onDepartureTimeChanged(time: Date): void {
		this.updateState();
	}

	/**
	 *
	 * @param val
	 */
	public onLastLocationChanged(val: string): void {
		console.log(this.state.returnHomeResponse);
	}

	/**
	 *
	 */
	public updateState(): void {
		console.log(this.model);
		this._schedulerLogic.updateScheduleInputState();
	}

	/**
	 *
	 */
	public confirmScheduleItem(): void {
		this._schedulerLogic.confirmSchedule();
	}

	/**
	 *
	 */
	public removeScheduleItem(): void {
		this._scheduler.removeItem(this.scheduleIndex);
	}

	/**
	 *
	 * @param template
	 */
	public openModal(template: TemplateRef<any>): void {
		// this.modalRef = this._modalService.show(template, { class: 'modal-dialog-centered' });
		this.dialogInput.show();
	}

	public closeAddressInputDialog(): void {
		// clear purpose as address was reset
		this.model.purpose = undefined;
		this.modalRef.hide();
		this.updateState();
	}

	public saveAddressInputDialog(): void {
		// clear purpose as address was reset
		this.modalRef.hide();
		this.updateState();
	}

	public setActive(): void {
		this.dataCollected = false;
	}
}
