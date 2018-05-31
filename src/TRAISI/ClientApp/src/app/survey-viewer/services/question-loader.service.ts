import { Injectable, Compiler, SkipSelf, Injector, SystemJsNgModuleLoader, ComponentFactory } from '@angular/core';
import { QuestionLoaderEndpointService } from './question-loader-endpoint.service';
import { Observable, of, Operator } from 'rxjs';
import 'rxjs/add/observable/of';



declare const SystemJS;

@Injectable({
	providedIn: 'root'
})
export class QuestionLoaderService {


	/**
	 *
	 * @param questionType
	 */
	public getQuestionComponentFactory(questionType: string): Observable<any> {


		let obs: Observable<any> = Observable.create(() => {
			SystemJS.import('a.module.js').then((module) => {
				const moduleFactory = this.compiler.compileModuleSync(module.default);
				const moduleRef = moduleFactory.create(this.injector);
				const widgets = moduleRef.injector.get('widgets');
				const resolver = moduleRef.componentFactoryResolver;
				const componentFactory: ComponentFactory<any> = resolver.resolveComponentFactory(widgets[0][0].component);
			});
		});

		return obs;
	}


	/**
	 *
	 * @param _questionLoaderEndpointService
	 * @param compiler
	 * @param injector
	 * @param moduleLoader
	 */
	constructor(private _questionLoaderEndpointService: QuestionLoaderEndpointService,
		private compiler: Compiler, @SkipSelf() private injector: Injector,
		private moduleLoader: SystemJsNgModuleLoader) {


	}
}
