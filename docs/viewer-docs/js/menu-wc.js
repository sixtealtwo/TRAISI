'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Survey Viewer App</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse" ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' : 'data-target="#xs-components-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' :
                                            'id="xs-components-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' }>
                                            <li class="link">
                                                <a href="components/AdminToolbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminToolbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Footer1Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Footer1Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Header1Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Header1Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/Header2Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">Header2Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainSurveyAccess1Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MainSurveyAccess1Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrivacyConfirmationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PrivacyConfirmationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuestionContainerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuestionContainerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuestionPlaceholderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuestionPlaceholderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpecialPageBuilderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SpecialPageBuilderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyErrorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyGroupcodePageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyGroupcodePageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyHeaderDisplayComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyHeaderDisplayComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyScreeningPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyScreeningPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyShortcodeDisplayPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyShortcodeDisplayPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyShortcodePageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyShortcodePageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyStartPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyStartPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyTermsPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyTermsPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyThankYouPageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyThankYouPageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyViewerContainerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyViewerContainerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextBlock1Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TextBlock1Component</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' : 'data-target="#xs-injectables-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' :
                                        'id="xs-injectables-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' }>
                                        <li class="link">
                                            <a href="injectables/AppTranslationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppTranslationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ConfigurationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ConfigurationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStoreManager.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStoreManager</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QuestionLoaderEndpointService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>QuestionLoaderEndpointService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/QuestionLoaderService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>QuestionLoaderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SurveyResponderEndpointService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SurveyResponderEndpointService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SurveyViewerConditionalEvaluator.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SurveyViewerConditionalEvaluator</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SurveyViewerEndpointFactory.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SurveyViewerEndpointFactory</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SurveyViewerEndpointService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SurveyViewerEndpointService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SurveyViewerSession.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SurveyViewerSession</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SurveyViewerStateService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SurveyViewerStateService</a>
                                        </li>
                                    </ul>
                                </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' : 'data-target="#xs-pipes-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' :
                                            'id="xs-pipes-links-module-AppModule-f4e0c792e242bc4bd2efba676806b832"' }>
                                            <li class="link">
                                                <a href="pipes/SafeHtmlPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafeHtmlPipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SafePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-CoreModule-459e5764ac9a6a0ff2aba6b4077abf0d"' : 'data-target="#xs-directives-links-module-CoreModule-459e5764ac9a6a0ff2aba6b4077abf0d"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-CoreModule-459e5764ac9a6a0ff2aba6b4077abf0d"' :
                                        'id="xs-directives-links-module-CoreModule-459e5764ac9a6a0ff2aba6b4077abf0d"' }>
                                        <li class="link">
                                            <a href="directives/LoadingPlaceholderDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoadingPlaceholderDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#directives-links"' :
                                'data-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/SurveyInternalViewDirective.html" data-type="entity-link">SurveyInternalViewDirective</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AlertDialog.html" data-type="entity-link">AlertDialog</a>
                            </li>
                            <li class="link">
                                <a href="classes/AlertMessage.html" data-type="entity-link">AlertMessage</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewBlock.html" data-type="entity-link">NewBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/Permission.html" data-type="entity-link">Permission</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyContainer.html" data-type="entity-link">SurveyContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyGroupContainer.html" data-type="entity-link">SurveyGroupContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyPageContainer.html" data-type="entity-link">SurveyPageContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyQuestionContainer.html" data-type="entity-link">SurveyQuestionContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyRepeatContainer.html" data-type="entity-link">SurveyRepeatContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveySectionContainer.html" data-type="entity-link">SurveySectionContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveySectionRepeatContainer.html" data-type="entity-link">SurveySectionRepeatContainer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyStart.html" data-type="entity-link">SurveyStart</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyUser.html" data-type="entity-link">SurveyUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyViewer.html" data-type="entity-link">SurveyViewer</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyViewerTranslateLanguageLoader.html" data-type="entity-link">SurveyViewerTranslateLanguageLoader</a>
                            </li>
                            <li class="link">
                                <a href="classes/TranslateLanguageLoader.html" data-type="entity-link">TranslateLanguageLoader</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AlertService.html" data-type="entity-link">AlertService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppTranslationService.html" data-type="entity-link">AppTranslationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link">AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ConfigurationService.html" data-type="entity-link">ConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DBkeys.html" data-type="entity-link">DBkeys</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EndpointFactory.html" data-type="entity-link">EndpointFactory</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtHelper.html" data-type="entity-link">JwtHelper</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStoreManager.html" data-type="entity-link">LocalStoreManager</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuestionLoaderEndpointService.html" data-type="entity-link">QuestionLoaderEndpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/QuestionLoaderService.html" data-type="entity-link">QuestionLoaderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyEndpointFactoryService.html" data-type="entity-link">SurveyEndpointFactoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyResponderEndpointService.html" data-type="entity-link">SurveyResponderEndpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyResponderService.html" data-type="entity-link">SurveyResponderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerApiEndpointService.html" data-type="entity-link">SurveyViewerApiEndpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerConditionalEvaluator.html" data-type="entity-link">SurveyViewerConditionalEvaluator</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerConfigurationService.html" data-type="entity-link">SurveyViewerConfigurationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerEndpointFactory.html" data-type="entity-link">SurveyViewerEndpointFactory</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerEndpointService.html" data-type="entity-link">SurveyViewerEndpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerNavigationService.html" data-type="entity-link">SurveyViewerNavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerService.html" data-type="entity-link">SurveyViewerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerSession.html" data-type="entity-link">SurveyViewerSession</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerStateService.html" data-type="entity-link">SurveyViewerStateService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyViewerTranslationService.html" data-type="entity-link">SurveyViewerTranslationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Utilities.html" data-type="entity-link">Utilities</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/IdToken.html" data-type="entity-link">IdToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponse.html" data-type="entity-link">LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpecialPageDataInput.html" data-type="entity-link">SpecialPageDataInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SpecialPageDataInput-1.html" data-type="entity-link">SpecialPageDataInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyQuestionComponent.html" data-type="entity-link">SurveyQuestionComponent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewConditional.html" data-type="entity-link">SurveyViewConditional</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewerSessionData.html" data-type="entity-link">SurveyViewerSessionData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewerState.html" data-type="entity-link">SurveyViewerState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewerTheme.html" data-type="entity-link">SurveyViewerTheme</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewerThemeTemplate.html" data-type="entity-link">SurveyViewerThemeTemplate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewGroupcodePage.html" data-type="entity-link">SurveyViewGroupcodePage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewGroupMember.html" data-type="entity-link">SurveyViewGroupMember</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewPage.html" data-type="entity-link">SurveyViewPage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewQuestion.html" data-type="entity-link">SurveyViewQuestion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewQuestionOption.html" data-type="entity-link">SurveyViewQuestionOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewScreening.html" data-type="entity-link">SurveyViewScreening</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewSection.html" data-type="entity-link">SurveyViewSection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewTermsModel.html" data-type="entity-link">SurveyViewTermsModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyViewThankYouModel.html" data-type="entity-link">SurveyViewThankYouModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SurveyWelcomeModel.html" data-type="entity-link">SurveyWelcomeModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserConfiguration.html" data-type="entity-link">UserConfiguration</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});