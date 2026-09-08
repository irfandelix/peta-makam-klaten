'use client';

import { MapContainer, TileLayer, GeoJSON, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';
import { updateMakamData } from '@/app/actions';

const { BaseLayer, Overlay } = LayersControl;
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
const corner1 = L.latLng(-7.6927527283648471, 110.6083313038653557);
const corner2 = L.latLng(-7.6924243856205905, 110.6085871048037887);
const bounds = L.latLngBounds(corner1, corner2);
const center = bounds.getCenter();

// -- Fungsi Penentu Warna Area Sesuai 7 Blok --
const getBlokColor = (blok: string) => {
  if (!blok) return '#fbbf24'; // Default
  switch (blok.toUpperCase()) {
    case 'A': return '#3b82f6'; // Biru
    case 'B': return '#a855f7'; // Ungu
    case 'C': return '#f97316'; // Orange
    case 'CIKAL BAKAL': return '#ef4444'; // Merah
    case 'D': return '#ec4899'; // Pink
    case 'E': return '#eab308'; // Kuning
    case 'F': return '#14b8a6'; // Tosca/Teal
    default: return '#fbbf24';  // Default
  }
};

export default function MapMakam({ geojsonData, dbData, batasData }: { geojsonData: any, dbData: any[], batasData: any }) {
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedGrave, setSelectedGrave] = useState<any>(null);
  const [formData, setFormData] = useState({ pemilik: '', status: '' });
  const [isSaving, setIsSaving] = useState(false);

  const [adminPin, setAdminPin] = useState<string | null>(null);

  const handleSave = async () => {
    if (!selectedGrave || !adminPin) return;
    setIsSaving(true);
    
    const result = await updateMakamData(
      selectedGrave.blok, 
      selectedGrave.no, 
      formData.pemilik, 
      formData.status,
      adminPin // Kirim PIN ke server
    );

    setIsSaving(false);
    if (result.success) {
      alert(`Sukses! Data Makam ${selectedGrave.blok}-${selectedGrave.no} berhasil diperbarui.`);
      setSelectedGrave(null);
    } else {
      alert("Gagal menyimpan data: " + result.error);
    }
  };

  return (
    <div className="h-screen w-full relative group">
      

    {/* --- PANEL JUDUL & LEGENDA (RESPONSIF) --- */}
      <div className="absolute top-14 md:top-6 left-4 md:left-6 z-[1000]">
        <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 w-56 md:w-64">
          
          {/* Header Judul (Bisa diklik di HP untuk buka/tutup) */}
          <div 
            className="p-3 cursor-pointer md:cursor-default flex justify-between items-center"
            onClick={() => {
              // Hanya berfungsi sebagai toggle di layar kecil
              if (window.innerWidth < 768) {
                const content = document.getElementById('legend-content');
                content?.classList.toggle('hidden');
              }
            }}
          >
            <div>
              <h1 className="text-sm md:text-base font-bold text-gray-800 leading-tight">DATABASE MAKAM</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Klaten, Jawa Tengah</p>
            </div>
            {/* Icon Panah Kecil (Hanya muncul di HP) */}
            <div className="md:hidden text-gray-400 text-sm">▼</div>
          </div>
          
          {/* Isi Legenda (Tersembunyi otomatis di HP, selalu muncul di Desktop) */}
          <div id="legend-content" className="hidden md:block p-3 pt-0 border-t border-gray-100">
            {/* Legenda Status */}
            <div className="py-2">
              <p className="text-xs md:text-sm font-bold text-gray-700 mb-2">Status Kaveling:</p>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-4 h-4 bg-[#22c55e] border border-gray-300 rounded-sm"></div>
                <span className="text-xs text-gray-600">Tersedia / Kosong</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#4a5568] border border-gray-300 rounded-sm"></div>
                <span className="text-xs text-gray-600">Terisi / Diboking</span>
              </div>
            </div>

            {/* Legenda Blok */}
            <div className="border-t border-gray-100 pt-2 pb-1">
              <p className="text-xs md:text-sm font-bold text-gray-700 mb-2">Area Pembatas Blok:</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-2">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#3b82f6] opacity-60 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Blok A</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#a855f7] opacity-60 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Blok B</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#f97316] opacity-60 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Blok C</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#ec4899] opacity-60 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Blok D</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#eab308] opacity-60 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Blok E</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 bg-[#14b8a6] opacity-60 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Blok F</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 mt-0.5">
                  <div className="w-3.5 h-3.5 bg-[#ef4444] opacity-60 rounded-sm"></div>
                  <span className="text-xs text-gray-600">Cikal Bakal</span>
                </div>
              </div>
            </div>

            {/* Tombol Login (Pindah ke dalam Legenda) */}
            <div className="border-t border-gray-100 pt-3 pb-1 mt-1">
              <button 
                onClick={() => {
                  if (isAdmin) {
                    setIsAdmin(false);
                    setAdminPin('');
                  } else {
                    const pin = prompt("Masukkan PIN Admin:");
                    if (pin) {
                      setIsAdmin(true);
                      setAdminPin(pin);
                      alert("Mode Edit Aktif. (PIN akan divalidasi saat menyimpan data)");
                    }
                  }
                }}
                className={`w-full py-2 rounded-lg shadow-sm text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors ${isAdmin ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                {isAdmin ? '🔴 Logout Admin' : '🔒 Login Admin'}
              </button>
            </div>
          </div>

        </div>
      </div>

        <MapContainer
            center={center}
            zoom={21}
            maxBounds={bounds.pad(0.5)}
            maxBoundsViscosity={0.5}
            minZoom={18}
            maxZoom={22}
            className={`h-full w-full ${isAdmin ? 'cursor-cell' : ''}`}
            zoomControl={false}
        >
        <LayersControl position="topright">
          <BaseLayer checked name="Citra Offline (QGIS)">
          <TileLayer 
              url="/tiles/{z}/{x}/{y}.png" 
              maxZoom={22} 
              maxNativeZoom={22}
            />
          </BaseLayer>
          <BaseLayer name="Google Satellite">
            <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" maxZoom={22}/>
          </BaseLayer>

          {/* LAYER 1: BATAS BLOK (Background Warna-Warni) */}
          {batasData && batasData.features && batasData.features.length > 0 && (
            <Overlay checked name="Batas Blok / Jalan">
              <GeoJSON
                data={batasData}
                interactive={false}
                style={(feature) => {
                  const blokName = feature?.properties?.Blok || feature?.properties?.blok;
                  const warnaBlok = getBlokColor(blokName);
                  return {
                    fillColor: warnaBlok, 
                    color: warnaBlok,
                    weight: 2,
                    fillOpacity: 0.2,
                  };
                }}
              />
            </Overlay>
          )}

          {/* LAYER 2: PETAK MAKAM (Kembali Garis Putih) */}
          <Overlay checked name="Petak Makam">
            <GeoJSON
              data={geojsonData}
              style={(feature) => {
                const p = feature?.properties;
                const dataDariDB = dbData?.find(
                  (db) => db.no === p?.No?.toString() && db.blok === p?.Blok
                );
                const isTerisi = dataDariDB?.status === 'Terisi';
                return {
                  fillColor: isTerisi ? '#4a5568' : '#22c55e', 
                  color: 'white',
                  weight: 1.5,
                  opacity: 1,
                  fillOpacity: isAdmin ? 0.9 : 0.7,
                };
              }}
              onEachFeature={(feature, layer) => {
                layer.on('click', () => {
                  const p = feature.properties;
                  const dataDariDB = dbData?.find(
                    (db) => db.no === p?.No?.toString() && db.blok === p?.Blok
                  );

                  // Cek jika nomor makam masih "-" atau kosong
                  if (!p?.No || p?.No?.toString().trim() === '-' || p?.No?.toString().trim() === '') {
                    alert("⚠️ PERHATIAN: Petak makam ini belum memiliki Nomor Kaveling yang unik di data Peta (QGIS). Anda tidak bisa mengisinya sebelum memberikan nomor yang jelas di QGIS.");
                    setSelectedGrave(null);
                    return;
                  }

                  setSelectedGrave({blok: p.Blok, no: p.No.toString()});
                  setFormData({
                    pemilik: dataDariDB?.pemilik || '-',
                    status: dataDariDB?.status || 'Tersedia'
                  });
                });

                if (feature.properties && feature.properties.No) {
                  layer.bindTooltip(feature.properties.No.toString(), {
                    permanent: true,
                    direction: 'center',
                    className: 'map-label'
                  }).openTooltip();
                }
              }}
            />
          </Overlay>
        </LayersControl>
      </MapContainer>

      {/* --- MODAL / PANEL EDIT --- */}
      {selectedGrave && (
        <div className="absolute inset-0 bg-black/60 z-[2000] flex justify-center items-end md:items-center p-0 md:p-4 group/modal" onClick={(e) => {
          if (e.target === e.currentTarget) setSelectedGrave(null);
        }}>
          
          <div className="bg-white w-full md:w-[380px] rounded-t-2xl md:rounded-2xl shadow-2xl p-6 relative animate-slide-up">
            
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h3 className="text-lg font-bold text-gray-900">Makam: <span className='text-green-700'>{selectedGrave.blok} - {selectedGrave.no}</span></h3>
              <button onClick={() => setSelectedGrave(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {isAdmin ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status Kaveling</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full text-sm p-2.5 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 text-gray-900 bg-white"
                  >
                    <option value="Tersedia">✅ Tersedia / Kosong</option>
                    <option value="Terisi">🔴 Sudah Terisi / Diboking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Nama Almarhum / Pemilik (Ahli Waris)</label>
                  <input 
                    type="text" 
                    value={formData.pemilik}
                    onChange={(e) => {
                      const newName = e.target.value;
                      const isKosong = newName.trim() === '' || newName.trim() === '-';
                      setFormData({
                        ...formData, 
                        pemilik: newName,
                        status: isKosong ? 'Tersedia' : 'Terisi'
                      });
                    }}
                    placeholder="Masukkan nama..."
                    className="w-full text-sm p-2.5 border rounded-lg focus:ring-2 focus:ring-green-200 focus:border-green-500 text-gray-900 bg-white placeholder-gray-400"
                  />
                </div>

                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`w-full mt-2 py-3 rounded-lg text-white font-bold transition-all ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
                  {isSaving ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-900"><b>Status:</b> <span className={`font-bold px-2 py-0.5 rounded ${formData.status === 'Terisi' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{formData.status.toUpperCase()}</span></p>
                {formData.status === 'Terisi' && (
                  <p className="text-sm border-t pt-3 text-gray-900"><b>Nama Pemilik:</b> <br/><span className='text-gray-700'>{formData.pemilik}</span></p>
                )}
                <p className="text-xs text-gray-400 italic pt-2 border-t mt-4">Nyalakan 'Mode Edit' untuk mengubah data.</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        .map-label {
          background: transparent;
          border: none;
          box-shadow: none;
          font-size: 10px;
          color: white;
          text-shadow: 1px 1px 2px black, -1px -1px 2px black;
          font-weight: bold;
          pointer-events: none;
        }
        .map-label::before { border: none !important; }

        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}