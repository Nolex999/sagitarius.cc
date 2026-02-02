import { useState } from 'react';
import { useNavigate, BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Ticket } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import './App.css';
import Home from './routes/Home.jsx';
import ResetPassword from './routes/ResetPassword.jsx';
import logoMain from './assets/logo.svg';

// Utilisation des variables d'environnement (plus sécurisé)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ================= APP (ROUTER) =================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// ================= LOGIN PAGE =================
function LoginPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: window.location.origin + '/reset-password'
        });
        if (resetError) throw resetError;
        setSuccess('Check your email for the password reset link.');
        setIsForgotPassword(false);
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        setSuccess('Connecté avec succès !');
        navigate('/home', { replace: true });

      } else {
        // 1. Valider le code via RPC (bypass RLS)
        const { data: validData } = await supabase.rpc('validate_invite_code', { p_code: formData.inviteCode });
        if (!validData?.valid) {
          throw new Error(validData?.message || "Code invalide ou déjà utilisé.");
        }

        if (formData.password !== formData.confirmPassword) {
          throw new Error("The passwords are not the same !.");
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { username: formData.username },
            emailRedirectTo: window.location.origin + '/login'
          }
        });

        if (authError) throw authError;

        // 2. Marquer le code comme utilisé via RPC (bypass RLS)
        const { data: useData } = await supabase.rpc('use_invite_code', { p_code: formData.inviteCode.trim().toUpperCase() });
        if (useData && !useData.success) {
          console.warn("Code use warning:", useData.message);
        }

        setSuccess('Account created, check your email to confirm your sign-up.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <div className="logo-container">
          <img src={logoMain} alt="logo" />
        </div>

        <div className="header">
          <h1>SAGITARIUS<span className="h1s">.CC</span></h1>
          <p><center>Authentication Portal</center></p>
        </div>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {isForgotPassword ? (
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <p className="form-hint">We'll send you a link to reset your password.</p>
            </div>
          ) : !isLogin && (
            <div className="form-group">
              <label>Invitation Code</label>
              <div className="input-wrapper">
                <Ticket size={18} />
                <input
                  name="inviteCode"
                  type="text"
                  placeholder="Enter invite code"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Username</label>
              <div className="input-wrapper">
                <User size={18} />
                <input
                  name="username"
                  type="text"
                  placeholder="Enter username"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          {!isForgotPassword && (
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} />
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          )}

          {!isForgotPassword && (
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                onChange={handleInputChange}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          )}

          {!isLogin && (
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <Lock size={18} />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account'))}
          </button>
        </form>

        {!isForgotPassword && (
        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            setIsLogin(!isLogin);
            setError(null);
            setSuccess(null);
          }}
        >
          {isLogin ? 'Need an account?' : 'Already registered?'}
        </button>
        )}

        {isLogin && !isForgotPassword && (
        <button
          type="button"
          className="toggle-btn forgot-btn"
          onClick={() => {
            setIsForgotPassword(true);
            setError(null);
            setSuccess(null);
          }}
        >
          Forgot password?
        </button>
        )}

        {isForgotPassword && (
        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            setIsForgotPassword(false);
            setError(null);
            setSuccess(null);
          }}
        >
          Back to login
        </button>
        )}
      </div>
    </div>
  );
}