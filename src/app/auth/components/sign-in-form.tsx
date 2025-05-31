'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SocialLoginButtons } from '@/components/ui/social-login-buttons'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'

const signInSchema = z.object({
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().trim().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export function SignInForm() {
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function handleSubmit(data: z.infer<typeof signInSchema>) {
    try {
      const success = await login(data.email, data.password)
      if (success) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      toast.error(
        'Problema ao fazer login. Verifique suas credenciais e tente novamente.'
      )
    }
  }

  return (
    <Card>
      {' '}
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SocialLoginButtons />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Ou continue com e-mail
            </span>
          </div>
        </div>
      </CardContent>{' '}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-2 pb-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      id="signin-email"
                      type="email"
                      autoComplete="username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      id="signin-password"
                      type="password"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <LoaderCircle className="animate-spin" /> : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
