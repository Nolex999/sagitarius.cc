'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FolderPlus, 
  FilePlus, 
  Trash2, 
  Upload, 
  Download, 
  ChevronDown, 
  ChevronRight, 
  Loader2, 
  AlertCircle, 
  Package, 
  Key, 
  ExternalLink,
  Plus,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

interface SoftwareFile {
  id: string;
  category_id: string;
  name: string;
  description: string;
  url: string;
  size: string;
  version: string;
  is_loader: boolean;
  created_at: string;
}

interface SoftwareKey {
  id: string;
  key: string;
  category_id: string;
  is_active: boolean;
  max_uses: number;
  current_uses: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  logo_url: string;
  files: SoftwareFile[];
  isOpen?: boolean;
  isKeysOpen?: boolean;
  keys?: SoftwareKey[];
  status?: 'undetected' | 'testing' | 'detected' | string;
}

const OWNER_EMAILS = ['chris@sagitarius.cc', 'chris@nolex.me', 'n0lex9999@gmail.com'];

export default function SoftwareManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('member');
  const [error, setError] = useState<string | null>(null);
  
  // Management state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLogo, setNewCategoryLogo] = useState('');
  const [uploading, setUploading] = useState<string | null>(null);
  const [uploadTarget, setUploadTarget] = useState<{ catId: string; isLoader: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [userInputKey, setUserInputKey] = useState('');
  const [isCasinoKey, setIsCasinoKey] = useState<string | null>(null);
  const [casinoSelectedCat, setCasinoSelectedCat] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'software' | 'status'>('software');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const supabase = createClient();

  const downloadPatchedLoader = async (key: string) => {
    const res = await fetch('/api/loader/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
      credentials: 'same-origin',
    });
    if (!res.ok) {
      let msg = 'Download failed';
      try {
        const j = await res.json();
        if (j?.error && typeof j.error === 'string') msg = j.error;
      } catch {
        /* ignore */
      }
      throw new Error(msg);
    }
    const blob = await res.blob();
    let filename = 'Sagitarius-Loader.exe';
    const cd = res.headers.get('Content-Disposition');
    const quoted = cd?.match(/filename="([^"]+)"/i);
    const plain = cd?.match(/filename=([^;\s]+)/i);
    if (quoted?.[1]) filename = quoted[1];
    else if (plain?.[1]) filename = plain[1].replace(/"/g, '');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        let userRole = profile?.role || 'member';
        if (OWNER_EMAILS.some(e => user.email?.toLowerCase() === e.toLowerCase())) {
          userRole = 'owner';
        }
        setRole(userRole);
      }
      
      fetchData();
    }
    init();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: cats, error: catErr } = await supabase
        .from('software_categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (catErr) throw catErr;

      const { data: files, error: fileErr } = await supabase
        .from('software_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (fileErr) throw fileErr;

      const merged = (cats || [])
        .filter((cat: any) => {
          const name = cat.name.toLowerCase();
          return !name.includes('cs2') && !name.includes('external') && !name.includes('faceit') || name.includes('rainbow') || name.includes('siege');
        })
        .map((cat: any) => ({
          ...cat,
          files: (files || []).filter((f: any) => f.category_id === cat.id),
          isOpen: true,
          isKeysOpen: false,
          keys: []
        }));

      setCategories(merged);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isManager = role === 'owner' || role === 'admin';

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const { data, error } = await supabase
        .from('software_categories')
        .insert({
          name: newCategoryName.trim(),
          logo_url: newCategoryLogo.trim() || null,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      setCategories([{ ...data, files: [], isOpen: true, isKeysOpen: false, keys: [] }, ...categories]);
      setNewCategoryName('');
      setNewCategoryLogo('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Are you sure? All files in this category will be deleted.')) return;
    try {
      const { error } = await supabase
        .from('software_categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
      setCategories(categories.filter((c: any) => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleCategory = (id: string) => {
    setCategories(categories.map((c: any) => c.id === id ? { ...c, isOpen: !c.isOpen } : c));
  };

  const fetchKeys = async (catId: string) => {
    try {
      const { data, error } = await supabase
        .from('software_keys')
        .select('*')
        .eq('category_id', catId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCategories(categories.map((c: any) => 
        c.id === catId ? { ...c, keys: data, isKeysOpen: !c.isKeysOpen } : c
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const createKey = async (catId: string) => {
    const randomKey = 'SAG-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + 
                      Math.random().toString(36).substring(2, 10).toUpperCase();
    try {
      const { data, error } = await supabase
        .from('software_keys')
        .insert({
          key: randomKey,
          category_id: catId,
          max_uses: 1,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setCategories(categories.map((c: any) => 
        c.id === catId ? { ...c, keys: [data, ...(c.keys || [])] } : c
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteKey = async (catId: string, keyId: string) => {
    try {
      const { error } = await supabase
        .from('software_keys')
        .delete()
        .eq('id', keyId);
      if (error) throw error;
      setCategories(categories.map((c: any) => 
        c.id === catId ? { ...c, keys: (c.keys || []).filter((k: any) => k.id !== keyId) } : c
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!uploadTarget) return;
    try {
      setError(null);
      setUploading(uploadTarget.catId);

      const fileName = `${Date.now()}_${file.name}`;
      const path = `software/${user.id}/${fileName}`;

      const { error: upErr } = await supabase.storage
        .from('software-files')
        .upload(path, file);

      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('software-files')
        .getPublicUrl(path);

      const { data, error: dbErr } = await supabase
        .from('software_files')
        .insert({
          category_id: uploadTarget.catId,
          name: file.name,
          url: publicUrl,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          is_loader: uploadTarget.isLoader,
          created_by: user.id
        })
        .select()
        .single();

      if (dbErr) throw dbErr;
      
      setCategories(categories.map((c: any) => c.id === uploadTarget.catId 
          ? { ...c, files: [...c.files, data] } 
          : c
      ));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(null);
      setUploadTarget(null);
    }
  };

  const deleteFile = async (catId: string, fileId: string) => {
    try {
      const { error } = await supabase
        .from('software_files')
        .delete()
        .eq('id', fileId);
      if (error) throw error;
      setCategories(categories.map((c: any) => c.id === catId 
          ? { ...c, files: c.files.filter((f: any) => f.id !== fileId) } 
          : c
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const verifyAndDownloadGlobal = async () => {
    if (!userInputKey) return;
    
    setVerifying(true);
    setError(null);
    setIsCasinoKey(null);
    
    try {
      const { data, error } = await supabase.rpc('verify_software_key', {
        p_key: userInputKey
      });

      if (error) throw error;
      
      const result = data[0];
      if (result.success) {
        if (result.message === 'casino_key') {
          setIsCasinoKey(userInputKey);
        } else if (result.loader_url) {
          await downloadPatchedLoader(userInputKey);
          setUserInputKey('');
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 15000);
        }
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const redeemCasinoKey = async () => {
    if (!isCasinoKey) return;
    setVerifying(true);
    try {
      await downloadPatchedLoader(isCasinoKey);
      setIsCasinoKey(null);
      setUserInputKey('');
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 15000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="animate-spin text-[var(--accent)]" size={32} />
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Loading Sagitarius...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-1 bg-white/[0.02] border border-white/5 rounded-2xl p-1.5 backdrop-blur-xl shrink-0 shadow-2xl">
           <button
             onClick={() => setActiveTab('software')}
             className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
               activeTab === 'software' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-white/20 hover:text-white/40'
             }`}
           >
             Software
           </button>
           <button
             onClick={() => setActiveTab('status')}
             className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
               activeTab === 'status' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-white/20 hover:text-white/40'
             }`}
           >
             Status
           </button>
        </div>
      </div>

      {activeTab === 'status' ? (
        <div className="space-y-6 animate-fade-in pb-20">
           {/* Monitoring Detailed View */}
          <div className="grid grid-cols-1 gap-6 pb-20">
            {categories
              .filter((cat: any) => {
                const name = cat.name.toLowerCase();
                return !name.includes('cs2') && !name.includes('external') && !name.includes('faceit');
              })
              .map(cat => (
              <div key={`status-tab-${cat.id}`} className="relative group">
                {/* Premium Background Glow */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--accent)]/0 to-[var(--accent)]/10 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-700" />
                
                <div className="relative p-10 rounded-[2.5rem] bg-[#050505]/60 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 backdrop-blur-3xl overflow-hidden transition-all duration-500 group-hover:bg-[#070707]/80">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-[var(--accent)]/5 blur-[60px] -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                    <div className="h-20 w-20 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center p-4 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-500">
                      {cat.logo_url ? (
                        <img src={cat.logo_url} alt={cat.name} className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                      ) : (
                        <Package className="text-white/10" size={32} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[8px] font-black text-[var(--accent)]/60 uppercase tracking-[0.4em]">Sagitarius.cc</span>
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-[0.25em] group-hover:text-[var(--accent)] transition-colors">{cat.name}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 relative z-10 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                       <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 px-6 py-2.5 rounded-full">
                         <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ 
                            backgroundColor: cat.status === 'detected' ? '#ef4444' : cat.status === 'testing' ? '#eab308' : '#22c55e',
                            boxShadow: `0 0 15px ${cat.status === 'detected' ? 'rgba(239,68,68,0.8)' : cat.status === 'testing' ? 'rgba(234,179,8,0.8)' : 'rgba(34,197,94,0.8)'}`
                         }} />
                         <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${
                            cat.status === 'detected' ? 'text-red-500' :
                            cat.status === 'testing' ? 'text-yellow-500' :
                            'text-green-500'
                         }`}>
                           {(cat.status || 'undetected')}
                         </span>
                       </div>
                    </div>

                    {isManager && (
                      <div className="flex flex-col gap-2 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
                        <span className="text-[8px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">Admin Access</span>
                        <select
                          value={cat.status || 'undetected'}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const { error } = await supabase.from('software_categories').update({ status: newStatus }).eq('id', cat.id);
                            if (!error) fetchData();
                          }}
                          className="bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white/60 uppercase tracking-widest outline-none focus:border-[var(--accent)]/40 transition-all hover:text-white cursor-pointer"
                        >
                          <option value="undetected">Set UNDETECTED</option>
                          <option value="testing">Set TESTING</option>
                          <option value="detected">Set DETECTED</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

      {downloadSuccess && (
        <div className="bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-[2.5rem] p-8 flex flex-col items-center gap-4 text-center backdrop-blur-3xl relative overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="absolute top-0 right-0 h-40 w-40 bg-[var(--accent)]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
           <div className="h-14 w-14 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
             <ShieldCheck size={28} />
           </div>
           <h3 className="text-lg font-black text-white uppercase tracking-[0.2em]">Download Successful</h3>
           <p className="text-[11px] text-white/40 max-w-md leading-relaxed">
              The loader is universal — it works for all games. Payment was required solely for the protection of our software and our business.
           </p>
           <button 
             onClick={() => setDownloadSuccess(false)}
             className="text-[9px] text-white/10 hover:text-white/30 uppercase font-black tracking-widest transition-colors"
           >
             Dismiss
           </button>
        </div>
      )}

          {/* Global Download Box */}
          {/* Global Download Box */}
          {!isManager && !isCasinoKey && (
            <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center gap-6 text-center backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent)]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="h-16 w-16 rounded-2xl bg-[var(--accent)]/[0.03] border border-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]/40 mb-2 group-hover:scale-105 transition-transform duration-500">
                <Download size={32} />
              </div>

              <div className="space-y-1 relative z-10">
                <h2 className="text-xl font-black text-white uppercase tracking-[0.3em]">Download Loader</h2>
                <p className="text-[10px] text-white/20 max-w-md mx-auto font-black uppercase tracking-widest">
                  Enter activation key below to begin the secure download.
                </p>
              </div>
              
              <div className="flex w-full max-w-md gap-3 relative z-10">
                <div className="relative flex-1">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={16} />
                  <input
                    type="text"
                    value={userInputKey}
                    onChange={e => setUserInputKey(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && verifyAndDownloadGlobal()}
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/[0.01] border border-white/5 text-white focus:outline-none focus:border-[var(--accent)]/30 font-mono tracking-wider transition-all placeholder:text-white/10"
                  />
                </div>
                <button
                  onClick={verifyAndDownloadGlobal}
                  disabled={verifying || !userInputKey}
                  className="h-12 px-8 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[var(--accent)]/60 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-[var(--accent)] hover:text-black disabled:opacity-30 transition-all flex items-center gap-3"
                >
                  {verifying ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Download
                </button>
              </div>
            </div>
          )}

          {/* CASINO KEY - Product Selection */}
          {isCasinoKey && !isManager && (
            <div className="bg-white/[0.01] border border-[var(--accent)]/20 rounded-[2.5rem] p-10 flex flex-col items-center gap-8 text-center backdrop-blur-3xl relative overflow-hidden animate-in zoom-in-95 duration-500">
               <div className="absolute top-0 right-0 h-40 w-40 bg-[var(--accent)]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 animate-pulse" />
               
               <div className="flex flex-col items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-[0.3em]">Casino Reward Active</h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">Select a product to redeem your reward:</p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg relative z-10">
                 {categories.filter(c => c.files?.some(f => f.is_loader)).map(cat => (
                   <button
                     key={cat.id}
                     onClick={() => setCasinoSelectedCat(cat.id)}
                     className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
                       casinoSelectedCat === cat.id
                         ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 shadow-lg shadow-[var(--accent)]/10'
                         : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                     }`}
                   >
                     {cat.logo_url ? (
                       <img src={cat.logo_url} alt={cat.name} className="w-12 h-12 object-contain" />
                     ) : (
                       <Package className="text-white/20" size={32} />
                     )}
                     <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{cat.name}</span>
                   </button>
                 ))}
               </div>

               <button
                  onClick={async () => {
                    if (!casinoSelectedCat) return;
                    setVerifying(true);
                    setError(null);
                    try {
                      const { error } = await supabase.rpc('redeem_casino_key', {
                        p_key: isCasinoKey,
                        p_category_id: casinoSelectedCat
                      });
                      if (error) throw error;
                      await downloadPatchedLoader(isCasinoKey);
                      setIsCasinoKey(null);
                      setCasinoSelectedCat(null);
                      setUserInputKey('');
                      setDownloadSuccess(true);
                      setTimeout(() => setDownloadSuccess(false), 15000);
                    } catch (err: any) {
                      setError(err.message);
                    } finally {
                      setVerifying(false);
                    }
                  }}
                  disabled={verifying || !casinoSelectedCat}
                  className="h-14 px-12 rounded-2xl bg-[var(--accent)] text-black font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[var(--accent-gold)] disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-3"
               >
                  {verifying ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Redeem & Download
               </button>

               <button 
                 onClick={() => { setIsCasinoKey(null); setCasinoSelectedCat(null); }}
                 className="text-[9px] text-white/10 hover:text-white/30 uppercase font-black tracking-widest transition-colors"
               >
                 Cancel
               </button>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={e => {
          if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}
