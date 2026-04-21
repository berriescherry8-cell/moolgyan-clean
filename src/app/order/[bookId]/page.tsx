import BookOrderForm from '@/components/BookOrderForm';

export function generateStaticParams() {
  return [
    { bookId: '1' },
    { bookId: '2' },
    { bookId: '3' },
    { bookId: '4' },
    { bookId: '5' },
    { bookId: '6' },
  ];
}

export default function OrderPage({ params }: { params: { bookId: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
      <BookOrderForm bookId={params.bookId} />
    </div>
  );
}
