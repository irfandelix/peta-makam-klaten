'use server'

import { db } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';

export async function updateMakamData(blok: string, no: string, pemilik: string, status: string, pin: string) {
  // Validasi PIN di server!
  if (pin !== process.env.ADMIN_PIN) {
    return { success: false, error: "Akses ditolak. PIN salah atau tidak ada." };
  }

  try {
    const docId = `${blok}-${no}`;
    
    // Simpan ke Firestore (Upsert: buat baru jika belum ada)
    await db.collection('makam').doc(docId).set({
      blok: blok,
      no: no,
      pemilik: pemilik,
      status: status,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Beritahu Next.js agar me-refresh data di halaman utama
    revalidatePath('/'); 

    return { success: true };
  } catch (error) {
    console.error("Gagal menyimpan ke Firebase:", error);
    return { success: false, error: "Gagal menyimpan data." };
  }
}