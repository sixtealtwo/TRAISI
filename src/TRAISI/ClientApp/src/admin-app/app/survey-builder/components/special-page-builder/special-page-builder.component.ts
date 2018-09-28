import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation, ComponentRef } from '@angular/core';
import { Header1Component } from './header1/header1.component';
import { MainSurveyAccess1Component } from './main-survey-access1/main-survey-access1.component';
import { TextBlock1Component } from './text-block1/text-block1.component';
import { Header2Component } from './header2/header2.component';
import { IContainerOptions } from '../../../shared/ngx-smooth-dnd/container/container.component';

@Component({
  selector: 'app-special-page-builder',
  templateUrl: './special-page-builder.component.html',
	styleUrls: ['./special-page-builder.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SpecialPageBuilderComponent implements OnInit {

	public loadedComponents: boolean = false;

	public headerKey: string;
	public headerComponent: any;
	private headerComponentInstance: any;
	public headerHTML: string;
	public headerInputs;
	public headerOutputs;

	public surveyAccessKey: string;
	public surveyAccessComponent: any;
	public surveyAccessHTML: string;
	public surveyAccessInputs;
	public surveyAccessOutputs;

	public componentKeys: string[] = [];
	public componentList: any[] = [];
	public componentHTML: string[] = [];

	public footerKey: string;
	public footerComponent: any;
	public footerHTML: string;
	public footerInputs;
	public footerOutputs;

	private dragOverContainer: Object = new Object();

	@Input() public pageType: string;
	@Input() public pageHTML: string;
	@Output() public pageHTMLChange = new EventEmitter();

	@Output() public forceSave = new EventEmitter();

  constructor() {
		this.headerShouldAcceptDrop = this.headerShouldAcceptDrop.bind(this);
	 }

  ngOnInit() {

		// deserailize page data
		try {
			let pageData = JSON.parse(this.pageHTML);
			Object.keys(pageData).forEach(q => {
				if (q.startsWith('header')) {
					this.headerKey = q;
					this.headerComponent = this.getComponent(q);
					this.headerHTML = pageData[q];
				} else {
					this.componentKeys.push(q);
					this.componentList.push(this.getComponent(q));
					this.componentHTML.push(pageData[q]);
				}
			});
		} catch (e) {
			if (this.pageType === 'welcome') {
				this.componentKeys.push('mainSurveyAccess1');
				this.componentList.push(this.getComponent('mainSurveyAccess1'));
				this.componentHTML.push('');

				this.componentKeys.push('textBlock1');
				this.componentList.push(this.getComponent('textBlock1'));
				this.componentHTML.push('');
			} else if (this.pageType === 'privacyPolicy') {
				this.componentKeys.push('textBlock1');
				this.componentList.push(this.getComponent('textBlock1'));
				this.componentHTML.push('');
			} else if (this.pageType === 'thankYou') {
				this.componentKeys.push('textBlock1');
				this.componentList.push(this.getComponent('textBlock1'));
				this.componentHTML.push('');
			}
		}
		this.setComponentInputs();
		this.loadedComponents = true;
	}

	private setComponentInputs() {
		this.headerInputs = {
			pageHTML: this.headerHTML
		};
		this.headerOutputs = {
			pageHTMLChange: (value: string) => this.headerHTML = value,
			forceSave: () => this.forcePageSave()
		};
		this.surveyAccessInputs = {
			pageHTML: this.surveyAccessHTML
		};
		this.surveyAccessOutputs = {
			pageHTMLChange: (value: string) => this.surveyAccessHTML = value,
			forceSave: () => this.forcePageSave()
		};
		this.footerInputs = {
			pageHTML: this.footerHTML
		};
		this.footerOutputs = {
			pageHTMLChange: (value: string) => this.footerHTML = value,
			forceSave: () => this.forcePageSave()
		};
	}

	private getComponent(componentName: string) {
		switch (componentName) {
			case 'header1':
				return Header1Component;
				break;
			case 'header2':
				return Header2Component;
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
		if (this.headerKey) {
			pageJson[this.headerKey] = this.headerHTML;
		}
		this.componentKeys.forEach((componentName, index) => {
			pageJson[componentName] = this.componentHTML[index];
		});
		this.pageHTML = JSON.stringify(pageJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}

	forcePageSave() {
		this.forceSave.emit();
	}

	headerComponentCreated(compRef: ComponentRef<any>) {
		this.headerComponentInstance = compRef.instance;
	}

	headerShouldAcceptDrop(sourceContainerOptions, payload) {
		if (sourceContainerOptions.groupName === 'special-header' && this.headerComponent === undefined) {
			return true;
		}
		return false;
	}

	onDragEnter(containerName: string) {
		this.dragOverContainer[containerName] = true;
	}

	onDragLeave(containerName: string) {
		this.dragOverContainer[containerName] = false;
	}


	onHeaderDrop(dropResult: any) {
		this.headerKey = dropResult.payload;
		this.headerComponent = this.getComponent(this.headerKey);
		this.headerHTML = '';
		this.headerInputs = {
			pageHTML: this.headerHTML
		};
		this.dragOverContainer = new Object();
	}

	deleteHeaderComponent() {
		this.headerKey = undefined;
		this.headerComponentInstance.clearUploads();
		this.headerComponentInstance = undefined;
		this.headerComponent = undefined;
		this.headerHTML = undefined;
		this.forcePageSave();
	}

	shouldAnimateDrop(sourceContainerOptions: IContainerOptions, payload: any) {
		return false;
	}
}
