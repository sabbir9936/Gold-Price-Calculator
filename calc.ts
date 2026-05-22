/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Bengali Gold Weight Hierarchy:
 * 1 Vori = 16 Ana
 * 1 Ana = 6 Roti
 * 1 Roti = 10 Point
 * 
 * Consequently:
 * 1 Vori = 16 * 6 = 96 Roti
 * 1 Vori = 16 * 6 * 10 = 960 Points
 */

export const VORI_TO_ANA = 16;
export const ANA_TO_ROTI = 6;
export const ROTI_TO_POINT = 10;
export const VORI_TO_POINTS = VORI_TO_ANA * ANA_TO_ROTI * ROTI_TO_POINT; // 960
export const VORI_TO_GRAMS = 11.664; // Standard Bangladeshi jeweler conversion (1 Vori = 11.664 grams)

/**
 * Converts Vori, Ana, Roti, Point into total cumulative points.
 */
export function calculateTotalPoints(
  vori: number,
  ana: number,
  roti: number,
  point: number
): number {
  const safeVori = isNaN(vori) || vori < 0 ? 0 : vori;
  const safeAna = isNaN(ana) || ana < 0 ? 0 : ana;
  const safeRoti = isNaN(roti) || roti < 0 ? 0 : roti;
  const safePoint = isNaN(point) || point < 0 ? 0 : point;

  return (
    safeVori * VORI_TO_POINTS +
    safeAna * ANA_TO_ROTI * ROTI_TO_POINT +
    safeRoti * ROTI_TO_POINT +
    safePoint
  );
}

/**
 * Converts total points back into structured Vori, Ana, Roti, Point weight.
 */
export function breakdownPointsToUnits(totalPoints: number): {
  vori: number;
  ana: number;
  roti: number;
  point: number;
} {
  const roundedPoints = Math.round(totalPoints * 1000) / 1000; // avoid precision errors
  let remaining = Math.floor(roundedPoints);

  const vori = Math.floor(remaining / VORI_TO_POINTS);
  remaining %= VORI_TO_POINTS;

  const ana = Math.floor(remaining / (ANA_TO_ROTI * ROTI_TO_POINT));
  remaining %= (ANA_TO_ROTI * ROTI_TO_POINT);

  const roti = Math.floor(remaining / ROTI_TO_POINT);
  remaining %= ROTI_TO_POINT;

  const point = remaining;

  return { vori, ana, roti, point };
}

/**
 * Converts points to grams.
 */
export function pointsToGrams(points: number): number {
  return (points / VORI_TO_POINTS) * VORI_TO_GRAMS;
}

/**
 * Calculates raw gold price from total weight points and price per vori.
 */
export function calculateGoldPrice(
  totalPoints: number,
  pricePerVori: number
): number {
  if (!totalPoints || !pricePerVori) return 0;
  return (totalPoints / VORI_TO_POINTS) * pricePerVori;
}

/**
 * Formats a number to Bengali digits (e.g. 123 -> ১২৩).
 */
export function toBengaliNumber(val: number | string, decimals: number = -1): string {
  if (val === undefined || val === null) return '';
  
  let str = '';
  if (typeof val === 'number') {
    if (decimals >= 0) {
      str = val.toFixed(decimals);
    } else {
      str = val.toString();
    }
  } else {
    str = val;
  }

  const enDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '.'];

  return str
    .split('')
    .map(char => {
      const idx = enDigits.indexOf(char);
      return idx !== -1 ? bnDigits[idx] : char;
    })
    .join('');
}

/**
 * Helper to get default current market prices in Bangladesh (approximate reference).
 * Prices in BDT per Vori.
 * As of 2026, gold price fluctuates around 1,15,000 - 1,40,000 BDT per Vori.
 */
export const DEFAULT_GOLD_RATES: { carat: '24K' | '22K' | '21K' | '18K' | 'Traditional'; pricePerVori: number; label: string; bnLabel: string }[] = [
  { carat: '22K', pricePerVori: 141200, label: '22 Carat (Karat) - Standard Jewelry', bnLabel: '২২ ক্যারেট (সবচেয়ে জনপ্রিয় স্বর্ণ)' },
  { carat: '21K', pricePerVori: 134800, label: '21 Carat (Karat) - Popular', bnLabel: '২১ ক্যারেট (জনপ্রিয় স্বর্ণ)' },
  { carat: '18K', pricePerVori: 115500, label: '18 Carat (Karat) - Economy/Diamond Base', bnLabel: '১৮ ক্যারেট (কোয়ালিটি স্বর্ণ)' },
  { carat: 'Traditional', pricePerVori: 96300, label: 'Traditional (Sanatoni) Gold', bnLabel: 'সনাতন পদ্ধতির স্বর্ণ' },
  { carat: '24K', pricePerVori: 154000, label: '24 Carat (Karat) - Pure Gold Bar', bnLabel: '২৪ ক্যারেট (খাঁটি পাকা স্বর্ণ)' },
];
