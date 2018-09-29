import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-footer1',
  templateUrl: './footer1.component.html',
	styleUrls: ['./footer1.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class Footer1Component implements OnInit {

	public quillMinimalModules = {
		toolbar: [
			['bold', 'italic', 'underline', 'strike'],
			[{ size: [] }],
			[{ align: [] }]
		]
	};

	public footerColour: string = '#242424';

	private pageHTMLJson: any;
	@Input()
	public pageHTML: string;
	@Output()
	public pageHTMLChange = new EventEmitter();

	@Output() public forceSave = new EventEmitter();

  constructor() { }

  ngOnInit() {
		try {
			let pageData = JSON.parse(this.pageHTML);
			this.pageHTMLJson = pageData;
			this.footerColour = pageData.footerColour;
		} catch (e) {
			this.pageHTMLJson = {};
			this.pageHTMLJson.html = '';
			this.pageHTMLJson.footerColour = '#242424';
		}
	}

	quillEditorCreated(quillInstance: any) {
		setTimeout(() => {
			if (this.pageHTML === undefined || this.pageHTML === '') {
				quillInstance.format('align', 'center', 'api');
			}
		}, 0);
	}

	clearUploads() {}

	updateFooterContent(contentInfo: any) {
		this.pageHTML = JSON.stringify(this.pageHTMLJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}

	footerColourChange(newColour: string) {
		this.footerColour = newColour;
		this.pageHTMLJson.footerColour = this.footerColour;
		this.pageHTML = JSON.stringify(this.pageHTMLJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}
}
