'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseClient } from '@/hooks/useSupabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Minus, IndianRupee, AlertCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { placeOrder } from '@/lib/orderClient';

interface Book {
  id: string;
  title: string;
  price: number | string;
}

interface BookOrderDialogProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookOrderDialog({ book, isOpen, onClose }: BookOrderDialogProps) {
  const { toast } = useToast();
  const supabase = useSupabaseClient();
  
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    quantity: 10,
    fullName: '',
    mobileNumber: '',
    address: '',
    pinCode: ''
  });
  
  const [errors, setErrors] = useState({
    fullName: '',
    mobileNumber: '',
    address: '',
    pinCode: ''
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when dialog opens
      setFormData({
        quantity: 10,
        fullName: '',
        mobileNumber: '',
        address: '',
        pinCode: ''
      });
      setErrors({
        fullName: '',
        mobileNumber: '',
        address: '',
        pinCode: ''
      });
    }
  }, [isOpen]);

  const calculateTotal = () => {
    if (!book) return 0;
    const price = typeof book.price === 'string' ? parseFloat(book.price) : book.price;
    return formData.quantity * price;
  };

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      mobileNumber: '',
      address: '',
      pinCode: ''
    };
    let isValid = true;

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Mobile Number validation (10 digits)
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
      isValid = false;
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Full address is required';
      isValid = false;
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address';
      isValid = false;
    }

    // Pin Code validation (6 digits)
    if (!formData.pinCode) {
      newErrors.pinCode = 'Pin code is required';
      isValid = false;
    } else if (!/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Pin code must be 6 digits';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 10 && newQuantity <= 2000) {
      setFormData(prev => ({ ...prev, quantity: newQuantity }));
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

      const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix errors",
        description: "Please check the form for errors and try again.",
        variant: "destructive"
      });
      return;
    }

    if (!book) return;

    setSubmitting(true);

    try {
      const result = await placeOrder({
        bookId: book.id,
        bookTitle: book.title,
        bookPrice: typeof book.price === 'string' ? book.price : book.price.toString(),
        customerName: formData.fullName,
        mobile: formData.mobileNumber,
        address: formData.address,
        pinCode: formData.pinCode,
        quantity: formData.quantity
      });

      toast({
        title: "Order Placed Successfully!",
        description: `Order #${result.orderId} created. Complete payment via QR & WhatsApp.`,
        variant: "default"
      });

      onClose();
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!book) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Order Form</DialogTitle>
          <DialogDescription>Complete your order for {book.title}</DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h3 className="font-semibold text-white">{book.title}</h3>
                  <p className="text-zinc-400 text-sm">Price per book</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-500">
                    <IndianRupee className="inline h-5 w-5" />
                    {typeof book.price === 'string' ? parseFloat(book.price).toFixed(2) : book.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quantity (Min: 10, Max: 2000)</Label>
                <div className="flex items-center gap-3 bg-zinc-800 p-3 rounded-lg">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(formData.quantity - 1)}
                    disabled={formData.quantity <= 10}
                    className="border-zinc-700"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 10 && value <= 2000) {
                        setFormData(prev => ({ ...prev, quantity: value }));
                      } else if (e.target.value === '') {
                        setFormData(prev => ({ ...prev, quantity: 0 }));
                      }
                    }}
                    onBlur={() => {
                      // Ensure quantity is within valid range when user leaves the field
                      if (formData.quantity < 10) {
                        setFormData(prev => ({ ...prev, quantity: 10 }));
                      } else if (formData.quantity > 2000) {
                        setFormData(prev => ({ ...prev, quantity: 2000 }));
                      }
                    }}
                    className="bg-zinc-700 border-zinc-600 text-white text-center w-24"
                    min="10"
                    max="2000"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(formData.quantity + 1)}
                    disabled={formData.quantity >= 2000}
                    className="border-zinc-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-zinc-400">Tip: You can type directly in the input field for faster quantity selection</p>
              </div>

              <div className="p-4 bg-zinc-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">
                    <IndianRupee className="inline h-4 w-4" />
                    {(formData.quantity * (typeof book.price === 'string' ? parseFloat(book.price) : book.price)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-amber-500">
                    <IndianRupee className="inline h-5 w-5" />
                    {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="font-semibold text-blue-400 mb-2">Important Instructions</h4>
                <ul className="text-sm text-zinc-300 space-y-1">
                  <li>• Minimum order quantity: 10 books</li>
                  <li>• Maximum order quantity: 2000 books</li>
                  <li>• Payment required before order confirmation</li>
                  <li>• Upload payment screenshot after payment</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment & Form */}
          <div className="space-y-6">
            {/* Payment Instructions */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Payment Instructions</CardTitle>
                <CardDescription>How to complete your payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <img 
                    src="https://lqymwrhfirszrakuevqm.supabase.co/storage/v1/object/public/moolgyan-media/App_logo_QR/payment-qr-code.jpeg" 
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto border-2 border-zinc-700 rounded-lg"
                  />
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">हिन्दी में निर्देश:</h4>
                  <p className="text-sm text-zinc-300 mb-3">
                    सबसे पहले इस दिए गए QR कोड पर या इस नंबर पर 9119239982 पर पेमेंट करें।
                    पेमेंट करने के बाद पेमेंट का स्क्रीनशॉट नीचे दिए गए नंबरों पर WhatsApp भेजें:
                    +91 9119239982, +91 7976830638, +91 7742780855
                  </p>
                  
                  <h4 className="font-semibold text-white mb-2">English Instructions:</h4>
                  <p className="text-sm text-zinc-300">
                    First, make payment on this QR code or call 9119239982.
                    After payment, send the payment screenshot to the following numbers on WhatsApp:
                    +91 9119239982, +91 7976830638, +91 7742780855
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Form */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Please fill in your details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-zinc-800 border-zinc-700"
                      />
                      {errors.fullName && (
                        <p className="text-red-400 text-sm">{errors.fullName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <Input
                        id="mobileNumber"
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                        placeholder="Enter 10-digit mobile number"
                        className="bg-zinc-800 border-zinc-700"
                      />
                      {errors.mobileNumber && (
                        <p className="text-red-400 text-sm">{errors.mobileNumber}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your complete address (street, city, state)"
                      className="bg-zinc-800 border-zinc-700 min-h-[100px]"
                    />
                    {errors.address && (
                      <p className="text-red-400 text-sm">{errors.address}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pinCode">Pin Code</Label>
                    <Input
                      id="pinCode"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      placeholder="Enter 6-digit pin code"
                      className="bg-zinc-800 border-zinc-700"
                    />
                    {errors.pinCode && (
                      <p className="text-red-400 text-sm">{errors.pinCode}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-zinc-400">
                    <AlertCircle className="h-4 w-4" />
                    <span>Double-check your address and mobile number for accurate delivery</span>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 border-zinc-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Submit Order - <IndianRupee className="inline h-4 w-4" />{calculateTotal().toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}