import { SurveyQuestion, ResponseTypes, OnVisibilityChanged, TimelineResponseData } from 'traisi-question-sdk';
import {
	Component,
	ViewEncapsulation,
	Output,
	EventEmitter,
	ViewChild,
	TemplateRef,
	OnInit,
	Inject,
	ViewContainerRef,
	Injector,
	AfterViewInit,
} from '@angular/core';
import templateString from './travel-diary-edit-dialog.component.html';
import styleString from './travel-diary-edit-dialog.component.scss';
import { TravelDiaryService } from './travel-diary.service';
import { CalendarEvent, CalendarView, CalendarDayViewComponent } from 'angular-calendar';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { TravelDiaryConfiguration } from './travel-diary-configuration.model';
import { Subject, BehaviorSubject, Observable, concat, of } from 'rxjs';
import { User } from './day-view-scheduler.component';
@Component({
	selector: 'traisi-travel-diary-edit-dialog',
	template: '' + templateString,
	encapsulation: ViewEncapsulation.None,
	providers: [],
	styles: ['' + styleString],
})
export class TravelDiaryEditDialogComponent implements AfterViewInit {
	@Output() public saved: EventEmitter<TimelineResponseData | { users: User[] }> = new EventEmitter();

	public modalRef: BsModalRef;

	private _mapComponent: any;

	@ViewChild('newEntryModal', { static: true })
	public modal: ModalDirective;

	@ViewChild('mapTemplate', { read: ViewContainerRef })
	public mapTemplate: ViewContainerRef;

	public searchInFocus: boolean = false;

	public model: TimelineResponseData = {
		address: undefined,
		latitude: 0,
		longitude: 0,
		name: undefined,
		order: 0,
		purpose: undefined,
		timeA: new Date(),
		timeB: new Date(),
	};

	public constructor(
		private _modalService: BsModalService,
		private _injector: Injector,
		private _travelDiaryService: TravelDiaryService,
		@Inject('QuestionLoaderService') private _questionLoaderService
	) {}

	public dialogSave(): void {
		console.log(this.model);
		this.hide();
		this.saved.emit(this.model);
	}

	public hide(): void {
		this.modal.hide();
	}

	public show(): void {
		this.modal.show();
	}

	public searchFocus(): void {
		this.searchInFocus = true;
	}

	public searchBlur(): void {
		this.searchInFocus = false;
	}

	public get users(): any {
		return this._travelDiaryService.users;
	}

	public get purposes(): string[] {
		return this._travelDiaryService.configuration.purposes;
	}

	public get addresses(): Observable<string[]> {
		return this._travelDiaryService.addresses$;
	}

	public get addressInput(): Subject<string> {
		return this._travelDiaryService.addressInput$;
	}

	public locationChanged(event): void {
		let r = [event.center[0], event.center[1]];
		(<any>this._mapComponent).setMarkerLocation(r);
		(<any>this._mapComponent).flyToPosition(r);
		(<any>this._mapComponent).saveLocation({ lat: r[1], lng: r[0] });
	}

	public mapResonse(response): void {
		this.model.address = response['address'];
		this.model.latitude = response['latitude'];
		this.model.longitude = response['longitude'];
	}

	public ngAfterViewInit(): void {
		let componentRef = null;
		let factories = this._questionLoaderService.componentFactories;
		// console.log(factories);
		let sub = Object.keys(this._questionLoaderService.componentFactories).forEach((key) => {
			let factory = this._questionLoaderService.componentFactories[key];
			if (factory.selector === 'traisi-map-question') {
				componentRef = this.mapTemplate.createComponent(factory, undefined, this._injector);
				let instance: SurveyQuestion<any> = <SurveyQuestion<any>>componentRef.instance;
				instance.containerHeight = 300;
				instance['loadGeocoder'] = false;
				instance.response.subscribe((value) => {
					this.mapResonse(value);
				});
				this._mapComponent = instance;
			}
		});
	}
	public ngOnInit(): void {}
}
