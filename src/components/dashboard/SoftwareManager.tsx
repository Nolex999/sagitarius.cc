'use client';

import { useState, useRef, useEffect } from 'react';
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
  Plus
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

interface Category {
  id: string;
  name: string;
  logo_url: string;
  files: SoftwareFile[];
  isOpen?: boolean;
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
  
  // Key state
  const [keys, setKeys] = useState<Record<string, string>>({}); // catId -> key
  const [verifying, setVerifying] = useState<string | null>(null); // catId

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
        // Fallback for hardcoded owners
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

      const merged = (cats || []).map(cat => ({
        ...cat,
        files: (files || []).filter(f => f.category_id === cat.id),
        isOpen: true
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
      setCategories([{ ...data, files: [], isOpen: true }, ...categories]);
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
      setCategories(categories.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleCategory = (id: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, isOpen: !c.isOpen } : c));
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
      
      setCategories(categories.map(c => 
        c.id === uploadTarget.catId 
          ? { ...c, files: [data, ...c.files] } 
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
      setCategories(categories.map(c => 
        c.id === catId 
          ? { ...c, files: c.files.filter(f => f.id !== fileId) } 
          : c
      ));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const verifyAndDownload = async (catId: string) => {
    const key = keys[catId];
    if (!key) return;
    
    setVerifying(catId);
    setError(null);
    
    try {
      const { data, error } = await supabase.rpc('verify_software_key', {
        p_category_id: catId,
        p_key: key
      });

      if (error) throw error;
      
      const result = data[0];
      if (result.success && result.loader_url) {
        window.open(result.loader_url, '_blank');
        setKeys(prev => ({ ...prev, [catId]: '' }));
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifying(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="text-white/40 text-sm animate-pulse">Loading software library...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Package size={28} className="text-purple-500" />
            Software Library
          </h1>
          <p className="text-sm text-white/40 mt-1">
            {isManager ? 'Manage your files and categories' : 'Download loaders using activation keys'}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Admin: Add Category */}
      {isManager && (
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="Category name..."
              className="flex-1 h-12 px-5 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-all"
            />
            <input
              type="text"
              value={newCategoryLogo}
              onChange={e => setNewCategoryLogo(e.target.value)}
              placeholder="Logo URL (optional)..."
              className="flex-1 h-12 px-5 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-all"
            />
            <button
              onClick={addCategory}
              className="h-12 px-6 rounded-xl bg-purple-600 text-white text-sm font-bold flex items-center gap-2 hover:bg-purple-500 transition-all"
            >
              <Plus size={18} />
              Create
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden group">
            {/* Category Header */}
            <div 
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-all"
              onClick={() => toggleCategory(cat.id)}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center overflow-hidden">
                  {cat.logo_url ? (
                    <img src={cat.logo_url} alt={cat.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="text-white/20" size={24} />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">{cat.name}</h3>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium">
                    {cat.files.length} {cat.files.length === 1 ? 'File' : 'Files'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isManager && (
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                    className="p-2.5 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <div className={`transition-transform duration-300 ${cat.isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="text-white/20" size={20} />
                </div>
              </div>
            </div>

            {cat.isOpen && (
              <div className="px-5 pb-6 pt-2 space-y-6">
                {/* Download Actions (For everyone) */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col items-center gap-4 text-center">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Download Loader</h4>
                    <p className="text-[11px] text-white/40">Enter your activation key to download the loader for {cat.name}</p>
                  </div>
                  
                  <div className="flex w-full max-w-sm gap-3">
                    <div className="relative flex-1">
                      <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                      <input
                        type="text"
                        value={keys[cat.id] || ''}
                        onChange={e => setKeys({ ...keys, [cat.id]: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && verifyAndDownload(cat.id)}
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        className="w-full h-11 pl-11 pr-4 rounded-xl bg-black/40 border border-white/[0.08] text-sm text-white focus:outline-none focus:border-purple-500/40 font-mono tracking-wider transition-all"
                      />
                    </div>
                    <button
                      onClick={() => verifyAndDownload(cat.id)}
                      disabled={verifying === cat.id || !keys[cat.id]}
                      className="h-11 px-6 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-white/90 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {verifying === cat.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      Download
                    </button>
                  </div>
                </div>

                {/* Files List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">Available Files</h5>
                    {isManager && (
                      <button
                        onClick={() => {
                          setUploadTarget({ catId: cat.id, isLoader: false });
                          fileInputRef.current?.click();
                        }}
                        disabled={uploading === cat.id}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold uppercase tracking-widest hover:bg-purple-500/20 transition-all"
                      >
                        {uploading === cat.id ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                        Upload
                      </button>
                    )}
                  </div>
                  
                  {cat.files.map(file => (
                    <div key={file.id} className="flex items-center justify-between p-4 rounded-xl bg-black/40 border border-white/[0.04] hover:border-white/[0.08] transition-all group/file">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${file.is_loader ? 'bg-purple-500/10 text-purple-400' : 'bg-white/[0.03] text-white/40'}`}>
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">
                            {file.name}
                            {file.is_loader && <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] bg-purple-500 text-white">LOADER</span>}
                          </p>
                          <p className="text-[10px] text-white/30 mt-0.5">Version {file.version || '1.0.0'} • {file.size}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isManager ? (
                          <button
                            onClick={() => deleteFile(cat.id, file.id)}
                            className="p-2 rounded-lg text-white/10 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        ) : (
                          !file.is_loader && (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/10 transition-all"
                            >
                              <Download size={16} />
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {cat.files.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-white/[0.02] rounded-2xl">
                      <p className="text-[11px] text-white/10 font-bold uppercase tracking-widest">No public files yet</p>
                    </div>
                  )}
                </div>
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
