'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@lib/supabase/client'
import { Button } from '@shared/ui/button'
import { Input } from '@shared/ui/input'
import { Label } from '@shared/ui/label'

export function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Verificar que el token esté presente en la URL
    const token = searchParams.get('token')
    if (!token) {
      setError('El enlace de restablecimiento no es válido o ha expirado')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirigir al inicio de sesión después de 3 segundos
      setTimeout(() => {
        router.push('/login?password-reset=success')
      }, 3000)
    } catch (error: any) {
      setError(error.message || 'Ocurrió un error al restablecer la contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Error</h1>
          <p className="text-destructive">{error}</p>
        </div>
        <Button onClick={() => router.push('/forgot-password')} className="mt-4">
          Volver a intentar
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">¡Contraseña actualizada!</h1>
          <p className="text-muted-foreground">
            Tu contraseña ha sido actualizada correctamente. Redirigiendo al inicio de sesión...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Restablecer contraseña</h1>
        <p className="text-muted-foreground mt-2">
          Ingresa tu nueva contraseña
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </Button>
      </form>
    </div>
  )
}
