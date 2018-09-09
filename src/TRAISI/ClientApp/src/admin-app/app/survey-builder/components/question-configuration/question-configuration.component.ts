import {
	Component,
	OnInit,
	Output,
	EventEmitter,
	ViewChildren,
	ViewContainerRef,
	QueryList,
	ComponentFactoryResolver,
	ChangeDetectorRef,
	AfterViewInit
} from '@angular/core';
import { QuestionTypeDefinition } from '../../models/question-type-definition';
import { QuestionPartView } from '../../models/question-part-view.model';
import { AuthService } from '../../../../../shared/services/auth.service';
import { ConfigurationService } from '../../../../../shared/services/configuration.service';
import { CheckboxComponent } from './checkbox-field/checkbox.component';
import { QuestionConfigurationDefinition } from '../../models/question-configuration-definition.model';
import { DateInputComponent } from './date-input-field/date-input.component';
import { DropdownListComponent } from './dropdown-list-field/dropdown-list.component';
import { MultiSelectComponent } from './multi-select-field/multi-select.component';
import { TextboxComponent } from './textbox-field/textbox.component';
import { TextAreaComponent } from './textarea-field/textarea.component';
import { NumericTextboxComponent } from './numeric-textbox-field/numeric-textbox.component';
import { SliderComponent } from './slider-field/slider.component';
import { SwitchComponent } from './switch-field/switch.component';
import { TimeInputComponent } from './time-input-field/time-input.component';
import { LocationFieldComponent } from './location-field/location.component';
import { RadioComponent } from './radio-field/radio.component';
import { SurveyBuilderService } from '../../services/survey-builder.service';
import { QuestionConfigurationValue } from '../../models/question-configuration-value.model';
import { TreeviewItem } from 'ngx-treeview';

@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss']
})
export class QuestionConfigurationComponent implements OnInit, AfterViewInit {
	public surveyId: number;

	public questionType: QuestionTypeDefinition;
	public questionBeingEdited: QuestionPartView;
	public editing: boolean = false;

	public newQuestion: boolean = true;

	public configurations: QuestionConfigurationDefinition[] = [];

	public configurationValues: QuestionConfigurationValue[] = [];

	public childrenComponents = [];

	public froalaQTestOptions: any;

	public fullStructure: TreeviewItem[] = [];
	public questionOptionsAfter: TreeviewItem[] = [];
	public questionsBefore: TreeviewItem[] = [];
	public thisQuestion: TreeviewItem[] = [];

	public conditionalsLoaded: boolean = false;

	@Output()
	configResult = new EventEmitter<string>();

	@ViewChildren('dynamic', { read: ViewContainerRef })
	public configTargets: QueryList<ViewContainerRef>;

	constructor(
		private builderService: SurveyBuilderService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private cDRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.froalaQTestOptions = this.generateFroalaOptions('Question Text');
	}

	ngAfterViewInit() {
		// this.updateAdvancedParams();
		setTimeout(() => {
			this.configTargets.changes.subscribe(item => {
				this.updateAdvancedParams();
			});
		}, 2000);
	}

	updateAdvancedParams() {
		const paramComponents = this.parameterComponents();
		this.childrenComponents = [];
		if (this.configurations.length > 0) {
			this.builderService
				.getQuestionPartConfigurations(this.surveyId, this.questionBeingEdited.questionPart.id)
				.subscribe(configurationValues => {
					for (let i = 0; i < this.configTargets.toArray().length; i++) {
						let conf = this.configurations[i];
						let component = paramComponents[conf.builderType];

						if (component) {
							let target = this.configTargets.toArray()[i];
							target.clear();
							let paramComponent = this.componentFactoryResolver.resolveComponentFactory(component);

							let cmpRef: any = target.createComponent(paramComponent);

							cmpRef.instance.id = i;
							cmpRef.instance.questionConfiguration = conf;
							if (configurationValues.has(conf.name)) {
								cmpRef.instance.processPriorValue(configurationValues.get(conf.name));
							}
							this.childrenComponents.push(cmpRef);
						}
					}
				});
		}
		// this.cDRef.detectChanges();
	}

	parameterComponents() {
		let widgetComponents = {
			Checkbox: CheckboxComponent,
			Date: DateInputComponent,
			SingleSelect: DropdownListComponent,
			MultiSelect: MultiSelectComponent,
			Text: TextboxComponent,
			TextArea: TextAreaComponent,
			NumericText: NumericTextboxComponent,
			Slider: SliderComponent,
			Switch: SwitchComponent,
			Time: TimeInputComponent,
			Location: LocationFieldComponent,
			Radio: RadioComponent
		};

		return widgetComponents;
	}

