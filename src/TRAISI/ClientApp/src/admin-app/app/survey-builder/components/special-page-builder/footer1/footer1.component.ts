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
			[{ 'color': [] }],
			[{ align: [] }]
		]
	};

	private pageHTMLJson: any;

	@Input()
	public pageThemeInfo: any;
	@Input()
	public pageHTML: string;
	@Output()
	public pageThemeInfoChange = new EventEmitter();
	@Output()
	public pageHTMLChange = new EventEmitter();

	@Output() public forceSave = new EventEmitter();

  constructor() { }

  public ngOnInit(): void {
		try {
			let pageData = JSON.parse(this.pageHTML);
			this.pageHTMLJson = pageData;
		} catch (e) {
			this.pageHTMLJson = {};
			this.pageHTMLJson.html = '';
		}
		if (!('footerColour' in this.pageThemeInfo)) {
			this.pageThemeInfo.footerColour = '#242424';
		}
	}

	public quillEditorCreated(quillInstance: any): void {
		setTimeout(() => {
			if (this.pageHTMLJson.html === undefined || this.pageHTMLJson.html === '') {
				quillInstance.format('align', 'center', 'api');
				quillInstance.format('color', '#ffffff', 'api');
			}
		}, 0);
	}

	public clearUploads(): void {}

	public updateFooterContent(contentInfo: any): void {
		this.pageHTML = JSON.stringify(this.pageHTMLJson);
		this.pageHTMLChange.emit(this.pageHTML);
	}

	public footerColourChange(newColour: string): void  {
		this.pageThemeInfo.footerColour = newColour;
		this.pageThemeInfoChange.emit(this.pageThemeInfo);
	}
}
