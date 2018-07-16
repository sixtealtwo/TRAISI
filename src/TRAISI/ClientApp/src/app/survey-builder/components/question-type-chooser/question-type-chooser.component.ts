import { Component, OnInit, ViewEncapsulation, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { AppConfig } from '../../../app.config';
import { QuestionIconType } from '../../models/question-icon-type.enum';

@Component({
	selector: 'traisi-question-type-chooser',
	templateUrl: './question-type-chooser.component.html',
	styleUrls: ['./question-type-chooser.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class QuestionTypeChooserComponent implements OnInit {
	public questionTypeDefinitions: QuestionTypeDefinition[];
	public config: any;
	public $el: any;
	public dragItemIndex: number = 0;
	
	@Output() addQuestionType: EventEmitter<QuestionTypeDefinition> = new EventEmitter();


	constructor(private surveyBuilderService: SurveyBuilderService, config: AppConfig, el: ElementRef) {
		this.config = config.getConfig();
		this.$el = jQuery(el.nativeElement);
		this.getQuestionPayload = this.getQuestionPayload.bind(this);
	}

	/**
	 * Component initialization
	 */
	ngOnInit() {
		this.questionTypeDefinitions = [];

		// retrieve all question types from the server
		this.surveyBuilderService
			.getQuestionTypes()
			.subscribe((value: QuestionTypeDefinition[]) => {
				this.questionTypeDefinitions = value;
				console.log(value);
			});

		jQuery(window).on('sn:resize', this.initSidebarScroll.bind(this));
		this.initSidebarScroll();
	}
	initSidebarScroll(): void {
		const $sidebarContent = this.$el.find('.js-builder-sidebar-content');
		if (this.$el.find('.slimScrollDiv').length !== 0) {
			$sidebarContent.slimscroll({
				destroy: true
			});
		}
		$sidebarContent.slimscroll({
			height: window.innerHeight,
			size: '4px'
		});
	}

	toggleSidebarOverflow($event) {
		jQuery('#builderSidebar').css('z-index', $event ? '2' : '0');
		jQuery('.js-builder-sidebar-content, .slimScrollDiv').css('overflow', $event ? 'visible' : 'hidden');
	}

	addQuestionTypeToList(qType: QuestionTypeDefinition) {
		this.addQuestionType.emit(qType);
	}

	addSectionToList() {
		let surveyPart: QuestionTypeDefinition = {
			id: -1,
			typeName: 'Survey Part',
			icon: 'fa-archive',
			iconType: QuestionIconType.FONT_ICON
		};
		this.addQuestionType.emit(surveyPart);
	}

	onDragStart(event: any) {
		$('.collapse').collapse('hide');
		setTimeout(() => {
			let dragging = $('.smooth-dnd-ghost');
			if (dragging.length === 1) {
				dragging.find('.collapse').collapse('hide');
			}
		}, 0);
	}


	getQuestionPayload(index) {
		if (index == 0) {
			let surveyPart = {
				typeName: 'Survey Part',
				icon: 'fa-archive'
			};
			return surveyPart;
		} else {
			return this.questionTypeDefinitions[index-1];
		}
	}
}

