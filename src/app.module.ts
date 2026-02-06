import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
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
import { PricingModule } from './pricing/pricing.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { RulesModule } from './rules/rules.module';
import { AlertsModule } from './alerts/alerts.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { ReplenishmentModule } from './replenishment/replenishment.module';
import { TasksModule } from './tasks/tasks.module';
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
import { ProformaInvoicesModule } from './proforma-invoices/proforma-invoices.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
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
    ProformaInvoicesModule,
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
    PricingModule,
    IntegrationsModule,
    RulesModule,
    AlertsModule,
    ExceptionsModule,
    ReplenishmentModule,
    TasksModule,
    SizeFitModule,
    CostSheetsModule,
    DigitalProductPassportModule,
    ComplianceEvidenceModule,
  ],
})
export class AppModule {}

