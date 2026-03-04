import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import Makam from '@/models/Makam';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // 1. Sambungkan ke Database
    await connectMongoDB();

    // 2. Baca file GeoJSON kamu
    const filePath = path.join(process.cwd(), 'public/data/database-makam.geojson');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const geojsonData = JSON.parse(fileContent);

    // 3. Ekstrak hanya datanya saja (tanpa titik koordinat)
    const dataYangMauDimasukkan = geojsonData.features.map((feature: any) => {
      const p = feature.properties;
      return {
        no: p.No,
        blok: p.Blok,
        pemilik: p.Pemilik || '-',
        status: p.Status || 'Tersedia'
      };
    });

    // 4. Bersihkan database lama (jika ada), lalu masukkan semua data baru
    await Makam.deleteMany({});
    await Makam.insertMany(dataYangMauDimasukkan);

    return NextResponse.json({ 
      pesan: "Sukses! Database berhasil diisi.", 
      jumlah_data: dataYangMauDimasukkan.length 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ pesan: "Gagal mengisi database", error }, { status: 500 });
  }
}