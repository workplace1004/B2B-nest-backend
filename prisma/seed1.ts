import { PrismaClient, UserRole, CollectionLifecycle, CustomerType, OrderStatus, OrderType, PurchaseOrderStatus, ShipmentStatus, ReviewStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Helper function to get random element from array
const randomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random number in range
const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to get random date in range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate SKU
const generateSKU = (index: number): string => {
  const prefix = ['PRD', 'PRO', 'ITM', 'SKU'][index % 4];
  return `${prefix}-${String(index).padStart(6, '0')}`;
};

// Helper function to generate EAN
const generateEAN = (index: number): string => {
  return `1234567890${String(index).padStart(3, '0')}`;
};

// Helper function to generate order number
const generateOrderNumber = (index: number): string => {
  const year = new Date().getFullYear();
  return `ORD-${year}-${String(index).padStart(6, '0')}`;
};

// Helper function to generate PO number
const generatePONumber = (index: number): string => {
  const year = new Date().getFullYear();
  return `PO-${year}-${String(index).padStart(6, '0')}`;
};

// Helper function to generate shipment number
const generateShipmentNumber = (index: number): string => {
  const year = new Date().getFullYear();
  return `SHIP-${year}-${String(index).padStart(6, '0')}`;
};

async function main() {
  console.log('🌱 Starting seed1 with 3000+ records (focusing on last month data)...');

  // Date calculations - all data from one month ago to present
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const startDate = oneMonthAgo; // Start from one month ago
  const endDate = now; // Up to present

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('🗑️  Clearing existing data...');
  await prisma.orderLine.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.purchaseOrderLine.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.forecast.deleteMany();
  await prisma.dAMAsset.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.auditLog.deleteMany();
  // Keep admin user, delete others
  await prisma.user.deleteMany({ where: { email: { not: 'admin@gmail.com' } } });

  console.log('✅ Data cleared');

  // Create admin user if not exists
  const adminEmail = 'admin@gmail.com';
  const adminPassword = '123123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  let admin;
  if (!existingAdmin) {
    admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isActive: true,
      },
    });
    console.log('✅ Created admin user');
  } else {
    admin = existingAdmin;
    console.log('✅ Admin user already exists');
  }

  // Create additional users (sales reps, operations, etc.)
  console.log('👥 Creating users...');
  const userRoles = [UserRole.SALES, UserRole.OPERATIONS, UserRole.B2B];
  const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Tom', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Moore'];

  const users = [admin];
  for (let i = 0; i < 20; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`;
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: randomElement(userRoles),
        isActive: true,
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users`);

  // Create warehouses
  console.log('🏭 Creating warehouses...');
  const warehouseNames = ['Main Warehouse', 'East Coast DC', 'West Coast DC', 'Central Distribution', 'Europe Hub', 'Asia Pacific Hub'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'London', 'Tokyo'];
  const countries = ['USA', 'USA', 'USA', 'USA', 'UK', 'Japan'];

  const warehouses = [];
  for (let i = 0; i < warehouseNames.length; i++) {
    const warehouse = await prisma.warehouse.create({
      data: {
        name: warehouseNames[i],
        location: `${cities[i]}, ${countries[i]}`,
        address: `${randomInt(100, 9999)} Industrial Blvd`,
        city: cities[i],
        country: countries[i],
        postalCode: String(randomInt(10000, 99999)),
        tplReference: `TPL-${String(i + 1).padStart(3, '0')}`,
        isActive: true,
      },
    });
    warehouses.push(warehouse);
  }
  console.log(`✅ Created ${warehouses.length} warehouses`);

  // Create suppliers
  console.log('🏢 Creating suppliers...');
  const supplierNames = ['Global Textiles Inc', 'Premium Materials Co', 'Quality Fabrics Ltd', 'Elite Suppliers Group', 'Prime Manufacturing', 'Apex Supply Chain'];
  const suppliers = [];
  for (let i = 0; i < supplierNames.length; i++) {
    const supplier = await prisma.supplier.create({
      data: {
        name: supplierNames[i],
        email: `contact@${supplierNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+1-${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
        contactName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
        address: `${randomInt(100, 9999)} Business Park Dr`,
        city: randomElement(cities),
        country: 'USA',
        postalCode: String(randomInt(10000, 99999)),
        leadTimeDays: randomInt(7, 45),
        isActive: true,
      },
    });
    suppliers.push(supplier);
  }
  console.log(`✅ Created ${suppliers.length} suppliers`);

  // Create collections
  console.log('📦 Creating collections...');
  const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];
  const years = ['2023', '2024', '2025'];
  const drops = ['Drop 1', 'Drop 2', 'Drop 3', 'Collection'];
  const lifecycles: CollectionLifecycle[] = [CollectionLifecycle.PLANNING, CollectionLifecycle.ACTIVE, CollectionLifecycle.ARCHIVED];

  const collections = [];
  for (let i = 0; i < 30; i++) {
    const season = randomElement(seasons);
    const year = randomElement(years);
    const drop = randomElement(drops);
    const collection = await prisma.collection.create({
      data: {
        name: `${season} ${year} ${drop}`,
        season: `${season} ${year}`,
        drop: drop,
        lifecycle: randomElement(lifecycles),
        description: `Premium ${season.toLowerCase()} collection for ${year}`,
      },
    });
    collections.push(collection);
  }
  console.log(`✅ Created ${collections.length} collections`);

  // Create products
  console.log('🛍️  Creating products...');
  const productNames = [
    'Classic T-Shirt', 'Premium Hoodie', 'Denim Jacket', 'Cotton Sweater', 'Wool Coat',
    'Leather Boots', 'Canvas Sneakers', 'Silk Scarf', 'Cashmere Sweater', 'Linen Shirt',
    'Chino Pants', 'Cargo Shorts', 'Baseball Cap', 'Beanie', 'Backpack',
    'Messenger Bag', 'Wallet', 'Belt', 'Watch', 'Sunglasses',
    'Polo Shirt', 'Blazer', 'Trench Coat', 'Jeans', 'Shorts',
    'Dress Shirt', 'Vest', 'Cardigan', 'Parka', 'Windbreaker',
    'Running Shoes', 'Dress Shoes', 'Sandals', 'Boots', 'Slippers',
    'Hat', 'Cap', 'Gloves', 'Socks', 'Underwear'
  ];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Brown', 'Red', 'Blue', 'Green', 'Purple', 'Pink', 'Yellow'];
  const materials = ['Cotton', 'Polyester', 'Wool', 'Leather', 'Silk', 'Linen', 'Cashmere', 'Denim', 'Nylon', 'Spandex'];

  const products = [];
  for (let i = 0; i < 1000; i++) {
    const productName = `${randomElement(productNames)} ${i + 1}`;
    const productSizes = sizes.slice(0, randomInt(3, 6));
    const productColors = colors.slice(0, randomInt(2, 5));
    const productMaterials = materials.slice(0, randomInt(1, 3));

    const product = await prisma.product.create({
      data: {
        name: productName,
        sku: generateSKU(i + 1),
        style: `STYLE-${String(i + 1).padStart(4, '0')}`,
        sizes: productSizes,
        colors: productColors,
        materials: productMaterials,
        ean: generateEAN(i + 1),
        description: `High-quality ${productName.toLowerCase()} made from premium materials`,
        basePrice: randomInt(20, 500),
        collectionId: randomElement(collections).id,
      },
    });
    products.push(product);
  }
  console.log(`✅ Created ${products.length} products`);

  // Create inventory
  console.log('📊 Creating inventory...');
  let inventoryCount = 0;
  for (const product of products) {
    // Each product in 2-4 warehouses
    const warehouseCount = randomInt(2, 4);
    const selectedWarehouses = warehouses.slice(0, warehouseCount);
    
    for (const warehouse of selectedWarehouses) {
      const quantity = randomInt(0, 500);
      await prisma.inventory.create({
        data: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: quantity,
          reservedQty: randomInt(0, Math.floor(quantity * 0.3)),
          availableQty: quantity - randomInt(0, Math.floor(quantity * 0.3)),
          reorderPoint: randomInt(10, 50),
          safetyStock: randomInt(5, 30),
        },
      });
      inventoryCount++;
    }
  }
  console.log(`✅ Created ${inventoryCount} inventory records`);

  // Create customers
  console.log('👤 Creating customers...');
  const customerTypes: CustomerType[] = [CustomerType.B2B, CustomerType.RETAILER, CustomerType.WHOLESALE];
  const companySuffixes = ['Inc', 'LLC', 'Corp', 'Ltd', 'Co', 'Group', 'Enterprises', 'Solutions', 'Partners', 'Global'];
  const customers = [];

  // Create customers - all from one month ago to present
  const customerCount = 1000;
  
  for (let i = 0; i < customerCount; i++) {
    const customerType = randomElement(customerTypes);
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const companyName = customerType !== CustomerType.B2B 
      ? `${lastName} ${randomElement(['Retail', 'Store', 'Shop', 'Boutique'])}`
      : `${lastName} ${randomElement(companySuffixes)}`;
    
    const createdAt = randomDate(startDate, endDate);
    const customer = await prisma.customer.create({
      data: {
        name: `${firstName} ${lastName}`,
        email: `customer${i + 1}@${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+1-${randomInt(200, 999)}-${randomInt(200, 999)}-${randomInt(1000, 9999)}`,
        type: customerType,
        companyName: companyName,
        taxId: customerType !== CustomerType.B2B ? undefined : `TAX-${String(i + 1).padStart(8, '0')}`,
        address: `${randomInt(100, 9999)} Main St`,
        city: randomElement(cities),
        country: 'USA',
        postalCode: String(randomInt(10000, 99999)),
        creditLimit: customerType === CustomerType.WHOLESALE ? randomInt(10000, 100000) : randomInt(1000, 10000),
        isActive: Math.random() > 0.1, // 90% active
        ownerId: Math.random() > 0.3 && users.filter(u => u.role === UserRole.SALES).length > 0 
          ? randomElement(users.filter(u => u.role === UserRole.SALES)).id 
          : null,
        createdAt: createdAt,
      },
    });
    customers.push(customer);
  }
  console.log(`✅ Created ${customers.length} customers (from one month ago to present)`);

  // Create orders
  console.log('📦 Creating orders...');
  const orderStatuses: OrderStatus[] = [
    OrderStatus.PENDING,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
    OrderStatus.PARTIALLY_FULFILLED,
    OrderStatus.FULFILLED,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
  ];
  const orderTypes: OrderType[] = [OrderType.B2B, OrderType.WHOLESALE, OrderType.DTC];

  const orders = [];
  // Create orders from one month ago to present
  const orderCount = 2000;

  for (let i = 0; i < orderCount; i++) {
    const customer = randomElement(customers);
    const orderDate = randomDate(startDate, endDate);
    const status = randomElement(orderStatuses);
    const type = randomElement(orderTypes);
    
    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(i + 1),
        customerId: customer.id,
        userId: Math.random() > 0.2 && users.filter(u => u.role === UserRole.SALES).length > 0
          ? randomElement(users.filter(u => u.role === UserRole.SALES)).id 
          : null,
        type: type,
        status: status,
        totalAmount: 0, // Will be calculated from order lines
        currency: 'USD',
        notes: Math.random() > 0.7 ? `Order notes for order ${i + 1}` : null,
        shippingAddress: `${randomInt(100, 9999)} Delivery St, ${randomElement(cities)}`,
        billingAddress: customer.address || `${randomInt(100, 9999)} Billing St, ${randomElement(cities)}`,
        orderDate: orderDate,
        requiredDate: status !== OrderStatus.CANCELLED ? new Date(orderDate.getTime() + randomInt(7, 30) * 24 * 60 * 60 * 1000) : null,
        shippedDate: ['SHIPPED', 'DELIVERED', 'IN_TRANSIT'].includes(status) ? new Date(orderDate.getTime() + randomInt(3, 10) * 24 * 60 * 60 * 1000) : null,
        deliveredDate: status === OrderStatus.DELIVERED ? new Date(orderDate.getTime() + randomInt(5, 15) * 24 * 60 * 60 * 1000) : null,
      },
    });

    // Create order lines (2-8 products per order)
    const lineCount = randomInt(2, 8);
    let orderTotal = 0;
    const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, lineCount);

    for (const product of selectedProducts) {
      const quantity = randomInt(1, 20);
      const unitPrice = Number(product.basePrice) * (type === OrderType.WHOLESALE ? 0.7 : type === OrderType.B2B ? 0.85 : 1);
      const totalPrice = unitPrice * quantity;

      await prisma.orderLine.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: quantity,
          unitPrice: unitPrice,
          totalPrice: totalPrice,
          size: randomElement(product.sizes),
          color: randomElement(product.colors),
          fulfilledQty: ['FULFILLED', 'SHIPPED', 'DELIVERED', 'PARTIALLY_FULFILLED'].includes(status) 
            ? randomInt(0, quantity) 
            : 0,
        },
      });

      orderTotal += totalPrice;
    }

    // Update order total
    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount: orderTotal },
    });

    orders.push({ ...order, totalAmount: orderTotal });
  }
  console.log(`✅ Created ${orders.length} orders (from one month ago to present)`);

  // Create shipments for shipped/delivered orders
  console.log('🚚 Creating shipments...');
  const shipmentStatuses: ShipmentStatus[] = [ShipmentStatus.SHIPPED, ShipmentStatus.IN_TRANSIT, ShipmentStatus.DELIVERED];
  const carriers = ['FedEx', 'UPS', 'DHL', 'USPS', 'Amazon Logistics'];
  let shipmentCount = 0;

  for (const order of orders.filter(o => ['SHIPPED', 'DELIVERED'].includes(o.status))) {
    const warehouse = randomElement(warehouses);
    const shipment = await prisma.shipment.create({
      data: {
        shipmentNumber: generateShipmentNumber(shipmentCount + 1),
        orderId: order.id,
        warehouseId: warehouse.id,
        status: order.status === OrderStatus.DELIVERED ? ShipmentStatus.DELIVERED : randomElement(shipmentStatuses),
        carrier: randomElement(carriers),
        trackingNumber: `TRK${String(shipmentCount + 1).padStart(10, '0')}`,
        shippingCost: randomInt(10, 100),
        shippedDate: order.shippedDate,
        deliveredDate: order.deliveredDate,
      },
    });
    shipmentCount++;
  }
  console.log(`✅ Created ${shipmentCount} shipments`);

  // Create purchase orders
  console.log('📋 Creating purchase orders...');
  const poStatuses: PurchaseOrderStatus[] = [
    PurchaseOrderStatus.DRAFT,
    PurchaseOrderStatus.SENT,
    PurchaseOrderStatus.CONFIRMED,
    PurchaseOrderStatus.PARTIALLY_RECEIVED,
    PurchaseOrderStatus.RECEIVED,
  ];
  const purchaseOrders = [];

  // All POs from one month ago to present
  const poCount = 300;

  for (let i = 0; i < poCount; i++) {
    const supplier = randomElement(suppliers);
    const poDate = randomDate(startDate, endDate);
    const status = randomElement(poStatuses);

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        poNumber: generatePONumber(i + 1),
        supplierId: supplier.id,
        status: status,
        totalAmount: 0, // Will be calculated
        currency: 'USD',
        orderDate: poDate,
        expectedDate: status !== PurchaseOrderStatus.CANCELLED ? new Date(poDate.getTime() + supplier.leadTimeDays * 24 * 60 * 60 * 1000) : null,
        receivedDate: ['RECEIVED', 'PARTIALLY_RECEIVED'].includes(status) ? new Date(poDate.getTime() + supplier.leadTimeDays * 24 * 60 * 60 * 1000) : null,
        notes: Math.random() > 0.7 ? `PO notes ${i + 1}` : null,
      },
    });

    // Create PO lines
    const lineCount = randomInt(3, 10);
    let poTotal = 0;
    const selectedProducts = products.sort(() => 0.5 - Math.random()).slice(0, lineCount);

    for (const product of selectedProducts) {
      const quantity = randomInt(50, 500);
      const unitCost = Number(product.basePrice) * 0.5; // Cost is 50% of base price
      const totalCost = unitCost * quantity;

      await prisma.purchaseOrderLine.create({
        data: {
          purchaseOrderId: purchaseOrder.id,
          productId: product.id,
          quantity: quantity,
          unitCost: unitCost,
          totalCost: totalCost,
          receivedQty: ['RECEIVED', 'PARTIALLY_RECEIVED'].includes(status) ? randomInt(0, quantity) : 0,
        },
      });

      poTotal += totalCost;
    }

    // Update PO total
    await prisma.purchaseOrder.update({
      where: { id: purchaseOrder.id },
      data: { totalAmount: poTotal },
    });

    purchaseOrders.push({ ...purchaseOrder, totalAmount: poTotal });
  }
  console.log(`✅ Created ${purchaseOrders.length} purchase orders (from one month ago to present)`);

  // Create reviews/ratings for customers
  console.log('⭐ Creating customer reviews/ratings...');
  const reviewSources = ['Website', 'Google', 'App Store', 'Play Store', 'Social Media'];
  const reviewStatuses: ReviewStatus[] = [ReviewStatus.PENDING, ReviewStatus.RESPONDED, ReviewStatus.RESOLVED];
  const reviewTexts = [
    'Amazing experience! Highly recommend this product.',
    'Good service but could improve support.',
    'Loved the product, highly recommend!',
    'Delivery was late but product quality is excellent.',
    'Average experience, nothing special.',
    'Excellent quality and fast shipping!',
    'Could be better, but acceptable.',
    'Outstanding service and product quality!',
    'Great value for money, very satisfied.',
    'Product met my expectations, would buy again.',
    'Fast delivery and good packaging.',
    'Not as described, but customer service helped resolve the issue.',
    'Perfect product, exactly what I needed.',
    'Good quality but shipping took longer than expected.',
    'Very happy with my purchase, will order again.',
  ];

  const reviewCount = 2000; // Create 2000 reviews
  let reviewsCreated = 0;

  for (let i = 0; i < reviewCount; i++) {
    // Randomly select a customer
    const customer = randomElement(customers);
    
    // Randomly select a product (optional, some reviews might not have products)
    const product = Math.random() > 0.2 ? randomElement(products) : null;
    
    // Generate rating (1-5 stars, weighted towards higher ratings)
    const ratingRoll = Math.random();
    let rating: number;
    if (ratingRoll < 0.65) {
      rating = 5; // 65% chance of 5 stars
    } else if (ratingRoll < 0.85) {
      rating = 4; // 20% chance of 4 stars
    } else if (ratingRoll < 0.95) {
      rating = 3; // 10% chance of 3 stars
    } else if (ratingRoll < 0.98) {
      rating = 2; // 3% chance of 2 stars
    } else {
      rating = 1; // 2% chance of 1 star
    }

    // Generate review date (from one month ago to present)
    const reviewDate = randomDate(startDate, endDate);
    
    try {
      await prisma.review.create({
        data: {
          customerId: customer.id,
          productId: product?.id,
          rating: rating,
          review: randomElement(reviewTexts),
          status: randomElement(reviewStatuses),
          source: randomElement(reviewSources),
          createdAt: reviewDate,
        },
      });
      reviewsCreated++;
    } catch (error) {
      // Skip if there's an error (e.g., duplicate constraint)
      console.log(`   ⚠️  Skipped review ${i + 1} due to error`);
    }
  }
  console.log(`✅ Created ${reviewsCreated} customer reviews/ratings (from one month ago to present)`);

  // Summary
  const totalRecords = 
    users.length +
    warehouses.length +
    suppliers.length +
    collections.length +
    products.length +
    inventoryCount +
    customers.length +
    orders.length +
    shipmentCount +
    purchaseOrders.length +
    reviewsCreated;

  console.log('\n✨ Seed1 completed successfully!');
  console.log('📊 Summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Warehouses: ${warehouses.length}`);
  console.log(`   - Suppliers: ${suppliers.length}`);
  console.log(`   - Collections: ${collections.length}`);
  console.log(`   - Products: ${products.length}`);
  console.log(`   - Inventory records: ${inventoryCount}`);
  console.log(`   - Customers: ${customers.length}`);
  console.log(`   - Orders: ${orders.length}`);
  console.log(`   - Shipments: ${shipmentCount}`);
  console.log(`   - Purchase Orders: ${purchaseOrders.length}`);
  console.log(`   - Reviews/Ratings: ${reviewsCreated}`);
  console.log(`   - TOTAL RECORDS: ${totalRecords}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed1 failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

