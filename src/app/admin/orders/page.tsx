
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2, Printer, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

type Order = {
  id: string;
  order_date: string;
  status: string;
  name: string;
  mobile: string;
  address: string;
  pincode: string;
  book_title: string;
  quantity: number;
  created_at: string;
  updated_at: string;
};

export default function OrdersPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from Supabase
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    }
  };

  // Google Sheet link for admin
  const googleSheetUrl = 'https://docs.google.com/spreadsheets/d/1lA2c6iX0r1x0HGJcnPDeDVNBLnU5UDbhpAv8ub7unU8/edit?usp=sharing';

  const handleToggleOrderStatus = async (order: Order) => {
    setIsProcessing(order.id);
    const newStatus = order.status === 'completed' ? 'pending' : 'completed';
    const newStatusVerb = newStatus === 'completed' ? 'Completed' : 'Marked as Pending';
    const newStatusPast = newStatus === 'completed' ? 'completed' : 'pending';

    try {
      // Update status in Supabase
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prev => prev.map(o =>
        o.id === order.id ? { ...o, status: newStatus } : o
      ));
      
      toast({
        title: `Order ${newStatusVerb}`,
        description: `Order for ${order.name} has been marked as ${newStatusPast}.`,
      });
      setIsProcessing(null);
    } catch (e: any) {
      console.error(`Error changing order status to ${newStatus}:`, e);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: e.message || "Could not update the order. Please try again.",
      });
      setIsProcessing(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setIsProcessing(orderId);
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        throw error;
      }

      // Update local state
      setOrders(prev => prev.filter(o => o.id !== orderId));
      toast({
        title: 'Order Deleted',
        description: 'The order has been successfully deleted.',
      });
      setIsProcessing(null);
    } catch (e: any) {
      console.error("Error deleting order: ", e);
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: e.message || "Could not delete the order. Please try again.",
      });
      setIsProcessing(null);
    }
  };

  const handlePrintReceipt = (order: Order) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Order Receipt</title>');
      printWindow.document.write('<style>body{font-family:sans-serif;padding:2rem}div{border:1px solid #ccc;padding:1rem;border-radius:0.5rem}h2,h3{margin-bottom:0.5rem}p{margin:0.25rem 0}</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write('<div>');
      printWindow.document.write(`<h2>Order Receipt</h2>`);
      printWindow.document.write(`<p><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleString()}</p>`);
      printWindow.document.write(`<p><strong>Status:</strong> ${order.status}</p>`);
      printWindow.document.write('<h3>Customer Details:</h3>');
      printWindow.document.write(`<p><strong>Name:</strong> ${order.name}</p>`);
      printWindow.document.write(`<p><strong>Mobile:</strong> ${order.mobile}</p>`);
      printWindow.document.write(`<p><strong>Address:</strong> ${order.address}, ${order.pincode}</p>`);
      printWindow.document.write('<h3>Order Details:</h3>');
      printWindow.document.write(`<p><strong>Book:</strong> ${order.book_title}</p>`);
      printWindow.document.write(`<p><strong>Quantity:</strong> ${order.quantity}</p>`);
      printWindow.document.write('</div>');
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Sheet Link for Admin */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Order Data Sheet</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            All orders are stored in Google Sheet. Click the button below to view and manage orders.
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.open(googleSheetUrl, '_blank')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Open Google Sheet
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(googleSheetUrl);
                toast({ title: "Link copied to clipboard!" });
              }}
            >
              Copy Sheet Link
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Note: Orders submitted through Google Form are automatically saved to this sheet.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            {orders && orders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.sort((a,b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime()).map((order) => (
                    <TableRow key={order.id} className={cn(order.status === 'completed' && 'bg-primary/5')}>
                      <TableCell>{new Date(order.order_date).toLocaleString()}</TableCell>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.mobile}</TableCell>
                      <TableCell>{`${order.address}, ${order.pincode}`}</TableCell>
                      <TableCell>{order.book_title}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(order.status)} className="capitalize">{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                         <Tooltip>
                          <TooltipTrigger asChild>
                             <Button
                               variant="ghost"
                               size="icon"
                               onClick={() => handleToggleOrderStatus(order)}
                               disabled={isProcessing === order.id}
                             >
                              {isProcessing === order.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin"/>
                              ) : order.status === 'completed' ? (
                                  <XCircle className="h-4 w-4 text-orange-500" />
                              ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{order.status === 'completed' ? 'Mark as Pending' : 'Mark as Complete'}</p>
                          </TooltipContent>
                        </Tooltip>
                         <Tooltip>
                          <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" onClick={() => handlePrintReceipt(order)}>
                              <Printer className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Receipt</p>
                          </TooltipContent>
                        </Tooltip>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={!!isProcessing}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the order for {order.name}. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteOrder(order.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {isProcessing === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No orders found.</p>
              </div>
            )}
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
}
