"use client";

import { useRef, useState } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import { ArrowLeft, Download, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  const { songs, collections, memories, history, settings, restoreStore, clearHistory } = useMusicStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExport = () => {
    const data = {
      songs,
      collections,
      memories,
      history,
      settings
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sonata-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        // Basic validation
        if (data && typeof data === 'object' && ('songs' in data || 'collections' in data)) {
          restoreStore(data);
          setImportStatus('Data imported successfully!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid backup file.');
        }
      } catch (error) {
        console.error('Import error:', error);
        setImportStatus('Failed to parse backup file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your search and listening history?')) {
      clearHistory();
    }
  };

  const handleFactoryReset = () => {
    if (confirm('WARNING: This will delete ALL your saved songs, collections, and memories. This action cannot be undone. Are you absolutely sure?')) {
      localStorage.removeItem('sonata-storage');
      window.location.reload();
    }
  };

  const stats = [
    { label: 'Saved Songs', value: Object.keys(songs).length },
    { label: 'Collections', value: Object.keys(collections).length },
    { label: 'Memories', value: Object.keys(memories).length },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-3xl mx-auto animate-[fadeIn_0.5s_easeOut_forwards]">
      <Link href="/" className="flex w-fit items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex flex-col gap-4 border-b border-[#262626] pb-8">
        <h1 className="text-4xl font-semibold text-white tracking-tight">Settings</h1>
        <p className="text-neutral-500">Manage your data, preferences, and backups.</p>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="flex flex-col gap-2 p-6 rounded-xl border border-[#262626] bg-black">
            <span className="text-3xl font-light text-white">{stat.value}</span>
            <span className="text-sm text-neutral-500">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Data Management */}
      <section className="flex flex-col gap-6 pt-8 border-t border-[#262626]">
        <h2 className="text-xl font-medium text-white">Data Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#262626] bg-[#0a0a0a]">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-white">Export Data</h3>
              <p className="text-sm text-neutral-400">Download a complete backup of your library, collections, and memories.</p>
            </div>
            <Button variant="outline" className="w-fit mt-auto" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Export Backup
            </Button>
          </div>

          <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#262626] bg-[#0a0a0a]">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-white">Import Data</h3>
              <p className="text-sm text-neutral-400">Restore your library from a previous backup file.</p>
            </div>
            
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImport}
            />
            <div className="flex items-center gap-4 mt-auto">
              <Button variant="outline" className="w-fit" onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" /> Import Backup
              </Button>
              {importStatus && (
                <span className="text-sm text-green-500 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> {importStatus}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="flex flex-col gap-6 pt-8 border-t border-[#262626]">
        <h2 className="text-xl font-medium text-red-500">Danger Zone</h2>
        
        <div className="flex flex-col gap-4 p-6 rounded-xl border border-red-950 bg-red-950/10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-white">Clear History</h3>
              <p className="text-sm text-neutral-400">Remove all recent searches and listening history.</p>
            </div>
            <Button variant="outline" onClick={handleClearHistory} className="border-red-950 hover:bg-red-950 text-red-400">
              Clear History
            </Button>
          </div>
          
          <div className="h-px w-full bg-red-950 my-2" />
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium text-white">Factory Reset</h3>
              <p className="text-sm text-neutral-400">Delete all local data. This cannot be undone.</p>
            </div>
            <Button variant="secondary" onClick={handleFactoryReset} className="bg-red-600 text-white hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" /> Reset Everything
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <div className="text-center text-sm text-neutral-600 mt-12 pb-12">
        <p>Sonata &bull; A premium personal music archive</p>
        <p>All data is stored locally in your browser.</p>
      </div>
    </div>
  );
}
