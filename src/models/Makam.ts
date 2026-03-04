import mongoose, { Schema } from 'mongoose';

const makamSchema = new Schema({
  no: { type: String, required: true },
  blok: { type: String, required: true },
  pemilik: { type: String, default: '-' },
  status: { type: String, default: 'Tersedia' },
});

// Ini agar tidak error saat Next.js me-refresh halaman
const Makam = mongoose.models.Makam || mongoose.model('Makam', makamSchema);

export default Makam;