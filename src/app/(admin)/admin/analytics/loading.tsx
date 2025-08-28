import { Skeleton } from '@/components/ui/skeleton';
import { Activity } from 'lucide-react';

export default function AnalyticsLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-senegal-green-600" />
            Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Chargement des statistiques...
          </p>
        </div>
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Cartes skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>

      {/* Graphique skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64 mb-6" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
}