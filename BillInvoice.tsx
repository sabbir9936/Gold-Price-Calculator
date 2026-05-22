/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Printer, ReceiptText, Trash2 } from 'lucide-react';
import { BillSetting, JewelleryItem } from '../types';
import {
  breakdownPointsToUnits,
  calculateTotalPoints,
  pointsToGrams,
  toBengaliNumber,
} from '../utils/calc';
import { TranslationSet, translations } from '../utils/lang';

interface BillInvoiceProps {
  lang: 'BN' | 'EN';
  items: JewelleryItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  billSetting: BillSetting;
}

export default function BillInvoice({
  lang,
  items,
  onRemoveItem,
  onClearAll,
  billSetting,
}: BillInvoiceProps) {
  const t: TranslationSet = translations[lang];

  // Calculations
  const totalPoints = items.reduce((sum, item) => {
    return (
      sum +
      calculateTotalPoints(
        item.weight.vori,
        item.weight.ana,
        item.weight.roti,
        item.weight.point
      )
    );
  }, 0);

  const brokenDownWeight = breakdownPointsToUnits(totalPoints);
  const totalGrams = pointsToGrams(totalPoints);

  // Raw Gold sum
  const sumRawPrice = items.reduce((sum, item) => {
    const pts = calculateTotalPoints(
      item.weight.vori,
      item.weight.ana,
      item.weight.roti,
      item.weight.point
    );
    return sum + (pts / 960) * item.pricePerVori;
  }, 0);

  // Making Charge sum
  const sumMakingCharge = items.reduce((sum, item) => {
    const pts = calculateTotalPoints(
      item.weight.vori,
      item.weight.ana,
      item.weight.roti,
      item.weight.point
    );
    if (item.makingChargeType === 'per_vori') {
      return sum + (pts / 960) * item.makingCharge;
    }
    return sum + item.makingCharge;
  }, 0);

  const subTotal = sumRawPrice + sumMakingCharge;
  const grandTotal = Math.max(0, subTotal - billSetting.discount);

  const triggerPrint = () => {
    const isBN = lang === 'BN';
    const invoiceId = Math.floor(100000 + Math.random() * 900000);
    const formattedTotalGrams = isBN ? toBengaliNumber(totalGrams.toFixed(3)) : totalGrams.toFixed(3);
    const formattedGrandTotal = isBN ? toBengaliNumber(Math.round(grandTotal).toLocaleString('en-IN')) : Math.round(grandTotal).toLocaleString('en-IN');
    const formattedSumRaw = isBN ? toBengaliNumber(Math.round(sumRawPrice).toLocaleString('en-IN')) : Math.round(sumRawPrice).toLocaleString('en-IN');
    const formattedSumMaking = isBN ? toBengaliNumber(Math.round(sumMakingCharge).toLocaleString('en-IN')) : Math.round(sumMakingCharge).toLocaleString('en-IN');
    const formattedDiscount = isBN ? toBengaliNumber(Math.round(billSetting.discount).toLocaleString('en-IN')) : Math.round(billSetting.discount).toLocaleString('en-IN');

    const bvori = isBN ? toBengaliNumber(brokenDownWeight.vori) : brokenDownWeight.vori;
    const bana = isBN ? toBengaliNumber(brokenDownWeight.ana) : brokenDownWeight.ana;
    const broti = isBN ? toBengaliNumber(brokenDownWeight.roti) : brokenDownWeight.roti;
    const bpoint = isBN ? toBengaliNumber(brokenDownWeight.point) : brokenDownWeight.point;

    const itemsRows = items.map((item, idx) => {
      const itemPoints = calculateTotalPoints(
        item.weight.vori,
        item.weight.ana,
        item.weight.roti,
        item.weight.point
      );
      const itemGrams = pointsToGrams(itemPoints);
      const itemRaw = (itemPoints / 960) * item.pricePerVori;
      const itemCharge =
        item.makingChargeType === 'per_vori'
          ? (itemPoints / 960) * item.makingCharge
          : item.makingCharge;
      const itemTotal = itemRaw + itemCharge;

      const nameText = item.name || (isBN ? `অলঙ্কার #${toBengaliNumber(idx + 1)}` : `Item #${idx + 1}`);
      const weightText = isBN
        ? `${toBengaliNumber(item.weight.vori)} ভরি, ${toBengaliNumber(item.weight.ana)} আনা, ${toBengaliNumber(item.weight.roti)} রতি, ${toBengaliNumber(item.weight.point)} পয়েন্ট`
        : `${item.weight.vori} Vori, ${item.weight.ana} Ana, ${item.weight.roti} Roti, ${item.weight.point} Point`;
      const priceRateText = isBN
        ? `৳${toBengaliNumber(item.pricePerVori.toLocaleString('en-IN'))}/ভরি`
        : `৳${item.pricePerVori.toLocaleString('en-IN')}/Vori`;
      const itemTotalText = isBN
        ? `৳${toBengaliNumber(Math.round(itemTotal).toLocaleString('en-IN'))}`
        : `৳${Math.round(itemTotal).toLocaleString('en-IN')}`;

      return `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 12px; font-weight: bold; color: #1e293b;">
            ${nameText}
            <div style="font-size: 11px; color: #64748b; font-weight: normal; margin-top: 2px;">Rate: ${priceRateText}</div>
          </td>
          <td style="padding: 12px; text-align: right; font-family: monospace; font-weight: bold; color: #334155;">${weightText}</td>
          <td style="padding: 12px; text-align: right; color: #64748b; font-family: monospace;">${isBN ? toBengaliNumber(itemGrams.toFixed(2)) : itemGrams.toFixed(2)}g</td>
          <td style="padding: 12px; text-align: right; font-family: monospace; font-weight: 800; color: #0f172a;">${itemTotalText}</td>
        </tr>
      `;
    }).join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="${isBN ? 'bn' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estimate Memo #${invoiceId}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f1f5f9;
            color: #0f172a;
            margin: 0;
            padding: 40px 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #ffffff;
            padding: 40px;
            text-align: center;
            position: relative;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: #fbbf24;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            color: #94a3b8;
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.1em;
        }
        .meta-info {
            display: flex;
            justify-content: space-between;
            background-color: #f8fafc;
            border-bottom: 2px solid #e2e8f0;
            padding: 16px 40px;
            font-size: 13px;
            font-weight: bold;
            color: #475569;
        }
        .content {
            padding: 40px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        th {
            background-color: #f8fafc;
            color: #475569;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #e2e8f0;
        }
        .summary-box {
            margin-top: 30px;
            border-top: 2px dashed #cbd5e1;
            padding-top: 20px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
            color: #334155;
        }
        .summary-row.total {
            background-color: #0f172a;
            color: #ffffff;
            border-radius: 12px;
            padding: 20px;
            margin-top: 15px;
            font-weight: 800;
            border-bottom: 4px solid #b45309;
        }
        .total-amount {
            color: #fbbf24;
            font-size: 24px;
        }
        .notes-section {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
            font-size: 12px;
            color: #64748b;
            line-height: 1.6;
        }
        .signatures {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
        }
        .signature-line {
            width: 40%;
            border-top: 1px dashed #94a3b8;
            text-align: center;
            padding-top: 8px;
            font-size: 13px;
            font-weight: 700;
            color: #334155;
        }
        .actions-bar {
            max-width: 800px;
            margin: 0 auto 20px auto;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }
        .btn {
            background-color: #fbbf24;
            color: #0f172a;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 800;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .btn:hover {
            background-color: #f59e0b;
            transform: translateY(-1px);
        }
        @media print {
            body {
                background-color: #ffffff;
                padding: 0;
            }
            .container {
                box-shadow: none;
                border: none;
                border-radius: 0;
            }
            .actions-bar, .btn {
                display: none !important;
            }
        }
    </style>
</head>
<body>
    <div class="actions-bar">
        <button class="btn" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            ${isBN ? 'প্রিন্ট দিন' : 'Print Now'}
        </button>
    </div>
    <div class="container">
        <div class="header">
            <h1>${isBN ? 'স্বর্ণালঙ্কার মেমো / ESTIMATE MEMO' : 'Gold Ornament Memo / Estimate'}</h1>
            <p>${isBN ? 'স্মার্ট জুয়েলারি ক্রয় হিসাব বিবরণী' : 'Premium Jewellery Calculation Statement'}</p>
        </div>
        <div class="meta-info">
            <span>${isBN ? 'তারিখ' : 'Date'}: ${todayDate}</span>
            <span>MEMO ID: #${invoiceId}</span>
        </div>
        <div class="content">
            <table>
                <thead>
                    <tr>
                        <th style="width: 35%;">${isBN ? 'অলঙ্কারের নাম' : 'Ornament Name'}</th>
                        <th style="width: 35%; text-align: right;">${isBN ? 'ওজন (ভরি-আনা-রতি-পয়েন্ট)' : 'Weight (Vori-Ana-Roti-Point)'}</th>
                        <th style="width: 15%; text-align: right;">${isBN ? 'গ্রাম' : 'Grams'}</th>
                        <th style="width: 15%; text-align: right;">${isBN ? 'মোট মূল্য' : 'Total Price'}</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsRows}
                </tbody>
            </table>

            <div class="summary-box">
                <div class="summary-row">
                    <span style="font-weight: bold; text-transform: uppercase;">${isBN ? 'সর্বমোট ওজন' : 'Total Combined Weight'}:</span>
                    <span style="font-weight: 800;">
                        ${isBN ? `${bvori} ভরি, ${bana} আনা, ${broti} রতি, ${bpoint} পয়েন্ট` : `${bvori} Vori, ${bana} Ana, ${broti} Roti, ${bpoint} Point`}
                        (${formattedTotalGrams}g)
                    </span>
                </div>
                <div class="summary-row">
                    <span>${isBN ? 'স্বর্ণের সাব-টোটাল মূল্য' : 'Raw Gold Subtotal'}:</span>
                    <span style="font-family: monospace; font-weight: bold;">৳${formattedSumRaw}</span>
                </div>
                <div class="summary-row">
                    <span>${isBN ? 'মোট মজুরি (মেকিং চার্জ)' : 'Total Making Charges'}:</span>
                    <span style="font-family: monospace; font-weight: bold;">৳${formattedSumMaking}</span>
                </div>
                ${billSetting.discount > 0 ? `
                <div class="summary-row" style="color: #ef4444;">
                    <span>${isBN ? 'ডিসকাউন্ট' : 'Discount'}:</span>
                    <span style="font-family: monospace; font-weight: bold;">-৳${formattedDiscount}</span>
                </div>
                ` : ''}
                <div class="summary-row total">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                        <span style="text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; font-weight: 800; color: #fbbf24;">
                            ${isBN ? 'সর্বমোট প্রদেয় মূল্য' : 'GRAND TOTAL AMOUNT'}
                        </span>
                        <span class="total-amount" style="font-family: monospace;">৳${formattedGrandTotal}</span>
                    </div>
                </div>
            </div>

            <div class="notes-section">
                <p style="font-weight: bold; color: #1e293b; margin: 0 0 4px 0;">
                    ${isBN ? '* বিশেষ দ্রষ্টব্য:' : '* Terms & Conditions:'}
                </p>
                <p style="margin: 0 0 4px 0;">
                    ${isBN ? 'অনুগ্রহ করে সোনা খাঁটি কি না এবং ওজন দোকানে থাকতেই সুচারুভাবে যাচাই করে বুঝে নিন। পরবর্তীতে কোনো দাবি গ্রহণযোগ্য নয়।' : 'Please verify the gold purity, quality, and weight specification before leaving the store premises.'}
                </p>
                <p style="margin: 0;">
                    ${isBN ? 'ভুল ত্রুটি সংশোধনযোগ্য (ভুলবশত কোনো প্রকার গাণিতিক অমিল দেখা দিলে পরিবর্তনযোগ্য)।' : 'Errors and omissions are subject to correction.'}
                </p>
            </div>

            <div class="signatures">
                <div class="signature-line">
                    ${isBN ? 'গ্রাহকের স্বাক্ষর' : "Customer's Signature"}
                </div>
                <div class="signature-line">
                    ${isBN ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authorized Signature'}
                </div>
            </div>
        </div>
    </div>
    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 300);
        }
    </script>
