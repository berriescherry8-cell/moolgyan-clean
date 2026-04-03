
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/i18n';
import { Sparkles, ExternalLink, Users, HandHeart } from 'lucide-react';
import GoogleFormButton from '@/components/GoogleFormButton';

export default function DeekshaAavedanPage() {
  const { t } = useLocale();

  return (
    <div className="w-full max-w-4xl mx-auto">
       <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-0 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Sparkles className="mx-auto h-16 w-16 text-indigo-600 animate-pulse" />
              <HandHeart className="absolute -bottom-1 -right-1 h-8 w-8 text-purple-600 bg-white rounded-full p-1 shadow-md" />
            </div>
          </div>
          <CardTitle className="text-4xl font-headline font-bold text-gray-800">{t.nav_deeksha_aavedan}</CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.deeksha_desc}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Instructions Section */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Users className="mr-3 h-6 w-6 text-indigo-600" />
              आध्यात्मिक दीक्षा के लिए आवेदन कैसे करें
            </h3>
            <div className="space-y-3 text-gray-700">
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                ऊपर दिए गए "दीक्षा आवेदन फॉर्म" बटन पर क्लिक करें
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                Google फॉर्म खुलेगा जहाँ आपको अपना विवरण भरना होगा
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                दीक्षा प्रकार चुनें (प्रथम या द्वितीय)
              </p>
              <p className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                सभी आवश्यक जानकारी भरकर सबमिट करें
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">दीक्षा लेने के लाभ</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">आत्म-ज्ञान का मार्ग प्राप्त करना</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">जन्म-मृत्यु के चक्र से मुक्ति</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">सत्य ज्ञान की प्राप्ति</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">आध्यात्मिक जागृति</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-lg">
              तैयार हैं अपने आध्यात्मिक सफर की शुरुआत करने के लिए?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GoogleFormButton 
                type="deeksha" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105"
              />
            </div>
            <p className="text-sm text-gray-500">
              फॉर्म भरने में लगभग 5 मिनट का समय लगता है
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
