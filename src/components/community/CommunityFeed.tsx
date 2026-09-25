import React, { useState } from 'react';
import {
  MessageSquare,
  Bookmark,
  Send,
  Heart,
  Plus,
  BookOpen,
  HelpCircle,
  Award,
  FolderGit2,
  Calendar,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LearningSession } from '../../types';

interface CommunityFeedProps {
  onStartSession?: (session: LearningSession) => void;
}

// 5 Specific Content types: Questions, Resources, Achievements, Projects, Sessions
export type CommunityContentType = 'Questions' | 'Resources' | 'Achievements' | 'Projects' | 'Sessions';

interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorCollege: string;
  timeAgo: string;
  contentType: CommunityContentType;
  skill: string;
  content: string;
  appreciationCount: number;
  isAppreciated?: boolean;
  isSaved?: boolean;
  comments: { author: string; text: string; time: string }[];
  sessionAction?: {
    label: string;
    topic: string;
    duration: number;
  };
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ onStartSession }) => {
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: 'post-1',
      authorName: 'Alex Rivera',
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'UC Berkeley',
      timeAgo: '15m ago',
      contentType: 'Achievements',
      skill: 'Python',
      content:
        'Completed the 2D array matrix traversal checkpoint with Rahul today. The nested loop concept finally clicked after using an index grid visualization.',
      appreciationCount: 14,
      isAppreciated: false,
      isSaved: false,
      comments: [
        {
          author: 'Rahul',
          text: 'Great work! You wrote the matrix flattening comprehension effortlessly.',
          time: '10m ago',
        },
      ],
    },
    {
      id: 'post-2',
      authorName: 'Priya N.',
      authorAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'Georgia Tech',
      timeAgo: '35m ago',
      contentType: 'Questions',
      skill: 'React',
      content:
        'Troubleshooting an async timing question in React 19. Does anyone have experience structuring concurrent transitions with optimistic state updates?',
      appreciationCount: 6,
      isAppreciated: false,
      isSaved: false,
      comments: [
        {
          author: 'Ojaswitha',
          text: 'Check the useOptimistic hook patterns. Happy to sync for 10 minutes to walk through it.',
          time: '20m ago',
        },
      ],
      sessionAction: {
        label: 'Connect to Help',
        topic: 'React 19 Optimistic State Updates',
        duration: 15,
      },
    },
    {
      id: 'post-3',
      authorName: 'Elena Rostova',
      authorAvatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'CMU',
      timeAgo: '2h ago',
      contentType: 'Resources',
      skill: 'Design',
      content:
        'Compiled a concise 2-page reference sheet on Figma design tokens, variable modes, and typography scopes for student project repos.',
      appreciationCount: 22,
      isAppreciated: false,
      isSaved: true,
      comments: [],
    },
    {
      id: 'post-4',
      authorName: 'Devon Vance',
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'Stanford',
      timeAgo: '3h ago',
      contentType: 'Sessions',
      skill: 'SQL',
      content:
        'Hosting a 20-minute peer study session on SQL execution plans and indexing trade-offs at 7:00 PM today. Geared toward students preparing for backend interviews.',
      appreciationCount: 16,
      isAppreciated: false,
      isSaved: false,
      comments: [
        {
          author: 'Marcus Chen',
          text: 'Joining! Looking forward to reviewing B-Tree vs Hash index trade-offs.',
          time: '1h ago',
        },
      ],
      sessionAction: {
        label: 'Join Study Session',
        topic: 'SQL Execution Plans & Indexing',
        duration: 20,
      },
    },
    {
      id: 'post-5',
      authorName: 'Marcus Chen',
      authorAvatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'MIT',
      timeAgo: '5h ago',
      contentType: 'Projects',
      skill: 'AI & ML',
      content:
        'Open-sourced a minimal Python repo benchmarking retrieval-augmented generation chunk sizes on student lecture transcripts. Feedback and peer contributions welcome!',
      appreciationCount: 19,
      isAppreciated: false,
      isSaved: false,
      comments: [],
    },
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [newPostSkill, setNewPostSkill] = useState('Python');
  const [newPostType, setNewPostType] = useState<CommunityContentType>('Questions');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  // Exact 5 Content Types specified by user prompt
  const contentTypes: CommunityContentType[] = [
    'Questions',
    'Resources',
    'Achievements',
    'Projects',
    'Sessions',
  ];

  const handleAppreciate = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isAppreciated = !p.isAppreciated;
          return {
            ...p,
            isAppreciated,
            appreciationCount: isAppreciated ? p.appreciationCount + 1 : p.appreciationCount - 1,
          };
        }
        return p;
      })
    );
  };

  const handleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim() || !currentUser) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                author: currentUser.fullName,
                text: commentInput.trim(),
                time: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );

    setCommentInput('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !currentUser) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser.fullName,
      authorAvatar: currentUser.avatarUrl,
      authorCollege: currentUser.college,
      timeAgo: 'Just now',
      contentType: newPostType,
      skill: newPostSkill,
      content: newPostText.trim(),
      appreciationCount: 1,
      isAppreciated: true,
      isSaved: false,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const filteredPosts =
    activeFilter === 'All'
      ? posts
      : posts.filter((p) => p.contentType.toLowerCase() === activeFilter.toLowerCase());

  const getContentTypeBadge = (type: CommunityContentType) => {
    switch (type) {
      case 'Questions':
        return { bg: 'bg-[#F1DED3]', text: 'text-[#C9825B]', icon: HelpCircle };
      case 'Resources':
        return { bg: 'bg-[#DCE6DE]', text: 'text-[#496456]', icon: BookOpen };
      case 'Achievements':
        return { bg: 'bg-[#DCE6DE]', text: 'text-[#387B62]', icon: Award };
      case 'Projects':
        return { bg: 'bg-[#F6F4EE]', text: 'text-[#202924]', icon: FolderGit2 };
      case 'Sessions':
        return { bg: 'bg-[#DCE6DE]', text: 'text-[#496456]', icon: Calendar };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-7 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#202924] tracking-tight">
          Learning Community
        </h1>
        <p className="text-xs sm:text-sm text-[#69736D] mt-1 font-sans">
          A focused workspace for student questions, resources, achievements, projects, and study sessions.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. COMPOSE CARD */}
      {/* ---------------------------------------------------- */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E3E1D9] shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <img
            src={
              currentUser?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt=""
            className="w-9 h-9 rounded-xl object-cover border border-[#E3E1D9]"
          />
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share a question, resource, project, or learning achievement..."
            className="flex-1 bg-[#F6F4EE] border border-[#E3E1D9] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#202924] placeholder-[#69736D] focus:outline-none focus:border-[#496456] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E3E1D9]">
          {/* Content Type Picker */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {contentTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setNewPostType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  newPostType === type
                    ? 'bg-[#496456] text-white'
                    : 'bg-[#F6F4EE] text-[#69736D] hover:text-[#202924]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreatePost}
            disabled={!newPostText.trim()}
            className="px-5 py-2 rounded-xl bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. CONTENT TYPE FILTER BAR */}
      {/* ---------------------------------------------------- */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...contentTypes].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === filter
                ? 'bg-[#496456] text-white'
                : 'bg-white border border-[#E3E1D9] text-[#69736D] hover:text-[#202924]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. FEED POSTS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const badge = getContentTypeBadge(post.contentType);
          const BadgeIcon = badge.icon;

          return (
            <div
              key={post.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E3E1D9] space-y-4 shadow-xs"
            >
              {/* Header: Author, College, Content Type Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-xl object-cover border border-[#E3E1D9]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#202924]">
                      {post.authorName}
                    </h4>
                    <p className="text-[11px] text-[#69736D]">
                      {post.authorCollege} • {post.timeAgo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}
                  >
                    <BadgeIcon className="w-3 h-3" />
                    <span>{post.contentType}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#69736D] bg-[#F6F4EE] px-2 py-0.5 rounded border border-[#E3E1D9]">
                    {post.skill}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <p className="text-xs sm:text-sm text-[#202924] leading-relaxed font-sans">
                {post.content}
              </p>

              {/* Optional 1-on-1 Session Action */}
              {post.sessionAction && (
                <div className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] flex items-center justify-between gap-3">
                  <div className="text-xs">
                    <span className="font-semibold text-[#202924]">
                      {post.sessionAction.topic}
                    </span>
                    <span className="text-[#69736D] ml-2">
                      ({post.sessionAction.duration} min 1-on-1)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (onStartSession && post.sessionAction) {
                        const session: LearningSession = {
                          id: `session-feed-${Date.now()}`,
                          learnerId: post.authorName,
                          learnerName: post.authorName,
                          learnerAvatar: post.authorAvatar,
                          learnerCollege: post.authorCollege,
                          mentorId: currentUser?.id || 'user-ojaswitha',
                          mentorName: currentUser?.fullName || 'Ojaswitha',
                          mentorAvatar: currentUser?.avatarUrl || '',
                          mentorCollege: currentUser?.college || 'UC Berkeley',
                          skill: post.skill,
                          topic: post.sessionAction.topic,
                          status: 'active',
                          durationMinutes: post.sessionAction.duration,
                          isRecording: false,
                          recordingConsentLearner: false,
                          recordingConsentMentor: false,
                          recordingSeconds: 0,
                          sharedNotes: `Community Session: ${post.sessionAction.topic}`,
                          chatMessages: [],
                          copilotItems: [],
                        };
                        onStartSession(session);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
                  >
                    {post.sessionAction.label}
                  </button>
                </div>
              )}

              {/* Actions Bar: Save · Comment · Appreciate (as specified by prompt) */}
              <div className="flex items-center gap-6 pt-3 border-t border-[#E3E1D9] text-xs text-[#69736D]">
                {/* Save */}
                <button
                  onClick={() => handleSave(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    post.isSaved ? 'text-[#496456] font-semibold' : 'hover:text-[#202924]'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-current' : ''}`} />
                  <span>{post.isSaved ? 'Saved' : 'Save'}</span>
                </button>

                {/* Comment */}
                <button
                  onClick={() =>
                    setActiveCommentPostId(
                      activeCommentPostId === post.id ? null : post.id
                    )
                  }
                  className="flex items-center gap-1.5 hover:text-[#202924] transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>
                    Comment {post.comments.length > 0 && `(${post.comments.length})`}
                  </span>
                </button>

                {/* Appreciate */}
                <button
                  onClick={() => handleAppreciate(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    post.isAppreciated
                      ? 'text-[#C9825B] font-semibold'
                      : 'hover:text-[#202924]'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      post.isAppreciated ? 'fill-current text-[#C9825B]' : ''
                    }`}
                  />
                  <span>
                    Appreciate ({post.appreciationCount})
                  </span>
                </button>
              </div>

              {/* Expandable Comments Drawer */}
              {activeCommentPostId === post.id && (
                <div className="pt-3 border-t border-[#E3E1D9] space-y-3">
                  {post.comments.map((c, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#F6F4EE] border border-[#E3E1D9] text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#202924]">{c.author}</span>
                        <span className="text-[10px] text-[#69736D]">{c.time}</span>
                      </div>
                      <p className="text-[#202924] leading-relaxed">{c.text}</p>
                    </div>
                  ))}

                  {/* Add Comment Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                      placeholder="Write a constructive response..."
                      className="flex-1 bg-[#F6F4EE] border border-[#E3E1D9] rounded-lg px-3 py-1.5 text-xs text-[#202924] placeholder-[#69736D] focus:outline-none focus:border-[#496456]"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentInput.trim()}
                      className="px-3 py-1.5 rounded-lg bg-[#496456] hover:bg-[#3d5347] text-white text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
