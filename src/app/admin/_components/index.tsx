"use client";

import React from "react";
import { AppSidebar } from "./app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilePenLine } from "lucide-react";

export default function SidebarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const path = usePathname();
  const pathSegments = path.split("/").filter((segment) => segment);

  return (
    <SidebarProvider className="container overflow-hidden">
      <AppSidebar className="absolute" />
      <SidebarInset className="border-x">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3 justify-between w-full">
            <div className="flex items-center">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {pathSegments.map((segment, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <BreadcrumbSeparator />}
                      <BreadcrumbItem>
                        {index === pathSegments.length - 1 ? (
                          <BreadcrumbPage>{segment}</BreadcrumbPage>
                        ) : (
                          <Link
                            href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                          >
                            {segment}
                          </Link>
                        )}
                      </BreadcrumbItem>
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button className="cursor-pointer"><FilePenLine />Write</Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
