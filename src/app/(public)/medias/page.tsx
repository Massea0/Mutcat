'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Video, Newspaper } from 'lucide-react';
import PhotosSection from './photos/page';
import VideosSection from './videos/page';
import PresseSection from './presse/page';

export default function MediasPage() {
  const [activeTab, setActiveTab] = useState('photos');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Médiathèque
          </h1>
          <p className="text-xl opacity-90">
            Découvrez nos réalisations en images, vidéos et dans la presse
          </p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="photos" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Vidéos
              </TabsTrigger>
              <TabsTrigger value="presse" className="flex items-center gap-2">
                <Newspaper className="h-4 w-4" />
                Presse
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="photos">
              <PhotosSection />
            </TabsContent>
            
            <TabsContent value="videos">
              <VideosSection />
            </TabsContent>
            
            <TabsContent value="presse">
              <PresseSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}