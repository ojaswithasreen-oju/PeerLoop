import React from 'react';
import { Bookmark, FileText, Code, Video, ExternalLink } from 'lucide-react';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          Saved
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Your bookmarked session summaries, cheatsheets, and peer notes.
        </p>
      </div>

      <div className="space-y-3">
        {savedItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EAE7] hover:border-[#DCE9E2] transition-all flex items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#F7F8F5] text-[#3F6B5B] border border-[#E5EAE7] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-[#1F2933]">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    {item.type} • Shared by {item.mentor} • {item.date}
                  </p>
                </div>
              </div>

              <button className="p-2 rounded-lg text-[#6B7280] hover:text-[#1F2933] hover:bg-[#F7F8F5] transition-colors cursor-pointer">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
