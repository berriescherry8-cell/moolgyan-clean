
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import { Users, ExternalLink, HandHeart, Star, Sparkles } from 'lucide-react';
import GoogleFormButton from '@/components/GoogleFormButton';

export default function JoinPage() {
  const { t } = useLocale();

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Users className="mx-auto h-16 w-16 text-orange-600" />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-500 bg-white rounded-full p-0.5 shadow-md animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-gray-800">{t.join_title}</CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.join_desc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* What is KGF? */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <HandHeart className="mr-3 h-6 w-6 text-orange-600" />
              केजीएफ क्या है?
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                केजीएफ (KGF) एक आध्यात्मिक संगठन है जो आत्म-ज्ञान और आध्यात्मिक उन्नति के मार्ग पर चलने वालों के लिए समर्पित है।
              </p>
              <p>
                हमारा उद्देश्य लोगों को आत्म-ज्ञान के मार्ग पर लाना और उन्हें जन्म-मृत्यु के चक्र से मुक्ति दिलाना है।
              </p>
            </div>
          </div>

          {/* Benefits of Joining */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Star className="mr-3 h-6 w-6 text-orange-600" />
              शामिल होने के लाभ
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">आध्यात्मिक ज्ञान प्राप्ति</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">सत्संग का लाभ</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">दीक्षा प्राप्ति का अवसर</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">आध्यात्मिक समुदाय में शामिल होना</p>
              </div>
            </div>
          </div>

          {/* How to Join */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <ExternalLink className="mr-3 h-6 w-6 text-orange-600" />
              कैसे शामिल हों?
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                नीचे दिए गए "KGF में शामिल हों" बटन पर क्लिक करें
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                Google फॉर्म खुलेगा जहाँ आपको अपना विवरण भरना होगा
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                अपना नाम, संपर्क जानकारी और आध्यात्मिक रुचि के बारे में बताएं
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                फॉर्म सबमिट करें और हमारी टीम आपसे संपर्क करेगी
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-lg">
              तैयार हैं अपने आध्यात्मिक सफर की शुरुआत करने के लिए?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GoogleFormButton 
                type="join" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
              />
            </div>
            <p className="text-sm text-gray-500">
              शामिल होने में केवल 2 मिनट का समय लगता है
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
