-- CreateTable
CREATE TABLE "fx_rates" (
    "id" SERIAL NOT NULL,
    "fromCurrency" TEXT NOT NULL,
    "toCurrency" TEXT NOT NULL,
    "rate" DECIMAL(18,6) NOT NULL,
    "previousRate" DECIMAL(18,6),
    "change" DECIMAL(18,6),
    "changePercent" DECIMAL(10,4),
    "source" TEXT NOT NULL DEFAULT 'API',
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fx_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_currency_settings" (
    "id" SERIAL NOT NULL,
    "marketId" INTEGER,
    "marketName" TEXT NOT NULL,
    "marketCode" TEXT NOT NULL,
    "region" TEXT,
    "defaultCurrency" TEXT NOT NULL,
    "supportedCurrencies" TEXT[],
    "autoUpdateRates" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "roundingPrecision" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "market_currency_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fx_rates_fromCurrency_idx" ON "fx_rates"("fromCurrency");

-- CreateIndex
CREATE INDEX "fx_rates_toCurrency_idx" ON "fx_rates"("toCurrency");

-- CreateIndex
CREATE UNIQUE INDEX "fx_rates_fromCurrency_toCurrency_key" ON "fx_rates"("fromCurrency", "toCurrency");

-- CreateIndex
CREATE INDEX "market_currency_settings_marketId_idx" ON "market_currency_settings"("marketId");

-- CreateIndex
CREATE UNIQUE INDEX "market_currency_settings_marketCode_key" ON "market_currency_settings"("marketCode");

-- AddForeignKey
ALTER TABLE "market_currency_settings" ADD CONSTRAINT "market_currency_settings_marketId_fkey" FOREIGN KEY ("marketId") REFERENCES "markets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
