import MapWrapper from '@/components/MapWrapper';

export default async function Home() {
  // 1 & 2. Ambil KOTAK PETA dan GARIS BATAS BLOK langsung dengan import (Aman untuk Vercel)
  const geojsonData = require('../../public/data/database-makam.geojson');
  let batasData = { type: "FeatureCollection", features: [] };
  try {
    batasData = require('../../public/data/batas-blok.geojson');
  } catch (e) {
    console.error("File batas-blok.geojson tidak ditemukan", e);
  }

  // 3. Ambil DATA ALMARHUM dari Firebase Firestore
  let makamData: any[] = [];
  try {
    const { db } = await import('@/lib/firebase');
    const snapshot = await db.collection('makam').get();
    
    makamData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Gagal mengambil data dari Firebase:", error);
  }

  return (
    <main className="h-screen w-full overflow-hidden">
      {/* Lempar ketiga data tersebut ke komponen Wrapper */}
      <MapWrapper geojsonData={geojsonData} dbData={makamData} batasData={batasData} />
    </main>
  );
}