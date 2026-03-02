'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isGoogleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const isLoading = isSubmitting || isGoogleLoading;

  const handleEmailLogin = async (data: LoginFormData) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: "Email ou senha inválidos. Por favor, tente novamente.",
      });
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Erro com Google Login",
        description: "Não foi possível autenticar com o Google. Tente novamente.",
      });
      console.error("Google login error:", error);
    } finally {
        setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
       <div className="mb-8">
        <Image src="/zenos_sem_fundo_escuro.png" alt="Zenos" width={64} height={64} />
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Acesse sua conta</CardTitle>
          <CardDescription>Bem-vindo de volta. Entre para gerenciar seus projetos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">Senha</Label>
                <Link href="#" className="ml-auto inline-block text-xs underline text-muted-foreground hover:text-primary">
                  Esqueceu sua senha?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                {...register('password')}
                disabled={isLoading}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
             <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
                {isGoogleLoading ? 'Aguarde...' : 'Google'}
            </Button>
             <Button variant="outline" disabled>
                Microsoft
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Não tem uma conta?{' '}
            <Link href="/signup" className="underline font-medium text-primary">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
