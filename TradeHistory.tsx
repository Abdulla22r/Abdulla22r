import React from 'react';
import { getBlockchainHistory } from './energyTrading';
import { Transaction } from './blockchain';

export function TradeHistory() {
  const [trades, setTrades] = React.useState<Transaction[]>([]);

  React.useEffect(() => {
    const history = getBlockchainHistory();
    setTrades(history);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Blockchain Trade History</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {trades.map((trade) => (
          <div key={trade.id} className="px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Trade ID: {trade.id.substring(0, 8)}...
                </p>
                <p className="text-sm text-gray-500">
                  {trade.energyAmount} kWh at ${trade.pricePerUnit}/kWh
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date(trade.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              <p>From: {trade.fromUserId.substring(0, 8)}...</p>
              <p>To: {trade.toUserId.substring(0, 8)}...</p>
            </div>
          </div>
        ))}
        {trades.length === 0 && (
          <div className="px-6 py-4 text-center text-gray-500">
            No trades recorded in the blockchain yet
          </div>
        )}
      </div>
    </div>
  );
}