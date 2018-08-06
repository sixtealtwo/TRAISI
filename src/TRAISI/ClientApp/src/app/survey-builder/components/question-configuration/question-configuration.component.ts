import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionPartView } from '../../models/question-part-view.model';
import { AuthService } from '../../../services/auth.service';
import { ConfigurationService } from '../../../services/configuration.service';

@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss']
})
export class QuestionConfigurationComponent implements OnInit {

	public questionType: QuestionTypeDefinition;
	public questionBeingEdited: QuestionPartView;
	public editing: boolean = false;

	public newQuestion: boolean = true;

	public configurations: any[];

	public froalaQTestOptions: any;

	@Output()
	configResult = new EventEmitter<string>();

	constructor(private authService: AuthService, private configurationService: ConfigurationService) {}

	ngOnInit() {
		this.froalaQTestOptions = this.generateFroalaOptions('Question Text');
	}

	saveConfiguration() {
		this.configResult.emit('save');
	}

	cancel() {
		this.configResult.emit('cancel');
	}

	delete() {
		this.configResult.emit('delete');
	}

	processConfigurations() {
		this.configurations = Object.keys(this.questionType.questionConfigurations);
	}

	generateFroalaOptions(placeHolder: string) {
		return {
			toolbarInline: false,
			charCounterCount: false,
			toolbarVisibleWithoutSelection: true,
			placeholderText: placeHolder,
			fontFamilySelection: true,
			fontFamily: {
				'Source Sans Pro,sans-serif': 'Source Sans Pro',
				'Arial,Helvetica,sans-serif': 'Arial',
				'Georgia,serif': 'Georgia',
				'Impact,Charcoal,sans-serif': 'Impact',
				'Tahoma,Geneva,sans-serif': 'Tahoma',
				'Times New Roman,Times,serif': 'Times New Roman',
				'Verdana,Geneva,sans-serif': 'Verdana'
			},
			toolbarButtons: [
				'bold',
				'italic',
				'underline',
				'subscript',
				'superscript',
				'color'
			],
			toolbarButtonsSM: [
				'bold',
				'italic',
				'underline',
				'subscript',
				'superscript',
				'color'
			]

		};
	}
}
