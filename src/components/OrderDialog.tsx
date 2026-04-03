'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, AlertCircle } from 'lucide-react';

interface OrderDialogProps {
  book: {
    id: string;
    title: string;
    author: string;
    price: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDialog({ book, isOpen, onClose }: OrderDialogProps) {
  const { toast } = useToast();

  const [form, setForm] = useState({
    quantity: '10',
    fullName: '',
    mobile: '',
    fullAddress: '',
    pinCode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Number(form.quantity) < 10 || Number(form.quantity) > 2000) {
      toast({
        title: "Error",
        description: "Quantity must be between 10 and 2000",
        variant: "destructive",
      });
      return;
    }

    if (!form.fullName || !form.mobile || !form.fullAddress || !form.pinCode) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          customerName: form.fullName,
          mobile: form.mobile,
          address: form.fullAddress,
          pinCode: form.pinCode,
          quantity: Number(form.quantity),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Order Placed Successfully",
          description: `Your order for ${form.quantity} copies of "${book.title}" has been placed.`,
        });
        
        // Reset form and close dialog
        setForm({
          quantity: '10',
          fullName: '',
          mobile: '',
          fullAddress: '',
          pinCode: '',
        });
        onClose();
      } else {
        throw new Error(result.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-zinc-950/90 backdrop-blur-lg border border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
          <DialogDescription>
            Please fill out your details to place an order for <span className="font-semibold">"{book.title}"</span>
          </DialogDescription>
        </DialogHeader>

        {/* Next Steps Box - Red Border */}
        <div className="bg-red-950/40 border border-red-800/70 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-red-400 text-xl">⚠</div>
            <div>
              <h3 className="font-semibold text-red-300 mb-2">Next Step: Confirm Your Order</h3>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 font-medium">Quantity</label>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                min={10}
                max={2000}
                className="bg-zinc-900 border-zinc-700 text-white text-lg font-semibold"
                required
              />
              <p className="text-xs text-zinc-500 mt-1">Minimum - 10, Maximum - 2,000</p>
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">Book Price</label>
              <Input
                value={`₹${book.price}`}
                disabled
                className="bg-zinc-800 border-zinc-700 text-white font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 font-medium">Full Name</label>
              <Input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your Full Name"
                className="bg-zinc-900 border-zinc-700 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">Mobile Number</label>
              <Input
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="10-digit Mobile Number"
                className="bg-zinc-900 border-zinc-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Full Address</label>
            <Textarea
              value={form.fullAddress}
              onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
              placeholder="Your full shipping address"
              rows={3}
              className="bg-zinc-900 border-zinc-700 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium">Pin Code</label>
            <Input
              value={form.pinCode}
              onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
              placeholder="6-digit Pin Code"
              className="bg-zinc-900 border-zinc-700 text-white"
              required
            />
          </div>

          {/* Payment Instructions + QR Code */}
          <div className="bg-zinc-900/70 p-4 rounded-xl border border-zinc-800 space-y-3">
            <h3 className="text-lg font-bold text-center">भुगतान निर्देश</h3>
            <p className="text-red-400 font-medium text-center">No Cash on Delivery</p>
            <p className="text-center text-zinc-300 text-sm">
              Please pay using the QR code or mobile number below and submit your details.
            </p>

            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-lg">
                <img
                  src="https://raw.githubusercontent.com/berriescherry8-cell/mool-gyan-assets/c9649b9cc73dc568c6b75444e5eda3969cdf496d/payment-qr-code.jpeg"
                  alt="Payment QR Code"
                  width={200}
                  height={200}
                  className="rounded"
                />
              </div>
            </div>

            <p className="text-center font-medium text-green-400 text-sm">
              Pay to Mobile No: +91 91192399982
            </p>

            {/* Shipping Details */}
            <div className="bg-zinc-800/70 p-3 rounded text-center">
              <p className="text-zinc-300 text-sm">
                Shipping Charges: ₹50 (for a pack of 100 pieces).
              </p>
            </div>

            {/* Contact */}
            <div className="text-center text-xs text-zinc-400">
              For any questions or further details, please contact us at:
              <div className="mt-1 font-medium text-green-400">
                +91 911192399982<br />
                +91 7976830638
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 text-lg"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Submit Order
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-700 text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}