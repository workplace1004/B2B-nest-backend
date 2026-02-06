import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  console.log('🗑️  Resetting all tables...');

  // Helper function to safely delete from table
  const safeDelete = async (deleteFn: () => Promise<any>, tableName: string) => {
    try {
      const result = await deleteFn();
      console.log(`   ✓ Cleared ${tableName}`);
      return result;
    } catch (error: any) {
      // If table doesn't exist (P2021), that's okay - migrations will create it
      if (error?.code === 'P2021' || error?.code === 'P2010') {
        console.log(`   ⚠️  Table ${tableName} doesn't exist yet, skipping`);
      } else {
        console.error(`   ❌ Error clearing ${tableName}:`, error.message);
        throw error;
      }
    }
  };

  // Delete all data in correct order (respecting foreign key constraints)
  // Start with tables that have foreign keys, then parent tables
  
  // Child tables first
  await safeDelete(() => prisma.proformaInvoiceLine.deleteMany(), 'proforma_invoice_lines');
  await safeDelete(() => prisma.quoteLine.deleteMany(), 'quote_lines');
  await safeDelete(() => prisma.orderLine.deleteMany(), 'order_lines');
  await safeDelete(() => prisma.purchaseOrderLine.deleteMany(), 'purchase_order_lines');
  await safeDelete(() => prisma.bOMComponent.deleteMany(), 'bom_components');
  await safeDelete(() => prisma.complianceEvidence.deleteMany(), 'compliance_evidences');
  await safeDelete(() => prisma.productPricing.deleteMany(), 'product_pricing');
  await safeDelete(() => prisma.replenishment.deleteMany(), 'replenishments');
  await safeDelete(() => prisma.return.deleteMany(), 'returns');
  await safeDelete(() => prisma.review.deleteMany(), 'reviews');
  await safeDelete(() => prisma.forecast.deleteMany(), 'forecasts');
  await safeDelete(() => prisma.dAMAsset.deleteMany(), 'dam_assets');
  await safeDelete(() => prisma.inventory.deleteMany(), 'inventory');
  await safeDelete(() => prisma.shipment.deleteMany(), 'shipments');
  await safeDelete(() => prisma.salesRepCommission.deleteMany(), 'sales_rep_commissions');
  await safeDelete(() => prisma.salesRepTerritory.deleteMany(), 'sales_rep_territories');
  await safeDelete(() => prisma.auditLog.deleteMany(), 'audit_logs');
  await safeDelete(() => prisma.brandMarket.deleteMany(), 'brand_markets');
  await safeDelete(() => prisma.localization.deleteMany(), 'localizations');
  
  // Parent tables
  await safeDelete(() => prisma.proformaInvoice.deleteMany(), 'proforma_invoices');
  await safeDelete(() => prisma.quote.deleteMany(), 'quotes');
  await safeDelete(() => prisma.order.deleteMany(), 'orders');
  await safeDelete(() => prisma.purchaseOrder.deleteMany(), 'purchase_orders');
  await safeDelete(() => prisma.bOM.deleteMany(), 'boms');
  await safeDelete(() => prisma.costSheet.deleteMany(), 'cost_sheets');
  await safeDelete(() => prisma.digitalProductPassport.deleteMany(), 'digital_product_passports');
  await safeDelete(() => prisma.product.deleteMany(), 'products');
  await safeDelete(() => prisma.collection.deleteMany(), 'collections');
  await safeDelete(() => prisma.customer.deleteMany(), 'customers');
  await safeDelete(() => prisma.supplier.deleteMany(), 'suppliers');
  await safeDelete(() => prisma.warehouse.deleteMany(), 'warehouses');
  await safeDelete(() => prisma.integration.deleteMany(), 'integrations');
  await safeDelete(() => prisma.rule.deleteMany(), 'rules');
  await safeDelete(() => prisma.alert.deleteMany(), 'alerts');
  await safeDelete(() => prisma.exception.deleteMany(), 'exceptions');
  await safeDelete(() => prisma.task.deleteMany(), 'tasks');
  await safeDelete(() => prisma.sizeChart.deleteMany(), 'size_charts');
  await safeDelete(() => prisma.brand.deleteMany(), 'brands');
  await safeDelete(() => prisma.market.deleteMany(), 'markets');
  await safeDelete(() => prisma.apiKey.deleteMany(), 'api_keys');
  await safeDelete(() => prisma.syncHealth.deleteMany(), 'sync_health');
  await safeDelete(() => prisma.numberingRule.deleteMany(), 'numbering_rules');
  await safeDelete(() => prisma.taxDefault.deleteMany(), 'tax_defaults');
  await safeDelete(() => prisma.warehouseDefault.deleteMany(), 'warehouse_defaults');
  await safeDelete(() => prisma.role.deleteMany(), 'roles');
  await safeDelete(() => prisma.dataImport.deleteMany(), 'data_imports');
  await safeDelete(() => prisma.dataExport.deleteMany(), 'data_exports');
  
  // Delete all users except we'll recreate admin
  await safeDelete(() => prisma.user.deleteMany(), 'users');

  console.log('✅ All tables reset');

  // Create admin user
  console.log('👤 Creating admin user...');
  const adminEmail = 'admin@gmail.com';
  const adminPassword = '123123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  console.log('✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

