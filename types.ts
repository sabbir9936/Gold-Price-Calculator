/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GoldCarat = '24K' | '22K' | '21K' | '18K' | 'Traditional';

export interface GoldRate {
  carat: GoldCarat;
  pricePerVori: number; // in BDT (Taka)
  label: string;
}

export interface JewelleryItem {
  id: string;
  name: string;
  carat?: GoldCarat;
  pricePerVori: number;
  weight: {
    vori: number;
    ana: number;
    roti: number;
    point: number;
  };
  makingCharge: number; // can be per vori or total
  makingChargeType: 'per_vori' | 'fixed';
}

export interface BillSetting {
  vatPercentage: number; // e.g., 5% in Bangladesh
  discount: number; // in BDT
}
