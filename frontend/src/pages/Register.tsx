import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import { authApi } from "../services/api"

export default function Register() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
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
      const res = await authApi.register({ email, username, password })
      setToken(res.data.access_token)
      const me = await authApi.me()
      setUser(me.data)
      navigate("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.detail || "注册失败")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass rounded-xl p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🚀</div>
          <h1 className="text-2xl font-bold">开始记录心情</h1>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <input type="email" placeholder="邮箱" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          <input type="text" placeholder="用户名" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          <input type="password" placeholder="密码" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-lg font-semibold transition">
            {loading ? "创建中..." : "创建账号"}
          </button>
        </form>
        <p className="text-center mt-4 text-slate-400">
          已有账号？ <Link to="/login" className="text-pink-400 hover:underline">登录</Link>
        </p>
      </div>
    </div>
  )
}
