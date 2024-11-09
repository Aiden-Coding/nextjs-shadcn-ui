import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Examples",
  description: "Check out some examples app built using the components.",
};

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default async function ExamplesLayout({ children }: ExamplesLayoutProps) {
  const cookieStore = await cookies();
  const sidebarStatus = cookieStore.get("sidebar:state");
  const defaultSidebarOpen = sidebarStatus ? sidebarStatus.value === "true" : true;
  console.log(defaultSidebarOpen);
  return (
    <div className="flex-1">
      <section className="h-full flex flex-col">
        <SidebarProvider
          style={{
            "--sidebar-width": "10rem",
            "--sidebar-width-mobile": "10rem",
          }}
          defaultOpen={defaultSidebarOpen}
        >
          <AppSidebar />
          <div className="flex-1 overflow-hidden rounded-[0.5rem] border bg-background shadow flex flex-col">
            <SidebarTrigger />
            {children}
          </div>
        </SidebarProvider>
      </section>
    </div>
  );
}
