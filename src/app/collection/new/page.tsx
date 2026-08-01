"use client";

import { useState } from 'react';
import { useMusicStore } from '@/store/useMusicStore';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';

export default function NewCollectionPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { createCollection, collections } = useMusicStore();
  const router = useRouter();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Collection name is required');
      return;
    }

    createCollection(name.trim(), description.trim());
    toast.success(`Collection "${name.trim()}" created`);
    
    router.push('/library');
  };

  return (
    <div className="flex flex-col gap-12 max-w-2xl mx-auto animate-[fadeIn_0.5s_easeOut_forwards]">
      <Link href="/" className="flex w-fit items-center gap-2 text-neutral-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold text-white">Create Collection</h1>
          <p className="text-neutral-500">Organize your saved songs into a new collection.</p>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-neutral-300">Name</label>
            <Input
              id="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Late Night Coding"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="desc" className="text-sm font-medium text-neutral-300">Description (Optional)</label>
            <textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description for this collection..."
              className="w-full min-h-[100px] rounded-md border border-[#262626] bg-transparent p-4 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-700 focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-colors resize-y"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={!name.trim()}>
              Create Collection
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
