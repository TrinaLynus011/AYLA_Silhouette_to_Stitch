'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BodyType, DetailedMeasurements } from '@/types';

interface MeasurementsInputProps {
  bodyType: BodyType;
  onMeasurementsComplete: (measurements: DetailedMeasurements) => void;
  onBack: () => void;
}

export default function MeasurementsInput({ 
  bodyType, 
  onMeasurementsComplete, 
  onBack 
}: MeasurementsInputProps) {
  const [measurements, setMeasurements] = useState<DetailedMeasurements>({
    bust: 36,
    waist: 28,
    hip: 38,
    shoulder_width: 15,
    height: 165,
    under_bust: 32,
    arm_length: 22,
    neck_circumference: 14,
    blouse_length: 15,
    skirt_length: 40,
    sleeve_length: 18
  });

  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');

  const handleChange = (field: keyof DetailedMeasurements, value: number) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    onMeasurementsComplete(measurements);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📏 Your Measurements
        </h2>
        <p className="text-gray-600 mb-4">
          Accurate measurements ensure perfect fit. These will be used for all garment construction.
        </p>
        
        {/* Body Shape Reminder */}
        <div className="inline-flex items-center space-x-2 bg-primary-50 border border-primary-200 px-4 py-2 rounded-lg">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {bodyType.shape.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-primary-900 font-medium capitalize">
            {bodyType.shape} Body Shape
          </span>
        </div>
      </div>

      {/* Unit Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setUnit('inches')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              unit === 'inches'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Inches
          </button>
          <button
            onClick={() => setUnit('cm')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              unit === 'cm'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Centimeters
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PRIMARY MEASUREMENTS */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-red-500 mr-2">*</span>
            Critical Measurements
          </h3>
          
          <div className="space-y-4">
            <MeasurementInput
              label="Bust"
              value={measurements.bust}
              unit={unit}
              onChange={(v) => handleChange('bust', v)}
              icon="👚"
              required
            />
            <MeasurementInput
              label="Waist"
              value={measurements.waist}
              unit={unit}
              onChange={(v) => handleChange('waist', v)}
              icon="⚖️"
              required
            />
            <MeasurementInput
              label="Hip"
              value={measurements.hip}
              unit={unit}
              onChange={(v) => handleChange('hip', v)}
              icon="👖"
              required
            />
            <MeasurementInput
              label="Shoulder Width"
              value={measurements.shoulder_width}
              unit={unit}
              onChange={(v) => handleChange('shoulder_width', v)}
              icon="📐"
              required
            />
            <MeasurementInput
              label="Height"
              value={measurements.height}
              unit={unit === 'inches' ? 'inches' : 'cm'}
              onChange={(v) => handleChange('height', v)}
              icon="📏"
              required
            />
          </div>
        </div>

        {/* SECONDARY MEASUREMENTS */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Measurements
            <span className="text-sm text-gray-500 ml-2">(Optional)</span>
          </h3>
          
          <div className="space-y-4">
            <MeasurementInput
              label="Under Bust"
              value={measurements.under_bust || 0}
              unit={unit}
              onChange={(v) => handleChange('under_bust', v)}
              icon="📍"
            />
            <MeasurementInput
              label="Arm Length"
              value={measurements.arm_length || 0}
              unit={unit}
              onChange={(v) => handleChange('arm_length', v)}
              icon="💪"
            />
            <MeasurementInput
              label="Neck Circumference"
              value={measurements.neck_circumference || 0}
              unit={unit}
              onChange={(v) => handleChange('neck_circumference', v)}
              icon="⭕"
            />
            <MeasurementInput
              label="Blouse Length"
              value={measurements.blouse_length || 0}
              unit={unit}
              onChange={(v) => handleChange('blouse_length', v)}
              icon="👗"
            />
            <MeasurementInput
              label="Skirt Length"
              value={measurements.skirt_length || 0}
              unit={unit}
              onChange={(v) => handleChange('skirt_length', v)}
              icon="👘"
            />
            <MeasurementInput
              label="Sleeve Length"
              value={measurements.sleeve_length || 0}
              unit={unit}
              onChange={(v) => handleChange('sleeve_length', v)}
              icon="🧥"
            />
          </div>
        </div>
      </div>

      {/* Measurement Guide */}
      <div className="card bg-blue-50 border-blue-200 mt-6">
        <h4 className="font-medium text-blue-900 mb-3">💡 How to Measure</h4>
        <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
          <div>
            <strong>Bust:</strong> Measure around the fullest part of your chest
          </div>
          <div>
            <strong>Waist:</strong> Measure around your natural waistline
          </div>
          <div>
            <strong>Hip:</strong> Measure around the fullest part of your hips
          </div>
          <div>
            <strong>Shoulder:</strong> Measure from shoulder point to shoulder point
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button onClick={onBack} className="btn-secondary">
          ← Back to Body Shape
        </button>
        
        <button onClick={handleContinue} className="btn-primary">
          Continue to Undertone →
        </button>
      </div>
    </div>
  );
}

// Measurement Input Component
function MeasurementInput({
  label,
  value,
  unit,
  onChange,
  icon,
  required = false
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (value: number) => void;
  icon: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {icon} {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          step="0.5"
          min="0"
        />
        <span className="text-sm text-gray-600 w-16">{unit}</span>
      </div>
    </div>
  );
}
