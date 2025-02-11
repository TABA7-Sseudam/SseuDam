import { Header } from "@/components/shared/Header";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
