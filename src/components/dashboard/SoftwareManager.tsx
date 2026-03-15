'use client';

import { useState, useRef } from 'react';
import { FolderPlus, FilePlus, Trash2, Upload, Download, ChevronDown, ChevronRight, Loader2, AlertCircle, Package } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SoftwareFile {
  id: string;
  name: string;
  description: string;
  url: string;
  size: string;
  downloads: number;
  createdAt: string;
}

interface SubCategory {
  id: string;
  name: string;
  files: SoftwareFile[];
}

interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
  isOpen: boolean;
}

const STORAGE_KEY = 'sagitarius_software_categories';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function SoftwareManager() {
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubName, setNewSubName] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<{ catId: string; subId: string } | null>(null);
  const supabase = createClient();

  const save = (cats: Category[]) => {
    setCategories(cats);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const cat: Category = {
      id: generateId(),
      name: newCategoryName.trim(),
      subcategories: [],
      isOpen: true,
    };
    save([...categories, cat]);
    setNewCategoryName('');
  };

  const deleteCategory = (catId: string) => {
    save(categories.filter(c => c.id !== catId));
  };

  const toggleCategory = (catId: string) => {
    save(categories.map(c => c.id === catId ? { ...c, isOpen: !c.isOpen } : c));
  };

  const addSubCategory = (catId: string) => {
    const name = newSubName[catId]?.trim();
    if (!name) return;
    const sub: SubCategory = { id: generateId(), name, files: [] };
    save(categories.map(c =>
      c.id === catId ? { ...c, subcategories: [...c.subcategories, sub] } : c
    ));
    setNewSubName(prev => ({ ...prev, [catId]: '' }));
  };

  const deleteSubCategory = (catId: string, subId: string) => {
    save(categories.map(c =>
      c.id === catId ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) } : c
    ));
  };

  const handleFileUpload = async (file: File) => {
    if (!uploadTarget) return;
    try {
      setError(null);
      setUploading(uploadTarget.subId);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const ext = file.name.split('.').pop();
      const path = `software/${user.id}/${Date.now()}_${file.name}`;

      const { error: upErr } = await supabase.storage
        .from('software-files')
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (upErr) throw upErr;

      const { data: { publicUrl } } = supabase.storage
        .from('software-files')
        .getPublicUrl(path);

      const newFile: SoftwareFile = {
        id: generateId(),
        name: file.name,
        description: '',
        url: publicUrl,
        size: formatFileSize(file.size),
        downloads: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      save(categories.map(c =>
        c.id === uploadTarget.catId
          ? {
            ...c,
            subcategories: c.subcategories.map(s =>
              s.id === uploadTarget.subId
                ? { ...s, files: [...s.files, newFile] }
                : s
            ),
          }
          : c
      ));
    } catch (err: any) {
      setError(err.message?.includes('Bucket') ? 'Create a "software-files" bucket in Supabase (Public)' : err.message || 'Upload failed');
    } finally {
      setUploading(null);
      setUploadTarget(null);
    }
  };

  const deleteFile = (catId: string, subId: string, fileId: string) => {
    save(categories.map(c =>
      c.id === catId
        ? {
          ...c,
          subcategories: c.subcategories.map(s =>
            s.id === subId ? { ...s, files: s.files.filter(f => f.id !== fileId) } : s
          ),
        }
        : c
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Package size={20} />
            Software Manager
          </h1>
          <p className="text-xs text-white/40 mt-1">Create categories & upload files. Owner only.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Add Category */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={e => setNewCategoryName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCategory()}
          placeholder="New category name..."
          className="flex-1 h-10 px-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/40 transition-colors"
        />
        <button
          onClick={addCategory}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-purple-500/15 border border-purple-400/20 text-purple-300 text-xs font-bold uppercase tracking-wider hover:bg-purple-500/25 transition-all"
        >
          <FolderPlus size={14} />
          Add
        </button>
      </div>

      {/* Categories Tree */}
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.id} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            {/* Category Header */}
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/[0.02] transition-colors" onClick={() => toggleCategory(cat.id)}>
              <div className="flex items-center gap-3">
                {cat.isOpen ? <ChevronDown size={16} className="text-white/40" /> : <ChevronRight size={16} className="text-white/40" />}
                <span className="text-sm font-bold text-white">{cat.name}</span>
                <span className="text-[9px] text-white/30 uppercase tracking-wider">{cat.subcategories.length} sub</span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); deleteCategory(cat.id); }}
                className="p-1.5 rounded-lg text-red-400/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>

            {cat.isOpen && (
              <div className="px-4 pb-4 pt-0 space-y-3">
                {/* Add Subcategory */}
                <div className="flex gap-2 pl-7">
                  <input
                    type="text"
                    value={newSubName[cat.id] || ''}
                    onChange={e => setNewSubName(prev => ({ ...prev, [cat.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addSubCategory(cat.id)}
                    placeholder="New subcategory..."
                    className="flex-1 h-8 px-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-white/15 transition-colors"
                  />
                  <button
                    onClick={() => addSubCategory(cat.id)}
                    className="flex items-center gap-1 h-8 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[9px] text-white/50 uppercase tracking-wider font-bold hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    <FilePlus size={11} />
                    Sub
                  </button>
                </div>

                {/* Subcategories */}
                {cat.subcategories.map(sub => (
                  <div key={sub.id} className="pl-7 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/70">{sub.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setUploadTarget({ catId: cat.id, subId: sub.id });
                            fileInputRef.current?.click();
                          }}
                          disabled={uploading === sub.id}
                          className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] uppercase tracking-wider font-bold bg-purple-500/10 border border-purple-400/15 text-purple-300 hover:bg-purple-500/20 transition-all disabled:opacity-50"
                        >
                          {uploading === sub.id ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
                          Upload
                        </button>
                        <button
                          onClick={() => deleteSubCategory(cat.id, sub.id)}
                          className="p-1 rounded-md text-red-400/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Files */}
                    {sub.files.map(file => (
                      <div key={file.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] ml-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-white truncate">{file.name}</p>
                          <p className="text-[9px] text-white/30 mt-0.5">{file.size} • {file.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-md text-white/30 hover:text-green-400 hover:bg-green-500/10 transition-all"
                          >
                            <Download size={12} />
                          </a>
                          <button
                            onClick={() => deleteFile(cat.id, sub.id, file.id)}
                            className="p-1.5 rounded-md text-red-400/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {sub.files.length === 0 && (
                      <p className="text-[10px] text-white/20 ml-4 italic">No files yet</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-12 text-white/20">
            <Package size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No categories yet</p>
            <p className="text-xs mt-1">Create your first category above</p>
          </div>
        )}
      </div>

      {/* Hidden file input */}
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
