/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationSet {
  title: string;
  subtitle: string;
  goldRateTitle: string;
  goldRateDesc: string;
  customRateLabel: string;
  ratePerVori: string;
  weightInputTitle: string;
  weightInputDesc: string;
  vori: string;
  ana: string;
  roti: string;
  point: string;
  realtimeResults: string;
  totalPoints: string;
  grams: string;
  rawGoldPrice: string;
  makingCharge: string;
  makingChargeType: string;
  makingChargeFixed: string;
  makingChargePerVori: string;
  vat: string;
  totalPrice: string;
  addToList: string;
  itemName: string;
  itemPlaceholder: string;
  itemListTitle: string;
  itemListDesc: string;
  noItemsYet: string;
  actions: string;
  delete: string;
  clearAll: string;
  grandTotal: string;
  totalW: string;
  invoiceTitle: string;
  invoiceSubtitle: string;
  invoiceNo: string;
  date: string;
  printReceipt: string;
  carat: string;
  traditional: string;
  calculatedValues: string;
  customPricePlaceholder: string;
  subTotal: string;
  bdt: string;
}

export const translations: Record<'BN' | 'EN', TranslationSet> = {
  BN: {
    title: 'স্বর্ণের দাম ক্যালকুলেটর',
    subtitle: 'বাংলাদেশী প্রচলিত পরিমাপ পদ্ধতিতে নিখুঁত ও রিয়েল-টাইম হিসাব',
    goldRateTitle: '১. প্রতি ভরি সোনার মূল্য নির্ধারণ',
    goldRateDesc: 'আজকের বাজার দর অনুযায়ী প্রতি ভরি স্বর্ণের দাম লিখুন (এটি রিয়েল-টাইমে হিসাব হবে)',
    customRateLabel: 'কাস্টম রেট (ভরি প্রতি মূল্য)',
    ratePerVori: 'প্রতি ভরি স্বর্ণের দাম (টাকা)',
    weightInputTitle: '২. স্বর্ণালঙ্কারের ওজন ইনপুট',
    weightInputDesc: 'ভরি, আনা, রতি এবং পয়েন্টে ওজন দিন (রিয়েল-টাইমে হিসাব হবে)',
    vori: 'ভরি',
    ana: 'আনা',
    roti: 'রতি',
    point: 'পয়েন্ট',
    realtimeResults: '৩. স্বর্ণের মূল্যের হিসাব বিবরণী',
    totalPoints: 'পয়েন্টে মোট ওজন',
    grams: 'গ্রামে ওজন (আন্তর্জাতিক)',
    rawGoldPrice: 'স্বর্ণের মূল দাম',
    makingCharge: 'মজুরি (মেকিং চার্জ)',
    makingChargeType: 'মজুরির ধরণ',
    makingChargeFixed: 'এককালীন ফিক্সড',
    makingChargePerVori: 'প্রতি ভরি হিসেবে',
    vat: 'ভ্যাট (সরকারি ট্যাক্স)',
    totalPrice: 'সর্বমোট গয়নার মূল্য',
    addToList: 'তালিকায় যুক্ত করুন',
    itemName: 'গয়নার নাম',
    itemPlaceholder: 'যেমন: চেইন, আংটি, বালা',
    itemListTitle: 'আজকের গয়নার ক্রয় তালিকা ও ইনভয়েস',
    itemListDesc: 'একাধিক অলঙ্কার একসঙ্গে যোগ করে সম্পূর্ণ ক্যাশ মেমো / বিল তৈরি করুন',
    noItemsYet: 'তালিকায় এখনও কোনো অলঙ্কার যুক্ত করা হয়নি। উপর থেকে হিসাব করে যুক্ত করুন।',
    actions: 'অ্যাকশন',
    delete: 'মুছে ফেলুন',
    clearAll: 'তালিকা খালি করুন',
    grandTotal: 'সর্বমোট প্রদেয় বিল',
    totalW: 'মোট ওজন',
    invoiceTitle: 'স্বর্ণালঙ্কার মেমো / অগ্রিম বিল',
    invoiceSubtitle: 'এটি একটি লাইভ ডিজিটাল ক্যালকুলেশন মেমো',
    invoiceNo: 'মেমো নং',
    date: 'তারিখ',
    printReceipt: 'রিসিট প্রিন্ট করুন',
    carat: 'ক্যারেট',
    traditional: 'সনাতন',
    calculatedValues: 'হিসাব বিবরণী',
    customPricePlaceholder: 'টাকার পরিমাণ লিখুন',
    subTotal: 'সাব টোটাল (অলঙ্কারের মোট মূল্য)',
    bdt: 'টাকা',
  },
  EN: {
    title: 'Gold Price Calculator',
    subtitle: 'Precise real-time gold pricing in traditional Bangladeshi units',
    goldRateTitle: '1. Set Gold Price per Vori',
    goldRateDesc: 'Enter the live market gold price per vori in BDT for real-time calculations',
    customRateLabel: 'Custom Rate (Price per Vori)',
    ratePerVori: 'Price Per Vori (BDT/Taka)',
    weightInputTitle: '2. Jewellery Weight Input',
    weightInputDesc: 'Provide weight in Vori, Ana, Roti, and Point for real-time rates',
    vori: 'Vori',
    ana: 'Ana',
    roti: 'Roti',
    point: 'Point',
    realtimeResults: '3. Real-time Calculation Details',
    totalPoints: 'Total weight in Points',
    grams: 'Weight in Grams (approx.)',
    rawGoldPrice: 'Raw Gold Value',
    makingCharge: 'Making Charge (Wages)',
    makingChargeType: 'Making Charge Type',
    makingChargeFixed: 'Flat / Fixed Charge',
    makingChargePerVori: 'Per Vori (Weight-based)',
    vat: 'Government VAT (Tax)',
    totalPrice: 'Jewellery Total Price',
    addToList: 'Add to Billing List',
    itemName: 'Jewellery Item Name',
    itemPlaceholder: 'e.g. Ring, Chain, Necklace',
    itemListTitle: 'Jewellery Purchase List & Invoice Builder',
    itemListDesc: 'Compile multiple jewellery pieces into a single itemized billing memo',
    noItemsYet: 'No items in the list. Fill the calculator above and click Add to List.',
    actions: 'Actions',
    delete: 'Delete',
    clearAll: 'Clear All',
    grandTotal: 'Grand Total Invoice Bill',
    totalW: 'Total Weight',
    invoiceTitle: 'Gold Jewellery Estimate Invoice',
    invoiceSubtitle: 'This is a live generated digital estimation slip',
    invoiceNo: 'Memo No',
    date: 'Date',
    printReceipt: 'Print Receipt & Bill',
    carat: 'Carat',
    traditional: 'Traditional',
    calculatedValues: 'Calculated Output',
    customPricePlaceholder: 'Enter Taka amount',
    subTotal: 'Subtotal (Sum of Items Price)',
    bdt: 'BDT',
  }
};
