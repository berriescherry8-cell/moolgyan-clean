import AppLayout from '@/components/AppLayout';

export default function OrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}