import React from 'react';
import { Bookmark, FileText, Code, Video, ExternalLink, Trash2 } from 'lucide-react';

export const SavedResourcesView: React.FC = () => {
  const savedItems = [
    {
      id: 'saved-1',
      title: 'Python Nested Loops & Matrix Cheatsheet',
      type: 'Notes & Cheatsheet',
      mentor: 'Rahul',
      date: 'Saved 2 days ago',
      icon: FileText,
      tag: 'Python',
    },
    {
      id: 'saved-2',
      title: 'React 19 Hooks & Server Actions Guide',
      type: 'Code Snippet',
      mentor: 'Maya',
      date: 'Saved 4 days ago',
      icon: Code,
      tag: 'Web Dev',
    },
    {
      id: 'saved-3',
      title: 'Figma Auto-Layout & Design Tokens Walkthrough',
      type: 'Recorded Micro-Session',
      mentor: 'Self',
      date: 'Saved last week',
      icon: Video,
      tag: 'UI/UX',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Saved Library
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Your bookmarked session summaries, cheatsheets, and peer notes.
        </p>
      </div>

      <div className="space-y-3">
        {savedItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#8B5CF6]/50 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#11182B] text-[#22D3EE] border border-[#1E2A47] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#11182B] text-[#C4B5FD] border border-[#1E2A47]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    {item.type} • Shared by {item.mentor} • {item.date}
                  </p>
                </div>
              </div>

              <button className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#11182B] transition-colors cursor-pointer">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
