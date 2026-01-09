'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDesigns } from '@/hooks/useDesigns';
import { UserSession } from '@/types';

interface SavedDesignsProps {
  onLoadDesign?: (design: UserSession) => void;
}

export default function SavedDesigns({ onLoadDesign }: SavedDesignsProps) {
  const [designs, setDesigns] = useState<any[]>([]);
  const { loadAllDesigns, deleteDesign, loading, error } = useDesigns();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDesigns();
    }
  }, [isOpen]);

  const fetchDesigns = async () => {
    try {
      const data = await loadAllDesigns();
      setDesigns(data);
    } catch (err) {
      console.error('Failed to load designs:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this design?')) {
      try {
        await deleteDesign(id);
        fetchDesigns();
      } catch (err) {
        console.error('Failed to delete design:', err);
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 z-50"
        title="View Saved Designs"
      >
        <span className="text-2xl">💾</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Saved Designs</h2>
                  <p className="text-primary-100 text-sm">Your design collection</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading designs...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">⚠️</span>
                  <p className="text-red-600">{error}</p>
                </div>
              ) : designs.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">📭</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Saved Designs</h3>
                  <p className="text-gray-600">Create your first design to see it here!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {designs.map((design) => (
                    <motion.div
                      key={design._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Design Preview */}
                      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg p-4 mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold">
                            {design.body_type?.shape?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {design.outfit_design?.outfit_type?.replace('_', ' ') || 'Untitled Design'}
                            </h3>
                            <p className="text-sm text-gray-600 capitalize">
                              {design.body_type?.shape} • {design.fabric_selection}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Design Details */}
                      <div className="space-y-2 mb-4">
                        {design.outfit_design?.top_design && (
                          <div className="text-sm">
                            <span className="text-gray-600">Neckline:</span>
                            <span className="ml-2 font-medium capitalize">
                              {design.outfit_design.top_design.neckline?.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                        {design.outfit_design?.top_design?.sleeve_length && (
                          <div className="text-sm">
                            <span className="text-gray-600">Sleeves:</span>
                            <span className="ml-2 font-medium capitalize">
                              {design.outfit_design.top_design.sleeve_length?.replace('_', ' ')}
                            </span>
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Created: {new Date(design.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        {onLoadDesign && (
                          <button
                            onClick={() => {
                              onLoadDesign(design);
                              setIsOpen(false);
                            }}
                            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Load
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(design._id)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
