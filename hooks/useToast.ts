import { toast } from 'sonner'

interface ToastMethods {
  success: (message: string, description?: string) => void
  error: (message: string, description?: string) => void
  warning: (message: string, description?: string) => void
  info: (message: string, description?: string) => void
  loading: (message: string) => string | number
  dismiss: (toastId?: string | number) => void
  promise: <T>(
    promise: Promise<T>,
    options: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => Promise<T>
}

export function useToast(): ToastMethods {
  return {
    success: (message: string, description?: string) => {
      toast.success(message, {
        description,
        duration: 4000,
      })
    },
    
    error: (message: string, description?: string) => {
      toast.error(message, {
        description,
        duration: 6000,
      })
    },
    
    warning: (message: string, description?: string) => {
      toast.warning(message, {
        description,
        duration: 5000,
      })
    },
    
    info: (message: string, description?: string) => {
      toast.info(message, {
        description,
        duration: 4000,
      })
    },
    
    loading: (message: string) => {
      return toast.loading(message)
    },
    
    dismiss: (toastId?: string | number) => {
      toast.dismiss(toastId)
    },
    
    promise: <T>(
      promise: Promise<T>,
      {
        loading,
        success,
        error,
      }: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: any) => string)
      }
    ): Promise<T> => {
      return toast.promise(promise, {
        loading,
        success,
        error,
      }) as unknown as Promise<T>
    },
  }
}
