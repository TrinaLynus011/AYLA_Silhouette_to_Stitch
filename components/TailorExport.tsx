// components/TailorExport.tsx
'use client';

interface TailorExportProps {
  recommendation: any;
}

export default function TailorExport({ recommendation }: TailorExportProps) {
  const { outfit, measurements, tailor_notes } = recommendation;

  return (
    <div className="bg-white p-8 border-2 border-gray-900 rounded-none shadow-2xl font-mono text-sm max-w-2xl mx-auto">
      <div className="border-b-2 border-gray-900 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold">AYLA TECH PACK</h1>
          <p>Generated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">DESIGN ID: #AY-{Math.floor(Math.random()*10000)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="bg-gray-900 text-white px-2 py-1 mb-2">SILHOUETTE SPEC</h3>
          <p>Outfit: {outfit.outfit_type}</p>
          <p>Neckline: {outfit.top_design.neckline}</p>
          <p>Sleeves: {outfit.top_design.sleeve_length}</p>
        </div>
        <div>
          <h3 className="bg-gray-900 text-white px-2 py-1 mb-2">MEASUREMENTS (IN)</h3>
          <p>Bust: {measurements.bust}"</p>
          <p>Waist: {measurements.waist}"</p>
          <p>Hips: {measurements.hip}"</p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="bg-gray-900 text-white px-2 py-1 mb-2">TAILOR EXECUTION NOTES</h3>
        <ul className="list-disc pl-5">
          {tailor_notes.map((note: string, i: number) => <li key={i}>{note}</li>)}
        </ul>
      </div>

      <button className="w-full bg-primary-600 text-white py-4 font-bold hover:bg-primary-700 transition-colors">
        DOWNLOAD PDF FOR TAILOR
      </button>
    </div>
  );
}