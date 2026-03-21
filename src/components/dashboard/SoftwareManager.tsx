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
  const [uploading, setUploading] = useState<string | null>(null); // Category ID
  const [uploadTarget, setUploadTarget] = useState<{ catId: string; isLoader: boolean } | null>(null);
  const [fileInputRef] = [useRef<HTMLInputElement>(null)];
  
  const [userInputKey, setUserInputKey] = useState('');
  const [verifying, setVerifying] = useState(false);

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
        <p className="text-white/40 text-sm animate-pulse">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-widest">
              <Download size={28} className="text-[var(--accent)]" />
              Products
            </h1>
            <p className="text-[10px] text-white/20 mt-1 font-black uppercase tracking-widest">
              Private Software Access & Monitoring
            </p>
          </div>
          
          <div className="flex items-center gap-6 bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-3">
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">UD</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">MT</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
               <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">DT</span>
             </div>
          </div>
        </div>

      {/* Monitoring Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(cat => (
          <div key={`mon-${cat.id}`} className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between group">
             <div className="flex items-center gap-3">
               <div className="h-2 w-2 rounded-full shadow-lg" style={{ 
                 backgroundColor: cat.status === 'detected' ? '#ef4444' : cat.status === 'testing' ? '#eab308' : '#22c55e',
                 boxShadow: `0 0 10px ${cat.status === 'detected' ? 'rgba(239,68,68,0.4)' : cat.status === 'testing' ? 'rgba(234,179,8,0.4)' : 'rgba(34,197,94,0.4)'}`
               }} />
               <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">{cat.name}</span>
             </div>
             <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md border ${
               cat.status === 'detected' ? 'bg-red-500/10 border-red-500/10 text-red-500' :
               cat.status === 'testing' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
               'bg-green-500/10 border-green-500/10 text-green-500'
             }`}>
               {(cat.status || 'undetected').toUpperCase()}
             </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Category Creation removed per user request */}

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

      {/* Tabs removed per user request for simplicity */}

      <div className="space-y-4 min-h-[400px]">
        {categories
          .filter((cat: any) => {
            if (isManager) return true;
            return cat.is_active;
          })
          .map((cat: any) => (
          <div key={cat.id} className="rounded-2xl bg-white/[0.01] border border-white/5 overflow-hidden group">
            <div 
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.01] transition-all"
              onClick={() => toggleCategory(cat.id)}
            >
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center overflow-hidden">
                  {cat.logo_url ? (
                    <img src={cat.logo_url} alt={cat.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <Package className="text-white/10" size={20} />
                  )}
                </div>
                <div>
                   <h3 className="text-[13px] font-black text-white/90 uppercase tracking-[0.2em]">{cat.name}</h3>
                   <div className="flex items-center gap-1.5 mt-0.5">
                     <span className={`text-[7px] font-black uppercase tracking-widest ${
                       cat.status === 'detected' ? 'text-red-500' :
                       cat.status === 'testing' ? 'text-yellow-500' :
                       'text-green-500'
                     }`}>
                       {(cat.status || 'undetected').toUpperCase()}
                     </span>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {isManager && (
                  <select
                    value={cat.status || 'undetected'}
                    onClick={(e) => e.stopPropagation()}
                    onChange={async (e) => {
                      const newStatus = e.target.value;
                      const { error } = await supabase.from('software_categories').update({ status: newStatus }).eq('id', cat.id);
                      if (!error) fetchData();
                    }}
                    className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[8px] font-black text-white/40 uppercase tracking-widest outline-none focus:border-[var(--accent)]/30 transition-all"
                  >
                    <option value="undetected">UD</option>
                    <option value="testing">MT</option>
                    <option value="detected">DT</option>
                  </select>
                )}
                {isManager && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                    className="p-2 rounded-xl text-white/10 hover:text-red-400 hover:bg-red-500/5 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className={`transition-transform duration-300 ${cat.isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="text-white/10" size={18} />
                </div>
              </div>
            </div>

            {cat.isOpen && (
               <div className="px-5 pb-6 pt-2 space-y-6 text-center">
                 <p className="text-[11px] text-white/40">Enter activation key below to download loader for {cat.name}</p>
                 <div className="flex w-full max-w-sm mx-auto gap-3">
                    <div className="relative flex-1">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input
                        type="text"
                        value={userInputKey}
                        onChange={e => setUserInputKey(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && verifyAndDownloadGlobal()}
                        placeholder="Key"
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-white/[0.01] border border-white/5 text-[11px] text-white focus:outline-none focus:border-[var(--accent)]/30 font-mono tracking-wider transition-all placeholder:text-white/10"
                      />
                    </div>
                    <button
                      onClick={verifyAndDownloadGlobal}
                      disabled={verifying || !userInputKey}
                      className="h-11 px-6 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {verifying ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      Download
                    </button>
                  </div>

                {/* Key Management (Owner/Admin only) */}
                {isManager && (
                  <div className="space-y-3">
                    <button 
                      onClick={() => fetchKeys(cat.id)}
                      className="flex items-center gap-2 text-[9px] font-black text-[var(--accent)]/40 hover:text-[var(--accent)] uppercase tracking-[0.2em] transition-all px-1"
                    >
                      <Key size={12} />
                      {cat.isKeysOpen ? 'Close Management' : 'Manage Keys'}
                    </button>

                    {cat.isKeysOpen && (
                      <div className="p-4 rounded-2xl bg-[var(--accent)]/[0.02] border border-[var(--accent)]/5 space-y-4">
                        <div className="flex items-center justify-between px-1">
                           <h5 className="text-[9px] text-[var(--accent)]/30 uppercase tracking-[0.2em] font-black">Active Keys</h5>
                           <button 
                             onClick={() => createKey(cat.id)}
                             className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[8px] bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[var(--accent)]/60 font-black uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-black transition-all"
                           >
                              <Plus size={10} /> Generate
                           </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {(cat.keys || []).map((k: any) => (
                            <div key={k.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 group/key">
                               <div className="flex flex-col">
                                 <code className="text-[12px] text-white/80 font-mono tracking-wider font-bold uppercase">{k.key}</code>
                                 <span className="text-[8px] text-white/15 font-black uppercase tracking-[0.2em] mt-1">
                                   {k.current_uses} / {k.max_uses === 0 ? '∞' : k.max_uses} used
                                 </span>
                               </div>
                               <button 
                                 onClick={() => deleteKey(cat.id, k.id)}
                                 className="h-8 w-8 flex items-center justify-center rounded-lg text-white/10 hover:text-red-400 hover:bg-red-500/5 transition-all"
                               >
                                  <Trash2 size={13} />
                               </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Files List - Only visible to managers (Owner/Admin) per user request */}
                {isManager && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between px-1">
                      <h5 className="text-[9px] text-white/15 uppercase tracking-[0.2em] font-black">Files</h5>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setUploadTarget({ catId: cat.id, isLoader: true });
                            fileInputRef.current?.click();
                          }}
                          disabled={uploading === cat.id}
                          className="px-3 py-1.5 rounded-lg text-[8px] bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-[var(--accent)]/60 font-black uppercase tracking-[0.2em] hover:bg-[var(--accent)] hover:text-black transition-all"
                        >
                          Add Loader
                        </button>
                        <button
                          onClick={() => {
                            setUploadTarget({ catId: cat.id, isLoader: false });
                            fileInputRef.current?.click();
                          }}
                          disabled={uploading === cat.id}
                          className="px-3 py-1.5 rounded-lg text-[8px] bg-white/[0.02] border border-white/5 text-white/30 font-black uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all"
                        >
                          Add Public
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {cat.files.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all group/file">
                          <div className="flex items-center gap-4">
                            <div className={`h-9 w-9 rounded-lg flex items-center justify-center border ${file.is_loader ? 'bg-[var(--accent)]/[0.03] border-[var(--accent)]/10 text-[var(--accent)]/40' : 'bg-white/[0.02] border-white/5 text-white/10'}`}>
                              <Package size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[13px] font-bold text-white/90 truncate">{file.name}</span>
                                {file.is_loader && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-[var(--accent)]/10 border border-[var(--accent)]/10 text-[var(--accent)] text-[8px] font-black uppercase tracking-widest">Loader</span>
                                )}
                              </div>
                              <p className="text-[9px] text-white/15 font-black uppercase tracking-[0.2em] mt-0.5">Version {file.version || '1.0.0'} • {file.size}</p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => deleteFile(cat.id, file.id)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-white/10 hover:text-red-400 hover:bg-red-500/5 transition-all"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                      
                      {cat.files.length === 0 && (
                        <div className="text-center py-8 border border-white/5 border-dashed rounded-2xl">
                          <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.2em]">No files available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-20 bg-white/[0.01] rounded-[2rem] border border-white/[0.04]">
            <Package size={48} className="mx-auto mb-4 text-white/10" />
            <h4 className="text-white/60 font-bold">No Software Available</h4>
            <p className="text-white/20 text-xs mt-1">Please come back later or contact an administrator.</p>
          </div>
        )}
      </div>

      {/* News & Changelog Section */}
      <div className="pt-12 space-y-8">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-xl font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
             <Globe className="text-[var(--accent)]" size={24} />
             Latest Updates
           </h2>
           <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">Dev Blog</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 relative overflow-hidden group hover:border-[var(--accent)]/20 transition-all duration-500">
              <div className="absolute top-0 right-0 p-4 pt-6 text-[8px] font-black text-white/10 uppercase tracking-widest">21 Mar 2026</div>
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-green-500/10 border border-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-widest">
                    Security Update
                 </div>
                 <h3 className="text-lg font-black text-white uppercase tracking-wider">Faceit Kernel Driver Re-build</h3>
                 <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wider">
                    We updated the internal communication protocol to bypass the latest AC patch. All users are required to download the new loader version.
                 </p>
                 <div className="pt-2 flex items-center gap-2 text-[9px] font-black text-[var(--accent)] uppercase tracking-widest cursor-pointer hover:gap-3 transition-all">
                    View Technical Details <ChevronRight size={12} />
                 </div>
              </div>
           </div>

           <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
              <div className="absolute top-0 right-0 p-4 pt-6 text-[8px] font-black text-white/10 uppercase tracking-widest">18 Mar 2026</div>
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest">
                    New Feature
                 </div>
                 <h3 className="text-lg font-black text-white uppercase tracking-wider">Cloud Configs Live</h3>
                 <p className="text-xs text-white/40 leading-relaxed font-bold uppercase tracking-wider">
                    Settings can now be saved directly to the cloud. Share your configuration codes with the community or import pro setups instantly.
                 </p>
                 <div className="pt-2 flex items-center gap-2 text-[9px] font-black text-blue-400 uppercase tracking-widest cursor-pointer hover:gap-3 transition-all">
                    Read Patch Notes <ChevronRight size={12} />
                 </div>
              </div>
           </div>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 border-dashed flex flex-col items-center justify-center gap-4">
           <AlertCircle size={32} className="text-white/5" />
           <p className="text-[10px] text-white/10 font-black uppercase tracking-[0.4em] text-center">
             Older updates can be found in our private archive.
           </p>
        </div>
      </div>

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
