import OrderForm from './OrderForm';

const booksData = {
  '1': { id: '1', title: 'विदेही ज्ञान (Videhi Gyan)', author: 'श्री नितिनदास जी साहिब', price: 12 },
  '2': { id: '2', title: 'संतों का सार सन्देश', author: 'श्री नितिनदास जी साहिब', price: 10 },
  '3': { id: '3', title: 'हर हर गीता 4th संस्करण', author: 'श्री नितिनदास जी साहिब', price: 6.5 },
  '4': { id: '4', title: 'हर हर गीता 3rd संस्करण', author: 'श्री नितिनदास जी साहिब', price: 6.5 },
  '5': { id: '5', title: 'हर हर गीता 2nd संस्करण', author: 'श्री नितिनदास जी साहिब', price: 6.5 },
  '6': { id: '6', title: 'हर हर गीता 1st संस्करण', author: 'श्री नितिनदास जी साहिब', price: 6.5 },
};

// Required for static export when using dynamic routes [bookId]
export function generateStaticParams() {
  return Object.keys(booksData).map((bookId) => ({
    bookId: bookId,
  }));
}

export default function OrderPage({ params }: { params: { bookId: string } }) {
  const book = booksData[params.bookId as keyof typeof booksData];

  if (!book) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-3xl mb-4">Book Not Found</h1>
        </div>
      </div>
    );
  }

  return <OrderForm book={book} />;
}
