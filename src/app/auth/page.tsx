'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SignUpForm } from './components/sign-up-form'
import { SignInForm } from './components/sign-in-form'
import { authClient } from '@/lib/auth-client'

export default function AuthenticationPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') || 'signin'

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: session } = await authClient.getSession()
        if (session?.user) {
          // Usuário já está logado, redirecionar para dashboard
          router.push('/dashboard')
          return
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Tabs defaultValue={defaultTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Entrar</TabsTrigger>
          <TabsTrigger value="register">Registrar</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignInForm />
        </TabsContent>
        <TabsContent value="register">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
