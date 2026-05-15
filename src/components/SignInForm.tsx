import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return

    setLoading(true)
    setMessage(null)

    const { error } = mode === 'signin' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin + '/account',
          }
        })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else if (mode === 'signup') {
      setMessage({ type: 'success', text: 'Registration successful. Check your email for verification.' })
    }
    setLoading(false)
  }

  return (
    <div className="auth-form">
      <div className="auth-toggle">
        <button 
          className={mode === 'signin' ? 'active' : ''} 
          onClick={() => { setMode('signin'); setMessage(null); }}
        >
          Sign In
        </button>
        <button 
          className={mode === 'signup' ? 'active' : ''} 
          onClick={() => { setMode('signup'); setMessage(null); }}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleAuth}>
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <div className="input-with-icon">
            <Mail size={16} className="input-icon" />
            <input 
              id="email"
              type="email" 
              placeholder="email@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon">
            <Lock size={16} className="input-icon" />
            <input 
              id="password"
              type={showPassword ? 'text' : 'password'} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {message && (
          <div className={`form-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <button className="primary-button wide" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              Processing...
            </>
          ) : (
            <>
              {mode === 'signin' ? 'Sign In' : 'Join CAVVE'} <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
      
      {mode === 'signin' && (
        <button 
          className="forgot-password" 
          onClick={() => setMessage({ type: 'error', text: 'Password reset is not yet implemented.' })}
        >
          Forgot Password?
        </button>
      )}
    </div>
  )
}
