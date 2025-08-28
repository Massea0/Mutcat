'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FileText, 
  Download, 
  Search, 
  Filter,
  File,
  FileCheck,
  Clock,
  Building,
  Home,
  MapPin,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Form {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_size: string;
  download_count: number;
  updated_at: string;
  required_documents?: string[];
  processing_time?: string;
  department?: string;
}

const categoryIcons: { [key: string]: any } = {
  'urbanisme': Building,
  'logement': Home,
  'foncier': MapPin,
  'administratif': FileText,
  'social': Users,
  'autre': File
};

const categoryColors: { [key: string]: string } = {
  'urbanisme': 'bg-blue-100 text-blue-800',
  'logement': 'bg-green-100 text-green-800',
  'foncier': 'bg-purple-100 text-purple-800',
  'administratif': 'bg-orange-100 text-orange-800',
  'social': 'bg-pink-100 text-pink-800',
  'autre': 'bg-gray-100 text-gray-800'
};

export default function FormulairesPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;

      // Mock data for now since the forms table might be empty
      const mockForms: Form[] = [
        {
          id: '1',
          title: 'Demande de permis de construire',
          description: 'Formulaire pour obtenir un permis de construire pour tout projet immobilier',
          category: 'urbanisme',
          file_url: '/forms/permis-construire.pdf',
          file_size: '2.3 MB',
          download_count: 1250,
          updated_at: '2024-01-15',
          required_documents: ['Plan architectural', 'Titre de propriété', 'Étude d\'impact'],
          processing_time: '30 jours',
          department: 'Direction de l\'Urbanisme'
        },
        {
          id: '2',
          title: 'Demande d\'attribution de logement social',
          description: 'Formulaire de candidature pour l\'obtention d\'un logement social',
          category: 'logement',
          file_url: '/forms/logement-social.pdf',
          file_size: '1.8 MB',
          download_count: 3420,
          updated_at: '2024-01-10',
          required_documents: ['Pièce d\'identité', 'Justificatifs de revenus', 'Composition familiale'],
          processing_time: '45 jours',
          department: 'Direction du Logement'
        },
        {
          id: '3',
          title: 'Déclaration de mutation foncière',
          description: 'Formulaire pour déclarer un changement de propriété foncière',
          category: 'foncier',
          file_url: '/forms/mutation-fonciere.pdf',
          file_size: '1.2 MB',
          download_count: 890,
          updated_at: '2024-01-08',
          required_documents: ['Acte de vente', 'Certificat de propriété'],
          processing_time: '15 jours',
          department: 'Service du Cadastre'
        },
        {
          id: '4',
          title: 'Demande de certificat d\'urbanisme',
          description: 'Formulaire pour obtenir un certificat d\'urbanisme opérationnel',
          category: 'urbanisme',
          file_url: '/forms/certificat-urbanisme.pdf',
          file_size: '980 KB',
          download_count: 560,
          updated_at: '2024-01-05',
          processing_time: '2 mois',
          department: 'Direction de l\'Urbanisme'
        },
        {
          id: '5',
          title: 'Demande d\'autorisation de lotir',
          description: 'Formulaire pour obtenir une autorisation de lotissement',
          category: 'foncier',
          file_url: '/forms/autorisation-lotir.pdf',
          file_size: '3.1 MB',
          download_count: 340,
          updated_at: '2024-01-03',
          required_documents: ['Plan de lotissement', 'Étude technique', 'Titre foncier'],
          processing_time: '3 mois',
          department: 'Direction de l\'Aménagement'
        },
        {
          id: '6',
          title: 'Formulaire de réclamation',
          description: 'Formulaire général pour soumettre une réclamation au ministère',
          category: 'administratif',
          file_url: '/forms/reclamation.pdf',
          file_size: '650 KB',
          download_count: 1890,
          updated_at: '2023-12-28',
          processing_time: '7 jours',
          department: 'Service des Relations Citoyennes'
        }
      ];

      setForms(data && data.length > 0 ? data : mockForms);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(mockForms.map(form => form.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading forms:', error);
      // Use mock data on error
      const mockForms: Form[] = [
        {
          id: '1',
          title: 'Demande de permis de construire',
          description: 'Formulaire pour obtenir un permis de construire',
          category: 'urbanisme',
          file_url: '/forms/permis-construire.pdf',
          file_size: '2.3 MB',
          download_count: 1250,
          updated_at: '2024-01-15',
          processing_time: '30 jours'
        }
      ];
      setForms(mockForms);
      setCategories(['urbanisme']);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (form: Form) => {
    // Track download
    try {
      await supabase
        .from('forms')
        .update({ download_count: (form.download_count || 0) + 1 })
        .eq('id', form.id);
    } catch (error) {
      console.error('Error tracking download:', error);
    }

    // Trigger download
    window.open(form.file_url, '_blank');
  };

  const filteredForms = forms.filter(form => {
    const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Formulaires et Documents
            </h1>
            <p className="text-xl opacity-90">
              Téléchargez tous les formulaires nécessaires pour vos démarches administratives
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher un formulaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Tous
              </Button>
              {categories.map((category) => {
                const Icon = categoryIcons[category] || File;
                return (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                );
              })}
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            {filteredForms.length} formulaire(s) trouvé(s)
          </div>
        </div>
      </section>

      {/* Forms Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredForms.map((form, index) => {
              const Icon = categoryIcons[form.category] || File;
              return (
                <motion.div
                  key={form.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Icon className="h-8 w-8 text-primary" />
                        <Badge className={categoryColors[form.category] || 'bg-gray-100'}>
                          {form.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{form.title}</CardTitle>
                      <CardDescription>{form.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {form.processing_time && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            Délai: {form.processing_time}
                          </div>
                        )}
                        
                        {form.department && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            {form.department}
                          </div>
                        )}

                        {form.required_documents && form.required_documents.length > 0 && (
                          <div className="text-sm">
                            <p className="font-medium mb-1">Documents requis:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                              {form.required_documents.slice(0, 2).map((doc, idx) => (
                                <li key={idx} className="text-xs">{doc}</li>
                              ))}
                              {form.required_documents.length > 2 && (
                                <li className="text-xs text-primary">
                                  +{form.required_documents.length - 2} autre(s)
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="text-sm text-gray-500">
                            <FileCheck className="h-4 w-4 inline mr-1" />
                            {form.file_size}
                          </div>
                          <div className="text-sm text-gray-500">
                            <Download className="h-4 w-4 inline mr-1" />
                            {form.download_count} téléchargements
                          </div>
                        </div>

                        <Button 
                          onClick={() => handleDownload(form)}
                          className="w-full"
                          variant="default"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredForms.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucun formulaire trouvé
              </h3>
              <p className="text-gray-500">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Besoin d'aide ?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Si vous avez des questions concernant les formulaires ou si vous avez besoin d'assistance 
                pour remplir un document, n'hésitez pas à nous contacter.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" asChild>
                  <a href="/contact">Nous contacter</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/faq">Consulter la FAQ</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}