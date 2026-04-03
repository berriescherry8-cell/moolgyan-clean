
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import { MessageSquareQuote, ExternalLink, Star, Heart, Send } from 'lucide-react';
import GoogleFormButton from '@/components/GoogleFormButton';

export default function FeedbackPage() {
  const { t } = useLocale();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-0 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <MessageSquareQuote className="mx-auto h-16 w-16 text-green-600" />
              <Star className="absolute -top-1 -right-1 h-6 w-6 text-yellow-500 bg-white rounded-full p-0.5 shadow-md" />
            </div>
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-gray-800">{t.feedback_title}</CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.feedback_desc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Why Your Feedback Matters */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Heart className="mr-3 h-6 w-6 text-green-600" />
              आपकी प्रतिक्रिया क्यों महत्वपूर्ण है
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</span>
                हमें आपके अनुभव के बारे में बताएं
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</span>
                ऐप में सुधार के लिए सुझाव दें
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</span>
                आपकी राय हमारे लिए कीमती है
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">✓</span>
                बेहतर सेवा प्रदान करने में मदद करें
              </p>
            </div>
          </div>

          {/* How to Submit Feedback */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Send className="mr-3 h-6 w-6 text-green-600" />
              प्रतिक्रिया कैसे दें
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                नीचे दिए गए "प्रतिक्रिया फॉर्म" बटन पर क्लिक करें
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                Google फॉर्म खुलेगा जहाँ आप अपनी प्रतिक्रिया दर्ज कर सकते हैं
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                अपना नाम, ईमेल और विस्तृत प्रतिक्रिया लिखें
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                सबमिट बटन पर क्लिक करके भेजें
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-lg">
              आपकी प्रतिक्रिया हमें बेहतर बनाने में मदद करती है
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GoogleFormButton 
                type="feedback" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
              />
            </div>
            <p className="text-sm text-gray-500">
              आपका समय और विचार हमारे लिए अमूल्य हैं
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
