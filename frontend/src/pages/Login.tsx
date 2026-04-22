import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import { authApi } from "../services/api"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)
  const setUser = useAuthStore((s) => s.setUser)

  const handle = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await authApi.login({ email, password })
      setToken(res.data.access_token)
      const me = await authApi.me()
      setUser(me.data)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.detail || "登录失败")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-xl p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎨</div>
          <h1 className="text-2xl font-bold">登录 MoodMosaic</h1>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <input type="email" placeholder="邮箱" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          <input type="password" placeholder="密码" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-lg font-semibold transition">
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
        <p className="text-center mt-4 text-slate-400">
          没有账号？ <Link to="/register" className="text-pink-400 hover:underline">注册</Link>
        </p>
      </div>
    </div>
  )
}
