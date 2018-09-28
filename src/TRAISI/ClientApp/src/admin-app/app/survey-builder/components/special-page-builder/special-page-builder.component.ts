import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Header1Component } from './header1/header1.component';
import { MainSurveyAccess1Component } from './main-survey-access1/main-survey-access1.component';
import { TextBlock1Component } from './text-block1/text-block1.component';

@Component({
  selector: 'app-special-page-builder',
  templateUrl: './special-page-builder.component.html',
	styleUrls: ['./special-page-builder.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SpecialPageBuilderComponent implements OnInit {

	public loadedComponents: boolean = false;
	public componentKeys: string[] = [];
	public componentList: any[] = [];
	public componentHTML: string[] = [];

	public headerHTML: string;
	public mainSurveyAccessHTML: string;
	public aboutHTML: string;

	@Input() public pageType: string;
	@Input() public pageHTML: string;
	@Output() public pageHTMLChange = new EventEmitter();

	@Output() public forceSave = new EventEmitter();

  constructor() { }

  ngOnInit() {

		// deserailize page data
		try {
			let pageData = JSON.parse(this.pageHTML);
			Object.keys(pageData).forEach(q => {
				this.componentKeys.push(q);
				this.componentList.push(this.getComponent(q));
				this.componentHTML.push(pageData[q]);
			});
		} catch (e) {
			if (this.pageType === 'welcome') {
				this.componentKeys.push('header1');
				this.componentList.push(this.getComponent('header1'));
				this.componentHTML.push('');

				this.componentKeys.push('mainSurveyAccess1');
				this.componentList.push(this.getComponent('mainSurveyAccess1'));
				this.componentHTML.push('');

				this.componentKeys.push('textBlock1');
				this.componentList.push(this.getComponent('textBlock1'));
				this.componentHTML.push('');
			} else if (this.pageType === 'privacyPolicy') {
				this.componentKeys.push('header1');
				this.componentList.push(this.getComponent('header1'));
				this.componentHTML.push('');
				this.componentKeys.push('textBlock1');
				this.componentList.push(this.getComponent('textBlock1'));
				this.componentHTML.push('');
			} else if (this.pageType === 'thankYou') {
				this.componentKeys.push('header1');
				this.componentList.push(this.getComponent('header1'));
				this.componentHTML.push('');
				this.componentKeys.push('textBlock1');
				this.componentList.push(this.getComponent('textBlock1'));
				this.componentHTML.push('');
			}
		}
		this.loadedComponents = true;
	}

	private getComponent(componentName: string) {
		switch (componentName) {
			case 'header1':
				return Header1Component;
				break;
			case 'mainSurveyAccess1':
				return MainSurveyAccess1Component;
				break;
			case 'textBlock1':
				return TextBlock1Component;
				break;
			default:
				return null;
				break;
		}
	}

	getComponentInputs(index: number) {
		let inputs = {
			pageHTML: this.componentHTML[index]
		};
		return inputs;
	}

	getComponentOutputs(index: number) {
		let outputs = {
			pageHTMLChange: (value: string) => this.componentHTML[index] = value,
			forceSave: () => this.forcePageSave()
		};
		return outputs;
	}

	updatePageData() {
		let pageJson = {};
		this.componentKeys.forEach((componentName, index) => {
			pageJson[componentName] = this.componentHTML[index];
		});
		this.pageHTML = JSON.stringify(pageJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}

	forcePageSave() {
		this.forceSave.emit();
	}

}
