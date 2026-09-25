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
  const { signIn, signUp, resetPassword, switchDemoUser } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError('Please enter your university or college email address.');
      return;
    }

    if (mode !== 'forgot' && !trimmedPassword) {
      setError('Please enter your password.');
      return;
    }

    if (mode === 'signup' && trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const studentName = fullName.trim() || trimmedEmail.split('@')[0] || 'Peer Learner';
        await signUp(trimmedEmail, trimmedPassword, studentName);
        setSuccessMessage('Account registered successfully! Welcome to PeerLoop.');
        setTimeout(() => {
          onClose();
        }, 1200);
        return;
      } else if (mode === 'login') {
        await signIn(trimmedEmail, trimmedPassword);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(trimmedEmail);
        setResetSent(true);
        setLoading(false);
        return;
      }
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
          ? 'Join PeerLoop'
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
          <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-[#DCE9E2] border border-[#3F6B5B]/30 text-[#3F6B5B] text-xs">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#3F6B5B]" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Reset Confirmation */}
        {resetSent ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-[#3F6B5B] mx-auto" />
            <p className="text-sm text-[#1F2933]">
              Password reset link sent to <span className="font-semibold text-[#1F2933]">{email}</span>.
            </p>
            <button
              onClick={() => {
                setResetSent(false);
                setMode('login');
              }}
              className="text-xs text-[#3F6B5B] font-semibold hover:underline cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ojaswitha S."
                    disabled={loading}
                    className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg pl-9 pr-3 py-2 text-sm text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] disabled:opacity-60"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#1F2933] mb-1">
                College / University Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  disabled={loading}
                  className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg pl-9 pr-3 py-2 text-sm text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] disabled:opacity-60"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#1F2933]">Password</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs text-[#3F6B5B] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6B7280] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    disabled={loading}
                    className="w-full bg-[#F7F8F5] border border-[#E5EAE7] rounded-lg pl-9 pr-3 py-2 text-sm text-[#1F2933] placeholder-[#6B7280] focus:outline-none focus:border-[#3F6B5B] disabled:opacity-60"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#3F6B5B] hover:bg-[#34594B] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>
                    {mode === 'signup'
                      ? 'Creating account...'
                      : mode === 'forgot'
                      ? 'Sending...'
                      : 'Signing in...'}
                  </span>
                </div>
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
        )}

        {/* Switch Mode Prompt */}
        <div className="text-center text-xs text-[#6B7280] pt-2 border-t border-[#E5EAE7]">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('login');
                }}
                className="text-[#3F6B5B] font-semibold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to PeerLoop?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('signup');
                }}
                className="text-[#3F6B5B] font-semibold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </p>
          )}
        </div>

        {/* Fast Test Drive Persona Logins */}
        <div className="pt-3 border-t border-[#E5EAE7]">
          <p className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3F6B5B]" />
            <span>Instant Demo Personas</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleDemoLogin(demo.id)}
                className="p-2 rounded-lg bg-[#F7F8F5] hover:bg-[#EEF2EE] border border-[#E5EAE7] flex items-center gap-2 text-left transition-all hover:border-[#DCE9E2] cursor-pointer"
              >
                <img
                  src={demo.avatarUrl}
                  alt={demo.fullName}
                  className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#1F2933] truncate">{demo.fullName}</p>
                  <p className="text-[10px] text-[#6B7280] truncate">
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
