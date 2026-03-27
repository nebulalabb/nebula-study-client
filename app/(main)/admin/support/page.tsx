'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User,
  MoreVertical,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SupportRequest {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  title: string;
  category: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export default function AdminSupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const url = filterStatus ? `/admin/support?status=${filterStatus}` : '/admin/support';
      const { data } = await apiClient.get(url);
      setRequests(data.data.items);
    } catch (err) {
      console.error('Failed to fetch support requests:', err);
      toast.error('Không thể tải danh sách yêu cầu hỗ trợ');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await apiClient.patch(`/admin/support/${id}`, { 
        status: newStatus,
        admin_notes: adminNotes 
      });
      toast.success('Cập nhật trạng thái thành công');
      fetchRequests();
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (err) {
      console.error('Update support request error:', err);
      toast.error('Cập nhật thất bại');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 uppercase tracking-tighter">Chờ xử lý</span>;
      case 'in_progress':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold border border-blue-200 uppercase tracking-tighter">Đang xử lý</span>;
      case 'resolved':
        return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200 uppercase tracking-tighter">Đã giải quyết</span>;
      case 'closed':
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold border border-gray-200 uppercase tracking-tighter">Đã đóng</span>;
      default:
        return null;
    }
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      bug: 'Lỗi kỹ thuật',
      feature: 'Tính năng',
      account: 'Tài khoản',
      other: 'Khác'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-100 flex items-center gap-3">
            <MessageSquare className="text-indigo-600" size={32} />
            Yêu cầu hỗ trợ
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 font-medium">Quản lý và phản hồi các yêu cầu từ người dùng.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-4 h-11 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm transition-all cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-[2rem] border border-gray-100 dark:border-zinc-800 animate-pulse">
              <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
              <p className="text-gray-500 font-bold">Đang tải danh sách...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-[2rem] border border-dashed border-gray-200 dark:border-zinc-800">
              <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CheckCircle className="text-gray-300" size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-800 dark:text-zinc-200">Tuyệt vời!</h3>
              <p className="text-gray-500 font-medium">Không có yêu cầu nào cần xử lý lúc này.</p>
            </div>
          ) : (
            requests.map((req) => (
              <div 
                key={req.id}
                onClick={() => {
                  setSelectedRequest(req);
                  setAdminNotes(req.admin_notes || '');
                }}
                className={`p-6 bg-white dark:bg-zinc-900 rounded-[2rem] border-2 transition-all cursor-pointer hover:shadow-xl hover:shadow-indigo-500/5 ${
                  selectedRequest?.id === req.id 
                    ? 'border-indigo-500 shadow-lg shadow-indigo-500/10 scale-[1.01]' 
                    : 'border-transparent shadow-sm hover:border-gray-200 dark:hover:border-zinc-800'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black overflow-hidden ring-4 ring-white dark:ring-zinc-900 shadow-sm border border-indigo-100 dark:border-indigo-900/50">
                      {req.avatar_url ? (
                        <img src={req.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 dark:text-zinc-100 leading-tight">{req.full_name}</p>
                      <p className="text-xs text-gray-500 dark:text-zinc-500 font-medium">{req.email}</p>
                    </div>
                  </div>
                  {getStatusBadge(req.status)}
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-2">
                     <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400 rounded-md text-[10px] font-black uppercase tracking-wider border border-gray-200 dark:border-zinc-700">
                       {getCategoryLabel(req.category)}
                     </span>
                     <h3 className="text-lg font-black text-gray-800 dark:text-zinc-200 line-clamp-1">{req.title}</h3>
                   </div>
                   <p className="text-gray-600 dark:text-zinc-400 text-sm font-medium line-clamp-2 leading-relaxed italic border-l-4 border-indigo-100 dark:border-indigo-900/50 pl-4 bg-gray-50/50 dark:bg-zinc-800/30 py-1">
                     "{req.message}"
                   </p>
                   <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <Clock size={14} />
                        {format(new Date(req.created_at), 'HH:mm - dd MMMM, yyyy', { locale: vi })}
                      </div>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail/Action Column */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <div className="p-8 bg-white dark:bg-zinc-900 rounded-[2.5rem] border-2 border-gray-100 dark:border-zinc-800 shadow-xl shadow-indigo-500/5 space-y-8 min-h-[400px] flex flex-col">
              {selectedRequest ? (
                <>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Thông tin chi tiết</h4>
                      <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700">
                         <h2 className="text-xl font-black text-gray-800 dark:text-zinc-100 mb-2">{selectedRequest.title}</h2>
                         <p className="text-gray-600 dark:text-zinc-400 text-sm leading-relaxed overflow-auto max-h-[200px] font-medium whitespace-pre-wrap">
                           {selectedRequest.message}
                         </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Phản hồi & Trạng thái</h4>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Ghi chú phản hồi hoặc thông tin xử lý..."
                        className="w-full h-32 p-4 rounded-xl border-2 border-gray-100 dark:border-zinc-800 bg-transparent focus:border-indigo-500 outline-none transition-all text-sm font-medium dark:text-zinc-200"
                      />
                      
                      <div className="grid grid-cols-2 gap-3">
                         <Button 
                           variant="outline"
                           disabled={isUpdating || selectedRequest.status === 'in_progress'}
                           onClick={() => handleUpdateStatus(selectedRequest.id, 'in_progress')}
                           className="h-12 rounded-xl font-bold border-blue-200 text-blue-600 hover:bg-blue-50"
                         >
                           Đang xử lý
                         </Button>
                         <Button 
                           disabled={isUpdating}
                           onClick={() => handleUpdateStatus(selectedRequest.id, 'resolved')}
                           className="h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                         >
                           Đã giải quyết
                         </Button>
                         <Button 
                           variant="outline"
                           disabled={isUpdating}
                           onClick={() => handleUpdateStatus(selectedRequest.id, 'closed')}
                           className="h-12 rounded-xl font-bold border-gray-200 text-gray-500 col-span-2"
                         >
                           Đóng yêu cầu
                         </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-500">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-xl font-black text-gray-800 dark:text-zinc-200">Cập nhật yêu cầu</h3>
                  <p className="text-gray-500 font-medium text-sm px-6">Chọn một yêu cầu hỗ trợ từ danh sách bên trái để bắt đầu xử lý.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
