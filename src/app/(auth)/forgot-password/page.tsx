import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form'

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
  description: 'Solicita un enlace para restablecer tu contraseña',
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
