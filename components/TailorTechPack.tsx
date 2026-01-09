import { StyleRecommendation } from '@/types';

export default function TailorTechPack({ recommendation }: { recommendation: StyleRecommendation }) {
  return (
    <div className="bg-white p-8 border-2 border-black font-mono text-sm shadow-xl">
      <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">AYLA | TECHNICAL SPECIFICATION</h2>
        <span className="text-xs">ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <section>
          <h3 className="bg-black text-white px-2 py-1 mb-3">DESIGN SUMMARY</h3>
          <p><strong>Style:</strong> {recommendation.outfit.outfit_type.replace('_', ' ')}</p>
          <p><strong>Neckline:</strong> {recommendation.outfit.top_design.neckline}</p>
          <p><strong>Sleeves:</strong> {recommendation.outfit.top_design.sleeve_length}</p>
          <p><strong>Fit:</strong> {recommendation.outfit.top_design.fit}</p>
        </section>

        <section>
          <h3 className="bg-black text-white px-2 py-1 mb-3">MEASUREMENTS (IN)</h3>
          <div className="grid grid-cols-2 gap-x-4">
            <p>Bust: {recommendation.measurements.bust.toFixed(1)}</p>
            <p>Waist: {recommendation.measurements.waist.toFixed(1)}</p>
            <p>Hip: {recommendation.measurements.hip.toFixed(1)}</p>
            <p>Shoulder: {recommendation.measurements.shoulder_width.toFixed(1)}</p>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <h3 className="bg-black text-white px-2 py-1 mb-3">TAILOR NOTES</h3>
        <ul className="list-disc pl-5 space-y-1">
          {recommendation.tailor_notes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h3 className="bg-black text-white px-2 py-1 mb-3">FABRIC CARE INSTRUCTIONS</h3>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>Hand wash in cold water with mild detergent</li>
          <li>Avoid bleach and harsh chemicals</li>
          <li>Dry flat or hang in shade to prevent fading</li>
          <li>Iron on low heat or steam gently</li>
          <li>Store in breathable cotton bag away from direct sunlight</li>
        </ul>
      </section>
      
      <button className="w-full mt-8 bg-black text-white py-3 font-bold hover:bg-gray-800 transition-colors">
        EXPORT AS PDF FOR TAILOR
      </button>
    </div>
  );
}