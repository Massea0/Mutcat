'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ExternalLink, Calendar, Newspaper, FileText, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

interface PressArticle {
  id: string;
  title: string;
  excerpt: string;
  source: string;
  source_logo?: string;
  url: string;
  date: string;
  category: string;
  featured_quote?: string;
}

export default function PresseSection() {
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('press_articles')
        .select('*')
        .eq('is_active', true)
        .order('date', { ascending: false });

      if (error) throw error;

      // Mock data for demonstration
      const mockArticles: PressArticle[] = [
        {
          id: '1',
          title: 'Le Sénégal lance un ambitieux programme de logements sociaux',
          excerpt: 'Le ministère de l\'Urbanisme annonce la construction de 100 000 logements sociaux sur les cinq prochaines années...',
          source: 'Le Soleil',
          url: 'https://example.com/article1',
          date: '2024-01-22',
          category: 'Logement',
          featured_quote: 'Ce programme représente un investissement de 500 milliards FCFA pour améliorer les conditions de vie des Sénégalais.'
        },
        {
          id: '2',
          title: 'Diamniadio : La ville du futur prend forme',
          excerpt: 'La nouvelle ville de Diamniadio continue son développement avec l\'inauguration de nouvelles infrastructures...',
          source: 'L\'Observateur',
          url: 'https://example.com/article2',
          date: '2024-01-20',
          category: 'Urbanisme'
        },
        {
          id: '3',
          title: 'Interview exclusive : Le ministre détaille sa vision pour 2050',
          excerpt: 'Dans un entretien accordé à notre rédaction, le ministre de l\'Urbanisme expose les grands axes de sa politique...',
          source: 'Sud Quotidien',
          url: 'https://example.com/article3',
          date: '2024-01-18',
          category: 'Interview',
          featured_quote: 'Notre objectif est de faire du Sénégal un modèle en matière d\'urbanisme durable en Afrique de l\'Ouest.'
        },
        {
          id: '4',
          title: 'Partenariat renforcé avec la Banque Mondiale',
          excerpt: 'Un nouvel accord de financement de 200 millions de dollars a été signé pour soutenir les projets urbains...',
          source: 'APS',
          url: 'https://example.com/article4',
          date: '2024-01-15',
          category: 'Coopération'
        },
        {
          id: '5',
          title: 'Les défis de l\'urbanisation rapide au Sénégal',
          excerpt: 'Analyse approfondie des enjeux liés à la croissance urbaine et aux solutions proposées par le gouvernement...',
          source: 'Jeune Afrique',
          url: 'https://example.com/article5',
          date: '2024-01-12',
          category: 'Analyse'
        },
        {
          id: '6',
          title: 'Succès du programme de rénovation urbaine à Saint-Louis',
          excerpt: 'La ville historique de Saint-Louis bénéficie d\'un programme de réhabilitation qui préserve son patrimoine...',
          source: 'Le Quotidien',
          url: 'https://example.com/article6',
          date: '2024-01-10',
          category: 'Patrimoine'
        },
        {
          id: '7',
          title: 'Forum international sur les villes durables à Dakar',
          excerpt: 'Le Sénégal accueille un sommet régional sur l\'urbanisme durable avec la participation de 15 pays africains...',
          source: 'RFI',
          url: 'https://example.com/article7',
          date: '2024-01-08',
          category: 'Événement'
        },
        {
          id: '8',
          title: 'Bilan positif pour les projets d\'assainissement urbain',
          excerpt: 'Les investissements dans l\'assainissement portent leurs fruits avec une amélioration notable dans plusieurs villes...',
          source: 'Enquête Plus',
          url: 'https://example.com/article8',
          date: '2024-01-05',
          category: 'Environnement'
        }
      ];

      setArticles(data && data.length > 0 ? data : mockArticles);
    } catch (error) {
      console.error('Error loading press articles:', error);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const sources = ['all', 'Le Soleil', 'L\'Observateur', 'Sud Quotidien', 'APS', 'Jeune Afrique', 'Le Quotidien', 'RFI', 'Enquête Plus'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = selectedSource === 'all' || article.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
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
              placeholder="Rechercher dans la presse..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {sources.map((source) => (
            <Button
              key={source}
              variant={selectedSource === source ? 'default' : 'outline'}
              onClick={() => setSelectedSource(source)}
              size="sm"
            >
              {source === 'all' ? 'Toutes les sources' : source}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {filteredArticles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{article.source}</Badge>
                      <Badge variant="secondary">{article.category}</Badge>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(article.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <CardTitle className="text-xl mb-2">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {article.title}
                      </a>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {article.excerpt}
                    </CardDescription>
                  </div>
                  <Newspaper className="h-8 w-8 text-gray-400 ml-4 flex-shrink-0" />
                </div>
              </CardHeader>
              {article.featured_quote && (
                <CardContent>
                  <div className="bg-gray-50 border-l-4 border-primary p-4 italic">
                    <Quote className="h-5 w-5 text-primary mb-2" />
                    <p className="text-gray-700">"{article.featured_quote}"</p>
                  </div>
                </CardContent>
              )}
              <CardContent>
                <Button variant="outline" size="sm" asChild>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Lire l'article complet
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Aucun article trouvé
          </h3>
          <p className="text-gray-500">
            Essayez de modifier vos critères de recherche
          </p>
        </div>
      )}

      {/* Press Contact Section */}
      <Card className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle>Contact Presse</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Pour toute demande de renseignements de la part de la presse ou pour recevoir 
            nos communiqués, veuillez contacter notre service de communication.
          </p>
          <div className="space-y-2">
            <p className="text-sm">
              <strong>Email:</strong> presse@muctat.gouv.sn
            </p>
            <p className="text-sm">
              <strong>Téléphone:</strong> +221 33 123 45 67
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}