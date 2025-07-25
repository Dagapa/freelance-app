import { Metadata } from 'next'
import { ResetPasswordForm } from '@auth/components/reset-password-form'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Restablecer contraseña',
  description: 'Establece una nueva contraseña para tu cuenta',
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
