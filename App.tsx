/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, Info, User, Phone } from 'lucide-react';
import { BillSetting, GoldCarat, JewelleryItem } from './types';
import Header from './components/Header';
import RateSection from './components/RateSection';
import WeightSection from './components/WeightSection';
import CalculatorDetails from './components/CalculatorDetails';
import BillInvoice from './components/BillInvoice';
import { translations } from './utils/lang';
import { toBengaliNumber } from './utils/calc';

export default function App() {
  // Locale State (defaults to 'BN' to prioritize user requested Bengali context)
  const [lang, setLang] = useState<'BN' | 'EN'>(() => {
    const cached = localStorage.getItem('gold_calc_lang');
    return (cached as 'BN' | 'EN') || 'BN';
  });

  // Rates and Carat
  const [pricePerVori, setPricePerVori] = useState<number>(0); // default BDT rate per vori

  // Weight Unit inputs
  const [vori, setVori] = useState<string>('');
  const [ana, setAna] = useState<string>('');
  const [roti, setRoti] = useState<string>('');
  const [point, setPoint] = useState<string>('');

  // Surcharges & Bill Configs
  const [makingCharge, setMakingCharge] = useState<string>('0'); // normal BD making charge rate
  const [makingChargeType, setMakingChargeType] = useState<'per_vori' | 'fixed'>('per_vori');
  const [vatPercentage, setVatPercentage] = useState<number>(5); // 5% Govt VAT on jewellery

  // Item Save Form
  const [itemName, setItemName] = useState<string>('');
  const [items, setItems] = useState<JewelleryItem[]>([]);

  // Safe localStorage synchronization
  useEffect(() => {
    localStorage.setItem('gold_calc_lang', lang);
  }, [lang]);

  const handleAddItem = () => {
    const numVori = parseFloat(vori) || 0;
    const numAna = parseFloat(ana) || 0;
    const numRoti = parseFloat(roti) || 0;
    const numPoint = parseFloat(point) || 0;

    if (numVori === 0 && numAna === 0 && numRoti === 0 && numPoint === 0) return;
    if (pricePerVori <= 0) return;

    const newItem: JewelleryItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 9),
      name: itemName.trim(),
      pricePerVori,
      weight: {
        vori: numVori,
        ana: numAna,
        roti: numRoti,
        point: numPoint,
      },
      makingCharge: parseFloat(makingCharge) || 0,
      makingChargeType,
    };

    setItems((prev) => [...prev, newItem]);
    
    // Clear inputs after adding to list (leaving standard rate presets intact)
    setItemName('');
    setVori('');
    setAna('');
    setRoti('');
    setPoint('');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 selection:bg-[#fbbf24] selection:text-[#0f172a]">
      {/* Top Header */}
      <div className="no-print">
        <Header lang={lang} setLang={setLang} />
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left panel: Live Gold Price Calculator */}
          <div className="no-print lg:col-span-5 space-y-5">
            {/* 1. Rates Carat */}
            <RateSection
              lang={lang}
              pricePerVori={pricePerVori}
              setPricePerVori={setPricePerVori}
            />

            {/* 2. Weight Inputs */}
            <WeightSection
              lang={lang}
              vori={vori}
              setVori={setVori}
              ana={ana}
              setAna={setAna}
              roti={roti}
              setRoti={setRoti}
              point={point}
              setPoint={setPoint}
            />

            {/* 3. Pricing details */}
            <CalculatorDetails
              lang={lang}
              pricePerVori={pricePerVori}
              vori={vori}
              ana={ana}
              roti={roti}
              point={point}
              makingCharge={makingCharge}
              setMakingCharge={setMakingCharge}
              makingChargeType={makingChargeType}
              setMakingChargeType={setMakingChargeType}
              vatPercentage={vatPercentage}
              setVatPercentage={setVatPercentage}
              itemName={itemName}
              setItemName={setItemName}
              onAddItem={handleAddItem}
            />
          </div>

          {/* Right panel: Digital Billing Invoice & Records */}
          <div className="lg:col-span-7">
            <div className="sticky top-6">
              <BillInvoice
                lang={lang}
                items={items}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
                billSetting={{ vatPercentage, discount: 0 }}
              />

              {/* Informative footer explaining weight unit metrics */}
              <div className="no-print mt-4 rounded-xl border border-slate-200 bg-white p-4 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2.5 shadow-sm">
                <Info className="h-4 w-4 shrink-0 text-[#b45309] mt-0.5" />
                <div>
                  <p className="font-extrabold text-[#0f172a] uppercase tracking-wider text-[10px]">
                    {lang === 'BN' ? 'বাংলাদেশী জুয়েলারি ওজন মানদণ্ডঃ' : 'Traditional Bangladeshi Weight Metrics:'}
                  </p>
                  <p className="mt-1">
                    {lang === 'BN' ? (
                      <span>
                        • ১ ভরি (Vori) = ১৬ আনা (Ana) = ১১.৬৬৪ গ্রাম (Grams) <br />
                        • ১ আনা (Ana) = ৬ রতি (Roti) = ০.৭২৯ গ্রাম (Grams) <br />
                        • ১ রতি (Roti) = ১০ পয়েন্ট (Point) = ০.১২১৫ গ্রাম (Grams) <br />
                        • ১ পয়েন্ট (Point) = ০.০১২২ গ্রাম (Grams)
                      </span>
                    ) : (
                      <span>
                        • 1 Vori = 16 Ana = 11.664 Grams (Standard Tola) <br />
                        • 1 Ana = 6 Roti = 0.729 Grams <br />
                        • 1 Roti = 10 Points = 0.1215 Grams <br />
                        • 1 Point = 0.0122 Grams
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Creator Credit Footer */}
              <div className="no-print mt-4 rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-xs shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-700">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-sans text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
                      {lang === 'BN' ? 'ওয়েবসাইট প্রস্তুতকারক' : 'Website Created By'}
                    </p>
                    <p className="font-sans text-sm font-black text-slate-800 mt-0.5">
                      Sabbir Ahmed
                    </p>
                    <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span className="font-mono text-xs font-semibold">01810869936</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
