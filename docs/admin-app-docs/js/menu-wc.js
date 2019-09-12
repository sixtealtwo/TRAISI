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
                    <a href="index.html" data-type="index-link">Admin App</a>
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
                                <a href="modules/AccountManagementModule.html" data-type="entity-link">AccountManagementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AccountManagementModule-bb6678230c8a432eb654056d9cfea319"' : 'data-target="#xs-components-links-module-AccountManagementModule-bb6678230c8a432eb654056d9cfea319"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccountManagementModule-bb6678230c8a432eb654056d9cfea319"' :
                                            'id="xs-components-links-module-AccountManagementModule-bb6678230c8a432eb654056d9cfea319"' }>
                                            <li class="link">
                                                <a href="components/UserInfoComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserInfoComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UserPreferencesComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UserPreferencesComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminAppModule.html" data-type="entity-link">AdminAppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' : 'data-target="#xs-components-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' :
                                            'id="xs-components-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' }>
                                            <li class="link">
                                                <a href="components/AdminAppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AdminAppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ErrorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ErrorComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' : 'data-target="#xs-directives-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' :
                                        'id="xs-directives-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' }>
                                        <li class="link">
                                            <a href="directives/AutofocusDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">AutofocusDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/BootstrapDatepickerDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">BootstrapDatepickerDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/BootstrapSelectDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">BootstrapSelectDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/BootstrapTabDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">BootstrapTabDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/BootstrapToggleDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">BootstrapToggleDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/EqualValidator.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">EqualValidator</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/LastElementDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">LastElementDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' : 'data-target="#xs-injectables-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' :
                                        'id="xs-injectables-links-module-AdminAppModule-52bb6353af1350dfec8464a0b0828f27"' }>
                                        <li class="link">
                                            <a href="injectables/AdminAppConfig.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AdminAppConfig</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AppTranslationService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppTranslationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EndpointFactory.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>EndpointFactory</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStoreManager.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStoreManager</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppRoutingModule-8e25fd826a013051b49191b4445c0d77"' : 'data-target="#xs-injectables-links-module-AppRoutingModule-8e25fd826a013051b49191b4445c0d77"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppRoutingModule-8e25fd826a013051b49191b4445c0d77"' :
                                        'id="xs-injectables-links-module-AppRoutingModule-8e25fd826a013051b49191b4445c0d77"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DashboardModule.html" data-type="entity-link">DashboardModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-DashboardModule-c2a68f110d35a2f77a811f69f861c3f8"' : 'data-target="#xs-components-links-module-DashboardModule-c2a68f110d35a2f77a811f69f861c3f8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-DashboardModule-c2a68f110d35a2f77a811f69f861c3f8"' :
                                            'id="xs-components-links-module-DashboardModule-c2a68f110d35a2f77a811f69f861c3f8"' }>
                                            <li class="link">
                                                <a href="components/DashboardComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DashboardComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/GroupsManagementModule.html" data-type="entity-link">GroupsManagementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-GroupsManagementModule-1e110872d1ef484030284995b3c6750d"' : 'data-target="#xs-components-links-module-GroupsManagementModule-1e110872d1ef484030284995b3c6750d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-GroupsManagementModule-1e110872d1ef484030284995b3c6750d"' :
                                            'id="xs-components-links-module-GroupsManagementModule-1e110872d1ef484030284995b3c6750d"' }>
                                            <li class="link">
                                                <a href="components/GroupsManagementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GroupsManagementComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LayoutModule.html" data-type="entity-link">LayoutModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LayoutModule-055015d6bc5aa50699d761f744f4d9c6"' : 'data-target="#xs-components-links-module-LayoutModule-055015d6bc5aa50699d761f744f4d9c6"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LayoutModule-055015d6bc5aa50699d761f744f4d9c6"' :
                                            'id="xs-components-links-module-LayoutModule-055015d6bc5aa50699d761f744f4d9c6"' }>
                                            <li class="link">
                                                <a href="components/ChatAppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChatAppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatMessageComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChatMessageComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ChatSidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ChatSidebarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LayoutComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NavbarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NavbarComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SidebarComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SidebarComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-LayoutModule-055015d6bc5aa50699d761f744f4d9c6"' : 'data-target="#xs-pipes-links-module-LayoutModule-055015d6bc5aa50699d761f744f4d9c6"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-LayoutModule-055015d6bc5aa50699d761f744f4d9c6"' :
                                            'id="xs-pipes-links-module-LayoutModule-055015d6bc5aa50699d761f744f4d9c6"' }>
                                            <li class="link">
                                                <a href="pipes/SearchPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/LoginModule.html" data-type="entity-link">LoginModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-LoginModule-60ba098cca8fcd9c60efd617083462ca"' : 'data-target="#xs-components-links-module-LoginModule-60ba098cca8fcd9c60efd617083462ca"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-LoginModule-60ba098cca8fcd9c60efd617083462ca"' :
                                            'id="xs-components-links-module-LoginModule-60ba098cca8fcd9c60efd617083462ca"' }>
                                            <li class="link">
                                                <a href="components/LoginComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LoginComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/NgxSmoothDnDModule.html" data-type="entity-link">NgxSmoothDnDModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-NgxSmoothDnDModule-30ce7e005f482ec77179dbcddb937cc3"' : 'data-target="#xs-components-links-module-NgxSmoothDnDModule-30ce7e005f482ec77179dbcddb937cc3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-NgxSmoothDnDModule-30ce7e005f482ec77179dbcddb937cc3"' :
                                            'id="xs-components-links-module-NgxSmoothDnDModule-30ce7e005f482ec77179dbcddb937cc3"' }>
                                            <li class="link">
                                                <a href="components/ContainerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ContainerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DraggableComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DraggableComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-5cf2b34920ca4a8313fa7986c4f06a14"' : 'data-target="#xs-components-links-module-SharedModule-5cf2b34920ca4a8313fa7986c4f06a14"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-5cf2b34920ca4a8313fa7986c4f06a14"' :
                                            'id="xs-components-links-module-SharedModule-5cf2b34920ca4a8313fa7986c4f06a14"' }>
                                            <li class="link">
                                                <a href="components/DropdownTreeviewSelectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DropdownTreeviewSelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ItemListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ItemListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SearchBoxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SearchBoxComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-SharedModule-5cf2b34920ca4a8313fa7986c4f06a14"' : 'data-target="#xs-pipes-links-module-SharedModule-5cf2b34920ca4a8313fa7986c4f06a14"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-SharedModule-5cf2b34920ca4a8313fa7986c4f06a14"' :
                                            'id="xs-pipes-links-module-SharedModule-5cf2b34920ca4a8313fa7986c4f06a14"' }>
                                            <li class="link">
                                                <a href="pipes/SafePipe-1.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafePipe</a>
                                            </li>
                                            <li class="link">
                                                <a href="pipes/SafePipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SafePipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SurveyBuilderModule.html" data-type="entity-link">SurveyBuilderModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' : 'data-target="#xs-components-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' :
                                            'id="xs-components-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' }>
                                            <li class="link">
                                                <a href="components/CheckboxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CheckboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DateInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DateInputComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/DropdownListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">DropdownListComponent</a>
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
                                                <a href="components/LocationFieldComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">LocationFieldComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainSurveyAccess1Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MainSurveyAccess1Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MultiSelectComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MultiSelectComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NestedDragAndDropListComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NestedDragAndDropListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/NumericTextboxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">NumericTextboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PrivacyConfirmationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PrivacyConfirmationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuestionConditionalsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuestionConditionalsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuestionConfigurationComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuestionConfigurationComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuestionDetailsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuestionDetailsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuestionTypeChooserComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuestionTypeChooserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/QuestionViewerComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">QuestionViewerComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RadioComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RadioComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ScreeningQuestionsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ScreeningQuestionsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SliderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SliderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SourceConditionalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SourceConditionalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SpecialPageBuilderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SpecialPageBuilderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SponsorsComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SponsorsComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyBuilderComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyBuilderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SwitchComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SwitchComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TargetConditionalComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TargetConditionalComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextAreaComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TextAreaComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextBlock1Component.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TextBlock1Component</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TextboxComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TextboxComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TimeInputComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TimeInputComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' : 'data-target="#xs-directives-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' :
                                        'id="xs-directives-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' }>
                                        <li class="link">
                                            <a href="directives/CustomBuilderContainerDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">CustomBuilderContainerDirective</a>
                                        </li>
                                    </ul>
                                </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' : 'data-target="#xs-injectables-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' :
                                        'id="xs-injectables-links-module-SurveyBuilderModule-1fc59f17045ef64d9c46a8fcf974f487"' }>
                                        <li class="link">
                                            <a href="injectables/CustomBuilderService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CustomBuilderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SurveyBuilderEndpointService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SurveyBuilderEndpointService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SurveyBuilderService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SurveyBuilderService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SurveyExecuteModule.html" data-type="entity-link">SurveyExecuteModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SurveyExecuteModule-62fea9aa835f8ea5a79a787a471da4e5"' : 'data-target="#xs-components-links-module-SurveyExecuteModule-62fea9aa835f8ea5a79a787a471da4e5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SurveyExecuteModule-62fea9aa835f8ea5a79a787a471da4e5"' :
                                            'id="xs-components-links-module-SurveyExecuteModule-62fea9aa835f8ea5a79a787a471da4e5"' }>
                                            <li class="link">
                                                <a href="components/ConductSurveyComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ConductSurveyComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveyExecuteComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveyExecuteComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SurveysManagementModule.html" data-type="entity-link">SurveysManagementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SurveysManagementModule-e2edf2f9395773de8acda15e2e64afd0"' : 'data-target="#xs-components-links-module-SurveysManagementModule-e2edf2f9395773de8acda15e2e64afd0"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SurveysManagementModule-e2edf2f9395773de8acda15e2e64afd0"' :
                                            'id="xs-components-links-module-SurveysManagementModule-e2edf2f9395773de8acda15e2e64afd0"' }>
                                            <li class="link">
                                                <a href="components/SurveysEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveysEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SurveysManagementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SurveysManagementComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersManagementModule.html" data-type="entity-link">UsersManagementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UsersManagementModule-d4d53d0ff96bde0dcbf47f74ef2471a5"' : 'data-target="#xs-components-links-module-UsersManagementModule-d4d53d0ff96bde0dcbf47f74ef2471a5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersManagementModule-d4d53d0ff96bde0dcbf47f74ef2471a5"' :
                                            'id="xs-components-links-module-UsersManagementModule-d4d53d0ff96bde0dcbf47f74ef2471a5"' }>
                                            <li class="link">
                                                <a href="components/RoleEditorComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RoleEditorComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/RolesManagementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RolesManagementComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/UsersManagementComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersManagementComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#pipes-links-module-UsersManagementModule-d4d53d0ff96bde0dcbf47f74ef2471a5"' : 'data-target="#xs-pipes-links-module-UsersManagementModule-d4d53d0ff96bde0dcbf47f74ef2471a5"' }>
                                            <span class="icon ion-md-add"></span>
                                            <span>Pipes</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links-module-UsersManagementModule-d4d53d0ff96bde0dcbf47f74ef2471a5"' :
                                            'id="xs-pipes-links-module-UsersManagementModule-d4d53d0ff96bde0dcbf47f74ef2471a5"' }>
                                            <li class="link">
                                                <a href="pipes/GroupByPipe.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">GroupByPipe</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/WidgetModule.html" data-type="entity-link">WidgetModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-WidgetModule-9c284b7e000066fbb572826b4424cd23"' : 'data-target="#xs-directives-links-module-WidgetModule-9c284b7e000066fbb572826b4424cd23"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-WidgetModule-9c284b7e000066fbb572826b4424cd23"' :
                                        'id="xs-directives-links-module-WidgetModule-9c284b7e000066fbb572826b4424cd23"' }>
                                        <li class="link">
                                            <a href="directives/WidgetDirective.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules">WidgetDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#components-links"' :
                            'data-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ChatAppComponent.html" data-type="entity-link">ChatAppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatMessageComponent.html" data-type="entity-link">ChatMessageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatSidebarComponent.html" data-type="entity-link">ChatSidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupsManagementComponent.html" data-type="entity-link">GroupsManagementComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LayoutComponent.html" data-type="entity-link">LayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link">NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidebarComponent.html" data-type="entity-link">SidebarComponent</a>
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
                                <a href="classes/ChatService.html" data-type="entity-link">ChatService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CodeGenerator.html" data-type="entity-link">CodeGenerator</a>
                            </li>
                            <li class="link">
                                <a href="classes/DownloadNotification.html" data-type="entity-link">DownloadNotification</a>
                            </li>
                            <li class="link">
                                <a href="classes/DropdownTreeviewSelectI18n.html" data-type="entity-link">DropdownTreeviewSelectI18n</a>
                            </li>
                            <li class="link">
                                <a href="classes/EmailTemplate.html" data-type="entity-link">EmailTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupCode.html" data-type="entity-link">GroupCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/GroupMember.html" data-type="entity-link">GroupMember</a>
                            </li>
                            <li class="link">
                                <a href="classes/Label.html" data-type="entity-link">Label</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewBlock.html" data-type="entity-link">NewBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/NewBlock-1.html" data-type="entity-link">NewBlock</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notification.html" data-type="entity-link">Notification</a>
                            </li>
                            <li class="link">
                                <a href="classes/Order.html" data-type="entity-link">Order</a>
                            </li>
                            <li class="link">
                                <a href="classes/Permission.html" data-type="entity-link">Permission</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionConditional.html" data-type="entity-link">QuestionConditional</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionConditionalSourceGroup.html" data-type="entity-link">QuestionConditionalSourceGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionConditionalTargetGroup.html" data-type="entity-link">QuestionConditionalTargetGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionConfigurationValue.html" data-type="entity-link">QuestionConfigurationValue</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionOptionConditional.html" data-type="entity-link">QuestionOptionConditional</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionOptionLabel.html" data-type="entity-link">QuestionOptionLabel</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionOptionValue.html" data-type="entity-link">QuestionOptionValue</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionPart.html" data-type="entity-link">QuestionPart</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionPartView.html" data-type="entity-link">QuestionPartView</a>
                            </li>
                            <li class="link">
                                <a href="classes/QuestionPartViewLabel.html" data-type="entity-link">QuestionPartViewLabel</a>
                            </li>
                            <li class="link">
                                <a href="classes/Role.html" data-type="entity-link">Role</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScreeningQuestions.html" data-type="entity-link">ScreeningQuestions</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShortCode.html" data-type="entity-link">ShortCode</a>
                            </li>
                            <li class="link">
                                <a href="classes/Survey.html" data-type="entity-link">Survey</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyNotification.html" data-type="entity-link">SurveyNotification</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyPermissions.html" data-type="entity-link">SurveyPermissions</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyQuestionOptionStructure.html" data-type="entity-link">SurveyQuestionOptionStructure</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyUser.html" data-type="entity-link">SurveyUser</a>
                            </li>
                            <li class="link">
                                <a href="classes/SurveyViewStructure.html" data-type="entity-link">SurveyViewStructure</a>
                            </li>
                            <li class="link">
                                <a href="classes/TermsAndConditionsPage.html" data-type="entity-link">TermsAndConditionsPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/ThankYouPage.html" data-type="entity-link">ThankYouPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/TranslateLanguageLoader.html" data-type="entity-link">TranslateLanguageLoader</a>
                            </li>
                            <li class="link">
                                <a href="classes/UploadPath.html" data-type="entity-link">UploadPath</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEdit.html" data-type="entity-link">UserEdit</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserGroup.html" data-type="entity-link">UserGroup</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserGroupAPIKeys.html" data-type="entity-link">UserGroupAPIKeys</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserLogin.html" data-type="entity-link">UserLogin</a>
                            </li>
                            <li class="link">
                                <a href="classes/WelcomePage.html" data-type="entity-link">WelcomePage</a>
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
                                    <a href="injectables/AccountEndpoint.html" data-type="entity-link">AccountEndpoint</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AccountService.html" data-type="entity-link">AccountService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminAppConfig.html" data-type="entity-link">AdminAppConfig</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AlertService.html" data-type="entity-link">AlertService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppTitleService.html" data-type="entity-link">AppTitleService</a>
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
                                    <a href="injectables/CustomBuilderService.html" data-type="entity-link">CustomBuilderService</a>
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
                                    <a href="injectables/NotificationEndpoint.html" data-type="entity-link">NotificationEndpoint</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link">NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RealTimeNotificationServce.html" data-type="entity-link">RealTimeNotificationServce</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyBuilderEndpointService.html" data-type="entity-link">SurveyBuilderEndpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyBuilderService.html" data-type="entity-link">SurveyBuilderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyEndpointService.html" data-type="entity-link">SurveyEndpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyExecuteEndpointService.html" data-type="entity-link">SurveyExecuteEndpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyExecuteService.html" data-type="entity-link">SurveyExecuteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SurveyService.html" data-type="entity-link">SurveyService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserGroupEndpointService.html" data-type="entity-link">UserGroupEndpointService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserGroupService.html" data-type="entity-link">UserGroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/Utilities.html" data-type="entity-link">Utilities</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/CanDeactivateGuard.html" data-type="entity-link">CanDeactivateGuard</a>
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
                                <a href="interfaces/CanComponentDeactivate.html" data-type="entity-link">CanComponentDeactivate</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConditionalOptionItem.html" data-type="entity-link">ConditionalOptionItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventArg.html" data-type="entity-link">EventArg</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IContainerOptions.html" data-type="entity-link">IContainerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDragEvent.html" data-type="entity-link">IDragEvent</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDropResult.html" data-type="entity-link">IDropResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IdToken.html" data-type="entity-link">IdToken</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Item.html" data-type="entity-link">Item</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponse.html" data-type="entity-link">LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuestionConfigurationDefinition.html" data-type="entity-link">QuestionConfigurationDefinition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuestionOptionDefinition.html" data-type="entity-link">QuestionOptionDefinition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/QuestionTypeDefinition.html" data-type="entity-link">QuestionTypeDefinition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RolesChangedEventArg.html" data-type="entity-link">RolesChangedEventArg</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserAccountInfo.html" data-type="entity-link">UserAccountInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserConfiguration.html" data-type="entity-link">UserConfiguration</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#pipes-links"' :
                                'data-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse" ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/SafeHtmlPipe.html" data-type="entity-link">SafeHtmlPipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/SafePipe.html" data-type="entity-link">SafePipe</a>
                                </li>
                                <li class="link">
                                    <a href="pipes/SearchPipe.html" data-type="entity-link">SearchPipe</a>
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
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
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
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
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