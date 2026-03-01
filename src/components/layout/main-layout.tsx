"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  ListTodo,
  PanelLeft,
  Shield,
  CreditCard,
} from "lucide-react";
import { cn, hexToHsl } from "@/lib/utils";
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import type { Tenant } from '@/lib/data';

function ToggleButton() {
  const { toggleSidebar, state } = useSidebar();
  const tooltipText = state === "expanded" ? "Recolher menu" : "Expandir menu";
  return (
    <SidebarMenuButton onClick={toggleSidebar} tooltip={{ children: tooltipText }}>
      <PanelLeft />
      <span>Recolher</span>
    </SidebarMenuButton>
  );
}

function TheSidebar({ organization }: { organization: Tenant | null }) {
  const pathname = usePathname();
  const displayName = organization?.name || 'Zenos';
  
  return (
    <Sidebar
      className="border-r border-sidebar-border"
      collapsible="icon"
      variant="sidebar"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          {organization?.brandingLogoUrl ? (
             <Image src={organization.brandingLogoUrl} alt={displayName} width={32} height={32} className="object-contain" unoptimized />
          ) : (
             <Image src="/zenos_sem_fundo_escuro.png" alt={displayName} width={32} height={32} />
          )}
          <span
            className={cn(
              "font-bold text-xl font-headline transition-opacity duration-200",
              "group-data-[collapsible=icon]:opacity-0"
            )}
          >
            {displayName}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/"}
              tooltip={{ children: "Dashboard" }}
            >
              <Link href="/">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/projetos")}
              tooltip={{ children: "Projetos" }}
            >
              <Link href="/projetos">
                <FolderKanban />
                <span>Projetos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/tarefas")}
              tooltip={{ children: "Minhas Tarefas" }}
            >
              <Link href="/tarefas">
                <ListTodo />
                <span>Minhas Tarefas</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/precos")}
              tooltip={{ children: "Preços" }}
            >
              <Link href="/precos">
                <CreditCard />
                <span>Preços</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/super-admin")}
              tooltip={{ children: "Super Admin" }}
            >
              <Link href="/super-admin">
                <Shield />
                <span>Super Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith("/configuracoes")}
              tooltip={{ children: "Configurações" }}
            >
              <Link href="/configuracoes">
                <Settings />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarSeparator />
          <SidebarMenuItem>
            <ToggleButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const firestore = useFirestore();
  const { user } = useUser();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userProfile } = useDoc(userProfileRef);

  const organizationRef = useMemoFirebase(() => {
    if (!userProfile?.tenantId) return null;
    return doc(firestore, 'organizations', userProfile.tenantId);
  }, [firestore, userProfile]);
  const { data: organization } = useDoc(organizationRef as any);

  React.useEffect(() => {
    // We only apply custom branding if we are not in the super-admin section.
    if (organization?.brandingPrimaryColor && !pathname.startsWith('/super-admin')) {
      const hslColor = hexToHsl(organization.brandingPrimaryColor);
      if (hslColor) {
        document.documentElement.style.setProperty('--primary', hslColor);
      }
    } else {
      // Reset to default if no color is set or if on super-admin page.
      // The default is in globals.css, so we just remove the inline style.
      document.documentElement.style.removeProperty('--primary');
    }
  }, [organization, pathname]);


  return (
    <SidebarProvider>
      <TheSidebar organization={organization} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
