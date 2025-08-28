'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Search, Filter, Download, Eye, Calendar, MapPin, Camera } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Photo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail_url: string;
  category: string;
  location?: string;
  date: string;
  tags: string[];
  views: number;
}

export default function PhotosSection() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('type', 'photo')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Mock data for demonstration
      const mockPhotos: Photo[] = [
        {
          id: '1',
          title: 'Inauguration du nouveau quartier résidentiel',
          description: 'Cérémonie d\'inauguration du projet de logements sociaux à Diamniadio',
          url: '/images/housing-project.jpg',
          thumbnail_url: '/images/housing-project.jpg',
          category: 'Logement',
          location: 'Diamniadio',
          date: '2024-01-15',
          tags: ['logement social', 'inauguration', 'diamniadio'],
          views: 1250
        },
        {
          id: '2',
          title: 'Vue aérienne de la nouvelle ville',
          description: 'Perspective aérienne du projet d\'aménagement urbain',
          url: '/images/smart-city.jpg',
          thumbnail_url: '/images/smart-city.jpg',
          category: 'Urbanisme',
          location: 'Lac Rose',
          date: '2024-01-10',
          tags: ['urbanisme', 'aménagement', 'smart city'],
          views: 890
        },
        {
          id: '3',
          title: 'Visite ministérielle sur le terrain',
          description: 'Le ministre en visite d\'inspection des travaux',
          url: '/images/dakar-skyline.jpg',
          thumbnail_url: '/images/dakar-skyline.jpg',
          category: 'Événement',
          location: 'Dakar',
          date: '2024-01-08',
          tags: ['visite', 'ministre', 'inspection'],
          views: 2100
        },
        {
          id: '4',
          title: 'Chantier du pont de l\'émergence',
          description: 'Avancement des travaux du pont reliant les deux rives',
          url: '/images/infrastructure.jpg',
          thumbnail_url: '/images/infrastructure.jpg',
          category: 'Infrastructure',
          location: 'Saint-Louis',
          date: '2024-01-05',
          tags: ['infrastructure', 'pont', 'travaux'],
          views: 1560
        },
        {
          id: '5',
          title: 'Réunion avec les partenaires internationaux',
          description: 'Séance de travail avec la Banque Mondiale',
          url: '/images/meeting.jpg',
          thumbnail_url: '/images/meeting.jpg',
          category: 'Partenariat',
          location: 'Dakar',
          date: '2023-12-20',
          tags: ['partenariat', 'banque mondiale', 'coopération'],
          views: 780
        },
        {
          id: '6',
          title: 'Nouveau parc urbain écologique',
          description: 'Espace vert aménagé au cœur de la ville',
          url: '/images/park.jpg',
          thumbnail_url: '/images/park.jpg',
          category: 'Environnement',
          location: 'Thiès',
          date: '2023-12-15',
          tags: ['environnement', 'parc', 'écologie'],
          views: 1340
        }
      ];

      setPhotos(data && data.length > 0 ? data : mockPhotos);
    } catch (error) {
      console.error('Error loading photos:', error);
      // Use mock data on error
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPhoto = async (photo: Photo) => {
    setSelectedPhoto(photo);
    
    // Track view
    try {
      await supabase
        .from('media')
        .update({ views: (photo.views || 0) + 1 })
        .eq('id', photo.id);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const categories = ['all', 'Logement', 'Urbanisme', 'Infrastructure', 'Événement', 'Partenariat', 'Environnement'];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || photo.category === selectedCategory;
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
              placeholder="Rechercher des photos..."
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

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
              <Dialog>
                <DialogTrigger asChild>
                  <div onClick={() => handleViewPhoto(photo)} className="relative">
                    <div className="aspect-video relative overflow-hidden bg-gray-100">
                      <Image
                        src={photo.thumbnail_url}
                        alt={photo.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-white/90">
                          {photo.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-8 w-8 text-white mx-auto" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">{photo.title}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {photo.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {photo.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(photo.date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="text-sm text-gray-500">
                          <Eye className="h-4 w-4 inline mr-1" />
                          {photo.views} vues
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  {selectedPhoto && (
                    <div>
                      <div className="relative aspect-video mb-4">
                        <Image
                          src={selectedPhoto.url}
                          alt={selectedPhoto.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h2>
                      <p className="text-gray-600 mb-4">{selectedPhoto.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedPhoto.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {selectedPhoto.location}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={selectedPhoto.url} download>
                            <Download className="h-4 w-4 mr-2" />
                            Télécharger
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucune photo trouvée
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}
    </div>
  );
}