</body>
</html>`;

    // Create a Blob from the HTML text
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `gold_estimate_memo_${invoiceId}.html`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const todayDate = new Date().toLocaleDateString(
    lang === 'BN' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100/60 font-sans">
      {/* List Header */}
      <div className="no-print flex items-center justify-between border-b border-slate-150 pb-4">
        <div>
          <h2 className="flex items-center gap-2 font-sans text-base font-extrabold text-[#0f172a]">
            <ReceiptText className="h-5 w-5 text-[#b45309]" />
            {t.itemListTitle}
          </h2>
        </div>

        {items.length > 0 && (
          <button
            onClick={onClearAll}
            className="rounded-lg bg-slate-100 px-3.5 py-1.5 font-sans text-xs font-bold text-slate-700 hover:bg-slate-200 hover:text-[#0f172a] transition-all cursor-pointer"
            id="clear-all-invoice-button"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="no-print flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-350 border-2 border-dashed border-slate-200">
            <ReceiptText className="h-6 w-6" />
          </div>
          <p className="mt-3 max-w-xs font-sans text-xs text-[#0f172a]/70 font-bold">
            {t.noItemsYet}
          </p>
        </div>
      ) : (
        <div className="mt-5">
          {/* PRINT-ONLY HEADER */}
          <div className="print-only hidden text-center border-b-2 border-slate-900 pb-5 mb-5">
            <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-900">
              স্বর্ণালঙ্কার মেমো / ESTIMATE MEMO
            </h1>
            <p className="font-sans text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">
              {t.invoiceSubtitle}
            </p>
            <div className="mt-4 flex justify-between text-xs font-mono text-slate-800 px-4 font-extrabold">
              <span>
                {t.date}: {todayDate}
              </span>
              <span>
                {t.invoiceNo}: #{lang === 'BN' ? toBengaliNumber(1001) : '1001'}
              </span>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-600 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-3">{t.itemName}</th>
                  <th className="py-3 px-2 text-right">{lang === 'BN' ? 'পরিমাণ (ভরি-আনা-রতি-পয়েন্ট)' : 'Weight (V-A-R-P)'}</th>
                  <th className="py-3 px-2 text-right">{lang === 'BN' ? 'গ্রাম' : 'Grams'}</th>
                  <th className="py-3 px-3 text-right">{t.totalPrice}</th>
                  <th className="no-print py-3 px-2 text-center w-12">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {items.map((item, idx) => {
                  const itemPoints = calculateTotalPoints(
                    item.weight.vori,
                    item.weight.ana,
                    item.weight.roti,
                    item.weight.point
                  );
                  const itemGrams = pointsToGrams(itemPoints);
                  const itemRaw = (itemPoints / 960) * item.pricePerVori;
                  const itemCharge =
                    item.makingChargeType === 'per_vori'
                      ? (itemPoints / 960) * item.makingCharge
                      : item.makingCharge;
                  const itemTotal = itemRaw + itemCharge;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="py-3 px-3 font-medium text-slate-900">
                        <span className="block font-bold">
                          {item.name || (lang === 'BN' ? `অলঙ্কার #${toBengaliNumber(idx + 1)}` : `Item #${idx + 1}`)}
                        </span>
                        <span className="font-mono text-[9px] text-slate-400 font-semibold">
                          ৳{lang === 'BN' ? toBengaliNumber(item.pricePerVori.toLocaleString('en-IN')) : item.pricePerVori.toLocaleString('en-IN')}/{t.vori}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-slate-700">
                        {lang === 'BN' ? (
                          <span>
                            {toBengaliNumber(item.weight.vori)}-{toBengaliNumber(item.weight.ana)}-{toBengaliNumber(item.weight.roti)}-{toBengaliNumber(item.weight.point)}
                          </span>
                        ) : (
                          <span>
                            {item.weight.vori}v {item.weight.ana}a {item.weight.roti}r {item.weight.point}p
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right font-mono text-slate-500 font-semibold">
                        {lang === 'BN' ? toBengaliNumber(itemGrams.toFixed(2)) : itemGrams.toFixed(2)}g
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-950">
                        ৳{lang === 'BN' ? toBengaliNumber(Math.round(itemTotal).toLocaleString('en-IN')) : Math.round(itemTotal).toLocaleString('en-IN')}
                      </td>
                      <td className="no-print py-3 px-2 text-center">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition-colors cursor-pointer"
                          title={t.delete}
                          id={`delete-item-${item.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Memo Summary calculations */}
          <div className="mt-5 border-t-2 border-dashed border-slate-200 pt-4 space-y-2.5 text-slate-700 text-xs">
            {/* Accumulative Weight */}
            <div className="flex items-center justify-between font-bold border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">{t.totalW}:</span>
              <div className="font-mono font-black text-[#0f172a] text-sm">
                {lang === 'BN' ? (
                  <span>
                    {toBengaliNumber(brokenDownWeight.vori)} {t.vori}, {toBengaliNumber(brokenDownWeight.ana)} {t.ana}, {toBengaliNumber(brokenDownWeight.roti)} {t.roti}, {toBengaliNumber(brokenDownWeight.point)} {t.point}
                  </span>
                ) : (
                  <span>
                    {brokenDownWeight.vori} Vori, {brokenDownWeight.ana} Ana, {brokenDownWeight.roti} Roti, {brokenDownWeight.point} Point
                  </span>
                )}
                <span className="ml-1.5 text-[10px] text-slate-400 font-bold">
                  ({lang === 'BN' ? toBengaliNumber(totalGrams.toFixed(3)) : totalGrams.toFixed(3)}g)
                </span>
              </div>
            </div>

            {/* Sum Raw Price */}
            <div className="flex items-center justify-between text-slate-500 font-semibold border-b border-slate-50 pb-1.5">
              <span>{lang === 'BN' ? 'স্বর্ণের সাব-টোটাল মূল্য' : 'Raw Gold Subtotal'}:</span>
              <span className="font-mono font-bold text-slate-900">
                ৳{lang === 'BN' ? toBengaliNumber(Math.round(sumRawPrice).toLocaleString('en-IN')) : Math.round(sumRawPrice).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Sum Making Charge */}
            <div className="flex items-center justify-between text-slate-500 font-semibold border-b border-slate-50 pb-1.5">
              <span>{lang === 'BN' ? 'মোট মজুরি (মেকিং চার্জ)' : 'Total Making Charges'}:</span>
              <span className="font-mono font-bold text-slate-900">
                ৳{lang === 'BN' ? toBengaliNumber(Math.round(sumMakingCharge).toLocaleString('en-IN')) : Math.round(sumMakingCharge).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Grand dynamic Invoice Total */}
            <div className="mt-4 flex items-center justify-between rounded-xl bg-[#0f172a] p-5 text-white shadow-md border-b-[4px] border-b-[#b45309]">
              <span className="font-sans text-xs font-black uppercase tracking-widest text-[#fbbf24]">
                {t.grandTotal}
              </span>
              <div className="text-right">
                <span className="font-mono text-xl font-bold tracking-tight text-[#fbbf24]">
                   ৳{lang === 'BN' ? toBengaliNumber(Math.round(grandTotal).toLocaleString('en-IN')) : Math.round(grandTotal).toLocaleString('en-IN')}
                </span>
                <p className="font-sans text-[8px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">
                  {lang === 'BN' ? '*চূড়ান্ত হিসাব' : '*Calculated invoice bill'}
                </p>
              </div>
            </div>

            {/* PRINT-ONLY SIGNATURES & TERMS */}
            <div className="print-only hidden mt-10">
              <div className="border-t border-slate-300 pt-3 text-[10px] text-slate-500 leading-relaxed space-y-1">
                <p className="font-bold">
                  {lang === 'BN' 
                    ? '* বিশেষ দ্রষ্টব্য: অনুগ্রহ করে সোনা খাঁটি কি না এবং ওজন দোকানে থাকতেই সুচারুভাবে যাচাই করে বুঝে নিন। পরবর্তীতে কোনো দাবি গ্রহণযোগ্য নয়।' 
                    : '* Note: Please verify the gold purity, quality, and weight specification before leaving the store premises.'}
                </p>
                <p>
                  {lang === 'BN' 
                    ? 'ভুল ত্রুটি সংশোধনযোগ্য (ভুলবশত কোনো প্রকার গাণিতিক অমিল দেখা দিলে পরিবর্তনযোগ্য)।' 
                    : 'Errors and omissions are subject to correction.'}
                </p>
              </div>

              <div className="mt-14 flex justify-between px-4 text-xs font-bold text-slate-800">
                <div className="text-center pt-8 border-t border-dashed border-slate-300 w-2/5">
                  {lang === 'BN' ? 'গ্রাহকের স্বাক্ষর' : "Customer's Signature"}
                </div>
                <div className="text-center pt-8 border-t border-dashed border-slate-300 w-2/5">
                  {lang === 'BN' ? 'কর্তৃপক্ষের স্বাক্ষর' : 'Authorized Signature'}
                </div>
              </div>
            </div>
          </div>

          {/* Printing action button */}
          <div className="no-print mt-5 flex justify-end gap-3">
            <button
              onClick={triggerPrint}
              className="flex items-center gap-2 rounded-lg border-2 border-[#b45309] bg-[#fbbf24] px-5 py-2.5 text-xs font-black text-[#0f172a] shadow-md hover:bg-[#fbbf24]/90 active:scale-95 transition-all cursor-pointer"
              id="print-invoice-button"
            >
              <Printer className="h-4 w-4 stroke-[3px]" />
              <span>{t.printReceipt}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
