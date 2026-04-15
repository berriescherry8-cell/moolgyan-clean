'use client';

import FaqForm from '@/components/FaqForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Send, MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FAQs = [
  {
    question: 'Who is Nitin Sahib?',
    answer: 'Nitin Das Ji is a self-realized, insightful guru who is the saint revealing Kabir Sahib\'s 13th path to the whole world.'
  },
  {
    question: 'Why was this new book needed?',
    answer: 'Many scriptures are prevalent in different religions, beliefs, sects and communities but this knowledge has not been able to unite all of humanity. In such a situation this scripture is presented for the welfare of all mankind, inspired by Sadguru Nitin Sahib, authenticating the self-knowledge described in the Srimad Bhagvad Gita with the Sant Mat (path of saints).'
  },
  {
    question: 'How can one listen to Nitin Sahib\'s satsang?',
    answer: 'On the "Kahat Kabir Suno Bhai Saadho Nitindas" Youtube channel.'
  },
  {
    question: 'What is this app about?',
    answer: 'MoolGyan app provides spiritual knowledge, satsangs, bhajans, books, photos, and resources from Sadguru Nitin Sahib revealing Kabir Sahib\'s 13th path.'
  },
  {
    question: 'How to contact support?',
    answer: 'Use the FAQ form below to send your questions. Admin will review and respond. You can also check Live Satsang, Photos, and News sections for updates.'
  }
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900/50 via-purple-900/20 to-slate-900 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <HelpCircle className="mx-auto h-24 w-24 text-purple-400 mb-6" />
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Find answers to common questions about Sadguru Nitin Sahib, the path, satsangs, and app features.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* FAQs Accordion */}
          <div>
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-3">
                  <MessageCircle className="h-7 w-7" />
                  Common Questions
                </CardTitle>
                <CardDescription>
                  Explore our most frequently asked questions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {FAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-lg hover:no-underline h-auto py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-slate-300 mt-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Ask Question Form */}
          <div>
            <Card className="border-white/10 bg-slate-900/50 backdrop-blur sticky top-12">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline flex items-center gap-3 justify-center">
                  <Send className="h-7 w-7" />
                  Ask Your Question
                </CardTitle>
                <CardDescription>
                  Don\'t see your answer? Submit your question and admin will respond.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
<div className="space-y-2 mb-4">
  <p className="text-slate-400 text-sm italic">Fill in all fields to submit your question:</p>
  <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
    <li>• Full name (required)</li>
    <li>• Email address (required)</li>
    <li>• Your question (min 10 chars)</li>
  </ul>
</div>
<FaqForm />
                <div className="mt-8 grid grid-cols-2 gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Check Satsang</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-20 text-slate-500">
          <p className="text-lg">
            Still have questions? Your submission goes directly to the admin team.
          </p>
        </div>
      </div>
    </div>
  );
}
