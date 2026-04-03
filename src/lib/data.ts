import type { NewsArticle, Book, FaqItem, SatsangVideo } from './types';
import type { Translation } from './i18n/locales';

/**
 * Static FAQ data generator based on selected locale.
 */
export const getFaqData = (t: Translation): FaqItem[] => [
  {
    question: t.faq_q1,
    answer: t.faq_a1,
  },
  {
    question: t.faq_q2,
    answer: t.faq_a2,
  },
  {
    question: t.faq_q3,
    answer: t.faq_a3,
  },
  {
    question: t.faq_q4,
    answer: t.faq_a4,
  },
  {
    question: t.faq_q5,
    answer: t.faq_a5,
  },
];