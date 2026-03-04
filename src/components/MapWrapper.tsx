'use client';

import dynamic from 'next/dynamic';

const MapMakam = dynamic(() => import('@/components/MapMakam'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-4"></div>
      <p className="text-sm text-gray-600 font-medium">Memuat Database Makam...</p>
    </div>
  )
});

// Terima batasData di sini dan teruskan ke MapMakam
export default function MapWrapper({ geojsonData, dbData, batasData }: { geojsonData: any, dbData: any, batasData: any }) {
  return <MapMakam geojsonData={geojsonData} dbData={dbData} batasData={batasData} />;
}