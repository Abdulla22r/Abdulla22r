/*
  # Create Energy Trading Tables

  1. New Tables
    - `energy_trades`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (numeric, energy amount in kWh)
      - `price` (numeric, price per kWh)
      - `type` (text, 'buy' or 'sell')
      - `created_at` (timestamp)
    
    - `energy_storage`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `current_level` (numeric, current storage level in kWh)
      - `capacity` (numeric, maximum storage capacity in kWh)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to:
      - Read their own trades and storage
      - Create new trades
      - Update their storage levels
*/

-- Create energy trades table
CREATE TABLE IF NOT EXISTS energy_trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  price numeric NOT NULL CHECK (price >= 0),
  type text NOT NULL CHECK (type IN ('buy', 'sell')),
  created_at timestamptz DEFAULT now()
);

-- Create energy storage table
CREATE TABLE IF NOT EXISTS energy_storage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  current_level numeric NOT NULL DEFAULT 0 CHECK (current_level >= 0),
  capacity numeric NOT NULL DEFAULT 100 CHECK (capacity > 0),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE energy_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE energy_storage ENABLE ROW LEVEL SECURITY;

-- Policies for energy_trades
CREATE POLICY "Users can view their own trades"
  ON energy_trades
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create trades"
  ON energy_trades
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for energy_storage
CREATE POLICY "Users can view their own storage"
  ON energy_storage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own storage"
  ON energy_storage
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their storage record"
  ON energy_storage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);