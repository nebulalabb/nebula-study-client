'use client';

import React from 'react';
import { apiClient } from '@/lib/api-client';

interface QuotaModule {
  used: number;
  limit: number;
  remaining: number;
  reset_at: string;
  reset_type: 'daily' | 'monthly';
}

interface QuotaData {
  plan: string;
  modules: Record<string, QuotaModule>;
}

interface QuotaBadgeProps {
  module: string;
  label?: string;
  compact?: boolean;
}

// Shared quota cache across component instances (simple module-level cache)
let quotaCache: QuotaData | null = null;
let quotaCacheTime = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

async function fetchQuota(): Promise<QuotaData | null> {
  const now = Date.now();
  if (quotaCache && now - quotaCacheTime < CACHE_TTL_MS) {
    return quotaCache;
  }
  try {
    const { data } = await apiClient.get('/quota');
    quotaCache = data.data as QuotaData;
    quotaCacheTime = now;
    return quotaCache;
  } catch {
    return null;
  }
}

export function QuotaBadge({ module, label, compact = false }: QuotaBadgeProps) {
  const [quota, setQuota] = React.useState<QuotaModule | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchQuota().then((data) => {
      if (data?.modules[module]) {
        setQuota(data.modules[module]!);
      }
      setIsLoading(false);
    });
  }, [module]);

  if (isLoading) {
    return (
      <div className="h-5 w-20 bg-gray-100 dark:bg-zinc-800 rounded-full animate-pulse" />
    );
  }

  if (!quota) return null;

  const isUnlimited = quota.limit === -1;
  const percentage = isUnlimited ? 100 : Math.round((quota.remaining / quota.limit) * 100);
  const isLow = !isUnlimited && percentage <= 20;
  const isEmpty = !isUnlimited && quota.remaining === 0;

  const barColor = isEmpty
    ? 'bg-rose-500'
    : isLow
    ? 'bg-amber-500'
    : 'bg-orange-500';

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
        isEmpty
          ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20'
          : isLow
          ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20'
          : 'bg-orange-50 text-orange-600 dark:bg-orange-900/20'
      }`}>
        {isUnlimited ? '∞' : `${quota.remaining}/${quota.limit}`}
      </span>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        {label && <span className="text-gray-500 dark:text-zinc-400">{label}</span>}
        <span className={`font-semibold ml-auto ${isEmpty ? 'text-rose-500' : isLow ? 'text-amber-500' : 'text-gray-600 dark:text-zinc-400'}`}>
          {isUnlimited ? 'Không giới hạn' : isEmpty ? 'Hết lượt' : `${quota.remaining} còn lại`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

/** Invalidate the shared quota cache (call after consuming quota). */
export function invalidateQuotaCache() {
  quotaCache = null;
  quotaCacheTime = 0;
}
