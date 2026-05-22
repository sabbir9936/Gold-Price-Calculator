/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Scale } from 'lucide-react';
import { TranslationSet, translations } from '../utils/lang';
import { calculateTotalPoints, pointsToGrams, toBengaliNumber } from '../utils/calc';

interface WeightSectionProps {
  lang: 'BN' | 'EN';
  vori: string;
  setVori: (v: string) => void;
  ana: string;
  setAna: (v: string) => void;
  roti: string;
  setRoti: (v: string) => void;
  point: string;
  setPoint: (v: string) => void;
}

export default function WeightSection({
  lang,
  vori,
  setVori,
  ana,
  setAna,
  roti,
  setRoti,
  point,
  setPoint,
}: WeightSectionProps) {
  const t: TranslationSet = translations[lang];

  // Raw values to numeric
  const valVori = parseFloat(vori) || 0;
  const valAna = parseFloat(ana) || 0;
  const valRoti = parseFloat(roti) || 0;
  const valPoint = parseFloat(point) || 0;

  const totalPoints = calculateTotalPoints(valVori, valAna, valRoti, valPoint);
  const totalGrams = pointsToGrams(totalPoints);

  const resetWeight = () => {
    setVori('');
    setAna('');
    setRoti('');
    setPoint('');
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-100 transition-all">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-sans text-base font-extrabold text-[#0f172a] group">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#fbbf24] text-xs font-extrabold text-[#0f172a]">
            ২
          </span>
          {t.weightInputTitle}
        </h2>
        <button
          onClick={resetWeight}
          className="text-xs font-bold text-[#b45309] hover:text-[#fbbf24] transition-colors cursor-pointer"
          type="button"
          id="reset-weight-button"
        >
          {lang === 'BN' ? 'শূন্য করুন' : 'Reset Weight'}
        </button>
      </div>
      <p className="mt-1 font-sans text-xs text-slate-500 leading-relaxed">
        {t.weightInputDesc}
      </p>

      {/* Grid of weight inputs */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Vori */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-650" htmlFor="weight-vori">
            {t.vori}
          </label>
          <div className="relative mt-1">
            <input
              type="number"
              value={vori}
              onChange={(e) => setVori(e.target.value)}
              placeholder="0"
              className="block w-full rounded-lg border-2 border-slate-200 bg-[#f8fafc] px-3 py-2.5 font-mono text-sm font-bold text-slate-900 focus:border-[#fbbf24] focus:outline-none transition-all"
              id="weight-vori"
              min="0"
            />
            {valVori > 0 && (
              <span className="absolute top-1.5 right-2 rounded bg-[#fbbf24]/20 px-1 py-0.5 font-mono text-[9px] uppercase font-bold text-slate-900">
                {lang === 'BN' ? toBengaliNumber(valVori) : valVori}
              </span>
            )}
          </div>
        </div>

        {/* Ana */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-650" htmlFor="weight-ana">
              {t.ana}
            </label>
            {valAna >= 16 && (
              <span className="animate-pulse font-sans text-[9px] font-bold text-[#b45309]">
                {lang === 'BN' ? '≥ ১৬আ' : '≥ 16a'}
              </span>
            )}
          </div>
          <div className="relative mt-1">
            <input
              type="number"
              value={ana}
              onChange={(e) => setAna(e.target.value)}
              placeholder="0"
              className="block w-full rounded-lg border-2 border-slate-200 bg-[#f8fafc] px-3 py-2.5 font-mono text-sm font-bold text-slate-900 focus:border-[#fbbf24] focus:outline-none transition-all"
              id="weight-ana"
              min="0"
            />
          </div>
        </div>

        {/* Roti */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-650" htmlFor="weight-roti">
              {t.roti}
            </label>
            {valRoti >= 6 && (
              <span className="animate-pulse font-sans text-[9px] font-bold text-[#b45309]">
                {lang === 'BN' ? '≥ ৬র' : '≥ 6r'}
              </span>
            )}
          </div>
          <div className="relative mt-1">
            <input
              type="number"
              value={roti}
              onChange={(e) => setRoti(e.target.value)}
              placeholder="0"
              className="block w-full rounded-lg border-2 border-slate-200 bg-[#f8fafc] px-3 py-2.5 font-mono text-sm font-bold text-slate-900 focus:border-[#fbbf24] focus:outline-none transition-all"
              id="weight-roti"
              min="0"
            />
          </div>
        </div>

        {/* Point */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-650" htmlFor="weight-point">
              {t.point}
            </label>
            {valPoint >= 10 && (
              <span className="animate-pulse font-sans text-[9px] font-bold text-[#b45309]">
                {lang === 'BN' ? '≥ ১০প' : '≥ 10p'}
              </span>
            )}
          </div>
          <div className="relative mt-1">
            <input
              type="number"
              value={point}
              onChange={(e) => setPoint(e.target.value)}
              placeholder="0"
              className="block w-full rounded-lg border-2 border-slate-200 bg-[#f8fafc] px-3 py-2.5 font-mono text-sm font-bold text-slate-900 focus:border-[#fbbf24] focus:outline-none transition-all"
              id="weight-point"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Real-time Metric Helper / Equivalents Display */}
      {totalPoints > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 text-slate-700 text-xs font-semibold">
            <Scale className="h-4 w-4 text-[#b45309]" />
            <span>{t.totalPoints}:</span>
            <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
              {lang === 'BN' ? toBengaliNumber(totalPoints) : totalPoints} pts
            </span>
          </div>
          <div className="text-slate-700 text-xs font-semibold">
            <span>{t.grams}:</span>
            <span className="ml-1 font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-sm">
              {lang === 'BN' ? toBengaliNumber(totalGrams, 3) : totalGrams.toFixed(3)}g
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
