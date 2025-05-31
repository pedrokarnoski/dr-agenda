'use client'

import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: session } = await authClient.getSession()
        if (session?.user) {
          setUser(session.user as User)
        }
      } catch (error) {
        console.error('Erro ao buscar sessão:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()
  }, [])

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push('/auth')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-center">
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Sair
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo!</CardTitle>
          </CardHeader>
          <CardContent>
            {user && (
              <div className="space-y-2">
                <p>
                  <strong>Nome:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Email verificado:</strong>{' '}
                  {user.emailVerified ? 'Sim' : 'Não'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Consultas hoje: 0</p>
              <p>Pacientes ativos: 0</p>
              <p>Próximos agendamentos: 0</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline">
                Novo Agendamento
              </Button>
              <Button className="w-full" variant="outline">
                Cadastrar Paciente
              </Button>
              <Button className="w-full" variant="outline">
                Ver Agenda
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
