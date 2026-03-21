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
  Globe
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
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'software' | 'status'>('software');

  const supabase = createClient();

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

      const merged = (cats || []).map((cat: any) => ({
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
    
    try {
      const { data, error } = await supabase.rpc('verify_software_key', {
        p_key: userInputKey
      });

      if (error) throw error;
      
      const result = data[0];
      if (result.success && result.loader_url) {
        window.open(result.loader_url, '_blank');
        setUserInputKey('');
      } else {
        setError(result.message || 'Verification failed');
      }
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
           <div className="grid grid-cols-1 gap-4">
             {categories.map(cat => (
               <div key={`status-tab-${cat.id}`} className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 h-32 w-32 bg-[var(--accent)]/5 blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                    <div className="h-16 w-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center p-3 overflow-hidden shadow-inner">
                      {cat.logo_url ? (
                        <img src={cat.logo_url} alt={cat.name} className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <Package className="text-white/10" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-widest">{cat.name}</h3>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                        System Stability: 100%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 relative z-10 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-center">
                       <span className="block text-[8px] text-white/10 font-black uppercase tracking-[0.3em] mb-2">Current State</span>
                       <div className="flex items-center gap-3">
                         <div className={`w-2 h-2 rounded-full animate-pulse transition-all`} style={{ 
                            backgroundColor: cat.status === 'detected' ? '#ef4444' : cat.status === 'testing' ? '#eab308' : '#22c55e',
                            boxShadow: `0 0-12px ${cat.status === 'detected' ? 'rgba(239,68,68,0.6)' : cat.status === 'testing' ? 'rgba(234,179,8,0.6)' : 'rgba(34,197,94,0.6)'}`
                         }} />
                         <span className={`text-base font-black uppercase tracking-[0.2em] ${
                            cat.status === 'detected' ? 'text-red-500' :
                            cat.status === 'testing' ? 'text-yellow-500' :
                            'text-green-500'
                         }`}>
                           {(cat.status || 'undetected').toUpperCase()}
                         </span>
                       </div>
                    </div>

                    {isManager && (
                      <div className="h-12 w-[1px] bg-white/5 hidden md:block" />
                    )}

                    {isManager && (
                      <div className="flex flex-col gap-2">
                        <span className="text-[8px] text-white/10 font-black uppercase tracking-[0.2em]">Quick Action</span>
                        <select
                          value={cat.status || 'undetected'}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            const { error } = await supabase.from('software_categories').update({ status: newStatus }).eq('id', cat.id);
                            if (!error) fetchData();
                          }}
                          className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white/40 uppercase tracking-widest outline-none focus:border-[var(--accent)]/30 transition-all hover:text-white cursor-pointer"
                        >
                          <option value="undetected">Set UNDETECTED</option>
                          <option value="testing">Set TESTING</option>
                          <option value="detected">Set DETECTED</option>
                        </select>
                      </div>
                    )}
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

          {/* Global Download Box */}
          {!isManager && (
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

              <div className="pt-4 flex items-center gap-6 text-[8px] text-white/10 font-black uppercase tracking-[0.4em]">
                <span className="flex items-center gap-2">Secure</span>
                <span className="w-1 h-1 rounded-full bg-white/5" />
                <span className="flex items-center gap-2">Instant</span>
                <span className="w-1 h-1 rounded-full bg-white/5" />
                <span className="flex items-center gap-2">Global</span>
              </div>
            </div>
          )}

          {/* Categories consolidated to Status tab */}
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
