import {Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {QuestionLoaderService} from "../../services/question-loader.service";
import {NgTemplateOutlet} from "@angular/common";

@Component({
	selector: 'traisi-question-container',
	templateUrl: './question-container.component.html',
	styleUrls: ['./question-container.component.scss']
})
export class QuestionContainerComponent implements OnInit {


	@Input()
	question: any;


	@ViewChild("questionTemplate", {read: ViewContainerRef}) questionOutlet: ViewContainerRef;


	isLoaded: boolean = false;

	constructor(private questionLoaderService: QuestionLoaderService,
				public viewContainerRef: ViewContainerRef) {
	}

	/**
	 *
	 */
	ngOnInit() {


		this.questionLoaderService.loadQuestionComponent(this.question.questionType, this.questionOutlet)
			.subscribe((componentRef:ComponentRef<any>) => {
				this.isLoaded = true;
			});

	}

}
