import dynamic from "next/dynamic";

const SidebarLayout = dynamic(() => import("./_components"));

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex h-screen w-full flex-col border-b items-center justify-center">
            <SidebarLayout>
                {children}
            </SidebarLayout>
        </main>
    );
}
