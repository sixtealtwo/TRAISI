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

@Component({
	selector: 'traisi-travel-diary-edit-dialog',
	template: '' + templateString,
	encapsulation: ViewEncapsulation.None,
	providers: [],
	styles: ['' + styleString],
})
export class TravelDiaryEditDialogComponent implements AfterViewInit {
	@Output() saved: EventEmitter<TimelineResponseData> = new EventEmitter();

	public modalRef: BsModalRef;

	private _mapComponent: any;

	@ViewChild('newEntryModal', { static: true })
	public modal: ModalDirective;

	@ViewChild('mapTemplate', { read: ViewContainerRef })
	public mapTemplate: ViewContainerRef;

	public constructor(
		private _modalService: BsModalService,
		private _injector: Injector,
		@Inject('QuestionLoaderService') private _questionLoaderService
	) {}

	public hide(): void {
    this.modal.hide();
  }

	public show(): void {
		this.modal.show();
	}

	public ngAfterViewInit(): void {
		console.log(this.mapTemplate);
		let componentRef = null;
		let factories = this._questionLoaderService.componentFactories;
		// console.log(factories);
		let sub = Object.keys(this._questionLoaderService.componentFactories).forEach((key) => {
			let factory = this._questionLoaderService.componentFactories[key];
			if (factory.selector === 'traisi-map-question') {
				componentRef = this.mapTemplate.createComponent(factory, undefined, this._injector);
				let instance: SurveyQuestion<any> = <SurveyQuestion<any>>componentRef.instance;
				instance.response.subscribe((value) => {
					//	// this.callback(value);
				});
				this._mapComponent = instance;
			}
		});
	}
	public ngOnInit(): void {}
}
