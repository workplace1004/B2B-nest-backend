import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CollectionsModule } from './collections/collections.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { WarehousesModule } from './warehouses/warehouses.module';
import { ForecastModule } from './forecast/forecast.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { DamModule } from './dam/dam.module';
import { BOMModule } from './bom/bom.module';
import { ReturnsModule } from './returns/returns.module';
import { ReverseLogisticsModule } from './reverse-logistics/reverse-logistics.module';
import { PricingModule } from './pricing/pricing.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { RulesModule } from './rules/rules.module';
import { AlertsModule } from './alerts/alerts.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { ReplenishmentModule } from './replenishment/replenishment.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskCategoriesModule } from './task-categories/task-categories.module';
import { SizeFitModule } from './size-fit/size-fit.module';
import { CostSheetsModule } from './cost-sheets/cost-sheets.module';
import { DigitalProductPassportModule } from './digital-product-passport/digital-product-passport.module';
import { ComplianceEvidenceModule } from './compliance-evidence/compliance-evidence.module';
import { RolesModule } from './roles/roles.module';
import { BrandsModule } from './brands/brands.module';
import { MarketsModule } from './markets/markets.module';
import { LocalizationsModule } from './localizations/localizations.module';
import { ApiKeysModule } from './api-keys/api-keys.module';
import { SyncHealthModule } from './sync-health/sync-health.module';
import { NumberingRulesModule } from './numbering-rules/numbering-rules.module';
import { TaxDefaultsModule } from './tax-defaults/tax-defaults.module';
import { WarehouseDefaultsModule } from './warehouse-defaults/warehouse-defaults.module';
import { DataImportsModule } from './data-imports/data-imports.module';
import { DataExportsModule } from './data-exports/data-exports.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { AuditTrailModule } from './audit-trail/audit-trail.module';
import { ProformaInvoicesModule } from './proforma-invoices/proforma-invoices.module';
import { PurchaseOrdersModule } from './purchase-orders/purchase-orders.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { AccountingFieldsModule } from './accounting-fields/accounting-fields.module';
import { VismaFieldsModule } from './visma-fields/visma-fields.module';
import { VismaMappingsModule } from './visma-mappings/visma-mappings.module';
import { SyncLogsModule } from './sync-logs/sync-logs.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { FxRatesModule } from './fx-rates/fx-rates.module';
import { MarketCurrencySettingsModule } from './market-currency-settings/market-currency-settings.module';
import { CreditNotesModule } from './credit-notes/credit-notes.module';
import { CountingModule } from './counting/counting.module';
import { AllocationRulesModule } from './allocation-rules/allocation-rules.module';
import { PreOrdersModule } from './pre-orders/pre-orders.module';
import { BackordersModule } from './backorders/backorders.module';
import { PartialShipmentsModule } from './partial-shipments/partial-shipments.module';
import { SupplierPriceHistoryModule } from './supplier-price-history/supplier-price-history.module';
import { SupplierNegotiationNotesModule } from './supplier-negotiation-notes/supplier-negotiation-notes.module';
import { PurchaseOrderApprovalsModule } from './purchase-order-approvals/purchase-order-approvals.module';
import { PurchaseOrderWIPTrackingModule } from './purchase-order-wip-tracking/purchase-order-wip-tracking.module';
import { PurchaseOrderBatchesModule } from './purchase-order-batches/purchase-order-batches.module';
import { LandedCostsModule } from './landed-costs/landed-costs.module';
import { ScanHistoryModule } from './scan-history/scan-history.module';
import { PickListsModule } from './pick-lists/pick-lists.module';
import { PackSlipsModule } from './pack-slips/pack-slips.module';
import { ShippingLabelsModule } from './shipping-labels/shipping-labels.module';
import { StoresModule } from './stores/stores.module';
import { BOPISOrdersModule } from './bopis-orders/bopis-orders.module';
import { BORISReturnsModule } from './boris-returns/boris-returns.module';
import { EndlessAisleProductsModule } from './endless-aisle-products/endless-aisle-products.module';
import { CampaignEventsModule } from './campaign-events/campaign-events.module';
import { FeaturedCollectionsModule } from './featured-collections/featured-collections.module';
import { MarkdownPlansModule } from './markdown-plans/markdown-plans.module';
import { ServiceCasesModule } from './service-cases/service-cases.module';
import { UserPreferencesModule } from './user-preferences/user-preferences.module';
import { ProductConfigurationsModule } from './product-configurations/product-configurations.module';
import { SecurityConfigurationsModule } from './security-configurations/security-configurations.module';
import { StockControlConfigurationsModule } from './stock-control-configurations/stock-control-configurations.module';
import { SystemLogsConfigurationsModule } from './system-logs-configurations/system-logs-configurations.module';
import { WarehouseConfigurationsModule } from './warehouse-configurations/warehouse-configurations.module';
import { B2BTermsConfigurationsModule } from './b2b-terms-configurations/b2b-terms-configurations.module';
import { QuotesModule } from './quotes/quotes.module';
import { SalesRepTerritoriesModule } from './sales-rep-territories/sales-rep-territories.module';
import { SalesRepCommissionsModule } from './sales-rep-commissions/sales-rep-commissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    RolesModule,
    BrandsModule,
    MarketsModule,
    LocalizationsModule,
    ApiKeysModule,
    SyncHealthModule,
    NumberingRulesModule,
    TaxDefaultsModule,
    WarehouseDefaultsModule,
    DataImportsModule,
    DataExportsModule,
    AuditLogsModule,
    AuditTrailModule,
    ProformaInvoicesModule,
    PurchaseOrdersModule,
    ShipmentsModule,
    AccountingFieldsModule,
    VismaFieldsModule,
    VismaMappingsModule,
    SyncLogsModule,
    CurrenciesModule,
    FxRatesModule,
    MarketCurrencySettingsModule,
    CreditNotesModule,
    CountingModule,
    AllocationRulesModule,
    PreOrdersModule,
    BackordersModule,
    PartialShipmentsModule,
    SupplierPriceHistoryModule,
    SupplierNegotiationNotesModule,
    PurchaseOrderApprovalsModule,
    PurchaseOrderWIPTrackingModule,
    PurchaseOrderBatchesModule,
    LandedCostsModule,
    ScanHistoryModule,
    PickListsModule,
    PackSlipsModule,
    ShippingLabelsModule,
    StoresModule,
    BOPISOrdersModule,
    BORISReturnsModule,
    EndlessAisleProductsModule,
    CampaignEventsModule,
    FeaturedCollectionsModule,
    MarkdownPlansModule,
    ServiceCasesModule,
    UserPreferencesModule,
    ProductConfigurationsModule,
    SecurityConfigurationsModule,
    StockControlConfigurationsModule,
    SystemLogsConfigurationsModule,
    WarehouseConfigurationsModule,
    B2BTermsConfigurationsModule,
    QuotesModule,
    SalesRepTerritoriesModule,
    SalesRepCommissionsModule,
    ProductsModule,
    CollectionsModule,
    InventoryModule,
    OrdersModule,
    CustomersModule,
    SuppliersModule,
    WarehousesModule,
    ForecastModule,
    AnalyticsModule,
    DamModule,
    BOMModule,
    ReturnsModule,
    ReverseLogisticsModule,
    PricingModule,
    IntegrationsModule,
    RulesModule,
    AlertsModule,
    ExceptionsModule,
    ReplenishmentModule,
    TasksModule,
    TaskCategoriesModule,
    SizeFitModule,
    CostSheetsModule,
    DigitalProductPassportModule,
    ComplianceEvidenceModule,
  ],
})
export class AppModule {}

