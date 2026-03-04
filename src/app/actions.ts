'use server'

import { connectMongoDB } from '@/lib/mongodb';
import Makam from '@/models/Makam';
import { revalidatePath } from 'next/cache';

// Ini adalah fungsi ajaib Server Action untuk menyimpan perubahan
export async function updateMakamData(blok: string, no: string, pemilik: string, status: string) {
  try {
    await connectMongoDB();

    // Cari makam berdasarkan Blok dan No, lalu update datanya
    await Makam.findOneAndUpdate(
      { blok: blok, no: no }, // Pencari
      { pemilik: pemilik, status: status }, // Data baru
      { upsert: true } // Kalau belum ada datanya, buat baru
    );

    // Beritahu Next.js agar me-refresh data di halaman utama agar peta berubah warnanya
    revalidatePath('/'); 

    return { success: true };
  } catch (error) {
    console.error("Gagal menyimpan ke DB:", error);
    return { success: false, error: "Gagal menyimpan data." };
  }
}