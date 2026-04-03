
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function VideshBhramanPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/photos');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center text-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold">Redirecting...</h2>
        <p className="text-muted-foreground mt-2">This gallery has been updated. Redirecting to the main photos page.</p>
    </div>
  );
}
