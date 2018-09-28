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

	@Input()
	public pageHTML: string;
	@Output()
	public pageHTMLChange = new EventEmitter();

	@Output() public forceSave = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

	clearUploads() {}

	updateFooterContent(contentInfo: any) {
		this.pageHTMLChange.emit(this.pageHTML);
	}
}
