'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function BillingSettings() {
    const firestore = useFirestore();
    const { user } = useUser();

    // Need tenantId to get organization details
    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userProfile } = useDoc(userProfileRef);

    const organizationRef = useMemoFirebase(() => {
        if (!userProfile?.tenantId) return null;
        return doc(firestore, 'organizations', userProfile.tenantId);
    }, [firestore, userProfile]);
    const { data: organization, isLoading: isOrgLoading } = useDoc(organizationRef);
    
    if (isOrgLoading || !organization) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-2">
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                     <Skeleton className="h-10 w-48" />
                </CardFooter>
            </Card>
        )
    }

    const nextBillingDate = format(new Date(organization.subscriptionNextBilling), "dd 'de' MMMM, yyyy", { locale: ptBR });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Plano e Faturamento</CardTitle>
                <CardDescription>Gerencie sua assinatura e histórico de pagamentos.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Plano Atual</span>
                        <span className="font-medium">{organization.subscriptionPlan}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                         <span className="font-medium capitalize">{organization.subscriptionStatus}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Próxima Cobrança</span>
                        <span className="font-medium">{nextBillingDate}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Button>Gerenciar Assinatura</Button>
                <Button variant="outline">Ver Histórico</Button>
            </CardFooter>
        </Card>
    );
}
