
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getFaqData } from '@/lib/data';
import FaqForm from '@/components/FaqForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLocale } from '@/lib/i18n';

export default function FaqPage() {
  const { t } = useLocale();
  const faqData = getFaqData(t);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-8 text-center font-headline">{t.faq_title}</h1>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-lg text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">{t.faq_form_title}</CardTitle>
          <CardDescription>
            {t.faq_form_desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FaqForm />
        </CardContent>
      </Card>
    </div>
  );
}
