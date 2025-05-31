'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  role?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { data: result, error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        toast.error('E-mail ou senha incorretos')
        return false
      }

      if (result) {
        setUser(result.user as User)
        toast.success(`Bem-vindo(a), ${result.user.name}!`)
        return true
      }
      return false
    } catch (err) {
      console.error('Erro no login:', err)
      toast.error('Erro interno do servidor. Tente novamente.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { data: result, error } = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Erro ao criar conta')
        return false
      }

      if (result) {
        setUser(result.user as User)
        toast.success(
          `Conta criada com sucesso! Bem-vindo(a), ${result.user.name}!`
        )
        return true
      }
      return false
    } catch (err) {
      console.error('Erro no registro:', err)
      toast.error('Erro interno do servidor. Tente novamente.')
      return false
    } finally {
      setIsLoading(false)
    }
  }
  const logout = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.error('Erro ao fazer logout. Tente novamente.')
        return false
      }

      setUser(null)
      toast.success('Logout realizado com sucesso!')
      return true
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      toast.error('Erro ao fazer logout. Tente novamente.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
