/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import { calculateGoldPrice, calculateTotalPoints, toBengaliNumber } from '../utils/calc';
import { TranslationSet, translations } from '../utils/lang';

interface CalculatorDetailsProps {
  lang: 'BN' | 'EN';
  pricePerVori: number;
  vori: string;
  ana: string;
  roti: string;
  point: string;
  makingCharge: string;
  setMakingCharge: (v: string) => void;
  makingChargeType: 'per_vori' | 'fixed';
  setMakingChargeType: (v: 'per_vori' | 'fixed') => void;
  vatPercentage: number;
  setVatPercentage: (v: number) => void;
  itemName: string;
  setItemName: (v: string) => void;
  onAddItem: () => void;
}

export default function CalculatorDetails({
  lang,
  pricePerVori,
  vori,
  ana,
  roti,
  point,
  makingCharge,
  setMakingCharge,
  makingChargeType,
  setMakingChargeType,
  vatPercentage,
  setVatPercentage,
  itemName,
  setItemName,
  onAddItem,
}: CalculatorDetailsProps) {
  const t: TranslationSet = translations[lang];

  const valVori = parseFloat(vori) || 0;
  const valAna = parseFloat(ana) || 0;
  const valRoti = parseFloat(roti) || 0;
  const valPoint = parseFloat(point) || 0;

  const totalPoints = calculateTotalPoints(valVori, valAna, valRoti, valPoint);
  const rawPrice = calculateGoldPrice(totalPoints, pricePerVori);

  const valMakingCharge = parseFloat(makingCharge) || 0;
  let computedMakingCharge = 0;
  if (makingChargeType === 'per_vori') {
    computedMakingCharge = (totalPoints / 960) * valMakingCharge;
  } else {
    computedMakingCharge = valMakingCharge;
  }

  const subTotal = rawPrice + computedMakingCharge;
  const grandTotal = subTotal;

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && totalPoints > 0 && pricePerVori > 0) {
      onAddItem();
    }
  };

  return (
    <div className="rounded-2xl border border-[#334155] bg-[#0f172a] p-6 shadow-xl text-slate-100 relative overflow-hidden">
      {/* Decorative premium radial vector accent (similar to result-card::before) */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-[#fbbf24]/5 rounded-bl-full pointer-events-none" />

      <h2 className="flex items-center gap-2 font-sans text-base font-extrabold text-white group relative z-10">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fbbf24] text-xs font-bold text-[#0f172a]">
          ৩
        </span>
        {t.calculatedValues}
      </h2>

      {/* Calculations Breakdown */}
      <div className="mt-5 space-y-4 relative z-10">
        {/* Raw Gold Price */}
        <div className="flex items-center justify-between border-b border-[#334155] pb-2.5">
          <span className="font-sans text-xs text-slate-405">{t.rawGoldPrice}:</span>
          <span className="font-mono text-sm font-bold text-[#fbbf24]">
            ৳{lang === 'BN' ? toBengaliNumber(Math.round(rawPrice).toLocaleString('en-IN')) : Math.round(rawPrice).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Simplified Making Charge (strictly per vori) */}
        <div className="rounded-xl bg-[#1e293b] p-4 border border-[#334155] space-y-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-sans text-xs font-bold text-slate-300">
              {lang === 'BN' ? 'মজুরির হার (ভরি প্রতি)' : 'Making Charge (Per Vori)'}:
            </span>
          </div>

          <div className="relative rounded-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-sm font-medium text-slate-450">৳</span>
            </div>
            <input
              type="number"
              value={makingCharge === '0' ? '' : makingCharge}
              onChange={(e) => setMakingCharge(e.target.value)}
              placeholder={lang === 'BN' ? 'যেমন: ৩০০০' : 'e.g. 3000'}
              className="block w-full rounded-lg border-2 border-[#334155] bg-[#0f172a] py-2 pl-8 pr-12 font-mono text-xs font-bold text-white focus:border-[#fbbf24] focus:outline-none transition-all"
              id="making-charge-rate-input"
              min="0"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-[9px] font-bold text-[#fbbf24] bg-[#0f172a] rounded px-1.5 py-0.5 uppercase">
                {lang === 'BN' ? 'ভরি প্রতি' : '/ VORI'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-[#334155]/60">
            <span className="font-sans text-slate-400">{t.makingCharge}:</span>
            <span className="font-mono font-bold text-[#fbbf24]">
              ৳{lang === 'BN' ? toBengaliNumber(Math.round(computedMakingCharge).toLocaleString('en-IN')) : Math.round(computedMakingCharge).toLocaleString('en-IN')}
            </span>
          </div>
        </div>


        {/* Grand total large block (corresponds directly to total-price-display) */}
        <div className="rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-4 border-2 border-[#fbbf24] shadow-inner">
          <div className="flex flex-col">
            <span className="font-sans text-[10px] font-bold text-[#fbbf24] uppercase tracking-widest">
              {t.totalPrice}
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="font-mono text-3xl font-extrabold tracking-tight text-[#fbbf24]">
                ৳{lang === 'BN' ? toBengaliNumber(Math.round(grandTotal).toLocaleString('en-IN')) : Math.round(grandTotal).toLocaleString('en-IN')}
              </span>
              <p className="font-sans text-[9px] text-slate-400">
                {lang === 'BN' ? '*রিয়েল-টাইম হিসাব' : '*960-point standard conversion'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Item Saving workflow to build Invoice */}
      <div className="mt-5 border-t border-[#334155] pt-4 relative z-10">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400" htmlFor="item-name-input">
          {t.itemName} <span className="text-slate-500">({lang === 'BN' ? 'ঐচ্ছিক' : 'Optional'})</span>
        </label>
        <div className="mt-1.5 flex gap-2">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={t.itemPlaceholder}
            className="block w-full rounded-lg border-2 border-[#334155] bg-[#1e293b] px-3 py-2 text-xs font-bold text-white focus:border-[#fbbf24] focus:outline-none transition-all"
            id="item-name-input"
          />

          <button
            type="button"
            onClick={onAddItem}
            disabled={totalPoints <= 0 || pricePerVori <= 0}
            className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#fbbf24] px-4 text-xs font-extrabold text-[#0f172a] shadow-md hover:bg-[#fbbf24]/90 active:scale-95 disabled:pointer-events-none disabled:opacity-30 transition-all cursor-pointer whitespace-nowrap"
            id="add-item-to-list-button"
          >
            <Plus className="h-4 w-4 stroke-[3px]" />
            <span>{t.addToList}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
