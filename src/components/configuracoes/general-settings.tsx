'use client';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '../ui/skeleton';

export function GeneralSettings() {
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
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
                <CardFooter>
                     <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Nome da Organização</CardTitle>
                <CardDescription>Este é o nome que será exibido em toda a plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="orgName">Nome da Empresa</Label>
                    <Input id="orgName" defaultValue={organization.name} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="orgSlug">Subdomínio Zenos</Label>
                    <div className="flex items-center">
                         <Input id="orgSlug" defaultValue={organization.slug} className="rounded-r-none focus:!ring-0 focus:!border-input" />
                         <span className="inline-flex items-center px-3 h-10 rounded-r-md border border-l-0 border-input bg-muted text-sm text-muted-foreground">.zenos.tech</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <Button>Salvar</Button>
            </CardFooter>
        </Card>
    );
}
