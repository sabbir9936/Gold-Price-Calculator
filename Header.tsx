/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Gem, Languages, Scale } from 'lucide-react';
import { TranslationSet, translations } from '../utils/lang';

interface HeaderProps {
  lang: 'BN' | 'EN';
  setLang: (lang: 'BN' | 'EN') => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const t: TranslationSet = translations[lang];

  return (
    <header className="relative w-full border-b-[4px] border-b-[#b45309] bg-[#0f172a] py-5 px-4 sm:px-6 lg:px-8 shadow-xl">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-[#b45309] to-[#fbbf24] shadow-md shadow-stone-950/40">
              <Scale className="absolute h-6 w-6 text-[#0f172a]" />
              {/* Subtle visual flare */}
              <div className="absolute top-1 right-1 h-2 w-2 animate-pulse rounded-full bg-white" />
            </div>
            
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center gap-1.5 sm:justify-start">
                <h1 className="font-sans text-xl font-extrabold tracking-tight text-[#fbbf24] sm:text-2xl">
                  {t.title}
                </h1>
                <Gem className="h-4 w-4 text-[#fbbf24] animate-bounce" />
              </div>
            </div>
          </div>

          {/* Language Selector Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'BN' ? 'EN' : 'BN')}
              className="group relative flex items-center gap-2 rounded-lg border-2 border-[#b45309] bg-[#1e293b] px-4 py-2 font-sans text-xs font-bold text-[#fbbf24] shadow-sm transition-all hover:bg-[#334155] active:scale-95 cursor-pointer"
              id="lang-toggle-button"
            >
              <Languages className="h-4 w-4 text-[#fbbf24] transition-transform group-hover:rotate-12" />
              <span>{lang === 'BN' ? 'English (EN)' : 'বাংলা (BN)'}</span>
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-400"></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
