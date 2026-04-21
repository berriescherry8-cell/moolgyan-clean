'use client';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import { ExternalLink } from 'lucide-react';
<<<<<<< HEAD
import { dataManager } from '@/lib/data-manager';
=======
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470

interface GoogleFormButtonProps {
  type: 'deeksha' | 'feedback' | 'join';
  className?: string;
}

<<<<<<< HEAD
export default function GoogleFormButton({ type, className }: GoogleFormButtonProps) {
  const { t } = useLocale();
  
  // Get the form link from data manager
  const googleForms = dataManager.getDoc('googleForms', 'links') as any;
=======
// Hardcoded Google Forms URLs for static export
const GOOGLE_FORMS = {
  deeksha: 'https://docs.google.com/forms/d/e/1FAIpQLSe5szUFUT5dd0O9S7jf2cWS7iLUpYwtL08kh5fK6HhXZe8hmA/viewform?usp=publish-editor',
  feedback: 'https://docs.google.com/forms/d/e/1FAIpQLSeP5KW0S_yVs9v-OsXmfIfvZfRpZdagZ70jcSJLk9xEIFApHA/viewform?usp=publish-editor',
  join: 'https://docs.google.com/forms/d/e/1FAIpQLScveNKbw-DaD9S1h-qGhBvXlqXLAChYnDVido276jzixCfJHQ/viewform?usp=publish-editor',
};

export default function GoogleFormButton({ type, className }: GoogleFormButtonProps) {
  const { t } = useLocale();
  
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  let formLink = '';
  let buttonText = '';
  let ariaLabel = '';

  switch (type) {
    case 'deeksha':
<<<<<<< HEAD
      formLink = googleForms?.deekshaFormLink || 'https://docs.google.com/forms/d/e/1FAIpQLSe5szUFUT5dd0O9S7jf2cWS7iLUpYwtL08kh5fK6HhXZe8hmA/viewform?usp=publish-editor';
      buttonText = t.google_form_deeksha;
      ariaLabel = t.google_form_deeksha;
      break;
    case 'feedback':
      formLink = googleForms?.feedbackFormLink || 'https://docs.google.com/forms/d/e/1FAIpQLSeP5KW0S_yVs9v-OsXmfIfvZfRpZdagZ70jcSJLk9xEIFApHA/viewform?usp=publish-editor';
      buttonText = t.google_form_feedback;
      ariaLabel = t.google_form_feedback;
      break;
    case 'join':
      formLink = googleForms?.joinFormLink || 'https://docs.google.com/forms/d/e/1FAIpQLScveNKbw-DaD9S1h-qGhBvXlqXLAChYnDVido276jzixCfJHQ/viewform?usp=publish-editor';
      buttonText = t.google_form_join;
      ariaLabel = t.google_form_join;
=======
      formLink = GOOGLE_FORMS.deeksha;
      buttonText = t('google_form_deeksha');
      ariaLabel = t('google_form_deeksha');
      break;
    case 'feedback':
      formLink = GOOGLE_FORMS.feedback;
      buttonText = t('google_form_feedback');
      ariaLabel = t('google_form_feedback');
      break;
    case 'join':
      formLink = GOOGLE_FORMS.join;
      buttonText = t('google_form_join');
      ariaLabel = t('google_form_join');
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
      break;
  }

  const handleClick = () => {
    window.open(formLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button 
      onClick={handleClick} 
      className={className}
      aria-label={ariaLabel}
    >
      <ExternalLink className="mr-2 h-4 w-4" />
      {buttonText}
    </Button>
  );
}