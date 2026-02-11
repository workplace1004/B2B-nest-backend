import { PrismaClient, CollectionLifecycle, OrderStatus, OrderType, CampaignEventType, IntegrationType, IntegrationStatus, UserRole, RuleType, RuleStatus, AlertSeverity, AlertStatus, ExceptionType, ExceptionStatus, TaskStatus, TaskPriority, AlertType, ReplenishmentStatus, AuditAction, ReviewStatus, BrandStatus, MarketStatus, PurchaseOrderStatus, PurchaseOrderApprovalStatus, ReturnStatus, ReturnReason, ReverseLogisticsStatus, QuoteStatus, ProformaInvoiceStatus, ShipmentStatus, BOPISOrderStatus, BORISReturnStatus, ItemCondition, CommissionType, CommissionStatus, ApiKeyType, NumberingRuleType, ServiceCaseStatus, ServiceCasePriority, ProductConfigurationType, SecurityConfigurationType, StockControlConfigurationType, WarehouseConfigurationType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to get a random date between start and end
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get dates from 2 months ago to now
function getDateRange() {
  const now = new Date();
  const twoMonthsAgo = new Date(now);
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
  return { start: twoMonthsAgo, end: now };
}

// Helper to get random element from array
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function main() {
  console.log('🌱 Starting seed1 with data from 2 months ago to present...');
  console.log('🗑️  Clearing existing data...');

  // Clear all tables in correct order (respecting foreign keys)
  try {
    await prisma.markdownPlan.deleteMany();
    await prisma.featuredCollection.deleteMany();
    await prisma.campaignEvent.deleteMany();
    await prisma.endlessAisleWarehouse.deleteMany();
    await prisma.endlessAisleProduct.deleteMany();
    await prisma.bORISReturnItem.deleteMany();
    await prisma.bORISReturn.deleteMany();
    await prisma.bOPISOrderItem.deleteMany();
    await prisma.bOPISOrder.deleteMany();
    await prisma.partialShipmentItem.deleteMany();
    await prisma.partialShipment.deleteMany();
    await prisma.backorder.deleteMany();
    await prisma.preOrder.deleteMany();
    await prisma.allocationRule.deleteMany();
    await prisma.physicalInventoryItem.deleteMany();
    await prisma.physicalInventory.deleteMany();
    await prisma.cycleCountItem.deleteMany();
    await prisma.cycleCount.deleteMany();
    await prisma.creditNote.deleteMany();
    await prisma.marketCurrencySetting.deleteMany();
    await prisma.fxRate.deleteMany();
    await prisma.dataExport.deleteMany();
    await prisma.dataImport.deleteMany();
    await prisma.role.deleteMany();
    await prisma.warehouseDefault.deleteMany();
    await prisma.taxDefault.deleteMany();
    await prisma.numberingRule.deleteMany();
    await prisma.syncHealth.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.localization.deleteMany();
    await prisma.brandMarket.deleteMany();
    await prisma.market.deleteMany();
    await prisma.brand.deleteMany();
    await prisma.salesRepCommission.deleteMany();
    await prisma.salesRepTerritory.deleteMany();
    await prisma.complianceEvidence.deleteMany();
    await prisma.digitalProductPassport.deleteMany();
    await prisma.sizeChart.deleteMany();
    await prisma.taskCategory.deleteMany();
    await prisma.task.deleteMany();
    await prisma.serviceCase.deleteMany();
    await prisma.userPreference.deleteMany();
    await prisma.productConfiguration.deleteMany();
    await prisma.securityConfiguration.deleteMany();
    await prisma.stockControlConfiguration.deleteMany();
    await prisma.systemLogsConfiguration.deleteMany();
    await prisma.warehouseConfiguration.deleteMany();
    await prisma.b2BTermsConfiguration.deleteMany();
    await prisma.review.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.replenishment.deleteMany();
    await prisma.exception.deleteMany();
    await prisma.alert.deleteMany();
    await prisma.rule.deleteMany();
    await prisma.integration.deleteMany();
    await prisma.productPricing.deleteMany();
    await prisma.proformaInvoiceLine.deleteMany();
    await prisma.proformaInvoice.deleteMany();
    await prisma.quoteLine.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.reverseLogistics.deleteMany();
    await prisma.return.deleteMany();
    await prisma.costSheet.deleteMany();
    await prisma.bOMComponent.deleteMany();
    await prisma.bOM.deleteMany();
    await prisma.forecast.deleteMany();
    await prisma.dAMAsset.deleteMany();
    await prisma.shippingLabel.deleteMany();
    await prisma.shipment.deleteMany();
    await prisma.packSlipItem.deleteMany();
    await prisma.packSlip.deleteMany();
    await prisma.pickListItem.deleteMany();
    await prisma.pickList.deleteMany();
    await prisma.scanHistory.deleteMany();
    await prisma.landedCost.deleteMany();
    await prisma.purchaseOrderBatch.deleteMany();
    await prisma.purchaseOrderWIPTracking.deleteMany();
    await prisma.purchaseOrderApproval.deleteMany();
    await prisma.purchaseOrderLine.deleteMany();
    await prisma.purchaseOrder.deleteMany();
    await prisma.supplierNegotiationNote.deleteMany();
    await prisma.supplierPriceHistory.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.orderLine.deleteMany();
    await prisma.order.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.product.deleteMany();
    await prisma.collection.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.store.deleteMany();
    await prisma.warehouse.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ All tables cleared');
  } catch (error: any) {
    console.log('⚠️  Some tables may not exist yet:', error.message);
  }

  const { start: dateStart, end: dateEnd } = getDateRange();
  console.log(`📅 Date range: ${dateStart.toISOString().split('T')[0]} to ${dateEnd.toISOString().split('T')[0]}`);

  // ============================================
  // CHUNK 1: Users, Roles, Warehouses, Brands, Markets
  // ============================================
  console.log('👤 Creating users and roles...');
  const adminPassword = await bcrypt.hash('123123', 10);
  
  // Create roles first
  const adminRole = await prisma.role.create({
    data: {
      name: 'Administrator',
      description: 'Full system access',
      permissions: ['*'],
    },
  });

  const salesRole = await prisma.role.create({
    data: {
      name: 'Sales Representative',
      description: 'Sales and customer management',
      permissions: ['orders:view', 'orders:create', 'customers:view', 'customers:create'],
    },
  });

  const opsRole = await prisma.role.create({
    data: {
      name: 'Operations Manager',
      description: 'Inventory and warehouse management',
      permissions: ['inventory:view', 'inventory:edit', 'warehouses:view', 'warehouses:edit'],
    },
  });

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      roleId: adminRole.id,
      isActive: true,
      createdAt: randomDate(dateStart, dateEnd),
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@example.com',
      password: adminPassword,
      firstName: 'Sales',
      lastName: 'Rep',
      role: 'SALES',
      roleId: salesRole.id,
      isActive: true,
      createdAt: randomDate(dateStart, dateEnd),
    },
  });

  // Create additional sales users for territories
  const salesUsers = [salesUser];
  for (let i = 1; i < 3; i++) {
    const additionalSalesUser = await prisma.user.create({
      data: {
        email: `sales${i + 1}@example.com`,
        password: adminPassword,
        firstName: `Sales`,
        lastName: `Rep ${i + 1}`,
        role: 'SALES',
        roleId: salesRole.id,
        isActive: true,
        createdAt: randomDate(dateStart, dateEnd),
      },
    });
    salesUsers.push(additionalSalesUser);
  }

  const opsUser = await prisma.user.create({
    data: {
      email: 'ops@example.com',
      password: adminPassword,
      firstName: 'Operations',
      lastName: 'Manager',
      role: 'OPERATIONS',
      roleId: opsRole.id,
      isActive: true,
      createdAt: randomDate(dateStart, dateEnd),
    },
  });

  const b2bUser = await prisma.user.create({
    data: {
      email: 'b2b@example.com',
      password: adminPassword,
      firstName: 'B2B',
      lastName: 'Customer',
      role: 'B2B',
      isActive: true,
      createdAt: randomDate(dateStart, dateEnd),
    },
  });
  console.log('✅ Created users and roles');

  // Create warehouses
  console.log('🏭 Creating warehouses...');
  const warehouses: any[] = [];
  const warehouseNames = ['Main Warehouse', 'East Coast DC', 'West Coast DC', 'European Hub'];
  const warehouseLocations = ['New York', 'Atlanta', 'Los Angeles', 'London'];
  
  const warehouseNamesExtended = ['Main Warehouse', 'East Coast DC', 'West Coast DC', 'European Hub', 'Asian Distribution', 'South America Hub', 'Middle East DC', 'African Warehouse', 'Canadian DC', 'Mexico Distribution', 'Australia Hub', 'Japan Warehouse', 'Korea DC', 'Singapore Hub', 'India Warehouse', 'Brazil DC', 'Argentina Warehouse', 'Chile Distribution', 'UAE Hub', 'Saudi Warehouse'];
  const warehouseLocationsExtended = ['New York', 'Atlanta', 'Los Angeles', 'London', 'Shanghai', 'São Paulo', 'Dubai', 'Lagos', 'Toronto', 'Mexico City', 'Sydney', 'Tokyo', 'Seoul', 'Singapore', 'Mumbai', 'Rio de Janeiro', 'Buenos Aires', 'Santiago', 'Abu Dhabi', 'Riyadh'];
  const countriesExtended = ['USA', 'USA', 'USA', 'UK', 'China', 'Brazil', 'UAE', 'Nigeria', 'Canada', 'Mexico', 'Australia', 'Japan', 'South Korea', 'Singapore', 'India', 'Brazil', 'Argentina', 'Chile', 'UAE', 'Saudi Arabia'];
  const postalCodesExtended = ['10001', '30301', '90001', 'SW1A 1AA', '200000', '01310-100', '00000', '100001', 'M5H 2N2', '06000', '2000', '100-0001', '04548', '018956', '400001', '20000-000', 'C1000', '8320000', '00000', '11564'];
  
  for (let i = 0; i < 20; i++) {
    const warehouse = await prisma.warehouse.create({
      data: {
        name: warehouseNamesExtended[i],
        location: warehouseLocationsExtended[i],
        address: `${100 + i} Warehouse St`,
        city: warehouseLocationsExtended[i],
        country: countriesExtended[i],
        postalCode: postalCodesExtended[i],
        tplReference: `3PL-${String(i + 1).padStart(4, '0')}`,
        isActive: true,
        createdAt: randomDate(dateStart, dateEnd),
      },
    });
    warehouses.push(warehouse);
  }
  console.log('✅ Created warehouses');

  // Create warehouse defaults
  console.log('⚙️ Creating warehouse defaults...');
  for (let i = 0; i < warehouses.length; i++) {
    const warehouse = warehouses[i];
    await prisma.warehouseDefault.create({
      data: {
        name: `${warehouse.name} Default`,
        code: `WD-${String(i + 1).padStart(3, '0')}`,
        address: warehouse.address || `${100 + i} Warehouse St`,
        city: warehouse.city || 'New York',
        country: warehouse.country || 'USA',
        postalCode: warehouse.postalCode || `${10000 + i}`,
        status: 'ACTIVE',
      },
    });
  }
  console.log('✅ Created warehouse defaults');

  // Create brands
  console.log('🏷️ Creating brands...');
  const brands: any[] = [];
  const brandNames = ['Premium Brand', 'Eco Fashion', 'Urban Style', 'Classic Collection', 'Modern Trends', 'Luxury Line', 'Sportswear Pro', 'Casual Comfort', 'Business Elite', 'Street Style', 'Vintage Collection', 'Contemporary Design', 'Minimalist Brand', 'Bold Fashion', 'Elegant Essentials', 'Trendy Threads', 'Sustainable Style', 'Artisan Made', 'Designer Label', 'Boutique Brand'];
  
  for (let i = 0; i < 20; i++) {
    const brand = await prisma.brand.create({
      data: {
        name: brandNames[i],
        code: `BRAND-${String(i + 1).padStart(3, '0')}`,
        description: `Brand ${i + 1} description`,
        status: 'ACTIVE',
        createdAt: randomDate(dateStart, dateEnd),
      },
    });
    brands.push(brand);
  }
  console.log('✅ Created brands');

  // Create markets
  console.log('🌍 Creating markets...');
  const markets: any[] = [];
  const marketNames = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Southeast Asia', 'East Asia', 'South Asia', 'Africa', 'Oceania', 'Central America', 'Caribbean', 'Eastern Europe', 'Western Europe', 'Nordic Region', 'Mediterranean', 'Gulf States', 'Central Asia', 'South America', 'North Africa'];
  const marketCodes = ['NAM', 'EUR', 'ASP', 'LAM', 'MDE', 'SEA', 'EAS', 'SAS', 'AFR', 'OCE', 'CAM', 'CAR', 'EEU', 'WEU', 'NRE', 'MED', 'GUL', 'CAS', 'SAM', 'NAF'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Southeast Asia', 'East Asia', 'South Asia', 'Africa', 'Oceania', 'Central America', 'Caribbean', 'Eastern Europe', 'Western Europe', 'Nordic Region', 'Mediterranean', 'Gulf States', 'Central Asia', 'South America', 'North Africa'];
  const countries = ['USA', 'Germany', 'Japan', 'Brazil', 'UAE', 'Singapore', 'China', 'India', 'South Africa', 'Australia', 'Mexico', 'Jamaica', 'Poland', 'France', 'Sweden', 'Italy', 'Qatar', 'Kazakhstan', 'Argentina', 'Egypt'];
  const currencies = ['USD', 'EUR', 'JPY', 'BRL', 'AED', 'SGD', 'CNY', 'INR', 'ZAR', 'AUD', 'MXN', 'JMD', 'PLN', 'EUR', 'SEK', 'EUR', 'QAR', 'KZT', 'ARS', 'EGP'];
  const languages = ['en-US', 'de-DE', 'ja-JP', 'pt-BR', 'en-GB', 'zh-CN', 'es-ES', 'en-US','fr-FR','it-IT', 'es-ES', 'ko-KR','en-US','en-US','en-US','en-US','en-US','en-US','en-US','en-US','en-US','en-US'];
  const timezones = ['America/New_York', 'Europe/Berlin', 'Asia/Tokyo', 'America/Sao_Paulo', 'Asia/Dubai', 'Asia/Singapore', 'Asia/Shanghai', 'Asia/Kolkata', 'Africa/Johannesburg', 'Australia/Sydney', 'America/Mexico_City', 'America/Jamaica', 'Europe/Warsaw', 'Europe/Paris', 'Europe/Stockholm', 'Europe/Rome', 'Asia/Qatar', 'Asia/Almaty', 'America/Argentina/Buenos_Aires', 'Africa/Cairo'];
  
  for (let i = 0; i < 20; i++) {
    const market = await prisma.market.create({
      data: {
        name: marketNames[i],
        code: marketCodes[i],
        region: regions[i],
        country: countries[i],
        currency: currencies[i],
        language: languages[i],
        timezone: timezones[i],
        status: 'ACTIVE',
        createdAt: randomDate(dateStart, dateEnd),
      },
    });
    markets.push(market);
  }
  console.log('✅ Created markets');

  // Create brand-market relationships
  console.log('🔗 Creating brand-market relationships...');
  for (let i = 0; i < brands.length; i++) {
    for (let j = 0; j < 2; j++) {
      await prisma.brandMarket.create({
        data: {
          brandId: brands[i].id,
          marketId: markets[(i + j) % markets.length].id,
        },
      });
    }
  }
  console.log('✅ Created brand-market relationships');

  // Create tax defaults
  console.log('💰 Creating tax defaults...');
  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    await prisma.taxDefault.create({
      data: {
        name: `Tax Default ${i + 1}`,
        type: i % 2 === 0 ? 'SALES_TAX' : 'VAT',
        taxRate: i % 2 === 0 ? 8.5 + Math.random() * 5 : null,
        vatRate: i % 2 === 1 ? 20 + Math.random() * 5 : null,
        country: market.country,
        region: market.region,
        isDefault: i === 0,
      },
    });
  }
  console.log('✅ Created tax defaults');

  // Create FX rates
  console.log('💱 Creating FX rates...');
  const currencyList = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'AUD'];
  const rateMap = new Map<string, number>();
  for (let i = 0; i < 20; i++) {
    const fromCurrency = currencyList[Math.floor(Math.random() * currencyList.length)];
    const toCurrency = currencyList[Math.floor(Math.random() * currencyList.length)];
    if (fromCurrency !== toCurrency) {
      const key = `${fromCurrency}-${toCurrency}`;
      if (!rateMap.has(key)) {
        const rate = 0.5 + Math.random() * 2;
        rateMap.set(key, rate);
        await prisma.fxRate.create({
          data: {
            fromCurrency,
            toCurrency,
            rate,
            lastUpdated: randomDate(dateStart, dateEnd),
          },
        });
      }
    }
  }
  console.log('✅ Created FX rates');

  // Create market currency settings
  console.log('🌐 Creating market currency settings...');
  for (const market of markets) {
    await prisma.marketCurrencySetting.create({
      data: {
        marketId: market.id,
        marketName: market.name,
        marketCode: market.code,
        region: market.region,
        defaultCurrency: market.currency,
        supportedCurrencies: [market.currency, 'USD'],
        isActive: true,
      },
    });
  }
  console.log('✅ Created market currency settings');

  // ============================================
  // CHUNK 2: Customers, Collections, Products, Inventory
  // ============================================
  console.log('👥 Creating customers...');
  const customers = [];
  const customerNames = [
    'Acme Corp', 'Tech Solutions Inc', 'Global Retail Ltd', 'Fashion Forward', 
    'Style Co', 'Trend Setter', 'Modern Apparel', 'Elite Brands', 'Premium Retail',
    'Fashion Hub', 'Style Market', 'Trend Boutique', 'Urban Outfitters', 'Classic Store',
    'Mega Retail', 'Prime Suppliers', 'Elite Distribution', 'Top Tier Trading', 'Premium Wholesale',
    'Global Merchants', 'International Trade', 'Worldwide Retail', 'Mega Brands', 'Super Stores',
    'Ultra Fashion', 'Max Retailers', 'Pro Distributors', 'Apex Trading', 'Summit Suppliers', 'Peak Merchants'
  ];
  
  for (let i = 0; i < 30; i++) {
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'Seattle', 'Denver', 'Boston', 'Nashville', 'Detroit', 'Portland', 'Oklahoma City', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno'];
    const contactPersons = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams', 'David Brown', 'Emily Davis', 'Robert Wilson', 'Lisa Anderson', 'James Taylor', 'Maria Garcia', 'William Martinez', 'Jennifer Lee', 'Christopher White', 'Amanda Harris', 'Michael Chen', 'Patricia Rodriguez', 'Daniel Kim', 'Jessica Thompson', 'Andrew Wilson', 'Michelle Brown', 'Kevin Davis', 'Nicole Garcia', 'Ryan Martinez', 'Stephanie Anderson', 'Brandon Taylor', 'Lauren Moore', 'Justin Jackson', 'Rachel White', 'Tyler Harris', 'Samantha Clark'];
    const customer = await prisma.customer.create({
      data: {
        name: customerNames[i],
        email: `customer${i + 1}@example.com`,
        phone: `+1-555-${1000 + i}`,
        contactPerson: contactPersons[i],
        companyName: customerNames[i],
        taxId: `TAX-${String(i + 1).padStart(6, '0')}`,
        address: `${100 + i} Main St`,
        city: cities[i],
        country: 'USA',
        postalCode: `${10000 + i}`,
        creditLimit: 50000 + (i * 10000),
        type: i % 2 === 0 ? 'B2B' : 'WHOLESALE',
        isActive: true,
        ownerId: salesUser.id,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
    customers.push(customer);
  }
  console.log('✅ Created customers');

  // Create stores
  console.log('🏪 Creating stores...');
  const stores: any[] = [];
  for (let i = 0; i < 20; i++) {
    const store = await prisma.store.create({
      data: {
        name: `Store ${i + 1}`,
        code: `STORE-${String(i + 1).padStart(3, '0')}`,
        address: `${200 + i} Retail Ave`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Boston'][i],
        country: 'USA',
        postalCode: `${20000 + i}`,
        phone: `+1-555-${2000 + i}`,
        email: `store${i + 1}@example.com`,
        isActive: true,
        operatingHours: {
          monday: { open: '09:00', close: '18:00' },
          tuesday: { open: '09:00', close: '18:00' },
          wednesday: { open: '09:00', close: '18:00' },
          thursday: { open: '09:00', close: '18:00' },
          friday: { open: '09:00', close: '18:00' },
          saturday: { open: '10:00', close: '16:00' },
          sunday: { open: '10:00', close: '16:00' },
        },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
    stores.push(store);
  }
  console.log('✅ Created stores');

  // Create collections
  console.log('📦 Creating collections...');
  const collections: any[] = [];
  const seasons = ['Spring 2024', 'Summer 2024', 'Fall 2024', 'Winter 2024', 'Spring 2025', 'Summer 2025', 'Fall 2025', 'Winter 2025'];
  const drops = ['Drop 1', 'Drop 2', 'Drop 3', 'Drop 4', 'Drop 5', 'Drop 6', 'Drop 7', 'Drop 8'];
  
  for (let i = 0; i < 20; i++) {
    const collectionDate = randomDate(dateStart, dateEnd);
    const lifecycle = i < 2 ? 'PLANNING' : i < 6 ? 'ACTIVE' : i < 8 ? 'ARCHIVED' : 'DISCONTINUED';
    const collection = await prisma.collection.create({
      data: {
        name: `${seasons[i % seasons.length]} Collection`,
        season: seasons[i % seasons.length],
        drop: drops[i % drops.length],
        lifecycle,
        description: `Collection ${i + 1} description with seasonal items`,
        createdAt: collectionDate,
        updatedAt: collectionDate,
      },
    });
    collections.push(collection);
  }
  console.log('✅ Created collections');

  // Create products
  console.log('🛍️ Creating products...');
  const products: any[] = [];
  const productNames = [
    'Classic T-Shirt', 'Denim Jacket', 'Slim Fit Jeans', 'Cotton Hoodie', 'Wool Sweater',
    'Leather Boots', 'Canvas Sneakers', 'Baseball Cap', 'Backpack', 'Watch',
    'Sunglasses', 'Belt', 'Wallet', 'Scarf', 'Gloves', 'Jacket', 'Coat', 'Shirt',
    'Pants', 'Shorts', 'Dress', 'Skirt', 'Blouse', 'Vest', 'Cardigan', 'Pullover',
    'Tank Top', 'Polo Shirt', 'Chinos', 'Cargo Pants'
  ];
  
  for (let i = 0; i < 60; i++) {
    const collection = collections[i % collections.length];
    const productDate = randomDate(dateStart, dateEnd);
    const basePrice = 19.99 + (i * 3.5);
    const product = await prisma.product.create({
      data: {
        name: productNames[i % productNames.length] + ` ${Math.floor(i / productNames.length) + 1}`,
        sku: `SKU-${String(i + 1).padStart(5, '0')}`,
        style: `STYLE-${String(i + 1).padStart(4, '0')}`,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'].slice(0, 4 + (i % 3)),
        colors: [['Black'], ['White'], ['Blue'], ['Red'], ['Green'], ['Gray']][i % 6],
        materials: [['Cotton'], ['Polyester'], ['Wool'], ['Leather'], ['Synthetic']][i % 5],
        ean: `EAN${String(i + 1).padStart(12, '0')}`,
        description: `High-quality ${productNames[i % productNames.length]} with premium materials`,
        basePrice,
        price: basePrice * (1 + (Math.random() * 0.2 - 0.1)), // ±10% variation
        images: [],
        collectionId: collection.id,
        createdAt: productDate,
        updatedAt: productDate,
      },
    });
    products.push(product);
  }
  console.log('✅ Created products');

  // Create inventory
  console.log('📊 Creating inventory...');
  for (let i = 0; i < products.length; i++) {
    const warehouse = warehouses[i % warehouses.length];
    const quantity = 50 + Math.floor(Math.random() * 450);
    const availableQty = Math.floor(quantity * (0.6 + Math.random() * 0.3));
    const reservedQty = quantity - availableQty;
    
    await prisma.inventory.create({
      data: {
        productId: products[i].id,
        warehouseId: warehouse.id,
        quantity,
        availableQty,
        reservedQty,
        reorderPoint: 20 + Math.floor(Math.random() * 30),
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created inventory');

  // Create product pricing
  console.log('💵 Creating product pricing...');
  for (let i = 0; i < products.length; i += 3) {
    const product = products[i];
    const adjustedPrice = Number(product.price) * (0.8 + Math.random() * 0.4);
    await prisma.productPricing.create({
      data: {
        productId: product.id,
        basePrice: product.basePrice,
        discountPercent: 0,
        finalPrice: adjustedPrice,
        validFrom: randomDate(dateStart, dateEnd),
        isActive: true,
      },
    });
  }
  console.log('✅ Created product pricing');

  // ============================================
  // CHUNK 3: Suppliers, Purchase Orders, Orders
  // ============================================
  console.log('🏭 Creating suppliers...');
  const suppliers = [];
  const supplierNames = [
    'Global Textiles Ltd', 'Premium Materials Co', 'Fashion Suppliers Inc', 
    'Quality Fabrics Corp', 'Elite Manufacturing', 'Style Source Ltd',
    'Trend Materials Co', 'Classic Suppliers Inc', 'International Textiles', 'Mega Fabrics Co',
    'Worldwide Materials', 'Prime Suppliers Group', 'Advanced Manufacturing', 'Top Quality Corp',
    'Elite Textile Solutions', 'Premium Supply Chain', 'Global Materials Hub', 'International Sourcing',
    'Mega Manufacturing', 'World Class Suppliers'
  ];
  
  const contactNames = ['Zhang Wei', 'Ahmed Hassan', 'Mehmet Yilmaz', 'Nguyen Van', 'Budi Santoso', 'Somsak Chai', 'Juan Dela Cruz', 'Ali Khan', 'Raj Patel', 'Chen Li', 'Mohammed Ali', 'Kim Soo', 'Tanaka Hiroshi', 'Singh Ravi', 'Fernandez Carlos', 'Garcia Maria', 'Kumar Ashok', 'Lee Min', 'Wang Jun', 'Hassan Omar'];
  for (let i = 0; i < 20; i++) {
    const supplier = await prisma.supplier.create({
      data: {
        name: supplierNames[i],
        email: `supplier${i + 1}@example.com`,
        phone: `+1-555-${3000 + i}`,
        contactName: contactNames[i],
        address: `${300 + i} Supplier St`,
        city: ['Shanghai', 'Dhaka', 'Istanbul', 'Ho Chi Minh', 'Jakarta', 'Bangkok', 'Manila', 'Karachi', 'Mumbai', 'Beijing', 'Cairo', 'Seoul', 'Tokyo', 'Delhi', 'São Paulo', 'Bogota', 'Bangalore', 'Busan', 'Osaka', 'Karachi'][i],
        country: ['China', 'Bangladesh', 'Turkey', 'Vietnam', 'Indonesia', 'Thailand', 'Philippines', 'Pakistan', 'India', 'China', 'Egypt', 'South Korea', 'Japan', 'India', 'Brazil', 'Colombia', 'India', 'South Korea', 'Japan', 'Pakistan'][i],
        postalCode: `${30000 + i}`,
        leadTimeDays: 25 + Math.floor(Math.random() * 20), // 25-45 days
        isActive: true,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
    suppliers.push(supplier);
  }
  console.log('✅ Created suppliers');

  // Create supplier price history
  console.log('📈 Creating supplier price history...');
  for (let i = 0; i < suppliers.length; i++) {
    const supplier = suppliers[i];
    for (let j = 0; j < 15; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      await prisma.supplierPriceHistory.create({
        data: {
          supplierId: supplier.id,
          productId: product.id,
          productName: product.name,
          price: Number(product.basePrice) * (0.5 + Math.random() * 0.3), // 50-80% of base price
          currency: 'USD',
          quantity: 100 + Math.floor(Math.random() * 400),
          notes: j % 2 === 0 ? `Bulk pricing for ${product.name}` : null,
          createdBy: admin.email,
          date: randomDate(dateStart, dateEnd),
        },
      });
    }
  }
  console.log('✅ Created supplier price history');

  // Create purchase orders
  console.log('📋 Creating purchase orders...');
  const purchaseOrders: any[] = [];
  for (let i = 0; i < 40; i++) {
    const supplier = suppliers[i % suppliers.length];
    const orderDate = randomDate(dateStart, dateEnd);
    const numItems = 2 + Math.floor(Math.random() * 6);
    const purchaseOrderLines = [];
    let totalAmount = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = 50 + Math.floor(Math.random() * 450);
      const unitPrice = Number(product.basePrice) * (0.5 + Math.random() * 0.3);
      const lineTotal = unitPrice * quantity;
      totalAmount += lineTotal;
      
      purchaseOrderLines.push({
        productId: product.id,
        quantity,
        unitCost: unitPrice,
        totalCost: lineTotal,
      });
    }

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber: `PO-${String(i + 1).padStart(6, '0')}`,
        supplierId: supplier.id,
        status: i < 5 ? 'DRAFT' : i < 10 ? 'SENT' : i < 18 ? 'CONFIRMED' : i < 22 ? 'PARTIALLY_RECEIVED' : 'RECEIVED',
        totalAmount,
        currency: 'USD',
        orderDate,
        expectedDate: new Date(orderDate.getTime() + 45 * 24 * 60 * 60 * 1000),
        receivedDate: i >= 22 ? new Date(orderDate.getTime() + 30 * 24 * 60 * 60 * 1000) : null,
        notes: i % 3 === 0 ? `PO notes: Please ensure quality standards are met.` : i % 5 === 0 ? `Rush order - expedite production` : null,
        createdAt: orderDate,
        updatedAt: orderDate,
        lines: {
          create: purchaseOrderLines,
        },
      },
    });
    purchaseOrders.push(purchaseOrder);
  }
  console.log('✅ Created purchase orders');

  // Create purchase order approvals
  console.log('✅ Creating purchase order approvals...');
  for (let i = 0; i < purchaseOrders.length; i++) {
    if (i >= 5 && i < 18) {
      await prisma.purchaseOrderApproval.create({
        data: {
          purchaseOrderId: purchaseOrders[i].id,
          approverId: admin.id,
          approverName: `${admin.firstName} ${admin.lastName}`,
          status: 'APPROVED',
          comments: 'Approved for procurement',
          date: randomDate(dateStart, dateEnd),
        },
      });
    }
  }
  console.log('✅ Created purchase order approvals');

  // Create orders
  console.log('📦 Creating orders...');
  const orders: any[] = [];
  for (let i = 0; i < 80; i++) {
    const orderDate = randomDate(dateStart, dateEnd);
    const customer = customers[i % customers.length];
    const orderNumber = `ORD-${String(i + 1).padStart(6, '0')}`;
    
    const numItems = 1 + Math.floor(Math.random() * 8);
    const orderLines = [];
    let totalAmount = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = 1 + Math.floor(Math.random() * 15);
      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * quantity;
      totalAmount += lineTotal;
      
      orderLines.push({
        productId: product.id,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
        size: ['XS', 'S', 'M', 'L', 'XL'][j % 5],
        color: ['Black', 'White', 'Blue', 'Red', 'Green'][j % 5],
      });
    }

    const statuses: OrderStatus[] = ['DRAFT', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const statusIndex = Math.min(Math.floor(i / 12), statuses.length - 1);
    const status = statuses[statusIndex];
    
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        userId: salesUser.id,
        type: i % 3 === 0 ? 'B2B' : i % 3 === 1 ? 'DTC' : 'B2B',
        status,
        totalAmount,
        currency: 'USD',
        orderDate,
        requiredDate: new Date(orderDate.getTime() + (7 + Math.floor(Math.random() * 14)) * 24 * 60 * 60 * 1000),
        shippedDate: status === 'SHIPPED' || status === 'DELIVERED' ? new Date(orderDate.getTime() + (3 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000) : null,
        deliveredDate: status === 'DELIVERED' ? new Date(orderDate.getTime() + (7 + Math.floor(Math.random() * 7)) * 24 * 60 * 60 * 1000) : null,
        shippingAddress: `${customer.address}, ${customer.city}, ${customer.country} ${customer.postalCode}`,
        billingAddress: `${customer.address}, ${customer.city}, ${customer.country} ${customer.postalCode}`,
        notes: i % 5 === 0 ? `Order notes for ${orderNumber}. Please handle with care.` : i % 7 === 0 ? `Rush order - expedite shipping` : null,
        createdAt: orderDate,
        updatedAt: orderDate,
        orderLines: {
          create: orderLines,
        },
      },
    });
    orders.push(order);
  }
  console.log('✅ Created orders');

  // ============================================
  // CHUNK 4: Quotes, Proforma Invoices, Shipments, Returns
  // ============================================
  console.log('💼 Creating quotes...');
  const quotes = [];
  for (let i = 0; i < 30; i++) {
    const quoteDate = randomDate(dateStart, dateEnd);
    const customer = customers[i % customers.length];
    const order = i < 20 ? orders[i] : null;
    const numItems = 1 + Math.floor(Math.random() * 6);
    const quoteLines = [];
    let totalAmount = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = 1 + Math.floor(Math.random() * 10);
      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * quantity;
      totalAmount += lineTotal;
      
      quoteLines.push({
        productId: product.id,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
        size: ['XS', 'S', 'M', 'L', 'XL'][j % 5],
        color: ['Black', 'White', 'Blue', 'Red', 'Green'][j % 5],
        description: `${product.name} - Premium quality`,
      });
    }

    const taxRate = 8.5;
    const taxAmount = totalAmount * (taxRate / 100);
    const discountPercent = i % 3 === 0 ? 5 : 0;
    const discountAmount = totalAmount * (discountPercent / 100);
    const subtotal = totalAmount - discountAmount;
    const finalTotal = subtotal + taxAmount;

    const quote = await prisma.quote.create({
      data: {
        quoteNumber: `QT-${String(i + 1).padStart(6, '0')}`,
        customerId: customer.id,
        userId: salesUser.id,
        orderId: order?.id,
        status: i < 10 ? 'DRAFT' : i < 20 ? 'SENT' : i < 25 ? 'ACCEPTED' : 'REJECTED',
        subtotal,
        taxRate,
        taxAmount,
        discountPercent,
        discountAmount,
        totalAmount: finalTotal,
        currency: 'USD',
        notes: i % 4 === 0 ? `Quote notes: Valid for 30 days. Bulk discount available.` : null,
        terms: `Payment terms: Net 30. Shipping included for orders over $500.`,
        validUntil: new Date(quoteDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        sentAt: i >= 10 && i < 20 ? new Date(quoteDate.getTime() + 1 * 24 * 60 * 60 * 1000) : null,
        acceptedAt: i >= 20 && i < 25 ? new Date(quoteDate.getTime() + 5 * 24 * 60 * 60 * 1000) : null,
        rejectedAt: i >= 25 ? new Date(quoteDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
        createdAt: quoteDate,
        updatedAt: quoteDate,
        quoteLines: {
          create: quoteLines,
        },
      },
    });
    quotes.push(quote);
  }
  console.log('✅ Created quotes');

  // Create proforma invoices
  console.log('🧾 Creating proforma invoices...');
  const proformaInvoices: any[] = [];
  for (let i = 0; i < 25; i++) {
    const invoiceDate = randomDate(dateStart, dateEnd);
    const customer = customers[i % customers.length];
    const order = orders[i];
    const numItems = 1 + Math.floor(Math.random() * 6);
    const invoiceLines = [];
    let totalAmount = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = 1 + Math.floor(Math.random() * 10);
      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * quantity;
      totalAmount += lineTotal;
      
      invoiceLines.push({
        productId: product.id,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
        size: ['XS', 'S', 'M', 'L', 'XL'][j % 5],
        color: ['Black', 'White', 'Blue', 'Red', 'Green'][j % 5],
        description: `${product.name} - Invoice line item`,
      });
    }

    const taxRate = 8.5;
    const taxAmount = totalAmount * (taxRate / 100);
    const discountPercent = i % 3 === 0 ? 5 : 0;
    const discountAmount = totalAmount * (discountPercent / 100);
    const subtotal = totalAmount - discountAmount;
    const finalTotal = subtotal + taxAmount;

    const proformaInvoice = await prisma.proformaInvoice.create({
      data: {
        invoiceNumber: `PF-${String(i + 1).padStart(6, '0')}`,
        customerId: customer.id,
        userId: salesUser.id,
        orderId: order.id,
        status: i < 8 ? 'DRAFT' : i < 15 ? 'SENT' : i < 20 ? 'PAID' : 'CANCELLED',
        subtotal,
        taxRate,
        taxAmount,
        discountPercent,
        discountAmount,
        totalAmount: finalTotal,
        currency: 'USD',
        notes: i % 4 === 0 ? `Invoice notes: Payment due within 30 days.` : null,
        terms: `Payment terms: Net 30. Late payment fees may apply.`,
        dueDate: new Date(invoiceDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        sentAt: i >= 8 && i < 15 ? new Date(invoiceDate.getTime() + 1 * 24 * 60 * 60 * 1000) : null,
        paidAt: i >= 15 && i < 20 ? new Date(invoiceDate.getTime() + 15 * 24 * 60 * 60 * 1000) : null,
        createdAt: invoiceDate,
        updatedAt: invoiceDate,
        invoiceLines: {
          create: invoiceLines,
        },
      },
    });
    proformaInvoices.push(proformaInvoice);
  }
  console.log('✅ Created proforma invoices');

  // Create shipments
  console.log('🚚 Creating shipments...');
  const shipments: any[] = [];
  for (let i = 0; i < 40; i++) {
    const order = orders[i];
    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      const shipmentDate = order.shippedDate || randomDate(dateStart, dateEnd);
      const shipment = await prisma.shipment.create({
        data: {
          shipmentNumber: `SHIP-${String(i + 1).padStart(6, '0')}`,
          order: { connect: { id: order.id } },
          warehouse: { connect: { id: warehouses[i % warehouses.length].id } },
          carrier: ['UPS', 'FedEx', 'DHL', 'USPS'][i % 4],
          trackingNumber: `TRK${String(i + 1).padStart(10, '0')}`,
          status: order.status === 'DELIVERED' ? 'DELIVERED' : 'SHIPPED',
          shippingCost: 15 + Math.floor(Math.random() * 85), // $15-$100
          shippedDate: shipmentDate,
          deliveredDate: order.status === 'DELIVERED' ? order.deliveredDate : null,
        },
      });
      shipments.push(shipment);
    }
  }
  console.log('✅ Created shipments');

  // Create shipping labels
  console.log('🏷️ Creating shipping labels...');
  for (let i = 0; i < shipments.length; i++) {
    const shipment = shipments[i];
    const order = orders[i];
    await prisma.shippingLabel.create({
      data: {
        labelNumber: `LABEL-${String(i + 1).padStart(6, '0')}`,
        orderId: order.id,
        carrier: shipment.carrier || 'UPS',
        trackingNumber: shipment.trackingNumber || `TRK${String(i + 1).padStart(10, '0')}`,
        serviceType: ['Ground', 'Express', 'Overnight', '2-Day'][i % 4],
        weight: 1 + Math.random() * 10, // 1-11 lbs
        dimensions: `${10 + i} x ${8 + i} x ${6 + i} in`,
        cost: shipment.shippingCost || 25 + Math.floor(Math.random() * 50),
        status: 'PRINTED',
        printedAt: shipment.shippedDate || randomDate(dateStart, dateEnd),
        shippedAt: shipment.shippedDate || null,
        notes: i % 5 === 0 ? `Fragile - handle with care` : null,
      },
    });
  }
  console.log('✅ Created shipping labels');

  // Create returns
  console.log('↩️ Creating returns...');
  const returns: any[] = [];
  for (let i = 0; i < 25; i++) {
    const order = orders[10 + i];
    const returnDate = randomDate(order.orderDate, dateEnd);
    const orderLine = order.orderLines?.[0];
    if (orderLine) {
      const reasons: ReturnReason[] = ['DEFECTIVE', 'WRONG_SIZE', 'NOT_AS_DESCRIBED', 'CUSTOMER_REQUEST', 'DAMAGED'];
      const statuses: ReturnStatus[] = ['PENDING', 'APPROVED', 'PROCESSING', 'COMPLETED', 'REJECTED'];
      const returnRecord = await prisma.return.create({
        data: {
          rmaNumber: `RET-${String(i + 1).padStart(6, '0')}`,
          orderId: order.id,
          orderLineId: orderLine.id,
          productId: orderLine.productId,
          quantity: orderLine.quantity,
          reason: reasons[i % reasons.length],
          reasonDetails: `Return reason details: ${reasons[i % reasons.length].toLowerCase().replace('_', ' ')}. Customer requested return.`,
          status: statuses[Math.min(Math.floor(i / 3), statuses.length - 1)],
          requestedDate: returnDate,
          approvedDate: i >= 5 ? new Date(returnDate.getTime() + 1 * 24 * 60 * 60 * 1000) : null,
          processedDate: i >= 10 ? new Date(returnDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
          refundAmount: Number(order.totalAmount) * (0.3 + Math.random() * 0.5),
          notes: i % 3 === 0 ? `Return notes: Item inspected and approved for refund.` : null,
        },
      });
      returns.push(returnRecord);
    }
  }
  console.log('✅ Created returns');

  // Create reverse logistics
  console.log('🔄 Creating reverse logistics...');
  for (const returnRecord of returns) {
    if (returnRecord.status === 'APPROVED' || returnRecord.status === 'PROCESSING' || returnRecord.status === 'COMPLETED') {
      const order = await prisma.order.findUnique({ where: { id: returnRecord.orderId }, include: { customer: true } });
      await prisma.reverseLogistics.create({
        data: {
          rmaId: returnRecord.id,
          status: returnRecord.status === 'COMPLETED' ? 'PROCESSED' : returnRecord.status === 'PROCESSING' ? 'IN_TRANSIT' : 'PENDING',
          trackingNumber: `RL-${returnRecord.rmaNumber}`,
          carrier: ['UPS', 'FedEx', 'USPS'][Math.floor(Math.random() * 3)],
          originName: order?.customer?.name || 'Customer',
          originAddress: order?.customer?.address || '123 Main St',
          originCity: order?.customer?.city || 'New York',
          originState: 'NY',
          originPostalCode: order?.customer?.postalCode || '10001',
          originCountry: order?.customer?.country || 'USA',
          destinationName: 'Returns Department',
          destinationAddress: '456 Warehouse Blvd',
          destinationCity: 'Newark',
          destinationState: 'NJ',
          destinationPostalCode: '07102',
          destinationCountry: 'USA',
          shippedDate: returnRecord.status === 'PROCESSING' || returnRecord.status === 'COMPLETED' ? new Date(returnRecord.requestedDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
          receivedDate: returnRecord.status === 'COMPLETED' ? new Date(returnRecord.requestedDate.getTime() + 5 * 24 * 60 * 60 * 1000) : null,
          inspectedDate: returnRecord.status === 'COMPLETED' ? new Date(returnRecord.requestedDate.getTime() + 6 * 24 * 60 * 60 * 1000) : null,
          processedDate: returnRecord.status === 'COMPLETED' ? new Date(returnRecord.requestedDate.getTime() + 7 * 24 * 60 * 60 * 1000) : null,
          estimatedDeliveryDate: new Date(returnRecord.requestedDate.getTime() + 7 * 24 * 60 * 60 * 1000),
          notes: returnRecord.status === 'COMPLETED' ? `Return processed successfully` : null,
        },
      });
    }
  }
  console.log('✅ Created reverse logistics');

  // ============================================
  // CHUNK 5: BOPIS, BORIS, Endless Aisle, Marketing, More
  // ============================================
  console.log('🛒 Creating BOPIS orders...');
  const bopisOrders = [];
  for (let i = 0; i < 20; i++) {
    const orderDate = randomDate(dateStart, dateEnd);
    const customer = customers[i % customers.length];
    const store = stores[i % stores.length];
    const numItems = 1 + Math.floor(Math.random() * 5);
    const orderItems = [];
    let totalAmount = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = 1 + Math.floor(Math.random() * 3);
      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * quantity;
      totalAmount += lineTotal;
      
      orderItems.push({
        productId: product.id,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
        size: ['S', 'M', 'L', 'XL'][j % 4],
        color: ['Black', 'White', 'Blue'][j % 3],
      });
    }

    // Create the base order first
    const baseOrder = await prisma.order.create({
      data: {
        orderNumber: `BOPIS-${String(i + 1).padStart(6, '0')}`,
        customerId: customer.id,
        userId: salesUser.id,
        type: 'DTC',
        status: 'CONFIRMED',
        totalAmount,
        currency: 'USD',
        orderDate,
        orderLines: {
          create: orderItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: { orderLines: true },
    });

    const statuses: BOPISOrderStatus[] = ['PENDING', 'READY_FOR_PICKUP', 'PICKED_UP', 'CANCELLED', 'EXPIRED'];
    const statusIndex = Math.min(Math.floor(i / 4), statuses.length - 1);
    const status = statuses[statusIndex];
    
    const bopisOrder = await prisma.bOPISOrder.create({
      data: {
        orderId: baseOrder.id,
        orderNumber: baseOrder.orderNumber,
        customerId: customer.id,
        storeId: store.id,
        status,
        totalAmount,
        currency: 'USD',
        orderDate,
        readyForPickupDate: status === 'READY_FOR_PICKUP' || status === 'PICKED_UP' ? new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
        pickedUpDate: status === 'PICKED_UP' ? new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
        expiryDate: new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        pickupInstructions: `Pick up at ${store.name}`,
        customerNotes: i % 3 === 0 ? 'Please call when ready' : null,
        items: {
          create: orderItems.map((item, idx) => ({
            orderLineId: baseOrder.orderLines[idx].id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            size: item.size,
            color: item.color,
          })),
        },
      },
    });
    bopisOrders.push(bopisOrder);
  }
  console.log('✅ Created BOPIS orders');

  // Create BORIS returns
  console.log('↩️ Creating BORIS returns...');
  const borisReturns: any[] = [];
  for (let i = 0; i < 20; i++) {
    const returnDate = randomDate(dateStart, dateEnd);
    const bopisOrder = bopisOrders[i];
    const store = stores[i % stores.length];
    
    // Get the order lines for this BOPIS order
    const orderLines = await prisma.orderLine.findMany({
      where: { orderId: bopisOrder.orderId },
    });
    
    if (orderLines.length === 0) continue;
    
    const numItems = Math.min(1 + Math.floor(Math.random() * 3), orderLines.length);
    const returnItems = [];
    let refundAmount = 0;
    const conditions: ItemCondition[] = [ItemCondition.NEW, ItemCondition.USED, ItemCondition.DAMAGED, ItemCondition.DEFECTIVE];
    
    for (let j = 0; j < numItems; j++) {
      const orderLine = orderLines[j];
      const quantity = Math.min(1, orderLine.quantity);
      const lineRefundAmount = Number(orderLine.unitPrice) * quantity;
      refundAmount += lineRefundAmount;
      
      returnItems.push({
        orderLineId: orderLine.id,
        productId: orderLine.productId,
        quantity,
        condition: conditions[j % conditions.length],
        refundAmount: lineRefundAmount,
        notes: j === 0 ? 'Return requested by customer' : null,
      });
    }

    // Create a Return record first
    const returnRecord = await prisma.return.create({
      data: {
        rmaNumber: `RET-BORIS-${String(i + 1).padStart(6, '0')}`,
        orderId: bopisOrder.orderId,
        productId: returnItems[0].productId,
        quantity: returnItems[0].quantity,
        reason: 'CUSTOMER_REQUEST',
        status: 'APPROVED',
        requestedDate: returnDate,
        approvedDate: returnDate,
        refundAmount,
      },
    });

    const statuses: BORISReturnStatus[] = ['PENDING', 'IN_TRANSIT', 'RECEIVED', 'PROCESSED', 'REJECTED'];
    const statusIndex = Math.min(Math.floor(i / 3), statuses.length - 1);
    const status = statuses[statusIndex];
    
    const borisReturn = await prisma.bORISReturn.create({
      data: {
        returnId: returnRecord.id,
        returnNumber: `BORIS-${String(i + 1).padStart(6, '0')}`,
        orderId: bopisOrder.orderId,
        customerId: customers[(i + 1) % customers.length].id,
        storeId: store.id,
        status,
        returnDate,
        receivedDate: status === 'RECEIVED' || status === 'PROCESSED' ? new Date(returnDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
        processedDate: status === 'PROCESSED' ? new Date(returnDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
        reason: ['Wrong Size', 'Defective', 'Changed Mind', 'Not as Described'][i % 4],
        refundAmount,
        currency: 'USD',
        items: {
          create: returnItems,
        },
      },
    });
    borisReturns.push(borisReturn);
  }
  console.log('✅ Created BORIS returns');

  // Create endless aisle products
  console.log('🛍️ Creating endless aisle products...');
  for (let i = 0; i < 30; i++) {
    const product = products[(i * 2) % products.length];
    await prisma.endlessAisleProduct.create({
      data: {
        productId: product.id,
        isAvailable: i < 12,
        estimatedShippingDays: 3 + Math.floor(Math.random() * 7),
        currency: 'USD',
        basePrice: product.basePrice,
        availableAtWarehouses: {
          create: warehouses.slice(0, 2).map(warehouse => ({
            warehouseId: warehouse.id,
            availableQuantity: 10 + Math.floor(Math.random() * 50),
            estimatedShippingDays: 3 + Math.floor(Math.random() * 7),
          })),
        },
      },
    });
  }
  console.log('✅ Created endless aisle products');

  // Create campaign events
  console.log('📅 Creating campaign events...');
  const eventTypes: CampaignEventType[] = ['DROP', 'LAUNCH', 'PROMO'];
  const eventNames = [
    'Summer Sale Launch', 'New Collection Drop', 'Flash Sale', 'Holiday Promotion',
    'Black Friday Event', 'Cyber Monday Sale', 'End of Season Clearance', 'New Year Sale',
    'Spring Collection Launch', 'Back to School Sale', 'Winter Clearance', 'Valentine\'s Day Promo',
    'Easter Special', 'Mother\'s Day Sale', 'Father\'s Day Promo', 'Independence Day Sale',
    'Back to School', 'Halloween Special', 'Thanksgiving Sale', 'Christmas Promotion',
    'New Year Launch', 'Spring Break Sale', 'Memorial Day', 'Labor Day Special',
    'Graduation Sale', 'Wedding Season', 'Anniversary Promo', 'Birthday Special', 'Clearance Event', 'Grand Opening'
  ];
  
  for (let i = 0; i < 30; i++) {
    const eventDate = randomDate(dateStart, dateEnd);
    const collection = i % 2 === 0 ? collections[i % collections.length] : null;
    
    await prisma.campaignEvent.create({
      data: {
        name: eventNames[i % eventNames.length],
        date: eventDate,
        type: eventTypes[i % eventTypes.length],
        description: `Campaign event ${i + 1} description`,
        status: i < 5 ? 'ACTIVE' : i < 10 ? 'COMPLETED' : 'PLANNED',
        collectionId: collection?.id,
        createdAt: eventDate,
        updatedAt: eventDate,
      },
    });
  }
  console.log('✅ Created campaign events');

  // Create featured collections
  console.log('⭐ Creating featured collections...');
  for (let i = 0; i < 15; i++) {
    await prisma.featuredCollection.create({
      data: {
        collectionId: collections[i].id,
      },
    });
  }
  console.log('✅ Created featured collections');

  // Create markdown plans
  console.log('💰 Creating markdown plans...');
  for (let i = 0; i < 25; i++) {
    const product = products[(i * 3) % products.length];
    const startDate = randomDate(dateStart, dateEnd);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 30);
    
    await prisma.markdownPlan.create({
      data: {
        productId: product.id,
        discountPercent: 10 + (i * 3),
        newPrice: Number(product.price) * (1 - (10 + i * 3) / 100),
        startDate,
        endDate: endDate > dateEnd ? dateEnd : endDate,
        reason: ['Dead stock clearance', 'Seasonal clearance', 'End of line', 'Overstock', 'Promotional'][i % 5],
        notes: `Markdown plan for ${product.name}`,
      },
    });
  }
  console.log('✅ Created markdown plans');

  // Create integrations
  console.log('🔌 Creating integrations...');
  const integrationNames = [
    'Google Analytics', 'Shopify', 'Klaviyo', 'Facebook Pixel',
    'Google Ads', 'Segment', 'Mixpanel', 'Amplitude', 'Mailchimp', 'HubSpot',
    'Salesforce', 'Zendesk', 'Stripe', 'PayPal', 'WooCommerce', 'Magento',
    'BigCommerce', 'Squarespace', 'Wix', 'Adobe Commerce', 'PrestaShop'
  ];
  const integrationTypes: IntegrationType[] = [
    'ANALYTICS', 'E_COMMERCE', 'MARKETING', 'MARKETING',
    'MARKETING', 'ANALYTICS', 'ANALYTICS', 'ANALYTICS', 'MARKETING', 'MARKETING',
    'OTHER', 'OTHER', 'OTHER', 'OTHER', 'E_COMMERCE', 'E_COMMERCE',
    'E_COMMERCE', 'E_COMMERCE', 'E_COMMERCE', 'E_COMMERCE', 'E_COMMERCE'
  ];
  
  for (let i = 0; i < 21; i++) {
    // Determine status: first 4 are CONNECTED, next 2 are DISCONNECTED, rest are PENDING
    let status: IntegrationStatus;
    let apiKey: string | null = null;
    let apiSecret: string | null = null;
    let config: any = null;
    let lastSync: Date | null = null;
    
    if (i < 4) {
      // CONNECTED integrations
      status = 'CONNECTED';
      apiKey = `api_key_${i + 1}`;
      apiSecret = `api_secret_${i + 1}`;
      lastSync = randomDate(dateStart, dateEnd);
      config = {
        enabled: true,
        syncFrequency: 'hourly',
        autoSync: true,
        webhookUrl: `https://api.example.com/webhooks/${integrationNames[i].toLowerCase().replace(/\s+/g, '_')}`,
        version: 'v1',
        region: 'us-east-1'
      };
    } else if (i < 6) {
      // DISCONNECTED integrations
      status = 'DISCONNECTED';
      config = {
        enabled: false,
        lastConnected: randomDate(dateStart, dateEnd).toISOString(),
        reason: 'User disconnected'
      };
    } else {
      // PENDING integrations
      status = 'PENDING';
      config = {
        setupRequired: true,
        setupSteps: [
          'Generate API credentials',
          'Configure webhook endpoints',
          'Test connection'
        ]
      };
    }
    
    await prisma.integration.create({
      data: {
        name: integrationNames[i],
        type: integrationTypes[i],
        status,
        apiKey,
        apiSecret,
        config,
        lastSync,
        notes: `Integration for ${integrationNames[i]}. ${status === 'CONNECTED' ? 'Active and syncing data.' : status === 'DISCONNECTED' ? 'Previously connected but currently disconnected.' : 'Pending setup and configuration.'}`,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created integrations');

  // ============================================
  // CHUNK 6: Rules, Alerts, Exceptions, Tasks, Reviews, Forecasts, BOM, Cost Sheets
  // ============================================
  console.log('📜 Creating rules...');
  for (let i = 0; i < 20; i++) {
    const ruleTypes: RuleType[] = ['INVENTORY', 'PRICING', 'ORDER', 'ALERT', 'AUTOMATION'];
    await prisma.rule.create({
      data: {
        name: `Rule ${i + 1}`,
        type: ruleTypes[i % ruleTypes.length],
        status: i < 8 ? 'ACTIVE' : 'INACTIVE',
        description: `Automated rule ${i + 1} for ${ruleTypes[i % ruleTypes.length].toLowerCase()} management`,
        conditions: { threshold: 50 + i * 10 },
        actions: { action: 'notify', recipient: 'admin@example.com' },
        priority: i,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created rules');

  // Create alerts
  console.log('🚨 Creating alerts...');
  for (let i = 0; i < 30; i++) {
    const severities: AlertSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const statuses: AlertStatus[] = ['NEW', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED'];
    const alertTypes: AlertType[] = ['LOW_STOCK', 'HIGH_STOCK', 'ORDER_DELAY', 'PAYMENT_ISSUE', 'SYSTEM_ERROR'];
    await prisma.alert.create({
      data: {
        type: alertTypes[i % alertTypes.length],
        severity: severities[i % severities.length],
        status: statuses[Math.min(Math.floor(i / 5), statuses.length - 1)],
        title: `Alert ${i + 1}`,
        message: `Alert message ${i + 1} - requires attention`,
        metadata: { orderId: i < 10 ? orders[i]?.id : null },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created alerts');

  // Create exceptions
  console.log('⚠️ Creating exceptions...');
  for (let i = 0; i < 25; i++) {
    const statuses: ExceptionStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const exceptionTypes: ExceptionType[] = ['INVENTORY_MISMATCH', 'ORDER_PROCESSING_DELAY', 'SHIPMENT_DELAY', 'DATA_INCONSISTENCY', 'SYSTEM_ERROR'];
    await prisma.exception.create({
      data: {
        type: exceptionTypes[i % exceptionTypes.length],
        status: statuses[Math.min(Math.floor(i / 5), statuses.length - 1)],
        title: `Exception ${i + 1}`,
        message: `Exception description ${i + 1}`,
        metadata: { orderId: i < 10 ? orders[i]?.id : null },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created exceptions');

  // Create tasks
  console.log('✅ Creating tasks...');
  for (let i = 0; i < 35; i++) {
    const statuses: TaskStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
    const priorities: TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
    await prisma.task.create({
      data: {
        title: `Task ${i + 1}`,
        description: `Task description ${i + 1}`,
        status: statuses[Math.min(Math.floor(i / 7), statuses.length - 1)],
        priority: priorities[i % priorities.length],
        assignedTo: i % 2 === 0 ? admin.email : salesUser.email,
        dueDate: randomDate(dateStart, dateEnd),
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created tasks');

  // Create reviews
  console.log('⭐ Creating reviews...');
  for (let i = 0; i < 40; i++) {
    const product = products[i % products.length];
    await prisma.review.create({
      data: {
        productId: product.id,
        customerId: customers[i % customers.length].id,
        rating: 3 + Math.floor(Math.random() * 3), // 3-5 stars
        review: `Great product! ${i % 2 === 0 ? 'Highly recommended.' : 'Good value for money.'}`,
        status: i < 25 ? 'RESOLVED' : 'PENDING',
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created reviews');

  // Create forecasts
  console.log('📊 Creating forecasts...');
  for (let i = 0; i < 50; i++) {
    const product = products[i % products.length];
    const forecastDate = randomDate(dateStart, dateEnd);
    const period = `${forecastDate.getFullYear()}-${String(forecastDate.getMonth() + 1).padStart(2, '0')}`;
    await prisma.forecast.create({
      data: {
        productId: product.id,
        period,
        predictedDemand: 50 + Math.floor(Math.random() * 200),
        confidence: (70 + Math.random() * 25) / 100,
        method: ['AI', 'Manual', 'Historical'][i % 3],
      },
    });
  }
  console.log('✅ Created forecasts');

  // Create BOMs
  console.log('📋 Creating BOMs...');
  for (let i = 0; i < 20; i++) {
    const product = products[(i * 3) % products.length];
    const bom = await prisma.bOM.create({
      data: {
        productId: product.id,
        name: `BOM for ${product.name}`,
        description: `Bill of Materials for ${product.name}`,
        status: 'ACTIVE',
      },
    });
    
    // Create BOM components
    for (let j = 0; j < 5; j++) {
      const componentProduct = products[(i * 3 + j + 1) % products.length];
      await prisma.bOMComponent.create({
        data: {
          bomId: bom.id,
          productId: componentProduct.id,
          name: componentProduct.name,
          quantity: 1 + Math.floor(Math.random() * 3),
          unit: 'pcs',
          cost: Number(componentProduct.basePrice) * (0.5 + Math.random() * 0.5),
          notes: j % 2 === 0 ? `Component note: Quality grade A, sourced from approved supplier` : null,
        },
      });
    }
  }
  console.log('✅ Created BOMs');

  // Create cost sheets
  console.log('💰 Creating cost sheets...');
  for (let i = 0; i < 30; i++) {
    const product = products[(i * 2) % products.length];
    const materials = Number(product.basePrice) * 0.3;
    const labor = Number(product.basePrice) * 0.2;
    const overhead = Number(product.basePrice) * 0.1;
    const totalCost = materials + labor + overhead;
    await prisma.costSheet.create({
      data: {
        productId: product.id,
        materials,
        labor,
        overhead,
        totalCost,
        sellingPrice: Number(product.price),
        margin: ((Number(product.price) - totalCost) / Number(product.price)) * 100,
        notes: i % 3 === 0 ? `Cost breakdown notes: Materials sourced from multiple suppliers. Labor costs include assembly and quality control.` : null,
      },
    });
  }
  console.log('✅ Created cost sheets');

  // ============================================
  // CHUNK 7: Replenishment, Pick Lists, Pack Slips, Scan History, More
  // ============================================
  console.log('📦 Creating replenishments...');
  for (let i = 0; i < 30; i++) {
    const product = products[i % products.length];
    const warehouse = warehouses[i % warehouses.length];
    await prisma.replenishment.create({
      data: {
        productId: product.id,
        warehouseId: warehouse.id,
        quantity: 100 + Math.floor(Math.random() * 400),
        status: i < 8 ? 'PENDING' : i < 15 ? 'IN_PROGRESS' : 'COMPLETED',
        reorderPoint: 20 + Math.floor(Math.random() * 30),
        safetyStock: 10 + Math.floor(Math.random() * 20),
        requestedDate: randomDate(dateStart, dateEnd),
        completedDate: i >= 15 ? randomDate(dateStart, dateEnd) : null,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created replenishments');

  // Create pick lists
  console.log('📝 Creating pick lists...');
  const pickLists: any[] = [];
  for (let i = 0; i < 40; i++) {
    const order = orders[i];
    if (order.status === 'CONFIRMED' || order.status === 'PROCESSING' || order.status === 'SHIPPED') {
      const pickList = await prisma.pickList.create({
        data: {
          pickListNumber: `PL-${String(i + 1).padStart(6, '0')}`,
          order: { connect: { id: order.id } },
          warehouse: { connect: { id: warehouses[i % warehouses.length].id } },
          status: order.status === 'SHIPPED' ? 'COMPLETED' : 'IN_PROGRESS',
          assignedTo: opsUser.email,
          startedAt: order.status === 'SHIPPED' ? randomDate(order.orderDate, dateEnd) : null,
          completedAt: order.status === 'SHIPPED' ? randomDate(order.orderDate, dateEnd) : null,
        },
      });
      pickLists.push(pickList);
      
      // Create pick list items
      const orderLines = order.orderLines || [];
      for (let j = 0; j < orderLines.length; j++) {
        const orderLine = orderLines[j];
        const pickedQty = order.status === 'SHIPPED' ? orderLine.quantity : Math.floor(orderLine.quantity * 0.8);
        await prisma.pickListItem.create({
          data: {
            pickListId: pickList.id,
            orderLineId: orderLine.id,
            productId: orderLine.productId,
            binLocation: `A-${String(i % 10 + 1).padStart(2, '0')}-${String(j % 5 + 1).padStart(2, '0')}`,
            quantity: orderLine.quantity,
            pickedQuantity: pickedQty,
            status: order.status === 'SHIPPED' ? 'PICKED' : pickedQty > 0 ? 'PARTIAL' : 'PENDING',
            pickedBy: order.status === 'SHIPPED' ? opsUser.email : null,
            pickedAt: order.status === 'SHIPPED' ? randomDate(order.orderDate, dateEnd) : null,
            notes: pickedQty < orderLine.quantity ? `Partial pick: ${pickedQty} of ${orderLine.quantity}` : null,
          },
        });
      }
    }
  }
  console.log('✅ Created pick lists');

  // Create pack slips
  console.log('📄 Creating pack slips...');
  for (let i = 0; i < 35; i++) {
    const order = orders[i];
    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      const packSlip = await prisma.packSlip.create({
        data: {
          packSlipNumber: `PS-${String(i + 1).padStart(6, '0')}`,
          order: { connect: { id: order.id } },
          warehouse: { connect: { id: warehouses[i % warehouses.length].id } },
          packedBy: opsUser.email,
          packedAt: order.shippedDate || randomDate(order.orderDate, dateEnd),
        },
      });
      
      // Create pack slip items
      const orderLines = order.orderLines || [];
      for (let j = 0; j < orderLines.length; j++) {
        const orderLine = orderLines[j];
        await prisma.packSlipItem.create({
          data: {
            packSlipId: packSlip.id,
            orderLineId: orderLine.id,
            productId: orderLine.productId,
            quantity: orderLine.quantity,
            packedQty: orderLine.quantity,
            notes: j === 0 && i % 3 === 0 ? `Fragile item - handle with care` : null,
          },
        });
      }
    }
  }
  console.log('✅ Created pack slips');

  // Create scan history
  console.log('📱 Creating scan history...');
  for (let i = 0; i < 60; i++) {
    const product = products[i % products.length];
    const warehouse = warehouses[i % warehouses.length];
    const action = (['LOOKUP', 'INVENTORY_UPDATE', 'TRANSFER', 'RECEIVING', 'SHIPPING'] as any[])[i % 5];
    await prisma.scanHistory.create({
      data: {
        code: product.sku || `CODE-${i + 1}`,
        codeType: (['BARCODE', 'QR', 'RFID'] as any[])[i % 3],
        productId: product.id,
        warehouseId: warehouse.id,
        action,
        quantity: 1 + Math.floor(Math.random() * 10),
        status: 'SUCCESS',
        message: `Successfully scanned ${product.name} for ${action.toLowerCase().replace('_', ' ')}`,
        scannedBy: opsUser.email,
        scannedAt: randomDate(dateStart, dateEnd),
        metadata: {
          scannerId: `SCANNER-${String(i % 5 + 1).padStart(3, '0')}`,
          location: warehouse.location,
          timestamp: randomDate(dateStart, dateEnd).toISOString(),
        },
      },
    });
  }
  console.log('✅ Created scan history');

  // Create landed costs
  console.log('💸 Creating landed costs...');
  const usedOrderIds = new Set<number>();
  for (let i = 0; i < 20; i++) {
    let order;
    let attempts = 0;
    // Find an order that hasn't been used yet
    do {
      order = orders[(i * 5 + attempts) % orders.length];
      attempts++;
    } while (usedOrderIds.has(order.id) && attempts < orders.length);
    
    if (usedOrderIds.has(order.id)) continue; // Skip if all orders are used
    
    usedOrderIds.add(order.id);
    const productCost = Number(order.totalAmount) * 0.6;
    const shippingCost = 50 + Math.floor(Math.random() * 200);
    const freightCost = 30 + Math.floor(Math.random() * 150);
    const insuranceCost = 10 + Math.floor(Math.random() * 50);
    const customsDutyRate = 5 + Math.random() * 10; // 5-15%
    const customsDuty = productCost * (customsDutyRate / 100);
    const tariffs = 15 + Math.floor(Math.random() * 50);
    const portFees = 20 + Math.floor(Math.random() * 80);
    const handlingFees = 15 + Math.floor(Math.random() * 60);
    const otherCosts = 5 + Math.floor(Math.random() * 25);
    const subtotal = productCost + shippingCost + freightCost + insuranceCost + customsDuty + tariffs + portFees + handlingFees + otherCosts;
    await prisma.landedCost.upsert({
      where: { orderId: order.id },
      update: {
        productCost,
        shippingCost,
        freightCost,
        insuranceCost,
        customsDuty,
        customsDutyRate,
        tariffs,
        portFees,
        handlingFees,
        otherCosts,
        otherCostsDescription: otherCosts > 20 ? 'Documentation and administrative fees' : null,
        subtotal,
        totalLandedCost: subtotal,
        calculatedDate: randomDate(order.orderDate, dateEnd),
        notes: i % 3 === 0 ? `Landed cost calculated for international shipment` : null,
        updatedAt: randomDate(order.orderDate, dateEnd),
      },
      create: {
        orderId: order.id,
        productCost,
        shippingCost,
        freightCost,
        insuranceCost,
        customsDuty,
        customsDutyRate,
        tariffs,
        portFees,
        handlingFees,
        otherCosts,
        otherCostsDescription: otherCosts > 20 ? 'Documentation and administrative fees' : null,
        subtotal,
        totalLandedCost: subtotal,
        currency: 'USD',
        calculatedDate: randomDate(order.orderDate, dateEnd),
        notes: i % 3 === 0 ? `Landed cost calculated for international shipment` : null,
        createdAt: randomDate(order.orderDate, dateEnd),
        updatedAt: randomDate(order.orderDate, dateEnd),
      },
    });
  }
  console.log('✅ Created landed costs');

  // Create purchase order WIP tracking
  console.log('🏭 Creating purchase order WIP tracking...');
  for (let i = 0; i < 25; i++) {
    const purchaseOrder = purchaseOrders[i];
    if (purchaseOrder.status === 'ORDERED' || purchaseOrder.status === 'RECEIVED') {
      const stage = ['CUTTING', 'SEWING', 'FINISHING', 'QUALITY_CHECK', 'PACKAGING'][i % 5];
      const quantity = 100 + Math.floor(Math.random() * 200);
      const completedQty = Math.floor(quantity * (0.2 + (i % 5) * 0.2));
      const startDate = randomDate(purchaseOrder.orderDate, dateEnd);
      await prisma.purchaseOrderWIPTracking.create({
        data: {
          purchaseOrderId: purchaseOrder.id,
          stage,
          quantity,
          completedQty,
          status: i % 5 === 4 ? 'COMPLETED' : 'IN_PROGRESS',
          startDate,
          completionDate: i % 5 === 4 ? new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000) : null,
          notes: `WIP tracking for ${purchaseOrder.poNumber} - ${stage} stage. Progress: ${completedQty}/${quantity} units.`,
        },
      });
    }
  }
  console.log('✅ Created purchase order WIP tracking');

  // Create purchase order batches
  console.log('📦 Creating purchase order batches...');
  for (let i = 0; i < 20; i++) {
    const purchaseOrder = purchaseOrders[i * 2];
      const productionDate = i < 5 ? randomDate(purchaseOrder.orderDate, dateEnd) : null;
      await prisma.purchaseOrderBatch.create({
        data: {
          purchaseOrderId: purchaseOrder.id,
          batchNumber: `BATCH-${String(i + 1).padStart(4, '0')}`,
          lotNumber: `LOT-${String(i + 1).padStart(6, '0')}`,
          quantity: 50 + Math.floor(Math.random() * 200),
          status: i < 5 ? 'COMPLETED' : 'IN_PRODUCTION',
          productionDate,
          expiryDate: productionDate ? new Date(productionDate.getTime() + 365 * 24 * 60 * 60 * 1000) : null, // 1 year from production
          location: `WH-${String((i % 4) + 1).padStart(2, '0')}-AISLE-${String((i % 10) + 1).padStart(2, '0')}`,
          notes: i % 3 === 0 ? `Batch quality checked and approved` : null,
        },
      });
  }
  console.log('✅ Created purchase order batches');

  // Create sales rep territories
  console.log('🗺️ Creating sales rep territories...');
  for (let i = 0; i < salesUsers.length; i++) {
    const market = markets[i];
    const salesRep = salesUsers[i % salesUsers.length];
    await prisma.salesRepTerritory.create({
      data: {
        userId: salesRep.id,
        name: `${market.name} Territory`,
        region: market.region || market.name,
        countries: [market.country],
        isActive: true,
      },
    });
  }
  console.log('✅ Created sales rep territories');

  // Create sales rep commissions
  console.log('💵 Creating sales rep commissions...');
  // Track commissions by user/period/type to aggregate amounts
  const commissionMap = new Map<string, { salesAmount: number; commissionAmount: number; hasDelivered: boolean; deliveredDate: Date | null }>();
  
  for (let i = 0; i < 20; i++) {
    const order = orders[(i * 2) % orders.length];
    if (order && order.status !== 'DRAFT' && order.status !== 'CANCELLED') {
      const period = `${order.orderDate.getFullYear()}-${String(order.orderDate.getMonth() + 1).padStart(2, '0')}`;
      const key = `${salesUser.id}-${period}-${CommissionType.SALES_VOLUME}`;
      const commissionRate = 5 + Math.random() * 5; // 5-10%
      const orderCommissionAmount = Number(order.totalAmount) * (0.05 + Math.random() * 0.05);
      const isDelivered = order.status === 'DELIVERED';
      
      if (commissionMap.has(key)) {
        const existing = commissionMap.get(key)!;
        existing.salesAmount += Number(order.totalAmount);
        existing.commissionAmount += orderCommissionAmount;
        if (isDelivered) {
          existing.hasDelivered = true;
          existing.deliveredDate = order.deliveredDate;
        }
      } else {
        commissionMap.set(key, {
          salesAmount: Number(order.totalAmount),
          commissionAmount: orderCommissionAmount,
          hasDelivered: isDelivered,
          deliveredDate: isDelivered ? order.deliveredDate : null,
        });
      }
    }
  }
  
  // Create or update commissions using upsert
  for (const [key, data] of commissionMap.entries()) {
    const [userId, period, typeStr] = key.split('-');
    await prisma.salesRepCommission.upsert({
      where: {
        userId_period_type: {
          userId: parseInt(userId),
          period,
          type: CommissionType.SALES_VOLUME,
        },
      },
      create: {
        userId: parseInt(userId),
        period,
        type: CommissionType.SALES_VOLUME,
        salesAmount: data.salesAmount,
        commissionRate: 7.5, // Average rate
        commissionAmount: data.commissionAmount,
        status: data.hasDelivered ? CommissionStatus.PAID : CommissionStatus.PENDING,
        paidAt: data.deliveredDate,
      },
      update: {
        salesAmount: data.salesAmount,
        commissionAmount: data.commissionAmount,
        status: data.hasDelivered ? CommissionStatus.PAID : CommissionStatus.PENDING,
        paidAt: data.deliveredDate,
      },
    });
  }
  console.log('✅ Created sales rep commissions');

  // ============================================
  // CHUNK 8: DAM Assets, Digital Product Passports, Compliance, Audit Logs, More
  // ============================================
  console.log('🖼️ Creating DAM assets...');
  const assetDescriptions = [
    'Product image showcasing the item from front view',
    'Marketing video highlighting product features',
    'Product documentation and specifications',
    'Additional product asset for catalog display',
    'High-resolution product photography',
    'Product demonstration video',
    'Technical documentation and user guide',
    'Marketing material for promotional campaigns',
    'Product lifestyle image',
    'Product detail shot showing craftsmanship',
    '360-degree product view',
    'Product packaging and presentation',
    'Product comparison chart',
    'Size and fit guide',
    'Care instructions document',
  ];
  for (let i = 0; i < 50; i++) {
    const product = products[i % products.length];
    const assetType = (['IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER'] as any[])[i % 4];
    const baseUrl = `https://assets.example.com/${product.sku}/asset_${i + 1}`;
    await prisma.dAMAsset.create({
      data: {
        productId: product.id,
        name: `Asset ${i + 1}`,
        type: assetType,
        url: baseUrl,
        thumbnailUrl: assetType === 'IMAGE' ? `${baseUrl}_thumb` : assetType === 'VIDEO' ? `${baseUrl}_thumbnail.jpg` : null,
        description: assetDescriptions[i % assetDescriptions.length],
        fileSize: 1000000 + Math.floor(Math.random() * 9000000),
        mimeType: i % 4 === 0 ? 'image/jpeg' : i % 4 === 1 ? 'video/mp4' : i % 4 === 2 ? 'application/pdf' : 'model/obj',
        tags: [['product'], ['marketing'], ['catalog']][i % 3],
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created DAM assets');

  // Create digital product passports
  console.log('📱 Creating digital product passports...');
  for (let i = 0; i < 30; i++) {
    const product = products[(i * 2) % products.length];
    await prisma.digitalProductPassport.create({
      data: {
        productId: product.id,
        passportId: `DPP-${product.sku}`,
        countryOfOrigin: ['China', 'Bangladesh', 'Vietnam', 'India'][i % 4],
        productionDate: randomDate(dateStart, dateEnd),
        carbonFootprint: 10 + Math.random() * 20,
        waterFootprint: 50 + Math.random() * 100,
        traceabilityData: {
          origin: ['China', 'Bangladesh', 'Vietnam', 'India'][i % 4],
          manufacturingDate: randomDate(dateStart, dateEnd).toISOString(),
        },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created digital product passports');

  // Create compliance evidence
  console.log('✅ Creating compliance evidence...');
  for (let i = 0; i < 35; i++) {
    const product = products[i];
    await prisma.complianceEvidence.create({
      data: {
        productId: product.id,
        name: `Compliance Evidence ${i + 1}`,
        type: (['CERTIFICATION', 'TEST_REPORT', 'MATERIAL_SAFETY', 'ENVIRONMENTAL_IMPACT'] as any[])[i % 4],
        certificateNumber: `CERT-${String(i + 1).padStart(6, '0')}`,
        issuer: ['ISO', 'CE', 'FCC', 'FDA'][i % 4],
        standards: i % 3 === 0 ? ['REACH'] : i % 3 === 1 ? ['RoHS'] : ['CE'],
        issueDate: randomDate(dateStart, dateEnd),
        expiryDate: new Date(randomDate(dateStart, dateEnd).getTime() + 365 * 24 * 60 * 60 * 1000),
        documentUrl: `https://docs.example.com/compliance/${product.sku}`,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created compliance evidence');

  // Create size charts
  console.log('📏 Creating size charts...');
  for (let i = 0; i < 20; i++) {
    await prisma.sizeChart.create({
      data: {
        name: `Size Chart ${i + 1}`,
        category: ['Men', 'Women', 'Kids', 'Unisex'][i % 4],
        measurements: {
          S: { chest: 36, waist: 30, length: 28 },
          M: { chest: 40, waist: 34, length: 29 },
          L: { chest: 44, waist: 38, length: 30 },
          XL: { chest: 48, waist: 42, length: 31 },
        },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created size charts');

  // Create audit logs
  console.log('📝 Creating audit logs...');
  for (let i = 0; i < 60; i++) {
    const user = [admin, salesUser, opsUser][i % 3];
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: (['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT'] as AuditAction[])[i % 5],
        entityType: ['PRODUCT', 'ORDER', 'CUSTOMER', 'INVENTORY'][i % 4],
        entityId: i,
        ipAddress: `192.168.1.${100 + (i % 155)}`,
        userAgent: 'Mozilla/5.0',
        createdAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created audit logs');

  // Create data imports
  console.log('📥 Creating data imports...');
  for (let i = 0; i < 20; i++) {
    await prisma.dataImport.create({
      data: {
        fileName: `import_${i + 1}.csv`,
        type: (['PRODUCTS', 'ORDERS', 'CUSTOMERS', 'INVENTORY'] as any[])[i % 4],
        status: i < 7 ? 'COMPLETED' : i < 9 ? 'PROCESSING' : 'FAILED',
        recordsTotal: i < 7 ? 100 + Math.floor(Math.random() * 900) : 0,
        recordsProcessed: i < 7 ? 100 + Math.floor(Math.random() * 900) : 0,
        recordsFailed: i === 9 ? 5 + Math.floor(Math.random() * 10) : 0,
        uploadedBy: admin.email,
        uploadedAt: randomDate(dateStart, dateEnd),
        completedAt: i < 7 ? randomDate(dateStart, dateEnd) : null,
        errorMessage: i === 9 ? 'Import failed due to validation errors' : null,
      },
    });
  }
  console.log('✅ Created data imports');

  // Create data exports
  console.log('📤 Creating data exports...');
  for (let i = 0; i < 20; i++) {
    await prisma.dataExport.create({
      data: {
        name: `Export ${i + 1}`,
        format: 'CSV',
        type: (['PRODUCTS', 'ORDERS', 'CUSTOMERS', 'INVENTORY'] as any[])[i % 4],
        status: i < 6 ? 'COMPLETED' : 'PROCESSING',
        recordsCount: i < 6 ? 500 + Math.floor(Math.random() * 1500) : 0,
        createdBy: admin.email,
        createdAt: randomDate(dateStart, dateEnd),
        completedAt: i < 6 ? randomDate(dateStart, dateEnd) : null,
        fileUrl: i < 6 ? `https://exports.example.com/export_${i + 1}.csv` : null,
      },
    });
  }
  console.log('✅ Created data exports');

  // Create API keys
  console.log('🔑 Creating API keys...');
  for (let i = 0; i < 20; i++) {
    await prisma.apiKey.create({
      data: {
        name: `API Key ${i + 1}`,
        key: `api_key_${i + 1}_${Math.random().toString(36).substring(7)}`,
        type: (['API_KEY', 'WEBHOOK'] as ApiKeyType[])[i % 2],
        isActive: i < 4,
        lastUsed: i < 3 ? randomDate(dateStart, dateEnd) : null,
        expiresAt: i < 4 ? new Date(dateEnd.getTime() + 365 * 24 * 60 * 60 * 1000) : null,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created API keys');

  // Create sync health
  console.log('💚 Creating sync health records...');
  const channelNames = ['ERP', 'E_COMMERCE', 'ACCOUNTING', 'SHIPPING', 'ANALYTICS', 'MARKETING', 'WAREHOUSE', 'PAYMENT', 'INVENTORY', 'ORDERS', 'CUSTOMERS', 'PRODUCTS', 'SUPPLIERS', 'WAREHOUSES', 'SHIPMENTS', 'RETURNS', 'QUOTES', 'INVOICES', 'REPORTS', 'NOTIFICATIONS'];
  for (let i = 0; i < 20; i++) {
    await prisma.syncHealth.create({
      data: {
        channelId: i + 1,
        channelName: channelNames[i],
        status: i < 6 ? 'HEALTHY' : 'WARNING',
        lastSync: randomDate(dateStart, dateEnd),
        nextSync: new Date(randomDate(dateStart, dateEnd).getTime() + 24 * 60 * 60 * 1000),
        recordsFailed: i >= 6 ? 1 + Math.floor(Math.random() * 5) : 0,
        errorMessage: i >= 6 ? 'Sync timeout error' : null,
      },
    });
  }
  console.log('✅ Created sync health records');

  // Create numbering rules
  console.log('🔢 Creating numbering rules...');
  const numberingTypes: NumberingRuleType[] = ['SKU', 'EAN', 'BARCODE', 'SKU', 'EAN', 'BARCODE', 'SKU', 'EAN', 'BARCODE', 'SKU', 'EAN', 'BARCODE', 'SKU', 'EAN', 'BARCODE'];
  for (let i = 0; i < 15; i++) {
    await prisma.numberingRule.create({
      data: {
        name: `Numbering Rule ${i + 1}`,
        type: numberingTypes[i],
        prefix: ['SKU', 'EAN', 'BC', 'SKU'][i],
        sequenceStart: 1000 + i * 100,
        currentSequence: 1000 + i * 100,
        format: `${['SKU', 'EAN', 'BC', 'SKU'][i]}-{SEQUENCE}`,
        status: 'ACTIVE',
      },
    });
  }
  console.log('✅ Created numbering rules');

  // Create localizations
  console.log('🌐 Creating localizations...');
  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    await prisma.localization.create({
      data: {
        marketId: market.id,
        language: market.language,
        currency: market.currency,
      },
    });
  }
  console.log('✅ Created localizations');

  // ============================================
  // CHUNK 9: Pre Orders, Backorders, Partial Shipments, Cycle Counts, Physical Inventory, Allocation Rules, Credit Notes
  // ============================================
  console.log('📋 Creating pre orders...');
  for (let i = 0; i < 25; i++) {
    const product = products[(i * 3) % products.length];
    const order = orders[(60 + i) % orders.length];
    await prisma.preOrder.create({
      data: {
        orderId: order.id,
        productId: product.id,
        quantity: 10 + Math.floor(Math.random() * 40),
        expectedDate: new Date(dateEnd.getTime() + (30 + Math.floor(Math.random() * 60)) * 24 * 60 * 60 * 1000),
        status: i < 8 ? 'PENDING' : 'FULFILLED',
      },
    });
  }
  console.log('✅ Created pre orders');

  // Create backorders
  console.log('⏳ Creating backorders...');
  for (let i = 0; i < 25; i++) {
    const order = orders[20 + i];
    const orderLine = order.orderLines?.[0];
    if (orderLine) {
      await prisma.backorder.create({
        data: {
          orderId: order.id,
          orderLineId: orderLine.id,
          productId: orderLine.productId,
          quantity: orderLine.quantity,
          status: i < 10 ? 'PENDING' : 'FULFILLED',
          allocatedQty: i >= 10 ? orderLine.quantity : 0,
        },
      });
    }
  }
  console.log('✅ Created backorders');

  // Create partial shipments
  console.log('📦 Creating partial shipments...');
  for (let i = 0; i < 20; i++) {
    const order = orders[30 + i];
    if (order.status === 'SHIPPED' || order.status === 'DELIVERED') {
      const partialShipment = await prisma.partialShipment.create({
        data: {
          orderId: order.id,
          shipmentNumber: `PS-${String(i + 1).padStart(6, '0')}`,
          status: order.status === 'DELIVERED' ? 'DELIVERED' : 'SHIPPED',
          shippedDate: order.shippedDate || randomDate(order.orderDate, dateEnd),
          deliveredDate: order.status === 'DELIVERED' ? order.deliveredDate : null,
        },
      });
      
      // Create partial shipment items
      const orderLine = order.orderLines?.[0];
      if (orderLine) {
        await prisma.partialShipmentItem.create({
          data: {
            partialShipmentId: partialShipment.id,
            orderLineId: orderLine.id,
            productId: orderLine.productId,
            quantity: Math.floor(orderLine.quantity * 0.7), // 70% of order quantity
          },
        });
      }
    }
  }
  console.log('✅ Created partial shipments');

  // Create cycle counts
  console.log('🔢 Creating cycle counts...');
  const cycleCounts: any[] = [];
  for (let i = 0; i < 20; i++) {
    const warehouse = warehouses[i % warehouses.length];
    const scheduledDate = randomDate(dateStart, dateEnd);
    const cycleCount = await prisma.cycleCount.create({
      data: {
        countNumber: `CC-${String(i + 1).padStart(6, '0')}`,
        warehouseId: warehouse.id,
        countType: (['ABC', 'FULL', 'RANDOM', 'LOCATION_BASED'] as any[])[i % 4],
        status: i < 8 ? 'COMPLETED' : 'IN_PROGRESS',
        scheduledDate,
        startDate: i < 8 ? scheduledDate : null,
        completedDate: i < 8 ? new Date(scheduledDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null,
        assignedTo: opsUser.email,
      },
    });
    cycleCounts.push(cycleCount);
    
    // Create cycle count items
    for (let j = 0; j < 10; j++) {
      const product = products[(i * 5 + j) % products.length];
      const inventory = await prisma.inventory.findFirst({
        where: { productId: product.id, warehouseId: warehouse.id },
      });
      if (inventory) {
        const countedQty = inventory.quantity + (Math.random() > 0.7 ? Math.floor(Math.random() * 5) - 2 : 0);
        const variance = countedQty - inventory.quantity;
        const variancePercent = inventory.quantity > 0 ? (variance / inventory.quantity) * 100 : 0;
        await prisma.cycleCountItem.create({
          data: {
            cycleCountId: cycleCount.id,
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            binLocation: `A-${String(i + 1).padStart(2, '0')}-${String(j + 1).padStart(2, '0')}`,
            systemQuantity: inventory.quantity,
            countedQuantity: countedQty,
            variance,
            variancePercent,
            status: i < 8 ? 'COUNTED' : 'PENDING',
            countedBy: opsUser.email,
            countedAt: i < 8 ? randomDate(dateStart, dateEnd) : null,
            notes: variance !== 0 ? `Variance detected: ${variance > 0 ? '+' : ''}${variance} units` : null,
          },
        });
      }
    }
  }
  console.log('✅ Created cycle counts');

  // Create physical inventory
  console.log('📊 Creating physical inventory records...');
  const physicalInventories: any[] = [];
  for (let i = 0; i < 20; i++) {
    const warehouse = warehouses[i % warehouses.length];
    const physicalInventory = await prisma.physicalInventory.create({
      data: {
        inventoryNumber: `PI-${String(i + 1).padStart(6, '0')}`,
        warehouseId: warehouse.id,
        status: i < 6 ? 'COMPLETED' : 'IN_PROGRESS',
        assignedTo: opsUser.email,
        scheduledDate: randomDate(dateStart, dateEnd),
        startDate: i < 6 ? randomDate(dateStart, dateEnd) : null,
        completedDate: i < 6 ? randomDate(dateStart, dateEnd) : null,
      },
    });
    physicalInventories.push(physicalInventory);
    
    // Create physical inventory items
    for (let j = 0; j < 15; j++) {
      const product = products[(i * 10 + j) % products.length];
      const inventory = await prisma.inventory.findFirst({
        where: { productId: product.id, warehouseId: warehouse.id },
      });
      if (inventory) {
        const countedQty = inventory.quantity + (Math.random() > 0.8 ? Math.floor(Math.random() * 3) - 1 : 0);
        const variance = countedQty - inventory.quantity;
        const variancePercent = inventory.quantity > 0 ? (variance / inventory.quantity) * 100 : 0;
        await prisma.physicalInventoryItem.create({
          data: {
            physicalInventoryId: physicalInventory.id,
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            binLocation: `B-${String(i + 1).padStart(2, '0')}-${String(j + 1).padStart(2, '0')}`,
            systemQuantity: inventory.quantity,
            countedQuantity: countedQty,
            variance,
            variancePercent,
            status: i < 6 ? 'COUNTED' : 'PENDING',
            countedBy: opsUser.email,
            countedAt: i < 6 ? randomDate(dateStart, dateEnd) : null,
            notes: variance !== 0 ? `Variance detected: ${variance > 0 ? '+' : ''}${variance} units` : Math.random() > 0.9 ? 'Minor discrepancy noted' : null,
          },
        });
      }
    }
  }
  console.log('✅ Created physical inventory records');

  // Create allocation rules
  console.log('📐 Creating allocation rules...');
  for (let i = 0; i < 20; i++) {
    const warehouse = warehouses[i % warehouses.length];
    const market = markets[i % markets.length];
    await prisma.allocationRule.create({
      data: {
        name: `Allocation Rule ${i + 1}`,
        warehouseId: warehouse.id,
        customerId: i < 5 ? customers[i].id : null,
        customerType: i < 5 ? 'B2B' : null,
        channel: 'ALL',
        allocationMethod: 'FIFO',
        priority: i,
        isActive: i < 8,
        conditions: { minOrderValue: 100, maxOrderValue: 10000 },
      },
    });
  }
  console.log('✅ Created allocation rules');

  // Create credit notes
  console.log('💳 Creating credit notes...');
  for (let i = 0; i < 20; i++) {
    const order = orders[40 + i];
    const returnRecord = returns[i % returns.length];
    await prisma.creditNote.create({
      data: {
        creditNoteNumber: `CN-${String(i + 1).padStart(6, '0')}`,
        returnId: returnRecord?.id,
        customerId: order.customerId,
        amount: Number(order.totalAmount) * (0.1 + Math.random() * 0.3),
        currency: 'USD',
        reason: ['Return', 'Discount', 'Adjustment', 'Refund'][i % 4],
        status: i < 7 ? 'ISSUED' : 'APPLIED',
        issuedDate: randomDate(order.orderDate, dateEnd),
        appliedDate: i >= 7 ? randomDate(order.orderDate, dateEnd) : null,
      },
    });
  }
  console.log('✅ Created credit notes');

  // Create supplier negotiation notes
  console.log('💬 Creating supplier negotiation notes...');
  for (let i = 0; i < 30; i++) {
    const supplier = suppliers[i % suppliers.length];
    await prisma.supplierNegotiationNote.create({
      data: {
        supplierId: supplier.id,
        title: `Negotiation ${i + 1}`,
        content: `Negotiation note ${i + 1} for supplier ${i + 1}. Discussed pricing, quality standards, and delivery terms.`,
        date: randomDate(dateStart, dateEnd),
        createdBy: admin.email,
        tags: [['pricing', 'quality'], ['delivery', 'terms'], ['contract', 'agreement'], ['follow-up'], ['urgent']][i % 5],
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created supplier negotiation notes');

  // ============================================
  // CHUNK 10: Service Cases, Task Categories, User Preferences, Configurations
  // ============================================
  // Create service cases
  console.log('📞 Creating service cases...');
  for (let i = 0; i < 30; i++) {
    const customer = customers[i % customers.length];
    const priorities: ServiceCasePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const statuses: ServiceCaseStatus[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    await prisma.serviceCase.create({
      data: {
        caseNumber: `CASE-${String(i + 1).padStart(6, '0')}`,
        customerId: customer.id,
        title: `Service Case ${i + 1}`,
        description: `Service case description ${i + 1} - customer inquiry or issue`,
        category: ['Product Issue', 'Order Problem', 'Billing Question', 'Technical Support'][i % 4],
        status: statuses[Math.min(Math.floor(i / 5), statuses.length - 1)],
        priority: priorities[i % priorities.length],
        assignedTo: i % 2 === 0 ? admin.email : salesUser.email,
        resolution: i >= 15 ? `Case resolved on ${randomDate(dateStart, dateEnd).toISOString()}` : null,
        resolvedAt: i >= 15 ? randomDate(dateStart, dateEnd) : null,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created service cases');

  // Create task categories
  console.log('📋 Creating task categories...');
  const taskCategoryNames = ['Inventory', 'Orders', 'Customer Service', 'Marketing', 'Operations', 'Sales', 'Warehouse', 'Quality Control', 'Shipping', 'Returns', 'Procurement', 'Finance', 'HR', 'IT', 'Legal', 'Compliance', 'Product Development', 'Supply Chain', 'Logistics', 'Customer Support'];
  for (let i = 0; i < 20; i++) {
    await prisma.taskCategory.create({
      data: {
        name: taskCategoryNames[i],
        isDefault: i < 3,
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created task categories');

  // Create user preferences
  console.log('⚙️ Creating user preferences...');
  const users = [admin, salesUser, opsUser, b2bUser];
  const preferenceKeys = ['sizeChartLanguage', 'sizeChartUnitSystem', 'sizeChartRegionalSystem', 'theme', 'language', 'timezone'];
  const preferenceValues = ['en', 'metric', 'US', 'light', 'en-US', 'America/New_York'];
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    for (let j = 0; j < preferenceKeys.length; j++) {
      await prisma.userPreference.create({
        data: {
          userId: user.id,
          key: preferenceKeys[j],
          value: preferenceValues[j],
          createdAt: randomDate(dateStart, dateEnd),
          updatedAt: randomDate(dateStart, dateEnd),
        },
      });
    }
  }
  console.log('✅ Created user preferences');

  // Create product configurations
  console.log('🔧 Creating product configurations...');
  const productConfigTypes: ProductConfigurationType[] = ['ATTRIBUTES', 'TAXONOMY', 'BUNDLES'];
  // Note: Only 3 types exist, but we'll create multiple instances
  for (let i = 0; i < 3; i++) {
    await prisma.productConfiguration.create({
      data: {
        type: productConfigTypes[i],
        data: {
          attributes: i === 0 ? { color: ['Black', 'White', 'Blue'], size: ['S', 'M', 'L', 'XL'] } : {},
          taxonomy: i === 1 ? { category: 'Apparel', subcategory: 'Tops', brand: 'Premium' } : {},
          bundles: i === 2 ? { bundleId: 'BUNDLE-001', products: [1, 2, 3], discount: 10 } : {},
        },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created product configurations');

  // Create security configurations
  console.log('🔐 Creating security configurations...');
  const securityConfigTypes: SecurityConfigurationType[] = ['TWO_FACTOR', 'SSO'];
  for (let i = 0; i < 2; i++) {
    await prisma.securityConfiguration.create({
      data: {
        type: securityConfigTypes[i],
        data: {
          enabled: i === 0,
          provider: i === 1 ? 'Google' : null,
          settings: i === 0 ? { requireAuth: true, timeout: 30 } : { ssoUrl: 'https://sso.example.com' },
        },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created security configurations');

  // Create stock control configurations
  console.log('📦 Creating stock control configurations...');
  const stockControlTypes: StockControlConfigurationType[] = ['TRANSFERS', 'APPROVALS', 'CROSS_DOCK'];
  for (let i = 0; i < 3; i++) {
    await prisma.stockControlConfiguration.create({
      data: {
        type: stockControlTypes[i],
        data: {
          enabled: true,
          requireApproval: i === 1,
          autoTransfer: i === 0,
          crossDockEnabled: i === 2,
          settings: { minQuantity: 10, maxQuantity: 1000 },
        },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created stock control configurations');

  // Create system logs configuration
  console.log('📝 Creating system logs configuration...');
  const systemLogs = [];
  for (let i = 0; i < 30; i++) {
    systemLogs.push({
      id: i + 1,
      level: ['INFO', 'WARNING', 'ERROR', 'DEBUG'][i % 4],
      message: `System log entry ${i + 1}`,
      timestamp: randomDate(dateStart, dateEnd).toISOString(),
      source: ['API', 'Database', 'Worker', 'Scheduler'][i % 4],
    });
  }
  await prisma.systemLogsConfiguration.create({
    data: {
      data: systemLogs,
      createdAt: randomDate(dateStart, dateEnd),
      updatedAt: randomDate(dateStart, dateEnd),
    },
  });
  console.log('✅ Created system logs configuration');

  // Create warehouse configurations
  console.log('🏭 Creating warehouse configurations...');
  const warehouseConfigTypes: WarehouseConfigurationType[] = ['BINS', 'PUT_AWAY_RULES'];
  for (let i = 0; i < 2; i++) {
    await prisma.warehouseConfiguration.create({
      data: {
        type: warehouseConfigTypes[i],
        data: {
          bins: i === 0 ? [
            { id: 'A-01-01', zone: 'A', aisle: '01', shelf: '01', capacity: 100 },
            { id: 'A-01-02', zone: 'A', aisle: '01', shelf: '02', capacity: 100 },
            { id: 'B-02-01', zone: 'B', aisle: '02', shelf: '01', capacity: 150 },
          ] : [],
          putAwayRules: i === 1 ? [
            { ruleId: 'RULE-001', priority: 1, conditions: { productType: 'Fragile' }, action: { zone: 'A', aisle: '01' } },
            { ruleId: 'RULE-002', priority: 2, conditions: { productType: 'Heavy' }, action: { zone: 'B', aisle: '02' } },
          ] : [],
        },
        createdAt: randomDate(dateStart, dateEnd),
        updatedAt: randomDate(dateStart, dateEnd),
      },
    });
  }
  console.log('✅ Created warehouse configurations');

  // Create B2B terms configuration
  console.log('📄 Creating B2B terms configuration...');
  const b2bTerms = [];
  for (let i = 0; i < 10; i++) {
    b2bTerms.push({
      id: i + 1,
      term: `B2B Term ${i + 1}`,
      description: `Description for B2B term ${i + 1}`,
      category: ['Payment', 'Shipping', 'Returns', 'Discounts'][i % 4],
      isActive: i < 8,
      createdAt: randomDate(dateStart, dateEnd).toISOString(),
    });
  }
  await prisma.b2BTermsConfiguration.create({
    data: {
      data: b2bTerms,
      createdAt: randomDate(dateStart, dateEnd),
      updatedAt: randomDate(dateStart, dateEnd),
    },
  });
  console.log('✅ Created B2B terms configuration');

  // ============================================
  // FINAL VERIFICATION: Count all seeded records
  // ============================================
  console.log('🔍 Counting seeded records...');
  const counts = {
    users: await prisma.user.count(),
    roles: await prisma.role.count(),
    warehouses: await prisma.warehouse.count(),
    warehouseDefaults: await prisma.warehouseDefault.count(),
    brands: await prisma.brand.count(),
    markets: await prisma.market.count(),
    brandMarkets: await prisma.brandMarket.count(),
    taxDefaults: await prisma.taxDefault.count(),
    fxRates: await prisma.fxRate.count(),
    marketCurrencySettings: await prisma.marketCurrencySetting.count(),
    customers: await prisma.customer.count(),
    stores: await prisma.store.count(),
    collections: await prisma.collection.count(),
    products: await prisma.product.count(),
    inventory: await prisma.inventory.count(),
    productPricing: await prisma.productPricing.count(),
    suppliers: await prisma.supplier.count(),
    supplierPriceHistory: await prisma.supplierPriceHistory.count(),
    supplierNegotiationNotes: await prisma.supplierNegotiationNote.count(),
    purchaseOrders: await prisma.purchaseOrder.count(),
    purchaseOrderLines: await prisma.purchaseOrderLine.count(),
    purchaseOrderApprovals: await prisma.purchaseOrderApproval.count(),
    purchaseOrderWIPTracking: await prisma.purchaseOrderWIPTracking.count(),
    purchaseOrderBatches: await prisma.purchaseOrderBatch.count(),
    orders: await prisma.order.count(),
    orderLines: await prisma.orderLine.count(),
    quotes: await prisma.quote.count(),
    quoteLines: await prisma.quoteLine.count(),
    proformaInvoices: await prisma.proformaInvoice.count(),
    proformaInvoiceLines: await prisma.proformaInvoiceLine.count(),
    shipments: await prisma.shipment.count(),
    shippingLabels: await prisma.shippingLabel.count(),
    returns: await prisma.return.count(),
    reverseLogistics: await prisma.reverseLogistics.count(),
    bopisOrders: await prisma.bOPISOrder.count(),
    bopisOrderItems: await prisma.bOPISOrderItem.count(),
    borisReturns: await prisma.bORISReturn.count(),
    borisReturnItems: await prisma.bORISReturnItem.count(),
    endlessAisleProducts: await prisma.endlessAisleProduct.count(),
    endlessAisleWarehouses: await prisma.endlessAisleWarehouse.count(),
    campaignEvents: await prisma.campaignEvent.count(),
    featuredCollections: await prisma.featuredCollection.count(),
    markdownPlans: await prisma.markdownPlan.count(),
    integrations: await prisma.integration.count(),
    rules: await prisma.rule.count(),
    alerts: await prisma.alert.count(),
    exceptions: await prisma.exception.count(),
    tasks: await prisma.task.count(),
    reviews: await prisma.review.count(),
    forecasts: await prisma.forecast.count(),
    boms: await prisma.bOM.count(),
    bomComponents: await prisma.bOMComponent.count(),
    costSheets: await prisma.costSheet.count(),
    replenishments: await prisma.replenishment.count(),
    pickLists: await prisma.pickList.count(),
    pickListItems: await prisma.pickListItem.count(),
    packSlips: await prisma.packSlip.count(),
    packSlipItems: await prisma.packSlipItem.count(),
    scanHistory: await prisma.scanHistory.count(),
    landedCosts: await prisma.landedCost.count(),
    damAssets: await prisma.dAMAsset.count(),
    digitalProductPassports: await prisma.digitalProductPassport.count(),
    complianceEvidences: await prisma.complianceEvidence.count(),
    sizeCharts: await prisma.sizeChart.count(),
    auditLogs: await prisma.auditLog.count(),
    dataImports: await prisma.dataImport.count(),
    dataExports: await prisma.dataExport.count(),
    apiKeys: await prisma.apiKey.count(),
    syncHealth: await prisma.syncHealth.count(),
    numberingRules: await prisma.numberingRule.count(),
    localizations: await prisma.localization.count(),
    preOrders: await prisma.preOrder.count(),
    backorders: await prisma.backorder.count(),
    partialShipments: await prisma.partialShipment.count(),
    partialShipmentItems: await prisma.partialShipmentItem.count(),
    cycleCounts: await prisma.cycleCount.count(),
    cycleCountItems: await prisma.cycleCountItem.count(),
    physicalInventories: await prisma.physicalInventory.count(),
    physicalInventoryItems: await prisma.physicalInventoryItem.count(),
    allocationRules: await prisma.allocationRule.count(),
    creditNotes: await prisma.creditNote.count(),
    salesRepTerritories: await prisma.salesRepTerritory.count(),
    salesRepCommissions: await prisma.salesRepCommission.count(),
    serviceCases: await prisma.serviceCase.count(),
    taskCategories: await prisma.taskCategory.count(),
    userPreferences: await prisma.userPreference.count(),
    productConfigurations: await prisma.productConfiguration.count(),
    securityConfigurations: await prisma.securityConfiguration.count(),
    stockControlConfigurations: await prisma.stockControlConfiguration.count(),
    systemLogsConfigurations: await prisma.systemLogsConfiguration.count(),
    warehouseConfigurations: await prisma.warehouseConfiguration.count(),
    b2bTermsConfigurations: await prisma.b2BTermsConfiguration.count(),
  };
  console.log('✅ Record counting complete');

  console.log('✨ Seed1 completed successfully!');
  console.log(`📊 Complete Summary - All Tables Seeded:`);
  console.log(`\n👥 Users & Access:`);
  console.log(`   - Users: ${counts.users}`);
  console.log(`   - Roles: ${counts.roles}`);
  console.log(`   - Sales Rep Territories: ${counts.salesRepTerritories}`);
  console.log(`   - Sales Rep Commissions: ${counts.salesRepCommissions}`);
  console.log(`   - Audit Logs: ${counts.auditLogs}`);
  console.log(`\n🏭 Warehouses & Inventory:`);
  console.log(`   - Warehouses: ${counts.warehouses}`);
  console.log(`   - Warehouse Defaults: ${counts.warehouseDefaults}`);
  console.log(`   - Inventory: ${counts.inventory}`);
  console.log(`   - Replenishments: ${counts.replenishments}`);
  console.log(`   - Cycle Counts: ${counts.cycleCounts}`);
  console.log(`   - Cycle Count Items: ${counts.cycleCountItems}`);
  console.log(`   - Physical Inventories: ${counts.physicalInventories}`);
  console.log(`   - Physical Inventory Items: ${counts.physicalInventoryItems}`);
  console.log(`   - Scan History: ${counts.scanHistory}`);
  console.log(`\n🛍️ Products & Collections:`);
  console.log(`   - Collections: ${counts.collections}`);
  console.log(`   - Products: ${counts.products}`);
  console.log(`   - Product Pricing: ${counts.productPricing}`);
  console.log(`   - BOMs: ${counts.boms}`);
  console.log(`   - BOM Components: ${counts.bomComponents}`);
  console.log(`   - Cost Sheets: ${counts.costSheets}`);
  console.log(`   - Forecasts: ${counts.forecasts}`);
  console.log(`   - Reviews: ${counts.reviews}`);
  console.log(`   - Markdown Plans: ${counts.markdownPlans}`);
  console.log(`   - DAM Assets: ${counts.damAssets}`);
  console.log(`   - Digital Product Passports: ${counts.digitalProductPassports}`);
  console.log(`   - Compliance Evidences: ${counts.complianceEvidences}`);
  console.log(`   - Size Charts: ${counts.sizeCharts}`);
  console.log(`\n🌍 Brands & Markets:`);
  console.log(`   - Brands: ${counts.brands}`);
  console.log(`   - Markets: ${counts.markets}`);
  console.log(`   - Brand Markets: ${counts.brandMarkets}`);
  console.log(`   - Localizations: ${counts.localizations}`);
  console.log(`   - Tax Defaults: ${counts.taxDefaults}`);
  console.log(`   - FX Rates: ${counts.fxRates}`);
  console.log(`   - Market Currency Settings: ${counts.marketCurrencySettings}`);
  console.log(`\n👥 Customers & Orders:`);
  console.log(`   - Customers: ${counts.customers}`);
  console.log(`   - Orders: ${counts.orders}`);
  console.log(`   - Order Lines: ${counts.orderLines}`);
  console.log(`   - Quotes: ${counts.quotes}`);
  console.log(`   - Quote Lines: ${counts.quoteLines}`);
  console.log(`   - Proforma Invoices: ${counts.proformaInvoices}`);
  console.log(`   - Proforma Invoice Lines: ${counts.proformaInvoiceLines}`);
  console.log(`   - Credit Notes: ${counts.creditNotes}`);
  console.log(`   - Pre Orders: ${counts.preOrders}`);
  console.log(`   - Backorders: ${counts.backorders}`);
  console.log(`   - Allocation Rules: ${counts.allocationRules}`);
  console.log(`\n🚚 Shipping & Logistics:`);
  console.log(`   - Shipments: ${counts.shipments}`);
  console.log(`   - Shipping Labels: ${counts.shippingLabels}`);
  console.log(`   - Partial Shipments: ${counts.partialShipments}`);
  console.log(`   - Partial Shipment Items: ${counts.partialShipmentItems}`);
  console.log(`   - Pick Lists: ${counts.pickLists}`);
  console.log(`   - Pick List Items: ${counts.pickListItems}`);
  console.log(`   - Pack Slips: ${counts.packSlips}`);
  console.log(`   - Pack Slip Items: ${counts.packSlipItems}`);
  console.log(`   - Landed Costs: ${counts.landedCosts}`);
  console.log(`\n↩️ Returns:`);
  console.log(`   - Returns: ${counts.returns}`);
  console.log(`   - Reverse Logistics: ${counts.reverseLogistics}`);
  console.log(`\n🏪 Stores & Omnichannel:`);
  console.log(`   - Stores: ${counts.stores}`);
  console.log(`   - BOPIS Orders: ${counts.bopisOrders}`);
  console.log(`   - BOPIS Order Items: ${counts.bopisOrderItems}`);
  console.log(`   - BORIS Returns: ${counts.borisReturns}`);
  console.log(`   - BORIS Return Items: ${counts.borisReturnItems}`);
  console.log(`   - Endless Aisle Products: ${counts.endlessAisleProducts}`);
  console.log(`   - Endless Aisle Warehouses: ${counts.endlessAisleWarehouses}`);
  console.log(`\n🏭 Suppliers & Purchase Orders:`);
  console.log(`   - Suppliers: ${counts.suppliers}`);
  console.log(`   - Supplier Price History: ${counts.supplierPriceHistory}`);
  console.log(`   - Supplier Negotiation Notes: ${counts.supplierNegotiationNotes}`);
  console.log(`   - Purchase Orders: ${counts.purchaseOrders}`);
  console.log(`   - Purchase Order Lines: ${counts.purchaseOrderLines}`);
  console.log(`   - Purchase Order Approvals: ${counts.purchaseOrderApprovals}`);
  console.log(`   - Purchase Order WIP Tracking: ${counts.purchaseOrderWIPTracking}`);
  console.log(`   - Purchase Order Batches: ${counts.purchaseOrderBatches}`);
  console.log(`\n📅 Marketing:`);
  console.log(`   - Campaign Events: ${counts.campaignEvents}`);
  console.log(`   - Featured Collections: ${counts.featuredCollections}`);
  console.log(`\n⚙️ System & Configuration:`);
  console.log(`   - Integrations: ${counts.integrations}`);
  console.log(`   - Rules: ${counts.rules}`);
  console.log(`   - Alerts: ${counts.alerts}`);
  console.log(`   - Exceptions: ${counts.exceptions}`);
  console.log(`   - Tasks: ${counts.tasks}`);
  console.log(`   - Task Categories: ${counts.taskCategories}`);
  console.log(`   - Service Cases: ${counts.serviceCases}`);
  console.log(`   - User Preferences: ${counts.userPreferences}`);
  console.log(`   - Product Configurations: ${counts.productConfigurations}`);
  console.log(`   - Security Configurations: ${counts.securityConfigurations}`);
  console.log(`   - Stock Control Configurations: ${counts.stockControlConfigurations}`);
  console.log(`   - System Logs Configurations: ${counts.systemLogsConfigurations}`);
  console.log(`   - Warehouse Configurations: ${counts.warehouseConfigurations}`);
  console.log(`   - B2B Terms Configurations: ${counts.b2bTermsConfigurations}`);
  console.log(`   - Data Imports: ${counts.dataImports}`);
  console.log(`   - Data Exports: ${counts.dataExports}`);
  console.log(`   - API Keys: ${counts.apiKeys}`);
  console.log(`   - Sync Health: ${counts.syncHealth}`);
  console.log(`   - Numbering Rules: ${counts.numberingRules}`);
  console.log(`\n📅 All data dates range from ${dateStart.toISOString().split('T')[0]} to ${dateEnd.toISOString().split('T')[0]}`);
  console.log(`\n✅ ALL TABLES HAVE BEEN SEEDED WITH DATA!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
