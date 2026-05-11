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
                    <a href="index.html" data-type="index-link">Downline Frontend</a>
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
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/CalendarWrapperModule.html" data-type="entity-link" >CalendarWrapperModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/ActivitiesComponent.html" data-type="entity-link" >ActivitiesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActivitiesListComponent.html" data-type="entity-link" >ActivitiesListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActivityCallsComponent.html" data-type="entity-link" >ActivityCallsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActivityMailComponent.html" data-type="entity-link" >ActivityMailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActivityMeetingComponent.html" data-type="entity-link" >ActivityMeetingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ActivityTaskComponent.html" data-type="entity-link" >ActivityTaskComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AddBlogComponent.html" data-type="entity-link" >AddBlogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AddformFieldsComponent.html" data-type="entity-link" >AddformFieldsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AddInvoicesComponent.html" data-type="entity-link" >AddInvoicesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AddPageComponent.html" data-type="entity-link" >AddPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AdvancedUiComponent.html" data-type="entity-link" >AdvancedUiComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AllTasksComponent.html" data-type="entity-link" >AllTasksComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AnalyticsComponent.html" data-type="entity-link" >AnalyticsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppearanceSettingsComponent.html" data-type="entity-link" >AppearanceSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ApplicationComponent.html" data-type="entity-link" >ApplicationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AudioCallComponent.html" data-type="entity-link" >AudioCallComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AuthComponent.html" data-type="entity-link" >AuthComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BanIpAddressComponent.html" data-type="entity-link" >BanIpAddressComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BankAccountsComponent.html" data-type="entity-link" >BankAccountsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BaseUiComponent.html" data-type="entity-link" >BaseUiComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlankComponent.html" data-type="entity-link" >BlankComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogCategoriesComponent.html" data-type="entity-link" >BlogCategoriesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogCommentsComponent.html" data-type="entity-link" >BlogCommentsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogDetailsComponent.html" data-type="entity-link" >BlogDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogListComponent.html" data-type="entity-link" >BlogListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogsComponent.html" data-type="entity-link" >BlogsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BlogTagsComponent.html" data-type="entity-link" >BlogTagsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BreadcrumbsComponent.html" data-type="entity-link" >BreadcrumbsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CalendarComponent.html" data-type="entity-link" >CalendarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CallHistoryComponent.html" data-type="entity-link" >CallHistoryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CallsComponent.html" data-type="entity-link" >CallsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CampaignArchieveComponent.html" data-type="entity-link" >CampaignArchieveComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CampaignCompleteComponent.html" data-type="entity-link" >CampaignCompleteComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CampaignComponent.html" data-type="entity-link" >CampaignComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CampaignListComponent.html" data-type="entity-link" >CampaignListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChangePasswordFormComponent.html" data-type="entity-link" >ChangePasswordFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChartApexComponent.html" data-type="entity-link" >ChartApexComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChartsComponent.html" data-type="entity-link" >ChartsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChatComponent.html" data-type="entity-link" >ChatComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CitiesComponent.html" data-type="entity-link" >CitiesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClearCacheComponent.html" data-type="entity-link" >ClearCacheComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CollapseHeaderComponent.html" data-type="entity-link" >CollapseHeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ComingSoonComponent.html" data-type="entity-link" >ComingSoonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CommonFormModalComponent.html" data-type="entity-link" >CommonFormModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CompaniesComponent.html" data-type="entity-link" >CompaniesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CompaniesComponent-1.html" data-type="entity-link" >CompaniesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CompaniesDetailsComponent.html" data-type="entity-link" >CompaniesDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CompaniesGridComponent.html" data-type="entity-link" >CompaniesGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CompaniesListComponent.html" data-type="entity-link" >CompaniesListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CompanyReportsComponent.html" data-type="entity-link" >CompanyReportsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CompanySettingsComponent.html" data-type="entity-link" >CompanySettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConfirmModalComponent.html" data-type="entity-link" >ConfirmModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ConnectedAppsComponent.html" data-type="entity-link" >ConnectedAppsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactDetailsComponent.html" data-type="entity-link" >ContactDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactGridComponent.html" data-type="entity-link" >ContactGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactListComponent.html" data-type="entity-link" >ContactListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactMessagesComponent.html" data-type="entity-link" >ContactMessagesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactReportsComponent.html" data-type="entity-link" >ContactReportsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactsComponent.html" data-type="entity-link" >ContactsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContactStageComponent.html" data-type="entity-link" >ContactStageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContentComponent.html" data-type="entity-link" >ContentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContractsComponent.html" data-type="entity-link" >ContractsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContractsGridComponent.html" data-type="entity-link" >ContractsGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ContractsListComponent.html" data-type="entity-link" >ContractsListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CountriesComponent.html" data-type="entity-link" >CountriesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreateLevelUserComponent.html" data-type="entity-link" >CreateLevelUserComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CreditReferenceComponent.html" data-type="entity-link" >CreditReferenceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CronjobComponent.html" data-type="entity-link" >CronjobComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CurrenciesComponent.html" data-type="entity-link" >CurrenciesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CustomCalendarComponent.html" data-type="entity-link" >CustomCalendarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CustomFieldsSettingComponent.html" data-type="entity-link" >CustomFieldsSettingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CustomPaginationComponent.html" data-type="entity-link" >CustomPaginationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DatabaseBackupComponent.html" data-type="entity-link" >DatabaseBackupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DataTablesComponent.html" data-type="entity-link" >DataTablesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DateRangePickerComponent.html" data-type="entity-link" >DateRangePickerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DealReportsComponent.html" data-type="entity-link" >DealReportsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DealsComponent.html" data-type="entity-link" >DealsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DealsDashboardComponent.html" data-type="entity-link" >DealsDashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DealsDetailsComponent.html" data-type="entity-link" >DealsDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DealsKanbanComponent.html" data-type="entity-link" >DealsKanbanComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DealsListComponent.html" data-type="entity-link" >DealsListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DeleteRequestComponent.html" data-type="entity-link" >DeleteRequestComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DomainComponent.html" data-type="entity-link" >DomainComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditBlogComponent.html" data-type="entity-link" >EditBlogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditInvoicesComponent.html" data-type="entity-link" >EditInvoicesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EditPageComponent.html" data-type="entity-link" >EditPageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmailComponent.html" data-type="entity-link" >EmailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmailReplyComponent.html" data-type="entity-link" >EmailReplyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmailSettingsComponent.html" data-type="entity-link" >EmailSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EmailVerificationComponent.html" data-type="entity-link" >EmailVerificationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Error404Component.html" data-type="entity-link" >Error404Component</a>
                            </li>
                            <li class="link">
                                <a href="components/Error500Component.html" data-type="entity-link" >Error500Component</a>
                            </li>
                            <li class="link">
                                <a href="components/ErrorComponent.html" data-type="entity-link" >ErrorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EstimationListComponent.html" data-type="entity-link" >EstimationListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EstimationsComponent.html" data-type="entity-link" >EstimationsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EstimationsKanbanComponent.html" data-type="entity-link" >EstimationsKanbanComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ExportDropdownComponent.html" data-type="entity-link" >ExportDropdownComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FaqComponent.html" data-type="entity-link" >FaqComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FeaturesComponent.html" data-type="entity-link" >FeaturesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FileManagerComponent.html" data-type="entity-link" >FileManagerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ForgotPasswordComponent.html" data-type="entity-link" >ForgotPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormBasicInputsComponent.html" data-type="entity-link" >FormBasicInputsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormCheckboxRadiosComponent.html" data-type="entity-link" >FormCheckboxRadiosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormElementsComponent.html" data-type="entity-link" >FormElementsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormFieldsComponent.html" data-type="entity-link" >FormFieldsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormFileuploadComponent.html" data-type="entity-link" >FormFileuploadComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormFloatingLabelsComponent.html" data-type="entity-link" >FormFloatingLabelsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormGridGuttersComponent.html" data-type="entity-link" >FormGridGuttersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormHorizontalComponent.html" data-type="entity-link" >FormHorizontalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormInputGroupsComponent.html" data-type="entity-link" >FormInputGroupsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormMaskComponent.html" data-type="entity-link" >FormMaskComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormPickersComponent.html" data-type="entity-link" >FormPickersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormsComponent.html" data-type="entity-link" >FormsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormSelect2Component.html" data-type="entity-link" >FormSelect2Component</a>
                            </li>
                            <li class="link">
                                <a href="components/FormSelectComponent.html" data-type="entity-link" >FormSelectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormValidationComponent.html" data-type="entity-link" >FormValidationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormVerticalComponent.html" data-type="entity-link" >FormVerticalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FormWizardComponent.html" data-type="entity-link" >FormWizardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GdprCookiesComponent.html" data-type="entity-link" >GdprCookiesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HandlePermissionComponent.html" data-type="entity-link" >HandlePermissionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconBootstrapComponent.html" data-type="entity-link" >IconBootstrapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconFeatherComponent.html" data-type="entity-link" >IconFeatherComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconFlagComponent.html" data-type="entity-link" >IconFlagComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconFontawesomeComponent.html" data-type="entity-link" >IconFontawesomeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconIonicComponent.html" data-type="entity-link" >IconIonicComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconMaterialComponent.html" data-type="entity-link" >IconMaterialComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconPe7Component.html" data-type="entity-link" >IconPe7Component</a>
                            </li>
                            <li class="link">
                                <a href="components/IconRemixComponent.html" data-type="entity-link" >IconRemixComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconsComponent.html" data-type="entity-link" >IconsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconSimplelineComponent.html" data-type="entity-link" >IconSimplelineComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconTablerComponent.html" data-type="entity-link" >IconTablerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconThemifyComponent.html" data-type="entity-link" >IconThemifyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconTypiconComponent.html" data-type="entity-link" >IconTypiconComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IconWeatherComponent.html" data-type="entity-link" >IconWeatherComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/IndustryComponent.html" data-type="entity-link" >IndustryComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvoiceComponent.html" data-type="entity-link" >InvoiceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvoiceDetailsComponent.html" data-type="entity-link" >InvoiceDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvoiceDetailsComponent-1.html" data-type="entity-link" >InvoiceDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvoiceGridComponent.html" data-type="entity-link" >InvoiceGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvoiceListComponent.html" data-type="entity-link" >InvoiceListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvoicesComponent.html" data-type="entity-link" >InvoicesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InvoiceSettingsComponent.html" data-type="entity-link" >InvoiceSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/KanbanComponent.html" data-type="entity-link" >KanbanComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LanguageSettingsComponent.html" data-type="entity-link" >LanguageSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LanguageWebComponent.html" data-type="entity-link" >LanguageWebComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LanguageWebEditComponent.html" data-type="entity-link" >LanguageWebEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LayoutComponent.html" data-type="entity-link" >LayoutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LeadDashboardComponent.html" data-type="entity-link" >LeadDashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LeadReportsComponent.html" data-type="entity-link" >LeadReportsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LeadsComponent.html" data-type="entity-link" >LeadsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LeadsDetailsComponent.html" data-type="entity-link" >LeadsDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LeadsKanbanComponent.html" data-type="entity-link" >LeadsKanbanComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LeadsListComponent.html" data-type="entity-link" >LeadsListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LeafletComponent.html" data-type="entity-link" >LeafletComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LevelDefaultFieldsComponent.html" data-type="entity-link" >LevelDefaultFieldsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LocalizationSettingsComponent.html" data-type="entity-link" >LocalizationSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LocationsComponent.html" data-type="entity-link" >LocationsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LockScreenComponent.html" data-type="entity-link" >LockScreenComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LostReasonComponent.html" data-type="entity-link" >LostReasonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ManageUsersComponent.html" data-type="entity-link" >ManageUsersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MapsComponent.html" data-type="entity-link" >MapsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipAddonsComponent.html" data-type="entity-link" >MembershipAddonsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipComponent.html" data-type="entity-link" >MembershipComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipPlansComponent.html" data-type="entity-link" >MembershipPlansComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MembershipTransactionsComponent.html" data-type="entity-link" >MembershipTransactionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModalDashboardComponent.html" data-type="entity-link" >ModalDashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModuleComponent.html" data-type="entity-link" >ModuleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ModulesComponent.html" data-type="entity-link" >ModulesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MultiSelectDropdownComponent.html" data-type="entity-link" >MultiSelectDropdownComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotesComponent.html" data-type="entity-link" >NotesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationsComponent.html" data-type="entity-link" >NotificationsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationsSettingsComponent.html" data-type="entity-link" >NotificationsSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PackagesComponent.html" data-type="entity-link" >PackagesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PagesComponent.html" data-type="entity-link" >PagesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PaymentGatewaysComponent.html" data-type="entity-link" >PaymentGatewaysComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PaymentsComponent.html" data-type="entity-link" >PaymentsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PermissionsComponent.html" data-type="entity-link" >PermissionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PipelineComponent.html" data-type="entity-link" >PipelineComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PreferenceSettingsComponent.html" data-type="entity-link" >PreferenceSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrefixesSettingsComponent.html" data-type="entity-link" >PrefixesSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrimeNgComponent.html" data-type="entity-link" >PrimeNgComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PrintersSettingsComponent.html" data-type="entity-link" >PrintersSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfileSettingsComponent.html" data-type="entity-link" >ProfileSettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectDashboardComponent.html" data-type="entity-link" >ProjectDashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectDetailsComponent.html" data-type="entity-link" >ProjectDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectGridComponent.html" data-type="entity-link" >ProjectGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectListComponent.html" data-type="entity-link" >ProjectListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectReportsComponent.html" data-type="entity-link" >ProjectReportsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProjectsComponent.html" data-type="entity-link" >ProjectsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProposalsComponent.html" data-type="entity-link" >ProposalsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProposalsGridComponent.html" data-type="entity-link" >ProposalsGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProposalsListComponent.html" data-type="entity-link" >ProposalsListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PurchaseTransactionComponent.html" data-type="entity-link" >PurchaseTransactionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RechargeComponent.html" data-type="entity-link" >RechargeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterComponent.html" data-type="entity-link" >RegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ReportsComponent.html" data-type="entity-link" >ReportsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ResetPasswordComponent.html" data-type="entity-link" >ResetPasswordComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RoleComponent.html" data-type="entity-link" >RoleComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RoleFormComponent.html" data-type="entity-link" >RoleFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RolesPermissionsComponent.html" data-type="entity-link" >RolesPermissionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RoleUserComponent.html" data-type="entity-link" >RoleUserComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/RoleUsersComponent.html" data-type="entity-link" >RoleUsersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SecuritySettingsComponent.html" data-type="entity-link" >SecuritySettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SettingsComponent.html" data-type="entity-link" >SettingsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SidebarComponent.html" data-type="entity-link" >SidebarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SideFormModalComponent.html" data-type="entity-link" >SideFormModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SitemapComponent.html" data-type="entity-link" >SitemapComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SmsGatewaysComponent.html" data-type="entity-link" >SmsGatewaysComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SocialFeedComponent.html" data-type="entity-link" >SocialFeedComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SourcesComponent.html" data-type="entity-link" >SourcesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StatesComponent.html" data-type="entity-link" >StatesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StorageComponent.html" data-type="entity-link" >StorageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SubscriptionsComponent.html" data-type="entity-link" >SubscriptionsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SuccessComponent.html" data-type="entity-link" >SuccessComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SuperAdminComponent.html" data-type="entity-link" >SuperAdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SystemBackupComponent.html" data-type="entity-link" >SystemBackupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SystemUpdateComponent.html" data-type="entity-link" >SystemUpdateComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TableComponent.html" data-type="entity-link" >TableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TablesBasicComponent.html" data-type="entity-link" >TablesBasicComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskReportsComponent.html" data-type="entity-link" >TaskReportsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TasksCompletedComponent.html" data-type="entity-link" >TasksCompletedComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TasksComponent.html" data-type="entity-link" >TasksComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TasksImportantComponent.html" data-type="entity-link" >TasksImportantComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaxRatesComponent.html" data-type="entity-link" >TaxRatesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TestimonialsComponent.html" data-type="entity-link" >TestimonialsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TicketDetailsComponent.html" data-type="entity-link" >TicketDetailsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TicketsComponent.html" data-type="entity-link" >TicketsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TodoComponent.html" data-type="entity-link" >TodoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TodoListComponent.html" data-type="entity-link" >TodoListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TwoStepVerificationComponent.html" data-type="entity-link" >TwoStepVerificationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiAccordionComponent.html" data-type="entity-link" >UiAccordionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiAlertsComponent.html" data-type="entity-link" >UiAlertsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiAvatarComponent.html" data-type="entity-link" >UiAvatarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiBadgesComponent.html" data-type="entity-link" >UiBadgesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiBreadcrumbComponent.html" data-type="entity-link" >UiBreadcrumbComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiButtonsComponent.html" data-type="entity-link" >UiButtonsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiButtonsGroupComponent.html" data-type="entity-link" >UiButtonsGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiCardsComponent.html" data-type="entity-link" >UiCardsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiCarouselComponent.html" data-type="entity-link" >UiCarouselComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiClipboardComponent.html" data-type="entity-link" >UiClipboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiCollapseComponent.html" data-type="entity-link" >UiCollapseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiColorsComponent.html" data-type="entity-link" >UiColorsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiCounterComponent.html" data-type="entity-link" >UiCounterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiDragDropComponent.html" data-type="entity-link" >UiDragDropComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiDropdownsComponent.html" data-type="entity-link" >UiDropdownsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiGridComponent.html" data-type="entity-link" >UiGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiImagesComponent.html" data-type="entity-link" >UiImagesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiLightboxComponent.html" data-type="entity-link" >UiLightboxComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiLinksComponent.html" data-type="entity-link" >UiLinksComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiListGroupComponent.html" data-type="entity-link" >UiListGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiModalsComponent.html" data-type="entity-link" >UiModalsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiNavTabsComponent.html" data-type="entity-link" >UiNavTabsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiOffcanvasComponent.html" data-type="entity-link" >UiOffcanvasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiPaginationComponent.html" data-type="entity-link" >UiPaginationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiPlaceholdersComponent.html" data-type="entity-link" >UiPlaceholdersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiPopoversComponent.html" data-type="entity-link" >UiPopoversComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiProgressComponent.html" data-type="entity-link" >UiProgressComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiRangesliderComponent.html" data-type="entity-link" >UiRangesliderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiRatingComponent.html" data-type="entity-link" >UiRatingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiRibbonComponent.html" data-type="entity-link" >UiRibbonComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiScrollbarComponent.html" data-type="entity-link" >UiScrollbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiSortableComponent.html" data-type="entity-link" >UiSortableComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiSpinnerComponent.html" data-type="entity-link" >UiSpinnerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiStickynoteComponent.html" data-type="entity-link" >UiStickynoteComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiTextEditorComponent.html" data-type="entity-link" >UiTextEditorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiTimelineComponent.html" data-type="entity-link" >UiTimelineComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiToastsComponent.html" data-type="entity-link" >UiToastsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiTooltipsComponent.html" data-type="entity-link" >UiTooltipsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiTypographyComponent.html" data-type="entity-link" >UiTypographyComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiUtilitiesComponent.html" data-type="entity-link" >UiUtilitiesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UiVideoComponent.html" data-type="entity-link" >UiVideoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UnderMaintenanceComponent.html" data-type="entity-link" >UnderMaintenanceComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserLevelFormComponent.html" data-type="entity-link" >UserLevelFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserLevelsComponent.html" data-type="entity-link" >UserLevelsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/VideoCallComponent.html" data-type="entity-link" >VideoCallComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/ValidationDirective.html" data-type="entity-link" >ValidationDirective</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CommonService.html" data-type="entity-link" >CommonService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatahandlerService.html" data-type="entity-link" >DatahandlerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataService.html" data-type="entity-link" >DataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FingerprintService.html" data-type="entity-link" >FingerprintService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaginationService.html" data-type="entity-link" >PaginationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ResponseDecryptService.html" data-type="entity-link" >ResponseDecryptService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SettingsService.html" data-type="entity-link" >SettingsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SidebarService.html" data-type="entity-link" >SidebarService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/DesktopViewOnlyGuard.html" data-type="entity-link" >DesktopViewOnlyGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/DesktopViewOnlyGuard-1.html" data-type="entity-link" >DesktopViewOnlyGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/LevelGuard.html" data-type="entity-link" >LevelGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/activitiesList.html" data-type="entity-link" >activitiesList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/activityMail.html" data-type="entity-link" >activityMail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponse.html" data-type="entity-link" >ApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/apiResponse.html" data-type="entity-link" >apiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/apiResultFormat.html" data-type="entity-link" >apiResultFormat</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/blogCategories.html" data-type="entity-link" >blogCategories</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/blogComments.html" data-type="entity-link" >blogComments</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/blogTags.html" data-type="entity-link" >blogTags</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/callHistory.html" data-type="entity-link" >callHistory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/calls.html" data-type="entity-link" >calls</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CardDetails.html" data-type="entity-link" >CardDetails</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CardDetails-1.html" data-type="entity-link" >CardDetails</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-1.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-2.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-3.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-4.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-5.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-6.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-7.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-8.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-9.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-10.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-11.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-12.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ChartOptions-13.html" data-type="entity-link" >ChartOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/cities.html" data-type="entity-link" >cities</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/compaignList.html" data-type="entity-link" >compaignList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/companiesList.html" data-type="entity-link" >companiesList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CompanyAccount.html" data-type="entity-link" >CompanyAccount</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CompanyCard.html" data-type="entity-link" >CompanyCard</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CompanyInfo.html" data-type="entity-link" >CompanyInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/companyReports.html" data-type="entity-link" >companyReports</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/contactList.html" data-type="entity-link" >contactList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/contactMessage.html" data-type="entity-link" >contactMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/contactReports.html" data-type="entity-link" >contactReports</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/contactStage.html" data-type="entity-link" >contactStage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/contractList.html" data-type="entity-link" >contractList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/countries.html" data-type="entity-link" >countries</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/data.html" data-type="entity-link" >data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/data-1.html" data-type="entity-link" >data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/data-2.html" data-type="entity-link" >data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/data-3.html" data-type="entity-link" >data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/dataTables.html" data-type="entity-link" >dataTables</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/dealReports.html" data-type="entity-link" >dealReports</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/dealsList.html" data-type="entity-link" >dealsList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/deleteRequest.html" data-type="entity-link" >deleteRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EncryptedResponsePayload.html" data-type="entity-link" >EncryptedResponsePayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/estimationList.html" data-type="entity-link" >estimationList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/faq.html" data-type="entity-link" >faq</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/file.html" data-type="entity-link" >file</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/fileShared.html" data-type="entity-link" >fileShared</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FormField.html" data-type="entity-link" >FormField</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/formFields.html" data-type="entity-link" >formFields</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/googleAuthenticator.html" data-type="entity-link" >googleAuthenticator</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/industry.html" data-type="entity-link" >industry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/invoiceList.html" data-type="entity-link" >invoiceList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/languageSetting.html" data-type="entity-link" >languageSetting</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/languageSettingsWeb.html" data-type="entity-link" >languageSettingsWeb</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/leadReports.html" data-type="entity-link" >leadReports</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/leadsList.html" data-type="entity-link" >leadsList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Level.html" data-type="entity-link" >Level</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/levelUserFormField.html" data-type="entity-link" >levelUserFormField</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/lostReason.html" data-type="entity-link" >lostReason</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MainMenu.html" data-type="entity-link" >MainMenu</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/manageUsers.html" data-type="entity-link" >manageUsers</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/membershipTransactions.html" data-type="entity-link" >membershipTransactions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/menu.html" data-type="entity-link" >menu</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Menu.html" data-type="entity-link" >Menu</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MenuItem.html" data-type="entity-link" >MenuItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Module.html" data-type="entity-link" >Module</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/modules.html" data-type="entity-link" >modules</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PackageList.html" data-type="entity-link" >PackageList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/pages.html" data-type="entity-link" >pages</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/pageSelection.html" data-type="entity-link" >pageSelection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/pageSelection-1.html" data-type="entity-link" >pageSelection</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/pageSize.html" data-type="entity-link" >pageSize</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/pageSizeCal.html" data-type="entity-link" >pageSizeCal</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/paymentList.html" data-type="entity-link" >paymentList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PermissionConfig.html" data-type="entity-link" >PermissionConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/pipeline.html" data-type="entity-link" >pipeline</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/project.html" data-type="entity-link" >project</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/projectLists.html" data-type="entity-link" >projectLists</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/projectReports.html" data-type="entity-link" >projectReports</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/proposalsList.html" data-type="entity-link" >proposalsList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/proposalView.html" data-type="entity-link" >proposalView</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Role.html" data-type="entity-link" >Role</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/roles.html" data-type="entity-link" >roles</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/rolesPermissions.html" data-type="entity-link" >rolesPermissions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RouterObject.html" data-type="entity-link" >RouterObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-1.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-2.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-3.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-4.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-5.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-6.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-7.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-8.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-9.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/select-10.html" data-type="entity-link" >select</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SessionUser.html" data-type="entity-link" >SessionUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/sidebarData.html" data-type="entity-link" >sidebarData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/sidebarDataone.html" data-type="entity-link" >sidebarDataone</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/source.html" data-type="entity-link" >source</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/sources.html" data-type="entity-link" >sources</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Star.html" data-type="entity-link" >Star</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Star-1.html" data-type="entity-link" >Star</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StarModel.html" data-type="entity-link" >StarModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/states.html" data-type="entity-link" >states</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubMenu.html" data-type="entity-link" >SubMenu</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubMenu2.html" data-type="entity-link" >SubMenu2</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/subMenus.html" data-type="entity-link" >subMenus</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubMenuTwo.html" data-type="entity-link" >SubMenuTwo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubModule.html" data-type="entity-link" >SubModule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/superadmincompanies.html" data-type="entity-link" >superadmincompanies</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/superAdminDomain.html" data-type="entity-link" >superAdminDomain</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/superAdminPackages.html" data-type="entity-link" >superAdminPackages</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/superAdminPurchaseTransaction.html" data-type="entity-link" >superAdminPurchaseTransaction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/superAdminSubscriptions.html" data-type="entity-link" >superAdminSubscriptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/tablePageSize.html" data-type="entity-link" >tablePageSize</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/taskReports.html" data-type="entity-link" >taskReports</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/testimonials.html" data-type="entity-link" >testimonials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/tickets.html" data-type="entity-link" >tickets</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/updateBalancePayload.html" data-type="entity-link" >updateBalancePayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/updateCreditReferencePayload.html" data-type="entity-link" >updateCreditReferencePayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/updateUserStatusPayload.html" data-type="entity-link" >updateUserStatusPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/url.html" data-type="entity-link" >url</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/userLevels.html" data-type="entity-link" >userLevels</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/userList.html" data-type="entity-link" >userList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/videocall.html" data-type="entity-link" >videocall</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/FormatTimePipe.html" data-type="entity-link" >FormatTimePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
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
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});