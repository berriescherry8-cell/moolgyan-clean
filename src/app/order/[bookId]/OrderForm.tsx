'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

// This component receives the book as a prop
export default function OrderForm({ book }: { book: any }) {
  const router = useRouter();
  const { toast } = useToast();

  // Load saved form data from localStorage on component mount
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pendingOrderForm');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Ensure we have the correct book context
          if (parsed.bookId === book.id) {
            return parsed;
          }
        } catch (e) {
          console.error('Error parsing saved form data:', e);
        }
      }
    }
    return {
      bookId: book.id,
      quantity: '10',
      fullName: '',
      mobile: '',
      fullAddress: '',
      pinCode: '',
    };
  });

  // Auto-save form data to localStorage whenever form changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pendingOrderForm', JSON.stringify(form));
    }
  }, [form]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(form.quantity) < 10 || Number(form.quantity) > 2000) {
      toast({
        title: "Error",
        description: "Quantity must be between 10 and 2000",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Submitted!",
      description: `Your order for ${book.title} (${form.quantity} pieces) has been placed successfully.`,
    });

    router.push('/books');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-lg mx-auto bg-zinc-950/90 backdrop-blur-lg border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="bg-zinc-900 p-5 border-b border-zinc-800 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Order Details</h1>
          <div className="w-10"></div>
        </div>

        <div className="p-6 space-y-6">

          {/* Book Title in Header */}
          <p className="text-center text-zinc-400">
            Please fill out your details to place an order for <br />
            <span className="font-semibold text-white">"{book.title}"</span>.
          </p>

          {/* अगला कदम Box - Red Border */}
          <div className="bg-red-950/40 border border-red-800/70 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <div className="text-red-400 text-2xl">⚠</div>
              <div>
                <h3 className="font-semibold text-red-300 mb-2">अगला कदम: ऑर्डर की पुष्टि करें</h3>
                <p className="text-sm text-zinc-300">
                  After placing your order, please send the order receipt and payment receipt to one of these WhatsApp numbers:
                </p>
                <div className="mt-3 text-sm font-medium text-green-400 space-y-1">
                  <p>+91 911192399982</p>
                  <p>+91 7976830638</p>
                  <p>+91 774427808855</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Shipping Information</h2>

            <div>
              <label className="block text-sm mb-2 font-medium">Quantity</label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                min={10}
                max={2000}
                className="bg-zinc-900 border-zinc-700 text-white text-lg font-semibold"
              />
              <p className="text-xs text-zinc-500 mt-1">Minimum - 10, Maximum - 2,000</p>
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">Full Name</label>
              <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your Full Name"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">Mobile Number</label>
              <Input
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="10-digit Mobile Number"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">Full Address</label>
              <Textarea
                value={form.fullAddress}
                onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
                placeholder="Your full shipping address"
                rows={3}
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">Pin Code</label>
              <Input
                value={form.pinCode}
                onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
                placeholder="6-digit Pin Code"
                className="bg-zinc-900 border-zinc-700 text-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-6 text-lg"
          >
            Submit Order
          </Button>

          {/* Payment Instructions + QR Code */}
          <div className="bg-zinc-900/70 p-6 rounded-xl border border-zinc-800 space-y-5">
            <h2 className="text-xl font-bold text-center">भुगतान निर्देश</h2>
            <p className="text-red-400 font-medium text-center">No Cash on Delivery</p>
            <p className="text-center text-zinc-300">
              Please pay using the QR code or mobile number below and submit your details.
            </p>

            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-2xl">
                <Image
                  src="https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/c9649b9cc73dc568c6b75444e5eda3969cdf496d/payment-qr-code.jpeg"
                  alt="Payment QR Code"
                  width={240}
                  height={240}
                  className="rounded-xl"
                />
              </div>
            </div>

            <p className="text-center font-medium text-green-400">
              Pay to Mobile No: +91 911192399982
            </p>

            {/* Shipping Details */}
            <div className="bg-zinc-800/70 p-4 rounded-lg text-center">
              <p className="text-zinc-300">
                Shipping Charges: ₹50 (for a pack of 100 pieces).
              </p>
            </div>

            {/* Contact */}
            <div className="text-center text-sm text-zinc-400">
              For any questions or further details, please contact us at:
              <div className="mt-2 font-medium text-green-400">
                +91 911192399982<br />
                +91 7976830638
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
