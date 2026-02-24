import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Hammer, Mail, Lock, User, ArrowLeft, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simula login/cadastro — aceita qualquer coisa
    setTimeout(() => {
      navigate('/app')
    }, 1200)
  }

  const isLoginValid = form.email && form.password
  const isRegisterValid = form.name && form.email && form.password && form.password === form.confirmPassword

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* ─── Animated gradient background ─── */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
      
      {/* Floating gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/20 blur-[120px] animate-float-slow" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/15 blur-[120px] animate-float-slow-reverse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] animate-pulse-slow" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} 
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i * 17) % 80}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* ─── Login card ─── */}
      <div className="relative z-10 w-full max-w-md mx-4 sm:mx-auto">
        {/* Back to landing */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-blue-300/70 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar ao site
        </Link>

        {/* Card */}
        <div className="bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/20 animate-card-enter">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/25 animate-logo-glow">
              <Hammer className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
            </h1>
            <p className="text-sm text-blue-200/50 mt-1.5">
              {mode === 'login'
                ? 'Entre com suas credenciais para acessar'
                : 'Comece a usar o MarcenaFlow gratuitamente'}
            </p>
          </div>

          {/* Toggle Login/Register */}
          <div className="flex bg-white/5 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-blue-200/50 hover:text-white/70'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                mode === 'register'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-blue-200/50 hover:text-white/70'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name — register only */}
            {mode === 'register' && (
              <div className="animate-field-enter">
                <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">
                  Nome completo
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/30" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Seu nome"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="seu@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-blue-300/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password — register only */}
            {mode === 'register' && (
              <div className="animate-field-enter">
                <label className="block text-xs font-semibold text-blue-200/60 mb-1.5 uppercase tracking-wider">
                  Confirmar senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-blue-200/30 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
                  />
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1.5">As senhas não coincidem</p>
                )}
              </div>
            )}

            {/* Forgot password — login only */}
            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-blue-400/70 hover:text-blue-300 transition-colors font-medium"
                  onClick={() => alert('Funcionalidade de recuperação de senha será implementada em breve!')}
                >
                  Esqueci minha senha
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (mode === 'login' ? !isLoginValid : !isRegisterValid)}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-500/50 disabled:to-blue-600/50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === 'login' ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Entrar' : 'Criar conta'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-blue-200/30 font-medium">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Skip to dashboard */}
          <Link
            to="/app"
            className="w-full py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 text-white/70 hover:text-white text-sm font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Acessar demonstração
          </Link>

          {/* Toggle mode text */}
          <p className="text-center text-xs text-blue-200/40 mt-6">
            {mode === 'login' ? (
              <>
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  Faça login
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-blue-200/20 mt-6">
          © 2026 MarcenaFlow · Todos os direitos reservados
        </p>
      </div>

      {/* ─── CSS animations (injected via style tag) ─── */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        @keyframes float-slow-reverse {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 20px) scale(0.95); }
          66% { transform: translate(20px, -30px) scale(1.05); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { transform: translateY(-40px) scale(1.5); opacity: 0.6; }
        }
        @keyframes card-enter {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes field-enter {
          0% { opacity: 0; transform: translateY(-8px); max-height: 0; }
          100% { opacity: 1; transform: translateY(0); max-height: 120px; }
        }
        @keyframes logo-glow {
          0%, 100% { box-shadow: 0 8px 24px rgba(59, 130, 246, 0.25); }
          50% { box-shadow: 0 8px 40px rgba(59, 130, 246, 0.45); }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-slow-reverse { animation: float-slow-reverse 14s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 4s ease-in-out infinite; }
        .animate-card-enter { animation: card-enter 0.6s ease-out both; }
        .animate-field-enter { animation: field-enter 0.3s ease-out both; overflow: hidden; }
        .animate-logo-glow { animation: logo-glow 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
