'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Search, Play, Calendar, Eye, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  duration: string;
  category: string;
  date: string;
  views: number;
  author?: string;
}

export default function VideosSection() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('type', 'video')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mock data for demonstration
      const mockVideos: Video[] = [
        {
          id: '1',
          title: 'Présentation du Plan National d\'Urbanisme 2050',
          description: 'Le ministre présente la vision et les objectifs du nouveau plan d\'urbanisme',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: '/images/video-thumb-1.jpg',
          duration: '15:30',
          category: 'Conférence',
          date: '2024-01-20',
          views: 5420,
          author: 'MUCTAT TV'
        },
        {
          id: '2',
          title: 'Visite virtuelle du nouveau quartier écologique',
          description: 'Découvrez en 3D le projet de quartier durable de Diamniadio',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: '/images/video-thumb-2.jpg',
          duration: '8:45',
          category: 'Projet',
          date: '2024-01-18',
          views: 3210,
          author: 'Direction de l\'Urbanisme'
        },
        {
          id: '3',
          title: 'Témoignages des bénéficiaires de logements sociaux',
          description: 'Les familles partagent leur expérience dans les nouveaux logements',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: '/images/video-thumb-3.jpg',
          duration: '12:20',
          category: 'Reportage',
          date: '2024-01-15',
          views: 8900,
          author: 'MUCTAT TV'
        },
        {
          id: '4',
          title: 'Formation sur les procédures d\'obtention de permis',
          description: 'Session de formation pour les professionnels du secteur',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: '/images/video-thumb-4.jpg',
          duration: '45:00',
          category: 'Formation',
          date: '2024-01-10',
          views: 2100,
          author: 'Service Formation'
        },
        {
          id: '5',
          title: 'Cérémonie de pose de première pierre',
          description: 'Lancement officiel du projet de rénovation urbaine',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: '/images/video-thumb-5.jpg',
          duration: '20:15',
          category: 'Événement',
          date: '2024-01-05',
          views: 4560,
          author: 'MUCTAT TV'
        },
        {
          id: '6',
          title: 'Interview exclusive avec le ministre',
          description: 'Le ministre répond aux questions sur les défis de l\'urbanisation',
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          thumbnail_url: '/images/video-thumb-6.jpg',
          duration: '30:00',
          category: 'Interview',
          date: '2023-12-28',
          views: 12340,
          author: 'Communication MUCTAT'
        }
      ];

      setVideos(data && data.length > 0 ? data : mockVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayVideo = async (video: Video) => {
    setSelectedVideo(video);
    
    // Track view
    try {
      await supabase
        .from('media')
        .update({ views: (video.views || 0) + 1 })
        .eq('id', video.id);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const categories = ['all', 'Conférence', 'Projet', 'Reportage', 'Formation', 'Événement', 'Interview'];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Rechercher des vidéos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              size="sm"
            >
              {category === 'all' ? 'Toutes' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <Dialog>
                <DialogTrigger asChild>
                  <div 
                    className="cursor-pointer group"
                    onClick={() => handlePlayVideo(video)}
                  >
                    <div className="relative aspect-video bg-gray-900">
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 z-10">
                        <Badge variant="secondary" className="bg-black/70 text-white">
                          {video.duration}
                        </Badge>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="mb-2">
                        {video.category}
                      </Badge>
                      <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        {video.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {video.author}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(video.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          <Eye className="h-4 w-4 inline mr-1" />
                          {video.views.toLocaleString('fr-FR')} vues
                        </div>
                        <div className="text-sm text-gray-500">
                          <Clock className="h-4 w-4 inline mr-1" />
                          {video.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  {selectedVideo && (
                    <div>
                      <div className="aspect-video mb-4">
                        <iframe
                          src={selectedVideo.url}
                          title={selectedVideo.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{selectedVideo.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div>
                          <Eye className="h-4 w-4 inline mr-1" />
                          {selectedVideo.views.toLocaleString('fr-FR')} vues
                        </div>
                        <div>
                          <Calendar className="h-4 w-4 inline mr-1" />
                          {new Date(selectedVideo.date).toLocaleDateString('fr-FR')}
                        </div>
                        {selectedVideo.author && (
                          <div>
                            <User className="h-4 w-4 inline mr-1" />
                            {selectedVideo.author}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Play className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucune vidéo trouvée
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
}