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
import { TravelDiarySchedulerErrorState } from 'travel-diary-scheduler/models/error-state.model';
@Component({
	selector: 'traisi-travel-diary-scheduler-item',
	template: '' + templateString,
	providers: [TravelDiarySchedulerLogic],
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

	public get state(): ScheduleInputState {
		return this._schedulerLogic.inputState;
	}

	public get errorState(): TravelDiarySchedulerErrorState {
		return this._schedulerLogic.inputState.errorState;
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
		this._schedulerLogic.inputState = { model: this.model, scheduleIndex: this.scheduleIndex };
	}

	/**
	 *
	 * @param purpose
	 */
	public onPurposeChanged(purpose: Purpose | PurposeLocation): void {
		if (this.isPurposeWithAddress(purpose)) {
			this.model.address = purpose.address;
			this.model.purpose = purpose.purpose;
			this.updateState();
		} else {
			this.model.purpose = purpose.id;

			// show dialog for collecting address
			this.openModal(this.addressInputDialogTemplate);
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
		this.model.timeA = time;
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
		this._schedulerLogic.updateScheduleInputState();
		console.log(this.state.errorState);
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
		this.dialogInput.onSaved = (data) => {
			this.model.address = data.address;
			this.model.latitude = data.latitude;
			this.model.longitude = data.longitude;
		};
		this.dialogInput.show(this.model);
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
