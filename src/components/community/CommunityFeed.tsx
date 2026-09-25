import React, { useState } from 'react';
import {
  MessageSquare,
  Bookmark,
  Send,
  Heart,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LearningSession } from '../../types';

interface CommunityFeedProps {
  onStartSession?: (session: LearningSession) => void;
}

interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorCollege: string;
  timeAgo: string;
  category: 'Question' | 'Achievement' | 'Resource' | 'Project' | 'Study Session' | 'Workshop';
  skill: string;
  content: string;
  likes: number;
  isLiked?: boolean;
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
      category: 'Achievement',
      skill: 'Python',
      content:
        'Completed the 2D array traversal exercises with Rahul today! The nested loop concept finally clicked after using a grid visualization.',
      likes: 12,
      isLiked: false,
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
      category: 'Question',
      skill: 'React',
      content:
        'Troubleshooting an async state timing condition in React 19. Does anyone have experience structuring concurrent transitions with optimistic updates?',
      likes: 5,
      isLiked: false,
      isSaved: false,
      comments: [
        {
          author: 'Ojaswitha',
          text: 'Check the useOptimistic hook guidelines from React documentation. Happy to sync for 10 minutes to review.',
          time: '20m ago',
        },
      ],
      sessionAction: {
        label: 'Help with doubt',
        topic: 'React 19 Optimistic State Updates',
        duration: 15,
      },
    },
    {
      id: 'post-3',
      authorName: 'Devon Vance',
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'Stanford',
      timeAgo: '1h ago',
      category: 'Study Session',
      skill: 'SQL',
      content:
        'Hosting a 20-minute study session on SQL execution plans and indexing strategies at 7:00 PM today. Designed for anyone preparing for database engineering interviews.',
      likes: 18,
      isLiked: false,
      isSaved: false,
      comments: [
        {
          author: 'Marcus Chen',
          text: 'Joining! Excited to review B-Tree indexing trade-offs.',
          time: '45m ago',
        },
      ],
      sessionAction: {
        label: 'Join Study Session',
        topic: 'SQL Execution Plans & Indexing',
        duration: 20,
      },
    },
    {
      id: 'post-4',
      authorName: 'Elena Rostova',
      authorAvatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'CMU',
      timeAgo: '2h ago',
      category: 'Resource',
      skill: 'UI/UX',
      content:
        'Compiled a concise 2-page cheatsheet on Figma variable collections and token scopes for student projects. Bookmarked in the library for reference.',
      likes: 24,
      isLiked: false,
      isSaved: true,
      comments: [],
    },
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [newPostSkill, setNewPostSkill] = useState('Python');
  const [newPostCategory, setNewPostCategory] = useState<CommunityPost['category']>('Question');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const categories: CommunityPost['category'][] = [
    'Question',
    'Achievement',
    'Resource',
    'Project',
    'Study Session',
    'Workshop',
  ];

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isLiked: !p.isLiked,
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handleSave = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSaved: !p.isSaved } : p))
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser?.fullName || 'Ojaswitha',
      authorAvatar:
        currentUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      authorCollege: currentUser?.college || 'UC Berkeley',
      timeAgo: 'Just now',
      category: newPostCategory,
      skill: newPostSkill,
      content: newPostText.trim(),
      likes: 1,
      isLiked: true,
      isSaved: false,
      comments: [],
      sessionAction:
        newPostCategory === 'Question'
          ? { label: 'Help with doubt', topic: newPostText.slice(0, 32), duration: 15 }
          : newPostCategory === 'Study Session' || newPostCategory === 'Workshop'
          ? { label: 'Join session', topic: newPostText.slice(0, 32), duration: 20 }
          : undefined,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                author: currentUser?.fullName || 'Ojaswitha',
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
    setActiveCommentPostId(null);
  };

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'All') return true;
    return p.category === activeFilter;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-150">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2933] tracking-tight">
          Learning Community
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Share student questions, learning achievements, resources, and study sessions with peers.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. COMPOSE CARD */}
      {/* ---------------------------------------------------- */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5EAE7] shadow-xs space-y-3.5">
        <div className="flex items-center gap-3">
          <img
            src={
              currentUser?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-[#E5EAE7]"
          />
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share a question, achievement, resource, or study session..."
            className="flex-1 bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3.5 py-2 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E5EAE7]">
          {/* Post Category Picker */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setNewPostCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                  newPostCategory === cat
                    ? 'bg-[#DCE9E2] text-[#3F6B5B]'
                    : 'text-[#6B7280] hover:text-[#1F2933]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={handleCreatePost}
            disabled={!newPostText.trim()}
            className="px-4 py-1.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {['All', ...categories].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === filter
                ? 'bg-[#3F6B5B] text-white'
                : 'bg-white border border-[#E5EAE7] text-[#6B7280] hover:text-[#1F2933]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. FEED CARDS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-white border border-[#E5EAE7] space-y-3.5 shadow-xs"
          >
            {/* Header: Avatar, Name, College, Skill Tag */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border border-[#E5EAE7]"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#1F2933]">
                    {post.authorName}
                  </h4>
                  <p className="text-[11px] text-[#6B7280]">
                    {post.authorCollege} • {post.timeAgo}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#F7F8F5] text-[#6B7280] border border-[#E5EAE7]">
                  {post.category}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#DCE9E2] text-[#3F6B5B]">
                  {post.skill}
                </span>
              </div>
            </div>

            {/* Content */}
            <p className="text-xs sm:text-sm text-[#1F2933] leading-relaxed">
              {post.content}
            </p>

            {/* Optional Study Session CTA */}
            {post.sessionAction && (
              <div className="p-3 rounded-xl bg-[#F0F4F1] border border-[#DCE9E2] flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#1F2933]">
                    {post.sessionAction.topic}
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
                    {post.sessionAction.duration} min study block
                  </p>
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
                  className="px-3.5 py-1.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {post.sessionAction.label}
                </button>
              </div>
            )}

            {/* Action Bar: Like, Comment, Save */}
            <div className="flex items-center gap-5 pt-2 border-t border-[#E5EAE7] text-xs text-[#6B7280]">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  post.isLiked ? 'text-rose-600 font-semibold' : 'hover:text-[#1F2933]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-current' : ''}`} />
                <span>Like ({post.likes})</span>
              </button>

              <button
                onClick={() =>
                  setActiveCommentPostId(
                    activeCommentPostId === post.id ? null : post.id
                  )
                }
                className="flex items-center gap-1.5 hover:text-[#1F2933] transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Comment ({post.comments.length})</span>
              </button>

              <button
                onClick={() => handleSave(post.id)}
                className={`flex items-center gap-1.5 ml-auto transition-colors cursor-pointer ${
                  post.isSaved ? 'text-[#3F6B5B] font-semibold' : 'hover:text-[#1F2933]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-current' : ''}`} />
                <span>{post.isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Comments Thread */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-[#E5EAE7]">
                {post.comments.map((c, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-[#F7F8F5] text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#1F2933]">{c.author}</span>
                      <span className="text-[10px] text-[#6B7280]">{c.time}</span>
                    </div>
                    <p className="text-[#6B7280]">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            {activeCommentPostId === post.id && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write a supportive reply..."
                  className="flex-1 bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg px-3 py-1.5 text-xs text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B]"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#3F6B5B] text-white text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
