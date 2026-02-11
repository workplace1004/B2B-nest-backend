import { IsString, IsEnum, IsInt, IsOptional, IsObject } from 'class-validator';

export enum ScanCodeType {
  BARCODE = 'BARCODE',
  QR = 'QR',
  RFID = 'RFID',
}

export enum ScanAction {
  LOOKUP = 'LOOKUP',
  INVENTORY_UPDATE = 'INVENTORY_UPDATE',
  TRANSFER = 'TRANSFER',
  RECEIVING = 'RECEIVING',
  SHIPPING = 'SHIPPING',
}

export enum ScanStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}

export class CreateScanHistoryDto {
  @IsString()
  code: string;

  @IsEnum(ScanCodeType)
  codeType: ScanCodeType;

  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsInt()
  warehouseId?: number;

  @IsEnum(ScanAction)
  action: ScanAction;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsEnum(ScanStatus)
  status: ScanStatus;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  scannedBy?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

