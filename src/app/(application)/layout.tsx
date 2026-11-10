import { AppSidebar } from "@/components/app-sidebar";

export default function ApplicationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1">
      <AppSidebar />
      <div className="flex min-h-screen flex-1 flex-col pb-20 md:pb-0">
        {children}
      </div>
    </div>
  );
}
