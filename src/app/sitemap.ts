import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/client'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://muctat.sn'

  // Pages statiques
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/ministere/missions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ministere/ministre`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ministere/directions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/ministere/organigramme`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projets`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/actualites`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/appels-offres`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/publications`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/evenements`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ]

  // Pages dynamiques - Projets
  const { data: projects } = await supabase
    .from('projects')
    .select('id, updated_at')
    .order('updated_at', { ascending: false })
    .limit(100)

  const projectPages: MetadataRoute.Sitemap = projects?.map((project) => ({
    url: `${baseUrl}/projets/${project.id}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: 'monthly',
    priority: 0.7,
  })) || []

  // Pages dynamiques - Actualités
  const { data: news } = await supabase
    .from('news')
    .select('id, updated_at')
    .order('updated_at', { ascending: false })
    .limit(100)

  const newsPages: MetadataRoute.Sitemap = news?.map((article) => ({
    url: `${baseUrl}/actualites/${article.id}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  })) || []

  // Pages dynamiques - Appels d'offres
  const { data: tenders } = await supabase
    .from('tenders')
    .select('id, updated_at')
    .eq('status', 'open')
    .order('updated_at', { ascending: false })
    .limit(50)

  const tenderPages: MetadataRoute.Sitemap = tenders?.map((tender) => ({
    url: `${baseUrl}/appels-offres/${tender.id}`,
    lastModified: new Date(tender.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  })) || []

  // Pages dynamiques - Publications
  const { data: publications } = await supabase
    .from('publications')
    .select('id, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(100)

  const publicationPages: MetadataRoute.Sitemap = publications?.map((pub) => ({
    url: `${baseUrl}/publications/${pub.id}`,
    lastModified: new Date(pub.updated_at),
    changeFrequency: 'monthly',
    priority: 0.5,
  })) || []

  // Pages dynamiques - Événements
  const { data: events } = await supabase
    .from('events')
    .select('id, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(50)

  const eventPages: MetadataRoute.Sitemap = events?.map((event) => ({
    url: `${baseUrl}/evenements/${event.id}`,
    lastModified: new Date(event.updated_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  })) || []

  return [
    ...staticPages,
    ...projectPages,
    ...newsPages,
    ...tenderPages,
    ...publicationPages,
    ...eventPages,
  ]
}