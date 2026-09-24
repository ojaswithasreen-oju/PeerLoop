import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { DEMO_USERS } from '../../services/seedData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const { signIn, signUp, signInWithGoogle, resetPassword, switchDemoUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) throw new Error('Please enter your full name.');
        await signUp(email, password, fullName);
      } else if (mode === 'login') {
        await signIn(email, password);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
        setLoading(false);
        return;
      }
      onClose();
    } catch (err: unknown) {
      const errorObj = err as Error;
      setError(errorObj.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (userId: string) => {
    switchDemoUser(userId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'signup'
          ? 'Join the PeerLoop Network'
          : mode === 'forgot'
          ? 'Reset Your Password'
          : 'Welcome Back to PeerLoop'
      }
      subtitle={
        mode === 'signup'
          ? 'Learn, practice, teach, and build proof of your university skills'
          : mode === 'forgot'
          ? "We'll send a password recovery link to your college email"
          : 'Continue your peer learning and mentoring sessions'
      }
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Reset Confirmation */}
        {resetSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-sm text-slate-200">
              Password reset link sent to <span className="font-semibold text-white">{email}</span>.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="text-xs text-indigo-400 hover:underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Google Sign-in */}
            {mode !== 'forgot' && (
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#11182B] hover:bg-[#1E293B] border border-slate-700/80 text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-3.5">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-[#151E33] px-3 text-[11px] uppercase tracking-wider text-slate-500 font-medium absolute">
                    or continue with email
                  </span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ojaswitha S."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                College / University Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signup'
                      ? 'Create Student Account'
                      : mode === 'forgot'
                      ? 'Send Reset Link'
                      : 'Sign In to PeerLoop'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
          </>
        )}

        {/* Switch Mode Prompt */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to PeerLoop?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-indigo-400 font-semibold hover:underline"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Fast Test Drive Persona Logins */}
        <div className="pt-3 border-t border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Instant Test Drive Personas</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleDemoLogin(demo.id)}
                className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 flex items-center gap-2 text-left transition-all hover:border-slate-700"
              >
                <img
                  src={demo.avatarUrl}
                  alt={demo.fullName}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{demo.fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {demo.activeMode === 'mentor' ? 'Mentor' : 'Learner'} • {demo.course}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
