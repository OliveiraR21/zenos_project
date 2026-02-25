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
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  ListTodo,
} from "lucide-react";
import { ZenosLogo } from "@/components/icons";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar
        className="border-r border-sidebar-border"
        collapsible="icon"
        variant="sidebar"
      >
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <ZenosLogo className="size-8 text-volt" />
            <span
              className={cn(
                "font-bold text-xl font-headline transition-opacity duration-200",
                "group-data-[collapsible=icon]:opacity-0"
              )}
            >
              Zenos
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
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
