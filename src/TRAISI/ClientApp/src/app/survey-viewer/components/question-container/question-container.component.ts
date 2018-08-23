import {Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
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


	@ViewChild("container", {read: ViewContainerRef}) questionOutlet: ViewContainerRef;

	constructor(private questionLoaderService: QuestionLoaderService,
				public viewContainerRef: ViewContainerRef) {
	}

	/**
	 *
	 */
	ngOnInit() {


		this.questionLoaderService.loadQuestionComponent(this.question.questionType, this.questionOutlet);

	}

}
