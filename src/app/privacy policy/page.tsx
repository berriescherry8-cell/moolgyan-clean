
'use client';

import PrivacyPolicyPage from '../privacy-policy/page';

/**
 * This route handles the URL with a space as requested by the user.
 * It serves the same content as the standard /privacy-policy route.
 */
export default function PrivacyPolicyWithSpace() {
  return <PrivacyPolicyPage />;
}
