import { Component, OnInit, ViewEncapsulation, ElementRef, Output, EventEmitter } from '@angular/core';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { AppConfig } from '../../../app.config';

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

	@Output() addQuestionType: EventEmitter<QuestionTypeDefinition> = new EventEmitter();


	constructor(private surveyBuilderService: SurveyBuilderService, config: AppConfig, el: ElementRef) {
		this.config = config.getConfig();
		this.$el = jQuery(el.nativeElement);
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
}

