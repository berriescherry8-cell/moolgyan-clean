
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { triggerConfetti } from '@/lib/confetti';
import { dataManager } from '@/lib/data-manager';

const faqFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  question: z.string().min(10, { message: 'Question must be at least 10 characters.' }),
});

type FaqFormValues = z.infer<typeof faqFormSchema>;

export default function FaqForm() {
  const { toast } = useToast();
  const { t } = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      name: '',
      email: '',
      question: '',
    },
  });
  
  const onFormSubmit = async (data: FaqFormValues) => {
    setIsSubmitting(true);
    try {
      const faqData = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        question: data.question,
        submittedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      dataManager.setDoc('faqQuestions', faqData);

      toast({
        title: 'Success!',
        description: `Thank you, ${data.name}! Your question has been submitted.`,
      });
      triggerConfetti();
      form.reset();
    } catch (error) {
      console.error("Error submitting FAQ question:", error);
      toast({
        title: 'Error',
        description: 'Failed to submit your question. Please try again.',
        variant: 'destructive',
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
                <Input placeholder={t.your_name} {...field} />
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
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.question}</FormLabel>
              <FormControl>
                <Textarea placeholder={t.your_question} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t.submit_question}
        </Button>
      </form>
    </Form>
  );
}
