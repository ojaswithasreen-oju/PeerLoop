import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  ExternalLink,
  BookOpen,
  FileCode,
  Sparkles,
  Search,
  Plus,
} from 'lucide-react';
import { store } from '../../services/storeService';
import { LearningResource } from '../../types';

export const ResourceLibrary: React.FC = () => {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');

  useEffect(() => {
    setResources(store.getResources());
  }, []);

  const filtered = resources.filter((res) => {
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = selectedSkill === 'All' || res.skill === selectedSkill;
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Peer Learning Resources</h1>
        <p className="text-xs text-slate-400 mt-1">
          Curated cheatsheets, problem sets, and documentation recommended by top university mentors.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides, cheat sheets, docs..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
        >
          <option value="All">All Topics</option>
          <option value="Python">Python</option>
          <option value="React">React</option>
          <option value="Data Structures">Data Structures</option>
        </select>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-indigo-400">{res.skill}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {res.type}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{res.title}</h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{res.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Curated by mentors</span>
              <a
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <span>Open Resource</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
