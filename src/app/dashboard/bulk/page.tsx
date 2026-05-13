'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, Copy, Check, ShoppingCart, Package, CreditCard, Lock } from 'lucide-react';

interface PricingTier {
  duration: string;
  min_quantity: number;
  price_per_unit: number;
}

interface Order {
  id: string;
  duration: string;
  quantity: number;
  total_price: number;
  status: string;
  keys_generated: string[];
  created_at: string;
}

const durations = [
  { id: '7-days', label: '7 Days' },
  { id: '1-month', label: '1 Month' },
  { id: '3-months', label: '3 Months' }
];

export default function BulkOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('1-month');
  const [quantity, setQuantity] = useState(1);
  const [pricing, setPricing] = useState<PricingTier[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const supabase = createClient();

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      if (data?.role !== 'reseller' && data?.role !== 'admin' && data?.role !== 'owner') {
        router.push('/dashboard');
        return;
      }
      setUserRole(data.role);
    }
    fetchPricing();
    fetchOrders();
  };

  const fetchPricing = async () => {
    const { data } = await supabase
      .from('bulk_pricing_tiers')
      .select('*')
      .eq('is_active', true)
      .order('min_quantity');
    
    if (data) setPricing(data);
  };

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/bulk-order');
    const data = await res.json();
    if (data.success) setOrders(data.orders);
    setLoading(false);
  };

  const getCurrentPrice = () => {
    const tiers = pricing.filter(p => p.duration === selectedDuration);
    const tier = tiers.find(t => t.min_quantity <= quantity);
    return tier?.price_per_unit || 0;
  };

  const getTotalPrice = () => getCurrentPrice() * quantity;

  const handleOrder = async () => {
    setOrdering(true);
    const res = await fetch('/api/bulk-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration: selectedDuration, quantity })
    });
    const data = await res.json();
    
    if (data.success) {
      await fetchOrders();
    }
    setOrdering(false);
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const currentPrice = getCurrentPrice();
  const totalPrice = getTotalPrice();

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] uppercase font-bold tracking-widest">
          <ShoppingCart size={12} />
          Reseller Bulk Orders
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-[0.2em]">
          Buy Keys in Bulk
        </h1>
        <p className="text-white/40 text-sm">
          Purchase multiple keys at discounted prices for resale
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {durations.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDuration(d.id)}
            className={`p-6 rounded-2xl border transition-all ${
              selectedDuration === d.id
                ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 shadow-lg shadow-[var(--accent)]/10'
                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
            }`}
          >
            <Package className={`mb-2 ${selectedDuration === d.id ? 'text-[var(--accent)]' : 'text-white/20'}`} size={24} />
            <div className="text-lg font-black text-white uppercase tracking-wider">{d.label}</div>
            <div className="text-[10px] text-white/30">Select duration</div>
          </button>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6">
        <div>
          <label className="text-[10px] text-white/40 uppercase font-bold tracking-widest block mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 text-white hover:bg-white/[0.08] transition-all"
            >
              -
            </button>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-32 h-12 text-center bg-white/[0.03] border border-white/5 rounded-xl text-white font-black text-xl"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 text-white hover:bg-white/[0.08] transition-all"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between py-4 border-t border-white/5">
          <div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Price per key</div>
            <div className="text-2xl font-black text-white">€{currentPrice.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-white/30 uppercase tracking-widest">Total</div>
            <div className="text-3xl font-black text-[var(--accent)]">€{totalPrice.toFixed(2)}</div>
          </div>
        </div>

        <button
          onClick={handleOrder}
          disabled={ordering || quantity < 1}
          className="w-full h-14 rounded-2xl bg-[var(--accent)] text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--accent-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
        >
          {ordering ? <Loader2 size={16} className="animate-spin" /> : <CreditCard size={16} />}
          Purchase {quantity} Key{quantity > 1 ? 's' : ''}
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-black text-white uppercase tracking-[0.2em]">Order History</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[var(--accent)]" size={24} />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-white/30 text-sm">No orders yet</div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm font-black text-white uppercase">
                      {order.quantity}x {order.duration.replace('-', ' ')}
                    </div>
                    <div className="text-[10px] text-white/30">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-[var(--accent)]">€{order.total_price}</div>
                    <div className={`text-[10px] uppercase font-bold ${
                      order.status === 'paid' ? 'text-green-500' : 
                      order.status === 'pending' ? 'text-yellow-500' : 'text-white/30'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
                
                {order.keys_generated && order.keys_generated.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Keys</div>
                    <div className="flex flex-wrap gap-2">
                      {order.keys_generated.map((key: string) => (
                        <button
                          key={key}
                          onClick={() => copyKey(key)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 hover:border-[var(--accent)]/30 transition-all"
                        >
                          <code className="text-xs font-mono text-white/60">{key}</code>
                          {copiedKey === key ? (
                            <Check size={12} className="text-green-500" />
                          ) : (
                            <Copy size={12} className="text-white/20" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}