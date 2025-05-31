'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { LoaderCircle } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

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
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'

const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().trim().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function handleSubmit(data: z.infer<typeof registerSchema>) {
    setIsLoading(true)

    try {
      const { data: result, error } = await authClient.signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message || 'Erro ao criar conta')
      } else if (result) {
        toast.success('Conta criada com sucesso!')
        router.push('/dashboard')
      }
    } catch (err) {
      console.error('Erro no registro:', err)
      toast.error('Erro interno do servidor. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar</CardTitle>
        <CardDescription>Crie uma nova conta.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-2 pb-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input id="register-name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      id="register-email"
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
                      id="register-password"
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                'Criar conta'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
