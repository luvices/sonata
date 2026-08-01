"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyboardShortcut } from '@/hooks/useKeyboardShortcut';
import { Search, FolderPlus, Download, Upload, Shuffle, Settings, Trash2, Moon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMusicStore } from '@/store/useMusicStore';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  const { clearHistory, songs } = useMusicStore();

  useKeyboardShortcut('k', () => setIsOpen((prev) => !prev), true);
  useKeyboardShortcut('Escape', () => setIsOpen(false));

  // Prevent scrolling when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; }
  }, [isOpen]);

  const commands = [
    { id: 'search', title: 'Search Songs', icon: Search, action: () => { router.push('/'); setTimeout(() => document.getElementById('main-search')?.focus(), 100); } },
    { id: 'collection', title: 'Create Collection', icon: FolderPlus, action: () => router.push('/collection/new') },
    { id: 'export', title: 'Export Data', icon: Download, action: () => router.push('/settings') },
    { id: 'import', title: 'Import Data', icon: Upload, action: () => router.push('/settings') },
    { id: 'random', title: 'Random Saved Song', icon: Shuffle, action: () => {
      const savedIds = Object.keys(songs);
      if (savedIds.length > 0) {
        const randomId = savedIds[Math.floor(Math.random() * savedIds.length)];
        router.push(`/song/${randomId}`);
      }
    }},
    { id: 'settings', title: 'Open Settings', icon: Settings, action: () => router.push('/settings') },
    { id: 'clear', title: 'Clear History', icon: Trash2, action: () => clearHistory() },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCommand = (action: () => void) => {
    action();
    setIsOpen(false);
    setSearch('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[#262626] bg-[#0a0a0a] shadow-2xl"
          >
            <div className="flex items-center border-b border-[#262626] px-4">
              <Search className="h-5 w-5 text-neutral-500" />
              <input
                autoFocus
                className="flex h-14 w-full bg-transparent px-4 text-white outline-none placeholder:text-neutral-500"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex items-center gap-1">
                <kbd className="hidden rounded bg-[#1a1a1a] px-2 py-1 text-xs text-neutral-400 sm:block">ESC</kbd>
              </div>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="py-6 text-center text-sm text-neutral-500">
                  No commands found.
                </div>
              ) : (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={() => handleCommand(cmd.action)}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-neutral-300 transition-colors hover:bg-[#1a1a1a] hover:text-white focus:bg-[#1a1a1a] focus:text-white focus:outline-none"
                  >
                    <cmd.icon className="h-4 w-4" />
                    <span>{cmd.title}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
