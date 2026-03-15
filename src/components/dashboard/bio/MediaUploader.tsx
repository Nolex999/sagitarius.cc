import { useState, useRef } from 'react';
import { UploadCloud, Link, AlertCircle, Loader2, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MediaUploaderProps {
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video' | 'any';
  placeholder?: string;
}

export default function MediaUploader({ value, onChange, type = 'any', placeholder = 'https://...' }: MediaUploaderProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'upload'>('url');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Validate the current URL type
  const isVideo = value && (value.toLowerCase().match(/\.(mp4|webm|mov)$/) || value.includes('youtube.com') || value.includes('vimeo'));
  
  const handleFileUpload = async (file: File) => {
    try {
      if (!file) return;
      setError(null);

      // Validation
      if (type === 'image' && !file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
      if (type === 'video' && !file.type.startsWith('video/')) {
        throw new Error('Please select a video file');
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        throw new Error('File size must be less than 50MB');
      }

      setIsUploading(true);

      // Get current user id
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('You must be logged in to upload files');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('bio-media')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('bio-media')
        .getPublicUrl(fileName);

      onChange(publicUrl);
      setActiveTab('url'); // Switch to URL tab so they see it
      setError(null);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message?.includes('Bucket') || err.message?.includes('bucket') 
        ? 'Bucket "bio-media" not found. Go to Supabase → Storage → New Bucket → Name: bio-media → Public: ON' 
        : err.message || 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.02] border border-white/[0.05]">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex-1 py-1 px-2 rounded-md text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'url' ? 'bg-purple-500/20 text-purple-300' : 'text-white/40 hover:text-white/60 hover:bg-white/5'
          }`}
        >
          <Link size={10} /> External URL
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-1 px-2 rounded-md text-[10px] uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'upload' ? 'bg-purple-500/20 text-purple-300' : 'text-white/40 hover:text-white/60 hover:bg-white/5'
          }`}
        >
          <UploadCloud size={10} /> Local Upload
        </button>
      </div>

      {activeTab === 'url' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
        />
      ) : (
        <div 
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative w-full aspect-video sm:h-24 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
            isDragging ? 'border-purple-500 bg-purple-500/10' : 
            error ? 'border-red-500/50 bg-red-500/5' :
            'border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            accept={type === 'image' ? 'image/*' : type === 'video' ? 'video/*' : 'image/*,video/*'} 
            className="hidden" 
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-purple-400">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-[10px] font-medium tracking-wide">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-white/40">
                {type !== 'video' && <ImageIcon size={20} />}
                {type !== 'image' && <VideoIcon size={20} />}
              </div>
              <div className="text-center">
                <p className="text-xs text-white/60 font-medium">Click to upload or drag & drop</p>
                <p className="text-[9px] text-white/30 uppercase mt-1 tracking-wider">
                  {type === 'image' ? 'Images up to 50MB' : type === 'video' ? 'Videos up to 50MB' : 'Images or Videos up to 50MB'}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-red-400 mt-1">
          <AlertCircle size={12} />
          <span className="text-[10px] font-medium">{error}</span>
        </div>
      )}
    </div>
  );
}
