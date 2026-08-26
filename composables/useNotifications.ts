type ToastKind = "success" | "error" | "warning" | "info";

const toasts = ref<Array<{ id: number; message: string; kind: ToastKind; action?: () => void; actionLabel?: string }>>([]);
const confirmation = ref<{ message: string; title: string; resolve: (value: boolean) => void } | null>(null);
let toastId = 0;

export const useNotifications = () => {
  const notify = (message: string, kind: ToastKind = "info", options: { action?: () => void; actionLabel?: string; duration?: number } = {}) => {
    const id = ++toastId;
    toasts.value.push({ id, message, kind, action: options.action, actionLabel: options.actionLabel });
    window.setTimeout(() => dismiss(id), options.duration ?? (options.action ? 7000 : 4000));
  };
  const dismiss = (id: number) => { toasts.value = toasts.value.filter((item) => item.id !== id); };
  const ask = (message: string, title = "Konfirmasi tindakan") => new Promise<boolean>((resolve) => {
    confirmation.value = { message, title, resolve };
  });
  const answer = (value: boolean) => {
    confirmation.value?.resolve(value);
    confirmation.value = null;
  };
  return { toasts, confirmation, notify, dismiss, ask, answer };
};
