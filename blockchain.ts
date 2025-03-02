export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  energyAmount: number;
  pricePerUnit: number;
  timestamp: number;
  signature?: string;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export class Blockchain {
  private chain: Block[];
  private difficulty: number;
  private pendingTransactions: Transaction[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4; // Number of leading zeros required in hash
    this.pendingTransactions = [];
  }

  private createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: '0',
      hash: '0',
      nonce: 0
    };
  }

  private async calculateHash(block: Omit<Block, 'hash'>): Promise<string> {
    const data = block.index + block.previousHash + block.timestamp + JSON.stringify(block.transactions) + block.nonce;
    return await sha256(data);
  }

  private async mineBlock(block: Omit<Block, 'hash'>): Promise<Block> {
    let nonce = 0;
    let hash = await this.calculateHash({ ...block, nonce });

    while (hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join('0')) {
      nonce++;
      hash = await this.calculateHash({ ...block, nonce });
    }

    return {
      ...block,
      nonce,
      hash
    };
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  async addTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<void> {
    const timestamp = Date.now();
    const data = timestamp.toString() + JSON.stringify(transaction);
    const id = await sha256(data);
    
    const newTransaction: Transaction = {
      ...transaction,
      id,
      timestamp
    };
    this.pendingTransactions.push(newTransaction);
  }

  async minePendingTransactions(minerAddress: string): Promise<void> {
    const block: Omit<Block, 'hash'> = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      previousHash: this.getLatestBlock().hash,
      nonce: 0
    };

    const newBlock = await this.mineBlock(block);
    this.chain.push(newBlock);
    this.pendingTransactions = [];
  }

  async isChainValid(): Promise<boolean> {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify current block's hash
      const calculatedHash = await this.calculateHash({
        index: currentBlock.index,
        timestamp: currentBlock.timestamp,
        transactions: currentBlock.transactions,
        previousHash: currentBlock.previousHash,
        nonce: currentBlock.nonce
      });

      if (currentBlock.hash !== calculatedHash) {
        return false;
      }

      // Verify chain link
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getChain(): Block[] {
    return this.chain;
  }

  getPendingTransactions(): Transaction[] {
    return this.pendingTransactions;
  }
}

// Singleton instance
export const blockchain = new Blockchain();