export default function TestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#00923f', fontSize: '32px' }}>Test Page - MUCTAT</h1>
      <p style={{ color: '#333' }}>Si vous voyez cette page avec des styles, le serveur fonctionne !</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <h2 style={{ color: '#ffb800' }}>Couleurs du Sénégal</h2>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <div style={{ width: '100px', height: '100px', backgroundColor: '#00923f', borderRadius: '8px' }}></div>
          <div style={{ width: '100px', height: '100px', backgroundColor: '#ffb800', borderRadius: '8px' }}></div>
          <div style={{ width: '100px', height: '100px', backgroundColor: '#d91010', borderRadius: '8px' }}></div>
        </div>
      </div>
      <div className="mt-8 p-4 bg-senegal-green-500 text-white rounded-xl">
        <p>Test avec Tailwind CSS</p>
      </div>
    </div>
  )
}