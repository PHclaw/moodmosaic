import { Link } from 'react-router-dom'

export default function Landing() {
  const colors = ['#FFD700','#7CFC00','#87CEEB','#D3D3D3','#FF8C00','#6495ED','#DC143C','#8B008B','#7CFC00','#FFD700','#87CEEB','#D3D3D3','#FF8C00','#6495ED','#7CFC00','#FFD700','#87CEEB','#DC143C','#D3D3D3','#8B008B','#FF8C00','#7CFC00','#6495ED','#FFD700','#87CEEB','#DC143C','#D3D3D3','#7CFC00','#FF8C00','#8B008B','#6495ED','#FFD700','#87CEEB','#D3D3D3','#7CFC00']
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12 fade-in">
        <div className="text-7xl mb-4">🎨</div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3">MoodMosaic</h1>
        <p className="text-xl text-slate-400">用色彩记录你的每一天</p>
      </div>
      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-1 w-72 mx-auto">
          {colors.map((color, i) => (
            <div key={i} className="w-8 h-8 rounded" style={{backgroundColor: color}} />
          ))}
        </div>
        <p className="text-center text-slate-500 text-sm mt-3">一年 365 天，你的情绪色彩图</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 max-w-3xl mb-12">
        {[{icon:'🗓️',t:'每日记录',d:'选一个颜色，记录今天的心情'}, {icon:'🎨',t:'年度马赛克',d:'365 天拼成你的年度色彩图'}, {icon:'🤖',t:'AI 洞察',d:'DeepSeek 分析你的情绪趋势'}].map(f => (
          <div key={f.t} className="glass p-4 text-center">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="font-semibold mb-1">{f.t}</h3>
            <p className="text-slate-400 text-sm">{f.d}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <Link to="/login" className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition">登录</Link>
        <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 rounded-lg font-semibold transition">开始记录</Link>
      </div>
    </div>
  )
}
