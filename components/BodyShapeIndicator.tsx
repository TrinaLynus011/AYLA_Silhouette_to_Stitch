'use client';

import { BodyType } from '@/types';

interface BodyShapeIndicatorProps {
  bodyType: BodyType;
  position?: 'top-right' | 'top-left';
}

export default function BodyShapeIndicator({ 
  bodyType, 
  position = 'top-right' 
}: BodyShapeIndicatorProps) {
  const positionClasses = position === 'top-right' 
    ? 'top-4 right-4' 
    : 'top-4 left-4';

  return (
    <div className={`fixed ${positionClasses} z-50`}>
      <div className="bg-white shadow-lg rounded-lg p-3 border-2 border-primary-200">
        <div className="flex items-center space-x-3">
          {/* Body Shape Icon */}
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {bodyType.shape.charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Body Info */}
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Your Body</div>
            <div className="text-sm font-bold text-gray-900 capitalize">
              {bodyType.shape}
            </div>
            <div className="text-xs text-gray-600">
              {bodyType.source === 'image' ? '📸 From Photo' : '👤 Manual'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
