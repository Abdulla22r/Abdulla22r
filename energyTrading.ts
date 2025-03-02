import { blockchain, Transaction } from './blockchain';
import { supabase } from './supabase';

export interface TradeRequest {
  fromUserId: string;
  toUserId: string;
  energyAmount: number;
  pricePerUnit: number;
}

export async function createEnergyTrade(trade: TradeRequest): Promise<Transaction> {
  try {
    // First, record the trade in Supabase
    const { error } = await supabase.from('energy_trades').insert({
      user_id: trade.fromUserId,
      amount: trade.energyAmount,
      price: trade.pricePerUnit,
      type: trade.fromUserId === trade.toUserId ? 'sell' : 'buy'
    });

    if (error) throw error;

    // Then add it to the blockchain
    await blockchain.addTransaction({
      fromUserId: trade.fromUserId,
      toUserId: trade.toUserId,
      energyAmount: trade.energyAmount,
      pricePerUnit: trade.pricePerUnit
    });

    // Mine the block with the new transaction
    await blockchain.minePendingTransactions(trade.fromUserId);

    // Return the latest transaction
    const pendingTransactions = blockchain.getPendingTransactions();
    return pendingTransactions[pendingTransactions.length - 1];
  } catch (error) {
    console.error('Error creating energy trade:', error);
    throw error;
  }
}

export function getBlockchainHistory(): Transaction[] {
  const chain = blockchain.getChain();
  return chain.flatMap(block => block.transactions);
}

export async function validateBlockchain(): Promise<boolean> {
  return await blockchain.isChainValid();
}