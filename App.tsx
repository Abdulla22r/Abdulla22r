import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Battery, Zap, ArrowLeftRight, BarChart3, Settings, User, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { TradeHistory } from './components/TradeHistory';
import { EnergyProduction } from './components/EnergyProduction';
import { createEnergyTrade } from './lib/energyTrading';
import { Toaster } from 'react-hot-toast';

const mockData = [
  { time: '00:00', energy: 4, price: 0.12 },
  { time: '04:00', energy: 2, price: 0.10 },
  { time: '08:00', energy: 6, price: 0.15 },
  { time: '12:00', energy: 8, price: 0.18 },
  { time: '16:00', energy: 5, price: 0.14 },
  { time: '20:00', energy: 3, price: 0.11 },
];

function App() {
  const [session, setSession] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        getUserType(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        getUserType(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserType = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('prosumer_type')
      .eq('id', userId);

    if (!error && data && data.length > 0) {
      setUserType(data[0].prosumer_type);
    } else {
      console.error('Error fetching user type:', error);
      setUserType('consumer'); // Default to consumer if no profile found
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <>
        <Toaster position="top-right" />
        <AuthForm />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">EnergyChain</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {session.user.email}
              </div>
              <button className="p-2 rounded-full hover:bg-gray-100" aria-label="User settings">
                <User className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Application settings">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label="Sign out"
              >
                <LogOut className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Battery className="h-10 w-10 text-blue-500" />
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Current Energy Storage</h3>
                <p className="text-2xl font-semibold">85%</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ArrowLeftRight className="h-10 w-10 text-green-500" />
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Today's Trades</h3>
                <p className="text-2xl font-semibold">12 kWh</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart3 className="h-10 w-10 text-purple-500" />
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm">Current Rate</h3>
                <p className="text-2xl font-semibold">$0.14/kWh</p>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Production Controls (for producers/prosumers only) */}
        {(userType === 'producer' || userType === 'prosumer') && (
          <div className="mb-8">
            <EnergyProduction userId={session.user.id} />
          </div>
        )}

        {/* Charts */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Energy Trading Overview</h2>
          <div className="w-full overflow-x-auto">
            <LineChart width={800} height={400} data={mockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="energy" stroke="#2563eb" name="Energy (kWh)" />
              <Line yAxisId="right" type="monotone" dataKey="price" stroke="#16a34a" name="Price ($/kWh)" />
            </LineChart>
          </div>
        </div>

        {/* Trade History from Blockchain */}
        <TradeHistory />
      </div>
    </div>
  );
}

export default App;