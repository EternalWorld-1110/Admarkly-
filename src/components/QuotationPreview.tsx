import { useState } from "react";
import { CarKey, Variant } from "../types";
import { CARS, fmt, getFeatures, getVideo, DEALER } from "../data/cars";
import { Copy, Send, RotateCcw, Flame, CheckCircle, Video, List, FileText, Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface QuotationPreviewProps {
  customerName: string;
  customerPhone: string;
  carKey: CarKey;
  fuelType: string;
  variant: Variant;
  discount: string;
  discountLabel: string;
  note: string;
  onReset: () => void;
  // Feature 3: Selected Car Color Shade
  selectedColor?: { name: string; hex: string };
  // Feature 5: Selected Accessories checklist from parent State
  selectedAccessories?: Array<{ name: string; price: number }>;
  // Feature 1: Finance Estimates state variables
  includeFinance?: boolean;
  financeTenure?: number;
  financeDownpayment?: number;
  financeRate?: number;
  rtoType?: "standard" | "bh";
  effectiveRto?: number;
}

export default function QuotationPreview({
  customerName,
  customerPhone,
  carKey,
  fuelType,
  variant,
  discount,
  discountLabel,
  note,
  onReset,
  selectedColor,
  selectedAccessories = [],
  includeFinance = false,
  financeTenure = 5,
  financeDownpayment = 0,
  financeRate = 8.75,
  rtoType = "standard",
  effectiveRto,
}: QuotationPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"invoice" | "raw">("invoice");

  const car = CARS[carKey];
  const discNum = Number(discount) || 0;
  
  // Calculate total accessories amount
  const accessoriesTotal = selectedAccessories.reduce((sum, item) => sum + item.price, 0);

  // Use dynamic RTO tax if provided
  const rtoCharge = effectiveRto !== undefined ? effectiveRto : variant.rto;
  const computedOnRoad = variant.ex + variant.ins + rtoCharge + variant.tcs;
  
  // Compute true final price with selected genuine accessories and discount
  const finalPrice = computedOnRoad + accessoriesTotal - discNum;
  
  // Custom Dynamic Color Accent of headers/borders matching the selected color shade!
  const accent = selectedColor?.hex || car.color;

  const keyFeatures = getFeatures(carKey, variant.name);
  const videoUrl = getVideo(carKey, variant.name);
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Calculate Monthly EMI math (standard fixed rate formula)
  const loanPrincipal = Math.max(0, finalPrice - financeDownpayment);
  const monthlyRate = (financeRate / 100) / 12;
  const totalMonths = financeTenure * 12;
  const monthlyEMI = loanPrincipal > 0 && monthlyRate > 0
    ? (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : loanPrincipal / Math.max(1, totalMonths);

  const generateRawWhatsAppText = () => {
    let message = `🚗 *TATA MOTORS — PRICE QUOTATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 *Date:* ${currentDate}
👤 *Customer:* ${customerName}${customerPhone ? `\n📞 *Phone:* ${customerPhone}` : ""}
🚙 *Model:* ${car.label}`;

    if (selectedColor) {
      message += `\n🎨 *Color shade:* ${selectedColor.name}`;
    }

    message += `
⚙️ *Type:* ${fuelType}
📋 *Variant:* *${variant.name}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 *PRICE BREAKDOWN*
• Ex-Showroom:             ${fmt(variant.ex)}
• Insurance (Nil Dep):    ${fmt(variant.ins)}
• RTO Tax & Charges:   ${fmt(rtoCharge)} ${rtoType === "bh" ? "(BH Series 2-Yr)" : ""}${variant.tcs > 0 ? `\n• TCS:                          ${fmt(variant.tcs)}` : ""}`;

    if (selectedAccessories.length > 0) {
      message += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n➕ *GENUINE ADDONS & ACCESSORIES*`;
      selectedAccessories.forEach((item) => {
        message += `\n• ${item.name}: ${fmt(item.price)}`;
      });
      message += `\n• Accessories Subtotal:    ${fmt(accessoriesTotal)}`;
    }

    message += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ *On Road Standard: ${fmt(computedOnRoad)}*`;

    if (accessoriesTotal > 0) {
      message += `\n➕ *Accessories pack: ${fmt(accessoriesTotal)}*`;
    }

    if (discNum > 0) {
      message += `\n🎁 *${discountLabel}:  -${fmt(discNum)}*`;
    }

    message += `\n💥 *Net Payable Amount:  ${fmt(finalPrice)}*`;

    if (includeFinance && loanPrincipal > 0) {
      message += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏦 *FINANCE ESTIMATOR (Indicative)*
• Proposed Tenure:         ${financeTenure} Years (${totalMonths} months)
• margin Down Payment:    ${fmt(financeDownpayment)}
• Principal Loan Amount:   ${fmt(loanPrincipal)}
• Interest Rate:          ${financeRate}% p.a.
• *Estimated Monthly EMI: ${fmt(Math.round(monthlyEMI))}/month*`;
    }

    message += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 *Watch Car Video:*
${videoUrl}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⭐ *KEY FEATURES — ${variant.name}*
${keyFeatures.map((f, i) => `${i + 1}. ${f}`).join("\n")}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━${note ? `\n📝 *Note:* ${note}\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━` : ""}
📍 *${DEALER.name}*
🗺️ ${DEALER.locations}
📞 *${DEALER.contact}*

_Valid 7 days. Prices subject to change at billing._
_🔑 Book today & drive your dream Tata!_`;

    return message;
  };

  const copyToClipboard = () => {
    const rawText = generateRawWhatsAppText();
    const fallbackCopy = () => {
      const ta = document.createElement("textarea");
      ta.value = rawText;
      ta.style.cssText = "position:fixed;opacity:0;";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error("Could not copy", err);
      }
      document.body.removeChild(ta);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(rawText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => fallbackCopy());
    } else {
      fallbackCopy();
    }
  };

  const cleanPhoneForUrl = customerPhone.replace(/\D/g, "");
  const formattedPhoneForUrl = cleanPhoneForUrl.startsWith("91") ? cleanPhoneForUrl : "91" + cleanPhoneForUrl.slice(-10);
  const textMsgForUrl = encodeURIComponent(generateRawWhatsAppText());
  const whatsappDirectUrl = `https://wa.me/${formattedPhoneForUrl}?text=${textMsgForUrl}`;
  const whatsappGeneralUrl = `https://wa.me/?text=${textMsgForUrl}`;

  const sendWhatsAppDirect = () => {
    window.open(whatsappDirectUrl, "_blank");
  };

  const sendWhatsAppGeneral = () => {
    window.open(whatsappGeneralUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Display View Toggle */}
      <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900">
        <button
          onClick={() => setViewMode("invoice")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewMode === "invoice"
              ? "bg-zinc-900 text-white shadow-md shadow-black/30 border border-zinc-800"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Luxury Invoice Mockup
        </button>
        <button
          onClick={() => setViewMode("raw")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            viewMode === "raw"
              ? "bg-zinc-900 text-white shadow-md shadow-black/30 border border-zinc-800"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <List className="w-3.5 h-3.5" />
          WhatsApp RAW String
        </button>
      </div>

      {viewMode === "invoice" ? (
        /* invoice visual receipt style component */
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl relative">
          
          {/* Header Colored Stamp Brand with Custom Selected Accent Background */}
          <div
            className="p-6 flex items-center justify-between text-white relative transition-all duration-300 overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            }}
          >
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-black/25 px-2.5 py-0.5 rounded-full inline-block mb-1.5 backdrop-blur-sm">
                Official Estimate
              </span>
              <h2 className="font-display font-black text-xl tracking-wide">
                TATA MOTORS ESTIMATE
              </h2>
              <p className="text-xs text-white/80 font-medium tracking-wide mt-1">
                Prepared by {DEALER.name}
              </p>
            </div>
            <div className="text-4xl filter drop-shadow">{car.emoji}</div>
          </div>

          <div className="p-6 space-y-6">
            {/* Meta row cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Customer Name
                </span>
                <span className="font-semibold text-sm text-zinc-200 mt-0.5 block truncate">
                  {customerName}
                </span>
              </div>
              <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850">
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block font-bold">
                  Vehicle Model Color
                </span>
                <span
                  className="font-bold text-sm mt-0.5 block truncate uppercase tracking-tight"
                  style={{ color: accent }}
                >
                  {selectedColor ? selectedColor.name : "Showroom Default"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {customerPhone && (
                <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">
                    Contact Phone
                  </span>
                  <span className="font-mono text-xs font-semibold text-zinc-300 mt-0.5 block">
                    +91 {customerPhone.replace(/\D/g, "").slice(-10)}
                  </span>
                </div>
              )}
              <div
                className={`bg-zinc-950/40 p-3 rounded-xl border border-zinc-850 ${
                  !customerPhone ? "col-span-2" : ""
                }`}
              >
                <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">
                  Variant Spec & Trans
                </span>
                <span className="font-medium text-xs text-zinc-300 mt-0.5 block truncate">
                  {variant.name} • {fuelType}
                </span>
              </div>
            </div>

            {/* Price section lines */}
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                  Detailed Pricing Itemization
                </h4>
              </div>
              <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-850/60 divide-y divide-zinc-900 animate-fadeIn">
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-zinc-400">Ex-Showroom Price</span>
                  <span className="font-mono text-zinc-200">{fmt(variant.ex)}</span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-zinc-400">Insurance Policy (Nil Depreciation)</span>
                  <span className="font-mono text-zinc-200">{fmt(variant.ins)}</span>
                </div>
                <div className="flex justify-between py-2 text-xs">
                  <span className="text-zinc-400 flex items-center gap-1.5 flex-wrap">
                    RTO Registration Tax & Charges
                    {rtoType === "bh" && (
                      <span className="bg-amber-500/20 text-amber-400 font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 animate-pulse">
                        BH Series (2-Yr)
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-zinc-200">{fmt(rtoCharge)}</span>
                </div>
                {variant.tcs > 0 && (
                  <div className="flex justify-between py-2 text-xs">
                    <span className="text-zinc-400">Tax Collected at Source (TCS)</span>
                    <span className="font-mono text-zinc-200">{fmt(variant.tcs)}</span>
                  </div>
                )}
                
                {/* Genuine Accessories Premium section if added */}
                {selectedAccessories.length > 0 && (
                  <div className="py-2.5 space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-semibold">
                      ➕ Genuine Addons & Accessories Subtotal
                    </span>
                    <div className="space-y-1 pl-2">
                      {selectedAccessories.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-[11px] text-zinc-400">
                          <span>{item.name}</span>
                          <span className="font-mono">{fmt(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between pt-3 pb-1">
                  <span className="font-bold text-xs text-zinc-400">Gross Vehicle Valuation</span>
                  <span className="font-mono font-extrabold text-sm text-zinc-200">
                    {fmt(computedOnRoad + accessoriesTotal)}
                  </span>
                </div>

                {discNum > 0 && (
                  <div className="flex justify-between py-2.5 text-xs text-emerald-500">
                    <span className="font-medium">🎁 Applied Offer ({discountLabel})</span>
                    <span className="font-mono font-bold">-{fmt(discNum)}</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 pb-1 border-t border-zinc-850">
                  <span className="font-display font-extrabold text-sm text-emerald-400">
                    Final Net Payable Total
                  </span>
                  <span className="font-mono font-black text-base text-emerald-400">
                    {fmt(finalPrice)}
                  </span>
                </div>
              </div>
            </div>

            {/* Feature 1: EMI Finance Plan box summary inside Luxury Invoice if ticked */}
            {includeFinance && loanPrincipal > 0 && (
              <div 
                className="bg-zinc-950/80 rounded-2xl p-4 border transition-all duration-300"
                style={{ borderColor: `${accent}25` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-2 w-2 rounded-full relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accent }}></span>
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: accent }}></span>
                  </span>
                  <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-zinc-400">
                    🏦 Indicative Finance Scheme Estimator
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850">
                    <span className="text-[9px] text-zinc-500 block uppercase tracking-wider font-mono">Down Payment</span>
                    <span className="text-xs font-mono font-bold text-zinc-300 block mt-0.5">{fmt(financeDownpayment)}</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850">
                    <span className="text-[9px] text-zinc-500 block uppercase tracking-wider font-mono">Loan Amount</span>
                    <span className="text-xs font-mono font-bold text-zinc-300 block mt-0.5">{fmt(loanPrincipal)}</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850">
                    <span className="text-[9px] text-zinc-500 block uppercase tracking-wider font-mono">Tenure Range</span>
                    <span className="text-xs font-bold text-zinc-300 block mt-0.5">{financeTenure} Yrs ({totalMonths} Mos)</span>
                  </div>
                  <div className="p-2.5 bg-zinc-900/60 rounded-xl border border-zinc-850">
                    <span className="text-[9px] text-zinc-500 block uppercase tracking-wider font-mono">Annual Rate</span>
                    <span className="text-xs font-mono font-bold text-zinc-300 block mt-0.5">{financeRate}% p.a.</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-900/90 rounded-xl border border-zinc-800">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Estimated Monthly EMI</span>
                    <span className="text-[10px] text-zinc-400">Fixed monthly installment</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-mono font-black" style={{ color: accent }}>
                      {fmt(Math.round(monthlyEMI))}
                    </span>
                    <span className="text-[10px] text-zinc-500 block font-mono">per month</span>
                  </div>
                </div>
              </div>
            )}

            {/* Video walkthrough feature */}
            <div className="bg-zinc-950 rounded-xl p-4 border border-rose-500/10 flex gap-3.5 items-start">
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  Walkaround video walkthrough
                </p>
                <p className="text-xs text-zinc-400 text-left">
                  Buyers are 3.5× more likely to purchased with video orientation. Direct link:
                </p>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-xs font-semibold text-red-400 hover:text-red-300 underline pt-1"
                >
                  Watch Walkaround Video &rarr;
                </a>
              </div>
            </div>

            {/* Key Brochure Premium Specs list */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
                  Key Technical Features & Highlights
                </h4>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {keyFeatures.map((feat, index) => (
                  <div
                    key={index}
                    className="flex gap-2.5 text-xs bg-zinc-950/25 p-2 rounded-lg border border-zinc-850/40 text-zinc-300"
                  >
                    <span className="text-zinc-500 font-mono select-none">{String(index + 1).padStart(2, "0")}</span>
                    <span className="leading-normal">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {note && (
              <div className="bg-zinc-950/80 border border-zinc-850 rounded-xl p-4 text-xs space-y-1">
                <h5 className="font-semibold text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                  Dealer Coordinator Note
                </h5>
                <p className="text-zinc-300 italic">"{note}"</p>
              </div>
            )}

            {/* Dealer Footer */}
            <div className="text-center pt-4 border-t border-zinc-850">
              <p className="text-xs font-semibold text-zinc-400 tracking-wide">
                📍 {DEALER.name}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">
                {DEALER.locations} • Tel: {DEALER.contact}
              </p>
              <p className="text-[9px] text-zinc-600 font-mono mt-3">
                Valid for 7 business days from generation. Price subject to modifications on billing date.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* raw whatsapp message review box */
        <div className="bg-zinc-950 border border-zinc-850 rounded-xl p-4 font-mono text-xs text-zinc-400 space-y-2 relative overflow-hidden select-text">
          <div className="absolute right-3 top-3 text-[10px] bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full uppercase font-mono">
            plain text output
          </div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold border-b border-zinc-900 pb-2 mb-3">
            Simulated WhatsApp Plain Text Preview
          </p>
          <pre className="whitespace-pre-wrap max-h-[500px] overflow-y-auto pr-2 leading-relaxed text-zinc-300 font-mono select-text">
            {generateRawWhatsAppText()}
          </pre>
        </div>
      )}

      {/* Primary Action Row Panels */}
      <div className="space-y-3">
        {customerPhone.replace(/\D/g, "").length >= 10 ? (
          <a
            href={whatsappDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white px-5 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-200 shadow-lg shadow-emerald-950/20 cursor-pointer no-underline select-none"
          >
            <Send className="w-5 h-5" />
            <div className="text-left leading-tight">
              <span className="block text-sm font-semibold">Send to Customer WhatsApp</span>
              <span className="block text-[11px] font-normal text-emerald-200">
                Configured with Phone: +91 {customerPhone.replace(/\D/g, "").slice(-10)}
              </span>
            </div>
          </a>
        ) : (
          <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-850/60 text-center text-xs text-zinc-500">
            ℹ️ Add a 10-digit WhatsApp number on the configuration form to unlock direct message transmission.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3.5">
          <a
            href={whatsappGeneralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 py-3 rounded-xl font-semibold text-xs text-zinc-200 cursor-pointer flex items-center justify-center gap-2 transition-all text-center justify-center items-center no-underline select-none"
          >
            <Send className="w-3.5 h-3.5 text-zinc-400" />
            Open Contact List
          </a>

          <button
            onClick={copyToClipboard}
            className={`py-3 rounded-xl font-bold text-xs cursor-pointer flex items-center justify-center gap-2 transition-all ${
              copied
                ? "bg-emerald-950/40 border border-emerald-900/60 text-emerald-400"
                : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-200"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                Copied Quote!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                Copy Plain Text
              </>
            )}
          </button>
        </div>

        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-zinc-800/80 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950/60 transition-all font-semibold text-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Create New Valuation Quote
        </button>
      </div>
    </div>
  );
}
