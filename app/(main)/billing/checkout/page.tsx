'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ShieldCheck, 
  ChevronRight, 
  CreditCard, 
  Zap, 
  Sparkles, 
  Lock,
  Globe,
  Loader2,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  const [plan, setPlan] = useState<any>(null);
  const [gateway, setGateway] = useState('manual');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bankTransferSent, setBankTransferSent] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  useEffect(() => {
    if (!planId) return;

    // Fetch Plan
    apiClient.get('/billing/plans').then(res => {
      const p = res.data.data.plans.find((x: any) => x.id === planId);
      if (p) setPlan(p);
      setIsLoading(false);
    });

    // Check for existing pending manual payment
    apiClient.get('/billing/pending', { params: { plan_id: planId } }).then(res => {
      if (res.data.data.pending) {
        setBankTransferSent(true);
      }
    });

  }, [planId]);

  const handlePay = async () => {
    if (!plan) return;

    if (gateway === 'manual') {
      setIsSubmitting(true);
      try {
        await apiClient.post('/billing/subscribe', {
          plan_id: plan.id,
          gateway: 'manual',
          return_url: ''
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
        setBankTransferSent(true);
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await apiClient.post('/billing/subscribe', {
        plan_id: plan.id,
        gateway,
        return_url: `${window.location.origin}/billing/vnpay_return`
      });
      if (data.data.checkout_url) {
        window.location.href = data.data.checkout_url;
      }
    } catch (err) {
      console.error('Lỗi thanh toán:', err);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="animate-spin text-orange-500 mb-4 inline-block"><Loader2 size={48} /></div>
          <p className="text-orange-900 font-black text-lg animate-pulse">Đang chuẩn bị đơn hàng của bạn... ✨</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-[3.5rem] border-4 border-orange-100 text-center max-w-md shadow-xl">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6"><Zap size={40} /></div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Ối! Gói cước không tồn tại</h2>
          <p className="text-gray-500 font-bold mb-8">Có vẻ như gói cước bạn chọn không hợp lệ hoặc đã hết hạn.</p>
          <Link href="/billing/upgrade">
            <Button className="rounded-2xl h-12 px-8 font-black bg-orange-500 text-white shadow-lg">Quay lại bảng giá</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price_vnd);
  const isBankTransfer = gateway === 'manual';

  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24 selection:bg-orange-200 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-100/30 rounded-full blur-3xl -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-100/20 rounded-full blur-3xl -mr-40 -mb-40" />

      <div className="max-w-6xl mx-auto px-6 pt-20 relative z-10 space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/billing/upgrade" className="inline-flex items-center gap-2 text-sm font-black text-orange-500 hover:translate-x-[-4px] transition-transform">
              <ArrowLeft size={16} strokeWidth={3} /> Quay lại
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-none">
              Sẵn sàng bứt phá <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500">Cùng Nebula Premium</span>
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-3 px-6 py-4 bg-white/50 backdrop-blur-sm rounded-3xl border-2 border-orange-100 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-500"><ShieldCheck size={20} /></div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Thanh toán an toàn</p>
              <p className="text-sm font-bold text-gray-700">Mã hoá 256-bit SSL</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* LEFT: PAYMENT METHODS */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500"><CreditCard size={20} /></div>
                Phương thức thanh toán
              </h2>
              <p className="text-gray-400 font-bold pl-14">Hỗ trợ tất cả thẻ nội địa và QR Pay nhanh chóng.</p>
            </div>

            <div className="grid gap-4">
              {/* Bank Transfer Card — PRIMARY */}
              <button
                onClick={() => setGateway('bank_transfer')}
                className={`group w-full flex items-center justify-between p-8 rounded-[2.5rem] border-4 transition-all ${isBankTransfer ? 'bg-white border-emerald-400 shadow-2xl shadow-emerald-500/10' : 'bg-white/40 border-orange-50 hover:bg-white hover:border-orange-200'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 bg-[#FFF9F5] border-2 border-white rounded-[1.75rem] shadow-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform ${isBankTransfer ? 'ring-4 ring-emerald-100' : ''}`}>
                    <img src="https://images.seeklogo.com/logo-png/47/1/mb-bank-logo-png_seeklogo-477159.png" alt="MB Bank" className="w-full h-auto object-contain" />
                  </div>
                  <div className="text-left">
                    <p className={`font-black text-xl leading-none mb-1 ${isBankTransfer ? 'text-gray-900' : 'text-gray-400'}`}>Chuyển khoản</p>
                    <p className="text-sm font-bold text-gray-400">MB Bank • Kích hoạt thủ công</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors ${isBankTransfer ? 'border-emerald-500 bg-emerald-500' : 'border-orange-100 bg-white'}`}>
                  {isBankTransfer && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
              </button>

              {/* Bank Details */}
              {isBankTransfer && (
                <div className="bg-emerald-50 border-4 border-emerald-100 rounded-[2rem] p-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                    <span>🏦</span> Quét QR để chuyển khoản ngay
                  </p>
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-white rounded-[1.5rem] border-4 border-emerald-100 p-4 shadow-lg">
                      <img
                        src={`https://img.vietqr.io/image/970422-01919102003-compact2.png?amount=${plan.price_vnd}&addInfo=NEBULA%20${(planId || 'PREMIUM').toUpperCase()}&accountName=NGUYEN%20HOANG%20KHA`}
                        alt="QR Chuyển khoản MB Bank"
                        className="w-52 h-52 object-contain"
                      />
                    </div>
                    <p className="text-xs font-bold text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full">Quét bằng app ngân hàng bất kỳ 📱</p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Ngân hàng', value: 'MB Bank', copyable: false },
                      { label: 'Số tài khoản', value: '01919102003', copyable: true },
                      { label: 'Chủ tài khoản', value: 'NGUYEN HOANG KHA', copyable: false },
                      { label: 'Số tiền', value: formatPrice, copyable: false },
                      { label: 'Nội dung CK', value: `NEBULA ${(planId || 'PREMIUM').toUpperCase()}`, copyable: true },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-gray-400 shrink-0 w-28">{item.label}</span>
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <span className="font-black text-gray-800 text-sm text-right">{item.value}</span>
                          {item.copyable && (
                            <button
                              type="button"
                              onClick={() => copyToClipboard(item.value, item.label)}
                              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 transition-all text-xs font-black shadow-sm ${
                                copiedField === item.label
                                  ? 'bg-emerald-500 border-emerald-500 text-white translate-y-[-2px]'
                                  : 'bg-white border-emerald-100 text-emerald-500 hover:bg-emerald-50 hover:border-emerald-200'
                              }`}
                            >
                              {copiedField === item.label ? (
                                <>
                                  <Check size={12} strokeWidth={4} />
                                  <span>Đã copy!</span>
                                </>
                              ) : (
                                <span>Copy</span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t-2 border-dashed border-emerald-200 pt-4">
                    <p className="text-xs font-bold text-amber-600 bg-amber-50 rounded-xl p-3 border-2 border-amber-100">
                      ⚠️ Sau khi chuyển khoản, Admin sẽ xác minh và kích hoạt Premium trong vòng <strong>1–6 giờ</strong>. Nhớ ghi đúng nội dung chuyển khoản nhé!
                    </p>
                  </div>
                </div>
              )}

              {/* VNPay Card */}
              <button
                onClick={() => setGateway('vnpay')}
                className={`group w-full flex items-center justify-between p-8 rounded-[2.5rem] border-4 transition-all ${gateway === 'vnpay' ? 'bg-white border-orange-400 shadow-2xl shadow-orange-500/10' : 'bg-white/40 border-orange-50 hover:bg-white hover:border-orange-200'}`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 bg-[#FFF9F5] border-2 border-white rounded-[1.75rem] shadow-lg flex items-center justify-center p-3 group-hover:scale-105 transition-transform ${gateway === 'vnpay' ? 'ring-4 ring-orange-100' : ''}`}>
                    <img src="https://static.cdnlogo.com/logos/v/92/vnpay_800.png" alt="VNPay" className="w-full h-auto object-contain" />
                  </div>
                  <div className="text-left">
                    <p className={`font-black text-xl leading-none mb-1 ${gateway === 'vnpay' ? 'text-gray-900' : 'text-gray-400'}`}>VNPay</p>
                    <p className="text-sm font-bold text-gray-400">ATM / QR Pay / Visa / Master</p>
                  </div>
                </div>
                <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-colors ${gateway === 'vnpay' ? 'border-orange-500 bg-orange-500' : 'border-orange-100 bg-white'}`}>
                  {gateway === 'vnpay' && <div className="w-3 h-3 bg-white rounded-full" />}
                </div>
              </button>
            </div>

            {/* Safety Badges (Mobile) */}
            <div className="lg:hidden grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex items-center gap-3">
                <Lock size={20} className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-700 uppercase">Mã hoá an toàn</span>
              </div>
              <div className="p-4 bg-sky-50 rounded-2xl border-2 border-sky-100 flex items-center gap-3">
                <Globe size={20} className="text-sky-500" />
                <span className="text-[10px] font-black text-sky-700 uppercase">Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <aside className="sticky top-24">
            <div className="bg-white rounded-[3rem] border-4 border-orange-50 p-10 shadow-2xl shadow-orange-500/5 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 rotate-12 text-orange-100 pointer-events-none">
                <Sparkles size={100} />
              </div>

              <div className="space-y-1 relative z-10">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Chi tiết đơn hàng</h3>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-sky-50 rounded-xl w-fit">
                  <Zap size={14} className="text-sky-500" />
                  <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest">
                    {isBankTransfer ? 'Kích hoạt sau xác minh' : 'Kích hoạt ngay lập tức'}
                  </span>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center group">
                  <div className="space-y-0.5">
                    <p className="font-black text-gray-800">{plan.display_name}</p>
                    <p className="text-xs font-bold text-gray-400 capitalize">Gói {plan.billing_cycle === 'monthly' ? 'Tháng' : 'Năm'}</p>
                  </div>
                  <p className="text-xl font-black text-gray-900 group-hover:text-orange-500 transition-colors">{formatPrice}</p>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="font-bold text-gray-400">Thuế GTGT (VAT)</p>
                  <p className="font-bold text-emerald-500">0 ₫ <span className="text-[10px] text-emerald-400 uppercase">(Free)</span></p>
                </div>
                <div className="h-0 border-t-2 border-dashed border-orange-100" />
                <div className="flex justify-between items-end">
                  <p className="text-lg font-black text-gray-400 mb-1">Tổng cộng:</p>
                  <p className="text-4xl font-black text-orange-500 drop-shadow-sm">{formatPrice}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-6 relative z-10 pt-4">
                {bankTransferSent ? (
                  <div className="bg-emerald-50 border-4 border-emerald-100 rounded-[2rem] p-6 text-center space-y-3">
                    <p className="text-3xl">🎉</p>
                    <p className="font-black text-emerald-700 text-lg">Đã ghi nhận!</p>
                    <p className="text-sm font-bold text-gray-500">Admin sẽ kích hoạt Premium trong 1–6 giờ sau khi xác minh giao dịch.</p>
                  </div>
                ) : (
                  <Button
                    onClick={handlePay}
                    disabled={isSubmitting}
                    className={`w-full h-16 rounded-[1.5rem] font-black text-xl shadow-xl text-white flex items-center justify-center gap-4 transition-all active:scale-95 ${
                      isBankTransfer
                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                        : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : isBankTransfer ? (
                      <>Tôi đã chuyển khoản ✓</>
                    ) : (
                      <>Thanh toán ngay <ChevronRight size={24} strokeWidth={3} /></>
                    )}
                  </Button>
                )}

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                    <ShieldCheck size={14} strokeWidth={3} /> Bảo vệ quyền lợi người dùng 100%
                  </div>
                  <div className="p-4 bg-[#FFF9F5] rounded-2xl border-2 border-orange-100 flex items-center justify-center gap-4 w-full opacity-60">
                    {isBankTransfer ? (
                      <img src="https://images.seeklogo.com/logo-png/47/1/mb-bank-logo-png_seeklogo-477159.png" alt="MB Bank" className="h-12 w-auto grayscale" />
                    ) : (
                      <img src="https://static.cdnlogo.com/logos/v/92/vnpay_800.png" alt="VNPay" className="h-12 w-auto grayscale" />
                    )}
                    <span className="text-gray-300">|</span>
                    <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">Verified Payment Portal</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="pt-20 text-center space-y-4 opacity-40">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.6em]">NebulaStudy Secure Cloud ✨</p>
        </footer>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center text-orange-400 font-bold animate-pulse">
        Đang gói quà đơn hàng của bạn... 🎁
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
