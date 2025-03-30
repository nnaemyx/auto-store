import { toast as sonnerToast } from "sonner";

enum ToastVariant {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}

type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

const variantStyles = {
  success:
    "bg-green-50 dark:bg-green-900 text-lg text-green-900 dark:text-green-100 border-green-200 dark:border-green-800",
  error:
    "bg-red-50 dark:bg-red-900 text-lg text-red-900 dark:text-red-100 border-red-200 dark:border-red-800",
  warning:
    "bg-yellow-50 dark:bg-yellow-900 text-lg text-yellow-900 dark:text-yellow-100 border-yellow-200 dark:border-yellow-800",
  info: "bg-blue-50 dark:bg-blue-900 text-lg text-blue-900 dark:text-blue-100 border-blue-200 dark:border-blue-800",
};

export function useToast() {
  const toast = ({ title, description, variant = ToastVariant.Info }: ToastProps) => {
    return sonnerToast(title, {
      description,
      className: variantStyles[variant],
    });
  };

  return { toast, ToastVariant };
}