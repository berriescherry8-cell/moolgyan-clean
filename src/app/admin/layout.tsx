// Minimal layout - middleware handles auth, sidebar in protected layout
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

