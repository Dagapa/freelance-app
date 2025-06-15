import { Metadata } from 'next'
import { SignupForm } from '@/features/auth/components/signup-form'

export const metadata: Metadata = {
  title: 'Registro',
  description: 'Crea una cuenta en Freelance Finance',
}

export default function SignupPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <SignupForm />
      </div>
    </div>
  )
}
