/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { toBengaliNumber } from '../utils/calc';
import { TranslationSet, translations } from '../utils/lang';

interface RateSectionProps {
  lang: 'BN' | 'EN';
  pricePerVori: number;
  setPricePerVori: (price: number) => void;
}

export default function RateSection({
  lang,
  pricePerVori,
  setPricePerVori,
}: RateSectionProps) {
  const t: TranslationSet = translations[lang];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100 transition-all font-sans">
      <h2 className="flex items-center gap-2 font-sans text-base font-extrabold text-[#0f172a] group">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fbbf24] text-xs font-extrabold text-[#0f172a]">
          ১
        </span>
        {t.goldRateTitle}
      </h2>

      {/* Price Input Field */}
      <div className="mt-5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600" htmlFor="price-per-vori-input">
          {t.ratePerVori} <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-2 rounded-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-sm font-semibold text-slate-400">৳</span>
          </div>
          <input
            type="number"
            value={pricePerVori || ''}
            onChange={(e) => setPricePerVori(Math.max(0, parseFloat(e.target.value) || 0))}
            placeholder={lang === 'BN' ? toBengaliNumber('135000') : '135000'}
            className="block w-full rounded-lg border-2 border-slate-200 bg-white py-2.5 pl-8 pr-12 font-mono text-sm font-bold text-slate-900 focus:border-[#fbbf24] focus:outline-none transition-all"
            id="price-per-vori-input"
            min="0"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 rounded px-1.5 py-0.5 uppercase">
              {lang === 'BN' ? 'ভরি' : 'VORI'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
