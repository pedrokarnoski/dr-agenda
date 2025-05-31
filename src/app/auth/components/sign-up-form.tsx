'use client'

import { useForm } from 'react-hook-form'
import { LoaderCircle } from 'lucide-react'
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

const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().trim().email('E-mail inválido'),
  password: z.string().trim().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export function SignUpForm() {
  const router = useRouter()
  const { register, isLoading } = useAuth()
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function handleSubmit(data: z.infer<typeof registerSchema>) {
    try {
      const success = await register(data.name, data.email, data.password)
      if (success) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Erro ao registrar:', error)
      toast.error(
        'Problema ao criar conta. Verifique seus dados e tente novamente.'
      )
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar</CardTitle>
        <CardDescription>Crie uma nova conta.</CardDescription>
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
      </CardContent>

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
            />
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
