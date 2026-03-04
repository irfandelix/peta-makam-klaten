import fs from 'fs';
import path from 'path';
import MapWrapper from '@/components/MapWrapper';
import { connectMongoDB } from '@/lib/mongodb';
import Makam from '@/models/Makam';

export default async function Home() {
  // 1. Ambil KOTAK PETA dari file GeoJSON
  const filePath = path.join(process.cwd(), 'public/data/database-makam.geojson');
  let geojsonData = { type: "FeatureCollection", features: [] };

  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      geojsonData = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Gagal membaca file makam GeoJSON:", error);
  }

  // 2. Ambil GARIS BATAS BLOK dari file GeoJSON (Jika sudah dibuat)
  const batasPath = path.join(process.cwd(), 'public/data/batas-blok.geojson');
  let batasData = { type: "FeatureCollection", features: [] };

  try {
    if (fs.existsSync(batasPath)) {
      const batasContent = fs.readFileSync(batasPath, 'utf8');
      batasData = JSON.parse(batasContent);
    }
  } catch (error) {
    console.error("Gagal membaca file batas GeoJSON:", error);
  }

  // 3. Ambil DATA ALMARHUM dari MongoDB
  let makamData: any[] = [];
  try {
    await connectMongoDB();
    const makamDariDB = await Makam.find({}).lean();
    
    // Rapikan data agar aman dikirim ke peta
    makamData = makamDariDB.map((doc: any) => ({
      ...doc,
      _id: doc._id.toString(),
    }));
  } catch (error) {
    console.error("Gagal mengambil data dari MongoDB:", error);
  }

  return (
    <main className="h-screen w-full overflow-hidden">
      {/* Lempar ketiga data tersebut ke komponen Wrapper */}
      <MapWrapper geojsonData={geojsonData} dbData={makamData} batasData={batasData} />
    </main>
  );
}