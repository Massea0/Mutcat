export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-senegal-green-500 via-senegal-yellow-500 to-senegal-red-500 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Test CSS - Vérification des styles
        </h1>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-senegal-green-600 mb-4">
            Si vous voyez cette page avec des couleurs, le CSS fonctionne !
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-senegal-green-500 text-white p-4 rounded-lg text-center">
              Vert Sénégal
            </div>
            <div className="bg-senegal-yellow-500 text-black p-4 rounded-lg text-center">
              Jaune Sénégal
            </div>
            <div className="bg-senegal-red-500 text-white p-4 rounded-lg text-center">
              Rouge Sénégal
            </div>
          </div>
          
          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-senegal-green-500 to-senegal-green-600 text-white py-3 px-6 rounded-lg hover:shadow-lg transition-all">
              Bouton avec gradient
            </button>
            
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700">
                Cette page utilise Tailwind CSS avec les couleurs personnalisées du Sénégal.
              </p>
            </div>
            
            <div className="flex gap-2">
              <span className="badge bg-senegal-green-100 text-senegal-green-700 px-3 py-1 rounded-full text-sm">
                Badge Vert
              </span>
              <span className="badge bg-senegal-yellow-100 text-senegal-yellow-700 px-3 py-1 rounded-full text-sm">
                Badge Jaune
              </span>
              <span className="badge bg-senegal-red-100 text-senegal-red-700 px-3 py-1 rounded-full text-sm">
                Badge Rouge
              </span>
            </div>
          </div>
        </div>
        
        <div className="glass-effect rounded-2xl p-8 text-white">
          <h3 className="text-xl font-bold mb-4">Effet Glassmorphism</h3>
          <p>Si vous voyez un effet de flou derrière ce bloc, le CSS avancé fonctionne aussi !</p>
        </div>
      </div>
    </div>
  )
}