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
import { AuthService } from '../../../services/auth.service';
import { ConfigurationService } from '../../../services/configuration.service';
import { CheckboxComponent } from './checkbox-field/checkbox.component';
import { QuestionConfigurationDefinition } from '../../models/question-configuration-definition.model';

@Component({
	selector: 'app-question-configuration',
	templateUrl: './question-configuration.component.html',
	styleUrls: ['./question-configuration.component.scss']
})
export class QuestionConfigurationComponent implements OnInit, AfterViewInit {
	public questionType: QuestionTypeDefinition;
	public questionBeingEdited: QuestionPartView;
	public editing: boolean = false;

	public newQuestion: boolean = true;

	public configurations: QuestionConfigurationDefinition[] =  [];
	public childrenComponents = [];

	public froalaQTestOptions: any;

	@Output()
	configResult = new EventEmitter<string>();

	@ViewChildren('dynamic', { read: ViewContainerRef })
	public configTargets: QueryList<ViewContainerRef>;

	constructor(
		private authService: AuthService,
		private configurationService: ConfigurationService,
		private componentFactoryResolver: ComponentFactoryResolver,
		private cDRef: ChangeDetectorRef
	) {}

	ngOnInit() {
		this.froalaQTestOptions = this.generateFroalaOptions('Question Text');
		console.log('Is this working!?!?');
	}

	ngAfterViewInit() {
		this.updateAdvancedParams();
		this.configTargets.changes.subscribe(item => {
			this.updateAdvancedParams();
		});
	}

	updateAdvancedParams() {
		const widgetComponents = this.parameterComponents();
		for (let i = 0; i < this.configTargets.toArray().length; i++) {
			let conf = this.configurations[i];
			let component = widgetComponents['checkbox'];

			if (component) {
				let target = this.configTargets.toArray()[i];
				let widgetComponent = this.componentFactoryResolver.resolveComponentFactory(
					component
				);

				let cmpRef: any = target.createComponent(widgetComponent);

				cmpRef.instance.title = conf.name;
				cmpRef.instance.name = conf.name;
				this.childrenComponents.push(cmpRef);
			}
		}
		this.cDRef.detectChanges();
	}

	parameterComponents() {
		let widgetComponents = {
			'checkbox': CheckboxComponent,
			/*1: RadioButtonsComponent,
			2: SliderComponent,
			3: NumericTextboxComponent,
			4: DropdownListComponent,
			5: MultiSelectComponent,
			6: SwitchComponent,
			7: TextboxComponent,
			8: DateInputComponent*/
		};

		return widgetComponents;
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
		this.configurations = Object.values(this.questionType.questionConfigurations);
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
			toolbarButtons: ['bold', 'italic', 'underline', 'subscript', 'superscript', 'color'],
			toolbarButtonsSM: ['bold', 'italic', 'underline', 'subscript', 'superscript', 'color']
		};
	}
}
