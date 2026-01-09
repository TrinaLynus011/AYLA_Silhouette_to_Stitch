'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserSession, TailorExport } from '@/types';
import { useDesigns } from '@/hooks/useDesigns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportPanelProps {
  session: UserSession;
  onBack: () => void;
  onNewDesign: () => void;
}

export default function ExportPanel({ session, onBack, onNewDesign }: ExportPanelProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'image' | 'whatsapp'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);
  const { saveDesign, loading: savingDesign } = useDesigns();
  const designCardRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Save design to database first (non-blocking)
      if (!savedDesignId) {
        saveDesign(session).then(id => setSavedDesignId(id)).catch(console.error);
      }
      
      // Generate export data immediately
      const exportData: TailorExport = {
        design_sketch: generateDesignSketch(),
        style_annotations: generateStyleAnnotations(),
        fabric_notes: generateFabricNotes(),
        fit_intent: generateFitIntent(),
        format: exportFormat
      };
      
      // Trigger download based on format
      if (exportFormat === 'pdf') {
        downloadPDF(exportData);
      } else if (exportFormat === 'image') {
        downloadImage(exportData);
      } else {
        shareWhatsApp(exportData);
      }
      
      setExportComplete(true);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateDesignSketch = (): string => {
    // In a real implementation, this would generate an actual design sketch
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="600" fill="white"/>
        <text x="200" y="40" text-anchor="middle" font-size="28" font-weight="bold" fill="#f97316">Ayla</text>
        <text x="200" y="65" text-anchor="middle" font-size="12" fill="#666" font-style="italic">From Silhouette to Stitch, Designed on You</text>
        <text x="200" y="95" text-anchor="middle" font-size="18" font-weight="bold">Outfit Design</text>
        <text x="200" y="115" text-anchor="middle" font-size="14">Custom Design for ${session.body_type?.shape} Body Type</text>
        <!-- Design sketch would be generated here -->
        <rect x="150" y="140" width="100" height="150" fill="none" stroke="black" stroke-width="2"/>
        <text x="200" y="320" text-anchor="middle" font-size="14">Outfit: ${session.outfit_design?.outfit_type}</text>
        <text x="200" y="340" text-anchor="middle" font-size="14">Neckline: ${session.outfit_design?.top_design.neckline}</text>
        <text x="200" y="360" text-anchor="middle" font-size="14">Sleeves: ${session.outfit_design?.top_design.sleeve_length}</text>
        <text x="200" y="380" text-anchor="middle" font-size="14">Fit: ${session.outfit_design?.top_design.fit}</text>
      </svg>
    `);
  };

  const generateStyleAnnotations = (): string[] => {
    const annotations = [
      `Ayla Design Reference - From Silhouette to Stitch, Designed on You`,
      `Body Type: ${session.body_type?.shape} (${session.body_type?.source} analysis)`,
      `Outfit Type: ${session.outfit_design?.outfit_type?.replace('_', ' ')}`,
      `Fabric: ${session.fabric_selection}${session.custom_fabric ? ` - ${session.custom_fabric}` : ''}`,
      `Neckline: ${session.outfit_design?.top_design.neckline?.replace('_', ' ')} - ${getNecklineDescription(session.outfit_design?.top_design.neckline)}`,
      `Sleeve Length: ${session.outfit_design?.top_design.sleeve_length?.replace('_', ' ')} - ${getSleeveDescription(session.outfit_design?.top_design.sleeve_length)}`,
      `Back Design: ${session.outfit_design?.top_design.back_design} - ${getBackDescription(session.outfit_design?.top_design.back_design)}`,
      `Top Length: ${session.outfit_design?.top_design.length} - ${getLengthDescription(session.outfit_design?.top_design.length)}`,
      `Fit: ${session.outfit_design?.top_design.fit} - ${getFitDescription(session.outfit_design?.top_design.fit)}`
    ];
    
    // Add undertone info if available
    if (session.undertone_analysis) {
      annotations.push(`Skin Undertone: ${session.undertone_analysis.undertone} (${session.undertone_analysis.source})`);
      annotations.push(`Primary Color: ${session.outfit_design?.color_scheme.primary_color}`);
    }
    
    return annotations;
  };

  const generateFabricNotes = (): string[] => {
    const notes = [];
    
    if (session.fabric_selection) {
      notes.push(`Primary fabric: ${session.fabric_selection}`);
      
      if (session.custom_fabric) {
        notes.push(`Fabric description: ${session.custom_fabric}`);
      }
      
      // Add fabric-specific handling notes
      const fabricNotes = getFabricHandlingNotes(session.fabric_selection);
      notes.push(...fabricNotes);
    }
    
    return notes;
  };

  const generateFitIntent = (): string => {
    const bodyType = session.body_type?.shape;
    const fit = session.outfit_design?.top_design?.fit;
    
    let intent = `This design is intended for a ${bodyType} body type with a ${fit} fit. `;
    
    switch (bodyType) {
      case 'hourglass':
        intent += 'Focus on maintaining the natural waist definition while ensuring comfort.';
        break;
      case 'pear':
        intent += 'Emphasize the upper body while ensuring comfortable fit around the hips.';
        break;
      case 'apple':
        intent += 'Create a flattering silhouette that elongates the torso.';
        break;
      case 'rectangle':
        intent += 'Add shape and definition to create curves.';
        break;
    }
    
    return intent;
  };

  const downloadPDF = async (exportData: TailorExport) => {
    if (!designCardRef.current) return;

    try {
      // Capture the design card as a canvas
      const canvas = await html2canvas(designCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add Ayla branding header
      pdf.setFontSize(24);
      pdf.setTextColor(249, 115, 22); // primary color
      pdf.text('Ayla', 105, 20, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text('From Silhouette to Stitch, Designed on You', 105, 27, { align: 'center' });

      // Add design image
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 15, 35, imgWidth, Math.min(imgHeight, 180));

      let yPos = 35 + Math.min(imgHeight, 180) + 10;

      // Add styling recommendations if there's space
      if (session.recommendations && yPos < 250) {
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text('Styling Recommendations', 15, yPos);
        yPos += 7;

        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 60);
        
        // Accessories
        if (session.recommendations.accessories?.length) {
          pdf.text('Accessories:', 15, yPos);
          yPos += 5;
          session.recommendations.accessories.slice(0, 2).forEach(acc => {
            const lines = pdf.splitTextToSize(`• ${acc}`, 180);
            pdf.text(lines, 20, yPos);
            yPos += lines.length * 4;
          });
          yPos += 2;
        }

        // Tailor notes
        if (session.recommendations.tailor_notes?.length && yPos < 270) {
          pdf.text('Tailor Notes:', 15, yPos);
          yPos += 5;
          session.recommendations.tailor_notes.slice(0, 3).forEach(note => {
            const lines = pdf.splitTextToSize(`• ${note}`, 180);
            pdf.text(lines, 20, yPos);
            yPos += lines.length * 4;
          });
        }
      }

      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Generated by Ayla • www.ayla.design', 105, 285, { align: 'center' });

      pdf.save(`ayla-design-${Date.now()}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to text export
      const content = exportData.style_annotations.join('\n') + '\n\n' + 
                      exportData.fabric_notes.join('\n') + '\n\n' +
                      exportData.fit_intent;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ayla-outfit-design-reference.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadImage = async (exportData: TailorExport) => {
    if (!designCardRef.current) return;

    try {
      const canvas = await html2canvas(designCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ayla-design-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (error) {
      console.error('Image export failed:', error);
    }
  };

  const shareWhatsApp = (exportData: TailorExport) => {
    const message = `
🧵 Blouse Design Reference

${exportData.style_annotations.join('\n')}

📝 Fabric Notes:
${exportData.fabric_notes.join('\n')}

✨ Generated by Ayla - From Silhouette to Stitch, Designed on You
    `;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div
        ref={designCardRef}
        className="bg-white rounded-lg p-6 mb-8 border-2 border-gray-200"
      >
        <div className="text-center mb-6">
          <h4 className="text-xl font-bold text-primary-600 mb-1">Ayla Design Reference</h4>
          <p className="text-xs text-gray-500 italic">From Silhouette to Stitch, Designed on You</p>
        </div>

        <div className="space-y-4">
                {/* Body Type & Fabric */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-primary-700 mb-1">Body Type</p>
                    <p className="text-sm font-semibold text-primary-900 capitalize">{session.body_type?.shape}</p>
                    <p className="text-xs text-primary-600">{session.body_type?.source} analysis</p>
                  </div>
                  <div className="bg-secondary-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-secondary-700 mb-1">Fabric</p>
                    <p className="text-sm font-semibold text-secondary-900 capitalize">{session.fabric_selection}</p>
                    {session.custom_fabric && <p className="text-xs text-secondary-600">{session.custom_fabric}</p>}
                  </div>
                </div>

                {/* Outfit Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-3 text-sm">Outfit Design</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{session.outfit_design?.outfit_type?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Neckline:</span>
                      <span className="font-medium capitalize">{session.outfit_design?.top_design?.neckline?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sleeves:</span>
                      <span className="font-medium capitalize">{session.outfit_design?.top_design?.sleeve_length?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fit:</span>
                      <span className="font-medium capitalize">{session.outfit_design?.top_design?.fit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Length:</span>
                      <span className="font-medium capitalize">{session.outfit_design?.top_design?.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Color:</span>
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-4 h-4 rounded border border-gray-300" 
                          style={{ backgroundColor: session.outfit_design?.color_scheme?.primary_color || '#D2691E' }}
                        />
                        <span className="text-xs">{session.outfit_design?.color_scheme?.primary_color}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Undertone Info */}
                {session.undertone_analysis && (
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-purple-700 mb-1">Skin Undertone</p>
                    <p className="text-sm font-semibold text-purple-900 capitalize">{session.undertone_analysis.undertone}</p>
                    <div className="flex gap-1 mt-2">
                      {session.undertone_analysis.recommended_colors?.slice(0, 6).map((color, idx) => (
                        <div key={idx} className="w-4 h-4 rounded border border-white shadow-sm" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations Preview */}
                {session.recommendations && (
                  <div className="border-t pt-3">
                    <h5 className="font-semibold text-gray-900 mb-2 text-xs">Key Recommendations</h5>
                    {session.recommendations.accessories?.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs font-medium text-gray-700">Accessories:</p>
                        <p className="text-xs text-gray-600">• {session.recommendations.accessories[0]}</p>
                      </div>
                    )}
                    {session.recommendations.tailor_notes?.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-700">For Tailor:</p>
                        {session.recommendations.tailor_notes.slice(0, 2).map((note, idx) => (
                          <p key={idx} className="text-xs text-gray-600">• {note}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
        </div>

        <div className="text-center mt-6 pt-4 border-t">
          <p className="text-xs text-gray-400">Generated by Ayla • {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-8 shadow-sm"
      >
        {!exportComplete ? (
          <>
            {/* Format Selection */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Choose Export Format</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    format: 'pdf' as const,
                    title: 'PDF Document',
                    description: 'Professional tailor reference',
                    icon: '📄',
                    recommended: true
                  },
                  {
                    format: 'image' as const,
                    title: 'PNG Image',
                    description: 'Visual design reference',
                    icon: '🖼️',
                    recommended: false
                  },
                  {
                    format: 'whatsapp' as const,
                    title: 'WhatsApp Share',
                    description: 'Quick share with tailor',
                    icon: '💬',
                    recommended: false
                  }
                ].map((option) => (
                  <motion.div
                    key={option.format}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
                      exportFormat === option.format
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-white hover:border-primary-300'
                    }`}
                    onClick={() => setExportFormat(option.format)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option.recommended && (
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Recommended
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-3xl mb-2">{option.icon}</div>
                      <h5 className="font-semibold text-gray-900 mb-1">{option.title}</h5>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Export Preview</h4>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Body Type:</span>
                    <span className="ml-2 capitalize">{session.body_type?.shape}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Fabric:</span>
                    <span className="ml-2 capitalize">{session.fabric_selection}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Neckline:</span>
                    <span className="ml-2 capitalize">{session.outfit_design?.top_design?.neckline?.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Sleeves:</span>
                    <span className="ml-2 capitalize">{session.outfit_design?.top_design?.sleeve_length?.replace('_', ' ')}</span>
                  </div>
                </div>
                
                {session.recommendations?.tailor_notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Tailor Notes:</span>
                    <ul className="mt-2 space-y-1">
                      {session.recommendations.tailor_notes.slice(0, 3).map((note, index) => (
                        <li key={index} className="text-gray-600 text-xs">• {note}</li>
                      ))}
                      {session.recommendations.tailor_notes.length > 3 && (
                        <li className="text-gray-500 text-xs">+ {session.recommendations.tailor_notes.length - 3} more notes</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Export Button */}
            <div className="text-center">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="btn-primary px-8 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Generating Export...</span>
                  </div>
                ) : (
                  `Export as ${exportFormat.toUpperCase()}`
                )}
              </button>
            </div>
          </>
        ) : (
          /* Export Complete */
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
            >
              <span className="text-3xl">✅</span>
            </motion.div>
            
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Export Complete!
            </h3>
            <p className="text-gray-600 mb-8">
              Your blouse design reference has been {exportFormat === 'whatsapp' ? 'shared' : 'downloaded'}. 
              Share it with your tailor to bring your vision to life!
            </p>
            
            <div className="flex justify-center space-x-4">
              <button onClick={onNewDesign} className="btn-primary">
                Create New Design
              </button>
              <button onClick={() => setExportComplete(false)} className="btn-secondary">
                Export Again
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        {!exportComplete && (
          <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
            <button onClick={onBack} className="btn-secondary">
              ← Back to Recommendations
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

// Helper functions for descriptions
function getNecklineDescription(neckline?: string): string {
  const descriptions = {
    round: 'Classic curved neckline',
    boat: 'Wide horizontal neckline',
    deep_round: 'Lower curved neckline',
    square: 'Geometric square cut',
    sweetheart: 'Heart-shaped neckline',
    halter: 'Neck-tie style'
  };
  return descriptions[neckline as keyof typeof descriptions] || '';
}

function getSleeveDescription(sleeve?: string): string {
  const descriptions = {
    sleeveless: 'No sleeves',
    cap: 'Short cap sleeves',
    short: 'Short sleeves',
    elbow: 'Elbow-length sleeves',
    three_quarter: '3/4 length sleeves',
    full: 'Full-length sleeves'
  };
  return descriptions[sleeve as keyof typeof descriptions] || '';
}

function getBackDescription(back?: string): string {
  const descriptions = {
    high: 'Conservative back coverage',
    medium: 'Moderate back opening',
    deep: 'Lower back opening',
    very_deep: 'Very low back opening'
  };
  return descriptions[back as keyof typeof descriptions] || '';
}

function getLengthDescription(length?: string): string {
  const descriptions = {
    crop: 'Shorter length',
    regular: 'Standard length',
    long: 'Extended length'
  };
  return descriptions[length as keyof typeof descriptions] || '';
}

function getFitDescription(fit?: string): string {
  const descriptions = {
    fitted: 'Close-fitting silhouette',
    regular: 'Comfortable standard fit',
    loose: 'Relaxed loose fit'
  };
  return descriptions[fit as keyof typeof descriptions] || '';
}

function getFabricHandlingNotes(fabric: string): string[] {
  const notes: Record<string, string[]> = {
    silk: ['Use silk-appropriate needles', 'Handle with care to avoid snags'],
    chiffon: ['Consider lining for opacity', 'Use French seams'],
    georgette: ['Handle delicately', 'May require lining'],
    velvet: ['Cut in same direction for consistent nap', 'Use appropriate pressing'],
    cotton: ['Pre-wash fabric', 'Standard sewing techniques'],
    linen: ['May require pressing', 'Consider pre-shrinking'],
    satin: ['Use sharp needles', 'Handle carefully to avoid pulls'],
    organza: ['Use fine needles', 'Consider interfacing for structure'],
    brocade: ['Let fabric pattern guide design', 'Use heavy-duty needles']
  };
  
  return notes[fabric] || ['Follow standard fabric handling procedures'];
}