	advancedConfig() {
		setTimeout(() => {
			window.dispatchEvent(new Event('resize'));
		}, 0);
	}

	saveConfiguration() {
		this.configurationValues = [];
		this.childrenComponents.forEach(compRef => {
			this.configurationValues.push(
				new QuestionConfigurationValue(compRef.instance.questionConfiguration.name, compRef.instance.getValue())
			);
		});
		this.configResult.emit('save');
	}

	cancel() {
		this.configResult.emit('cancel');
	}

	delete() {
		this.configResult.emit('delete');
	}

	processConfigurations() {
		this.configurations = Object.values(this.questionType.questionConfigurations);
		this.builderService.getStandardViewPagesStructureWithQuestionsOptions(this.surveyId, 'en').subscribe(
			treelist => {
				this.fullStructure = treelist;
				this.processQuestionTree();
				this.conditionalsLoaded = true;
			}
		);
	}

	private processQuestionTree() {
		this.questionsBefore = [];
		this.questionOptionsAfter = [];
		this.thisQuestion = [];
		let questionHitThisPage: boolean = false;
		this.fullStructure.forEach(treeElement => {
			let page = {
				value: treeElement.value,
				text: treeElement.text,
				checked: false,
				children: []
			};

			if (treeElement.children) {
				let { pageReturn, questionHitReturn } = this.processQuestionPageIntoTree(page, treeElement, questionHitThisPage);
				page = pageReturn;
				questionHitThisPage = questionHitReturn;
			}
			if (questionHitThisPage && page.children.length > 0) {
				this.questionOptionsAfter.push(new TreeviewItem(page));
			} else if (page.children.length > 0) {
				this.questionsBefore.push(new TreeviewItem(page));
			}
		});
	}

	private processQuestionPageIntoTree(page: any, treeElement: TreeviewItem, questionHit: boolean)
	{
		for (let element of treeElement.children) {
			if (element.value === `question-${this.questionBeingEdited.id}`) {
				this.thisQuestion = [element];
				if (page.children.length > 0) {
					this.questionsBefore.push(new TreeviewItem(page));
					page = {
						value: treeElement.value,
						text: treeElement.text,
						checked: false,
						children: []
					};
				}
				questionHit = true;
			} else {
				if (!questionHit) {
					this.clearOptionsFromElement(element);
				}
				let elementCopy = {
					value: element.value,
					text: element.text,
					checked: false,
					children: []
				};
				if (element.children) {
					let { pageReturn, questionHitReturn } = this.processQuestionPartIntoTree(page, element, elementCopy, questionHit);
					page = pageReturn;
					questionHit = questionHitReturn;
				}
				page.children.push(new TreeviewItem(elementCopy));
			}
		}
		return { pageReturn: page, questionHitReturn: questionHit};
	}

	private processQuestionPartIntoTree(page: any, partSource: TreeviewItem, part, questionHit: boolean)
	{
		for (let element of partSource.children) {
			if (element.value === `question-${this.questionBeingEdited.id}`) {
				this.thisQuestion = [element];
				if (page.children.length > 0) {
					this.questionsBefore.push(new TreeviewItem(page));
					page = {
						value: page.value,
						text: page.text,
						checked: false,
						children: []
					};
				}
				questionHit = true;
			} else {
				part.children.push(element);
			}
		}
		return {pageReturn: page, questionHitReturn: questionHit};
	}

	private clearOptionsFromElement(element: TreeviewItem) {
		if (element.children && element.children.length > 0) {
			if ((<string>element.children[0].value).startsWith('option')) {
				element.children = undefined;
			} else {
				element.children.forEach(child => {
					this.clearOptionsFromElement(child);
				});
			}
		}
	}


	generateFroalaOptions(placeHolder: string) {
		return {
			toolbarInline: false,
			charCounterCount: false,
			toolbarVisibleWithoutSelection: true,
			placeholderText: placeHolder,
			fontFamilySelection: true,
			enter: (<any>$).FroalaEditor.ENTER_BR,
			fontFamily: {
				'Source Sans Pro,sans-serif': 'Source Sans Pro',
				'Arial,Helvetica,sans-serif': 'Arial',
				'Georgia,serif': 'Georgia',
				'Impact,Charcoal,sans-serif': 'Impact',
				'Tahoma,Geneva,sans-serif': 'Tahoma',
				'Times New Roman,Times,serif': 'Times New Roman',
				'Verdana,Geneva,sans-serif': 'Verdana'
			},
			toolbarButtons: ['bold', 'italic', 'underline', 'subscript', 'superscript', 'color'],
			toolbarButtonsSM: ['bold', 'italic', 'underline', 'subscript', 'superscript', 'color']
		};
	}
}
