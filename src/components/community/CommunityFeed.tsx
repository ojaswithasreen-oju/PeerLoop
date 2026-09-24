import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Sparkles,
  Send,
  Plus,
  Play,
  Zap,
  Users,
  Clock,
  CheckCircle2,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LearningSession } from '../../types';

interface CommunityFeedProps {
  onStartSession?: (session: LearningSession) => void;
}

interface FeedItem {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorCollege: string;
  timeAgo: string;
  type: 'learning_win' | 'help_needed' | 'hosting_session';
  content: string;
  skillTag: string;
  likes: number;
  comments: { author: string; text: string; time: string }[];
  sessionAction?: {
    label: string;
    topic: string;
    duration: number;
  };
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ onStartSession }) => {
  const { currentUser } = useAuth();

  const [posts, setPosts] = useState<FeedItem[]>([
    {
      id: 'feed-1',
      authorName: 'Alex Rivera',
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'UC Berkeley',
      timeAgo: '12m ago',
      type: 'learning_win',
      content: 'Just finished learning Python dictionaries with Rahul! Finally understood hash collisions and key lookups. Highly recommend his sessions!',
      skillTag: 'Python',
      likes: 14,
      comments: [
        {
          author: 'Rahul',
          text: 'Great job today Alex! You nailed that dictionary comprehension exercise.',
          time: '8m ago',
        },
      ],
    },
    {
      id: 'feed-2',
      authorName: 'Priya N.',
      authorAvatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'Georgia Tech',
      timeAgo: '25m ago',
      type: 'help_needed',
      content: 'Need help debugging a React component. useEffect dependency array infinite loop issue with async fetch. Anyone free for a quick 10 min sync?',
      skillTag: 'React',
      likes: 6,
      comments: [
        {
          author: 'Ojaswitha',
          text: 'Check if you are creating new function references inside the render cycle! I can hop on a call to review.',
          time: '15m ago',
        },
      ],
      sessionAction: {
        label: 'Help out',
        topic: 'Debugging React useEffect Infinite Loop',
        duration: 10,
      },
    },
    {
      id: 'feed-3',
      authorName: 'Devon Vance',
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      authorCollege: 'Stanford',
      timeAgo: '42m ago',
      type: 'hosting_session',
      content: 'Hosting a 20-min session on SQL joins and indexing strategies at 7:00 PM. Perfect for anyone prepping for database midterms!',
      skillTag: 'SQL',
      likes: 22,
      comments: [
        {
          author: 'Marcus Chen',
          text: 'Count me in Devon!',
          time: '30m ago',
        },
      ],
      sessionAction: {
        label: 'Join session',
        topic: 'SQL Joins & Indexing Strategies',
        duration: 20,
      },
    },
  ]);

  const [newPostText, setNewPostText] = useState('');
  const [newPostType, setNewPostType] = useState<'learning_win' | 'help_needed' | 'hosting_session'>('learning_win');
  const [newPostTag, setNewPostTag] = useState('Python');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const newPost: FeedItem = {
      id: `post-${Date.now()}`,
      authorName: currentUser?.fullName || 'Ojaswitha',
      authorAvatar:
        currentUser?.avatarUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      authorCollege: currentUser?.college || 'UC Berkeley',
      timeAgo: 'Just now',
      type: newPostType,
      content: newPostText.trim(),
      skillTag: newPostTag,
      likes: 1,
      comments: [],
      sessionAction:
        newPostType === 'help_needed'
          ? { label: 'Help out', topic: newPostText.slice(0, 30), duration: 15 }
          : newPostType === 'hosting_session'
          ? { label: 'Join session', topic: newPostText.slice(0, 30), duration: 20 }
          : undefined,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                author: currentUser?.fullName || 'Ojaswitha',
                text: commentText.trim(),
                time: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );
    setCommentText('');
    setActiveCommentPostId(null);
  };

  const handleActionClick = (post: FeedItem) => {
    if (!onStartSession || !post.sessionAction) return;

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
      skill: post.skillTag,
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
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-200">
      {/* ---------------------------------------------------- */}
      {/* 1. HEADER */}
      {/* ---------------------------------------------------- */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
          Community Learning Pulse
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] mt-1">
          Live stream of campus learning wins, doubt beacons, and open peer sessions.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. COMPOSE POST BAR */}
      {/* ---------------------------------------------------- */}
      <div className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] shadow-lg space-y-3">
        <div className="flex items-center gap-3">
          <img
            src={
              currentUser?.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt=""
            className="w-9 h-9 rounded-xl object-cover border border-[#8B5CF6]/40"
          />
          <input
            type="text"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Share a win, ask for quick help, or announce a session..."
            className="flex-1 bg-[#0B1020] border border-[#1E2A47] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-hidden focus:border-[#8B5CF6] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E2A47]">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setNewPostType('learning_win')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                newPostType === 'learning_win'
                  ? 'bg-[#8B5CF6]/20 text-[#C4B5FD] border border-[#8B5CF6]/40'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              🎉 Learning Win
            </button>
            <button
              type="button"
              onClick={() => setNewPostType('help_needed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                newPostType === 'help_needed'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              ⚡ Need Help
            </button>
            <button
              type="button"
              onClick={() => setNewPostType('hosting_session')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                newPostType === 'hosting_session'
                  ? 'bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/40'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              🎙️ Hosting Session
            </button>
          </div>

          <button
            onClick={handleCreatePost}
            disabled={!newPostText.trim()}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. FEED OF POSTS */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-[#151E33] border border-[#1E2A47] hover:border-[#1E2A47]/80 transition-all space-y-4 shadow-sm"
          >
            {/* Post Author Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-xl object-cover border border-[#1E2A47]"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">
                    {post.authorName}
                  </h4>
                  <p className="text-[11px] text-[#94A3B8]">
                    {post.authorCollege} • {post.timeAgo}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#11182B] text-[#22D3EE] border border-[#1E2A47]">
                {post.skillTag}
              </span>
            </div>

            {/* Post Body Content */}
            <p className="text-xs sm:text-sm text-[#F8FAFC] leading-relaxed">
              {post.content}
            </p>

            {/* Direct Action Card (Join Session or Help Out) */}
            {post.sessionAction && (
              <div className="p-3.5 rounded-xl bg-[#0B1020] border border-[#1E2A47] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/20 text-[#22D3EE] flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#F8FAFC]">
                      {post.sessionAction.topic}
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">
                      {post.sessionAction.duration} min duration
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleActionClick(post)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#8B5CF6]/20 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {post.sessionAction.label === 'Join session' ? (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  ) : (
                    <Zap className="w-3.5 h-3.5 fill-current text-[#22D3EE]" />
                  )}
                  <span>{post.sessionAction.label}</span>
                </button>
              </div>
            )}

            {/* Action Bar: Like & Comment */}
            <div className="flex items-center gap-4 pt-2 border-t border-[#1E2A47] text-xs text-[#94A3B8]">
              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>{post.likes}</span>
              </button>

              <button
                onClick={() =>
                  setActiveCommentPostId(
                    activeCommentPostId === post.id ? null : post.id
                  )
                }
                className="flex items-center gap-1.5 hover:text-[#F8FAFC] transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Comment ({post.comments.length})</span>
              </button>
            </div>

            {/* Comments Thread */}
            {post.comments.length > 0 && (
              <div className="space-y-2 pt-1 border-t border-[#1E2A47]/40">
                {post.comments.map((c, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#11182B] text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F8FAFC]">{c.author}</span>
                      <span className="text-[10px] text-[#94A3B8]">{c.time}</span>
                    </div>
                    <p className="text-[#94A3B8]">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Comment Input */}
            {activeCommentPostId === post.id && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 bg-[#0B1020] border border-[#1E2A47] rounded-xl px-3 py-2 text-xs text-[#F8FAFC] placeholder-[#94A3B8]/60 focus:outline-hidden focus:border-[#8B5CF6]"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="px-3 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-bold cursor-pointer"
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
