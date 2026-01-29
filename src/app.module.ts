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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
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
  ],
})
export class AppModule {}

