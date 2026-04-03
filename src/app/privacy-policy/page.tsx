'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  const hostUrl = "https://studio--studio-9813085306-ab851.us-central1.hosted.app";
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="bg-zinc-950/50 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary text-center">Privacy Policy for Mool Gyan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 prose prose-invert max-w-none text-white/80">
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          
          <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
          
          <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">1. Interpretation and Definitions</h2>
              <p>For the purposes of this Privacy Policy, "We", "Us", or "Our" refers to the Mool Gyan application. "You" refers to the individual user. "Service" refers to the Mool Gyan application located at {hostUrl}.</p>
          </section>

          <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">2. Data We Collect</h2>
              <p>We collect information to provide and improve our Service. The types of data we collect include:</p>
              
              <h3 className="text-xl font-semibold text-primary">2.1. Voluntarily Provided Data</h3>
              <p>We collect personally identifiable information only when you voluntarily provide it through:</p>
              <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Book Orders:</strong> Name, mobile number, and full shipping address to process delivery.</li>
                  <li><strong>Joining KGF:</strong> Name, father's name, mobile number, and email address for registration.</li>
                  <li><strong>Deeksha Applications:</strong> Details required for spiritual initiation processing.</li>
                  <li><strong>Feedback & FAQs:</strong> Name and contact info to respond to your inquiries.</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-primary">2.2. Push Notifications</h3>
              <p>With your permission, we collect an anonymous Firebase Cloud Messaging (FCM) token to send you spiritual updates and news. This token does not identify you personally.</p>
          </section>
          
          <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">3. How We Use Your Data</h2>
              <ul className="list-disc pl-6 space-y-2">
                  <li>To fulfill your book orders and registrations.</li>
                  <li>To send timely notifications about Satsang and events.</li>
                  <li>To improve the spiritual experience of the application.</li>
                  <li>We never sell or share your personal data with third-party advertisers.</li>
              </ul>
          </section>

          <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">4. Data Security</h2>
              <p>Your data is protected by Google Firebase, a secure cloud platform. We use HTTPS encryption and strict Access Control lists via Firebase Security Rules to ensure your information remains private.</p>
          </section>

          <section className="space-y-3">
              <h2 className="text-2xl font-semibold text-white">5. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, contact us at: <span className="text-primary font-semibold">sharmadevendra715@gmail.com</span></p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}