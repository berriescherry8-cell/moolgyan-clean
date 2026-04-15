import BookOrderForm from '@/components/BookOrderForm';

export async function generateStaticParams() {
  return [
    { bookId: '1' },
    { bookId: '3' },
    { bookId: '4' },
    { bookId: '5' },
    { bookId: '6' },
    { bookId: '7' },
    { bookId: '8' },
    { bookId: '9' }
  ];
}

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <BookOrderForm />
    </div>
  );
}
