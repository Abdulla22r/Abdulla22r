import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { createEnergyTrade } from './energyTrading';
import toast from 'react-hot-toast';
import { Battery, Sun, Wind } from 'lucide-react';

interface EnergyProductionProps {
  userId: string;
}

export function EnergyProduction({ userId }: EnergyProductionProps) {
  const [currentProduction, setCurrentProduction] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [interval, setInterval] = useState(5);
  const [energySource, setEnergySource] = useState<'solar' | 'wind'>('solar');

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (autoUpdate) {
      timer = setInterval(async () => {
        // Simulate random energy production between 1-10 kWh
        const production = Math.random() * 9 + 1;
        setCurrentProduction(production);

        try {
          await createEnergyTrade({
            fromUserId: userId,
            toUserId: 'marketplace',
            energyAmount: production,
            pricePerUnit: 0.15 // Base price, could be made dynamic
          });
          
          const { error } = await supabase
            .from('energy_storage')
            .upsert({
              user_id: userId,
              current_level: production,
              updated_at: new Date().toISOString()
            });

          if (error) throw error;
          
        } catch (error: any) {
          toast.error('Failed to update energy production');
          console.error('Error:', error.message);
        }
      }, interval * 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoUpdate, interval, userId, energySource]);

  const handleManualUpdate = async () => {
    setIsUpdating(true);
    try {
      await createEnergyTrade({
        fromUserId: userId,
        toUserId: 'marketplace',
        energyAmount: currentProduction,
        pricePerUnit: 0.15
      });
      toast.success('Energy production updated');
    } catch (error: any) {
      toast.error('Failed to update energy production');
      console.error('Error:', error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Battery className="text-green-500" />
        Energy Production Control
      </h2>

      <div className="space-y-6">
        {/* Energy Source Selection */}
        <div className="flex gap-4" role="radiogroup" aria-label="Energy Source">
          <button
            type="button"
            role="radio"
            aria-checked={energySource === 'solar'}
            onClick={() => setEnergySource('solar')}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
              energySource === 'solar'
                ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Sun className={energySource === 'solar' ? 'text-yellow-500' : 'text-gray-400'} aria-hidden="true" />
            Solar
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={energySource === 'wind'}
            onClick={() => setEnergySource('wind')}
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${
              energySource === 'wind'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Wind className={energySource === 'wind' ? 'text-blue-500' : 'text-gray-400'} aria-hidden="true" />
            Wind
          </button>
        </div>

        {/* Current Production Display */}
        <div className="bg-gray-50 rounded-lg p-4" aria-live="polite">
          <div className="text-sm text-gray-600 mb-1">Current Production</div>
          <div className="text-3xl font-bold text-gray-900">
            {currentProduction.toFixed(2)} kWh
          </div>
        </div>

        {/* Manual Production Input */}
        <div className="space-y-2">
          <label htmlFor="manual-production" className="block text-sm font-medium text-gray-700">
            Manual Production Input
          </label>
          <div className="flex gap-2">
            <input
              id="manual-production"
              type="number"
              value={currentProduction}
              onChange={(e) => setCurrentProduction(Number(e.target.value))}
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              min="0"
              step="0.1"
            />
            <button
              onClick={handleManualUpdate}
              disabled={isUpdating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px] flex items-center justify-center"
              aria-label={isUpdating ? "Updating energy production" : "Update energy production"}
            >
              {isUpdating ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Update'
              )}
            </button>
          </div>
        </div>

        {/* Auto-Update Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Auto Update
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={autoUpdate}
              aria-label="Toggle auto update energy production"
              onClick={() => setAutoUpdate(!autoUpdate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                autoUpdate ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoUpdate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="update-interval" className="text-sm text-gray-600">Update Interval:</label>
            <select
              id="update-interval"
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">1 minute</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}