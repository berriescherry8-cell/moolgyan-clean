import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900/50 to-black p-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 bg-gradient-to-r from-primary to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Search className="w-12 h-12 text-black" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-headline font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="glass-card">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg" className="glass-card">
            <Link href="/">
              Back to Mool Gyan
            </Link>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Mool Gyan
        </p>
      </div>
    </div>
  );
}
