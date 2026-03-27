'use client';

import { toast as sonnerToast } from 'sonner';
import { ToastNebula } from '@/components/ui/toast-nebula';

interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.custom(() => <ToastNebula message={message} type="success" action={options?.action} />, options);
  },
  error: (message: string, options?: ToastOptions) => {
    sonnerToast.custom(() => <ToastNebula message={message} type="error" action={options?.action} />, options);
  },
  info: (message: string, options?: ToastOptions) => {
    sonnerToast.custom(() => <ToastNebula message={message} type="info" action={options?.action} />, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.custom(() => <ToastNebula message={message} type="warning" action={options?.action} />, options);
  },
};
