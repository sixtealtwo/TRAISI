import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-special-page-builder',
  templateUrl: './special-page-builder.component.html',
	styleUrls: ['./special-page-builder.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SpecialPageBuilderComponent implements OnInit {

	public headerHTML: string;
	public mainSurveyAccessHTML: string;
	public aboutHTML: string;

	@Input() public pageHTML: string;
	@Output() public pageHTMLChange = new EventEmitter();

	@Output() public forceSave = new EventEmitter();

  constructor() { }

  ngOnInit() {

		// deserailize page data
		try {
			let pageData = JSON.parse(this.pageHTML);
			this.headerHTML = pageData.header;
			this.mainSurveyAccessHTML = pageData.mainSurveyAccess;
			this.aboutHTML = pageData.about;
		} catch (e) {
			this.headerHTML = '';
			this.mainSurveyAccessHTML = '';
			this.aboutHTML = '';
		}
  }

	updatePageData() {
		let pageJson = {
			header: this.headerHTML,
			mainSurveyAccess: this.mainSurveyAccessHTML,
			about: this.aboutHTML
		};
		this.pageHTML = JSON.stringify(pageJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}

	forcePageSave(event: any) {
		this.forceSave.emit();
	}

}
