
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLocale } from '@/lib/i18n';
import { dataManager } from '@/lib/data-manager';
import { triggerConfetti } from '@/lib/confetti';


const joinFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  fathersName: z.string().min(2, { message: "Father's name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

type JoinFormValues = z.infer<typeof joinFormSchema>;

export default function JoinForm() {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JoinFormValues>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      name: '',
      fathersName: '',
      mobile: '',
      email: '',
    },
  });

  const onFormSubmit = async (data: JoinFormValues) => {
    setIsSubmitting(true);
    try {
        const memberData = {
            id: Date.now().toString(),
            name: data.name,
            fathersName: data.fathersName,
            mobile: data.mobile,
            email: data.email,
            joinedAt: new Date().toISOString(),
        };
        
        dataManager.setDoc('kgfMembers', memberData);

        toast({
            title: t.toast_success,
            description: `Welcome, ${data.name}! Your registration has been submitted.`,
        });
        triggerConfetti();
        form.reset();

    } catch (error: any) {
        console.error("KGF Form Submission Error:", error);
        toast({
            variant: "destructive",
            title: t.toast_error,
            description: 'Failed to submit your registration.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.full_name}</FormLabel>
              <FormControl>
                <Input placeholder={t.your_full_name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fathersName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.join_fathers_name}</FormLabel>
              <FormControl>
                <Input placeholder={t.join_fathers_name_placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.mobile_number}</FormLabel>
              <FormControl>
                <Input placeholder={t.mobile_number_placeholder} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.email}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t.your_email} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t.join_now}
        </Button>
      </form>
    </Form>
  );
}
