'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Search, 
  Filter,
  CreditCard,
  User,
  Calendar,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchPayments = async () => {
    try {
      const res = await apiClient.get('/billing/admin/payments');
      setPayments(res.data.data.items);
    } catch (err) {
      console.error(err);
      toast.error('Không thể tải danh sách thanh toán');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await apiClient.post('/billing/approve', { payment_id: id });
      toast.success('Đã duyệt thanh toán thành công!');
      fetchPayments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi duyệt');
    }
  };

  const filteredPayments = payments.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch = p.user_name.toLowerCase().includes(search.toLowerCase()) || 
                         p.user_email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold ring-1 ring-emerald-200"><CheckCircle2 size={14} /> Hoàn tất</span>;
      case 'pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold ring-1 ring-amber-200"><Clock size={14} /> Chờ duyệt</span>;
      case 'failed':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold ring-1 ring-rose-200"><XCircle size={14} /> Thất bại</span>;
      default:
        return <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <CreditCard className="text-indigo-600" size={32} />
            Quản lý Thanh toán
          </h1>
          <p className="text-gray-500 font-medium mt-1">Theo dõi và phê duyệt các giao dịch đăng ký Premium.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl text-indigo-700 text-xs font-bold">
                <ShieldCheck size={16} />
                Admin Certified
            </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Chờ duyệt', value: payments.filter(p => p.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
          { label: 'Thành công', value: payments.filter(p => p.status === 'success').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
          { label: 'Tổng doanh thu', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payments.filter(p => p.status === 'success').reduce((acc, p) => acc + p.amount_vnd, 0)), color: 'text-indigo-600', bg: 'bg-indigo-50', icon: CreditCard },
          { label: 'Tổng số lệnh', value: payments.length, color: 'text-gray-600', bg: 'bg-gray-50', icon: Filter },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all group`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={stat.color} />
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-xs font-bold shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">→</div>
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color} mt-1`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-[2.5rem] border-2 border-gray-50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo tên học sinh, email..." 
            className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {['all', 'pending', 'success', 'failed'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                filter === s 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {s === 'all' ? 'Tất cả' : s === 'pending' ? 'Chờ duyệt' : s === 'success' ? 'Thành công' : 'Thất bại'}
            </button>
          ))}
        </div>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
            <Clock className="animate-spin" size={32} />
            <p className="font-bold">Đang tải dữ liệu...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-gray-400 gap-4">
            <AlertCircle size={48} strokeWidth={1.5} />
            <p className="font-bold italic">Không tìm thấy giao dịch nào phù hợp</p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div key={payment.id} className="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-sm hover:border-indigo-100 transition-all group overflow-hidden relative">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                
                {/* User & Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 shadow-inner">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{payment.user_name}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mt-1">
                      <span>{payment.user_email}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(payment.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {/* Amount & Gateway */}
                <div className="flex items-center gap-8 px-6 md:border-x border-gray-100">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Số tiền</p>
                    <p className="text-xl font-black text-gray-900">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount_vnd)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Cổng thanh toán</p>
                    <p className="text-sm font-black text-indigo-600 flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                      {payment.gateway === 'manual' ? 'Bank Transfer' : payment.gateway.toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  {getStatusBadge(payment.status)}
                  {payment.status === 'pending' && (
                    <Button 
                      onClick={() => handleApprove(payment.id)}
                      className="rounded-2xl h-11 px-6 font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                    >
                      Duyệt ngay <ChevronRight size={16} strokeWidth={3} />
                    </Button>
                  )}
                  {payment.status === 'success' && (
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm ring-1 ring-emerald-100">
                        <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
              </div>

              {/* Detail footer - internal code / note */}
              <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] font-bold">
                <div className="flex items-center gap-4 text-gray-400 italic">
                  <span>Mã GD: {payment.gateway_txn_id}</span>
                  <span>•</span>
                  <span>Gói: {payment.note?.replace('plan_id:', '') || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={12} /> Xem chi tiết người dùng
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
