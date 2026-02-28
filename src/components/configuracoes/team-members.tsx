'use client';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Skeleton } from '../ui/skeleton';
import { UserPlus } from 'lucide-react';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string;
}

function TeamMembersLoading() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Membro</TableHead>
                    <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <Skeleton className="h-4 w-16" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export function TeamMembers() {
    const firestore = useFirestore();
    const { user } = useUser();

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc(userProfileRef);

    const teamQuery = useMemoFirebase(() => {
        if (!userProfile?.tenantId) return null;
        return query(collection(firestore, 'users'), where('tenantId', '==', userProfile.tenantId));
    }, [firestore, userProfile]);
    const { data: teamMembers, isLoading: areMembersLoading } = useCollection<UserProfile>(teamQuery);

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Convidar Membros</CardTitle>
                    <CardDescription>Adicione novos membros à sua organização. Eles receberão um convite por e-mail.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input type="email" placeholder="email@suaempresa.com" className="flex-1" />
                        <Button><UserPlus className="mr-2 h-4 w-4" /> Convidar</Button>
                    </div>
                     <p className="text-xs text-muted-foreground mt-2">Você pode convidar múltiplos usuários separando os e-mails por vírgula.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Equipe</CardTitle>
                    <CardDescription>Membros da sua organização.</CardDescription>
                </CardHeader>
                <CardContent>
                   {areMembersLoading || isProfileLoading ? <TeamMembersLoading /> : (
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Membro</TableHead>
                                <TableHead>Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers?.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                {/* In a real app user.avatarUrl would be here */}
                                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{member.name}</p>
                                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize">{member.role}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                   )}
                </CardContent>
            </Card>
        </div>
    );
}
