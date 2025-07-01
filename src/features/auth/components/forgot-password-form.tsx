'use client'

import { useState } from 'react'
import { Label } from '@shared/ui/label'
import { Input } from '@shared/ui/input'
import { useRouter } from 'next/navigation'
import { Button } from '@shared/ui/button'
import { useToast } from '@shared/ui/toast'
import { createClient } from '@lib/supabase/client'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setEmailSent(true)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error al enviar el correo',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Revisa tu correo</h1>
          <p className="text-muted-foreground">
            Te hemos enviado un enlace para restablecer tu contraseña a{' '}
            <span className="font-medium">{email}</span>.
          </p>
        </div>
        <Button onClick={() => router.push('/login')} className="mt-4">
          Volver al inicio de sesión
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">¿Olvidaste tu contraseña?</h1>
        <p className="text-muted-foreground mt-2">
          Te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <a href="/login" className="font-medium text-primary hover:underline">
          Volver al inicio de sesión
        </a>
      </p>
    </div>
  )
}
