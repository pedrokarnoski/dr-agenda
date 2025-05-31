'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: session } = await authClient.getSession()
        if (session?.user) {
          // Usuário logado, redirecionar para dashboard
          router.push('/dashboard')
        } else {
          // Usuário não logado, redirecionar para auth
          router.push('/auth')
        }
      } catch (error) {
        console.error('Erro ao verificar sessão:', error)
        // Em caso de erro, redirecionar para auth
        router.push('/auth')
      }
    }

    checkAuthAndRedirect()
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="animate-spin" />
      </div>
    </div>
  )
}
