import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { LocaleProvider } from '@/lib/i18n';
import AppLayout from '@/components/AppLayout';
import { UploadProvider } from '@/context/UploadProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

// User's provided launcher icon
const BRAND_LOGO = 'https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/d110636d-8ff5-4c7d-8964-6934a17c5812-removebg-preview-removebg-preview.png';

export const metadata: Metadata = {
  title: 'Mool Gyan',
  description: 'Experience the bliss of self-realization with Mool Gyan. Explore Satsang videos, stay updated with news, order spiritual books, and connect with the community.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mool Gyan',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: BRAND_LOGO,
    apple: BRAND_LOGO,
  },
  other: {
    'google': 'notranslate',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="notranslate">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="google" content="notranslate" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-black font-sans antialiased dark',
          inter.variable
        )}
      >
        <LocaleProvider>
          <UploadProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </UploadProvider>
        </LocaleProvider>
        <Toaster />
      </body>
    </html>
  );
}
