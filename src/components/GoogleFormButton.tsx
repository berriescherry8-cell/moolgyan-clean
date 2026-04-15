'use client';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import { ExternalLink } from 'lucide-react';

interface GoogleFormButtonProps {
  type: 'deeksha' | 'feedback' | 'join';
  className?: string;
}

// Hardcoded Google Forms URLs for static export
const GOOGLE_FORMS = {
  deeksha: 'https://docs.google.com/forms/d/e/1FAIpQLSe5szUFUT5dd0O9S7jf2cWS7iLUpYwtL08kh5fK6HhXZe8hmA/viewform?usp=publish-editor',
  feedback: 'https://docs.google.com/forms/d/e/1FAIpQLSeP5KW0S_yVs9v-OsXmfIfvZfRpZdagZ70jcSJLk9xEIFApHA/viewform?usp=publish-editor',
  join: 'https://docs.google.com/forms/d/e/1FAIpQLScveNKbw-DaD9S1h-qGhBvXlqXLAChYnDVido276jzixCfJHQ/viewform?usp=publish-editor',
};

export default function GoogleFormButton({ type, className }: GoogleFormButtonProps) {
  const { t } = useLocale();
  
  let formLink = '';
  let buttonText = '';
  let ariaLabel = '';

  switch (type) {
    case 'deeksha':
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