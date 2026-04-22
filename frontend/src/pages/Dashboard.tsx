import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/auth"
import { moodApi } from "../services/api"
import dayjs from "dayjs"

const MOODS = [
  { key: "ecstatic",  label: "狂喜",  color: "#FFD700" },
  { key: "happy",     label: "开心",  color: "#7CFC00" },
  { key: "calm",      label: "平静",  color: "#87CEEB" },
  { key: "neutral",   label: "一般",  color: "#D3D3D3" },
  { key: "anxious",   label: "焦虑",  color: "#FF8C00" },
  { key: "sad",       label: "难过",  color: "#6495ED" },
  { key: "angry",     label: "生气",  color: "#DC143C" },
  { key: "exhausted", label: "疲惫",  color: "#8B008B" },
]

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const [year, setYear] = useState(dayjs().year())
  const [entries, setEntries] = useState<Record<string, {mood: string; color: string; note?: string}>>({})
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"))
  const [insight, setInsight] = useState("")
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"year" | "week" | "stats">("year")

  useEffect(() => { loadData() }, [year])

  const loadData = async () => {
    try {
      const res = await moodApi.calendar(year)
      const map: Record<string, any> = {}
      res.data.forEach((e: any) => { map[e.date] = e })
      setEntries(map)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handlePick = async () => {
    if (!selectedMood) return
    const moodObj = MOODS.find(m => m.key === selectedMood)!
    try {
      await moodApi.create({ date: selectedDate, mood: moodObj.key, color: moodObj.color, note: note || undefined })
      setEntries({ ...entries, [selectedDate]: { mood: moodObj.key, color: moodObj.color, note } })
      setSelectedMood(null)
      setNote("")
    } catch (e) { console.error(e) }
  }

  const handleInsight = async () => {
    try {
      const res = await moodApi.insight("weekly")
      setInsight(res.data.summary)
    } catch (e) { console.error(e) }
  }

  const logout_ = () => { logout(); navigate("/") }
  const today = dayjs().format("YYYY-MM-DD")
  const todayEntry = entries[today]
  const startDay = dayjs(`${year}-01-01`).day()
  const daysInYear = dayjs(`${year}-12-31`).date()
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  return (
    <div className="min-h-screen p-4">
      <nav className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎨</span>
          <span className="font-bold text-xl">MoodMosaic</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">{user?.username}</span>
          <button onClick={logout_} className="text-slate-400 hover:text-white">退出</button>
        </div>
      </nav>

      <div className="flex gap-2 mb-6">
        {([["year","年度图"],["week","本周"],["stats","统计"]] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded-lg ${tab === t ? "bg-pink-600" : "bg-white/10"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "year" && (
        <div className="fade-in">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setYear(y => y - 1)} className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20">◀</button>
            <h2 className="text-xl font-bold">{year} 年</h2>
            <button onClick={() => setYear(y => y + 1)} className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20">▶</button>
          </div>
          <div className="flex mb-1">
            {months.map(m => <div key={m} className="text-xs text-slate-500 w-[calc(100%/12)]">{m}</div>)}
          </div>
          <div className="flex">
            <div className="flex flex-col mr-1">
              {["日","一","二","三","四","五","六"].map(d => (
                <div key={d} className="text-xs text-slate-600 h-3 mt-[2px]">{d}</div>
              ))}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-[2px]">
                {Array.from({length: startDay}).map((_, i) => (
                  <div key={"empty-"+i} className="w-3 h-3" />
                ))}
                {Array.from({length: daysInYear}).map((_, i) => {
                  const d = dayjs(`${year}-01-01`).add(i, "day")
                  const key = d.format("YYYY-MM-DD")
                  const entry = entries[key]
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedDate(key)}
                      className="w-3 h-3 rounded-sm cursor-pointer transition-all duration-100 hover:scale-125 hover:z-10"
                      style={{backgroundColor: entry?.color || "#1e293b"}}
                      title={key + (entry ? " - " + MOODS.find(m => m.key === entry.mood)?.label : "")}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Today's entry */}
          <div className="mt-6 glass p-4 rounded-xl">
            <p className="text-sm text-slate-400 mb-3">
              {selectedDate === today ? "今天" : selectedDate}
            </p>
            {todayEntry ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg" style={{backgroundColor: todayEntry.color}} />
                <div>
                  <p className="font-bold">{MOODS.find(m => m.key === todayEntry.mood)?.label}</p>
                  {todayEntry.note && <p className="text-sm text-slate-400">{todayEntry.note}</p>}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-400 mb-2">今天心情如何？</p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {MOODS.map(m => (
                    <button
                      key={m.key}
                      onClick={() => setSelectedMood(selectedMood === m.key ? null : m.key)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${selectedMood === m.key ? "ring-2 ring-white bg-white/20" : "hover:bg-white/10"}`}
                      title={m.label}
                    >
                      <div className="w-8 h-8 rounded-full" style={{backgroundColor: m.color}} />
                      <span className="text-xs mt-1">{m.label}</span>
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="flex gap-2">
                    <input value={note} onChange={e => setNote(e.target.value)}
                      placeholder="写一句心情（可选）"
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm" />
                    <button onClick={handlePick}
                      className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg font-semibold text-sm">
                      保存
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "week" && (
        <div className="fade-in">
          <h2 className="text-xl font-bold mb-4">本周心情</h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({length: 7}).map((_, i) => {
              const d = dayjs().subtract(6 - i, "day")
              const key = d.format("YYYY-MM-DD")
              const entry = entries[key]
              return (
                <div key={key} className="glass p-3 text-center">
                  <p className="text-xs text-slate-400 mb-2">{d.format("ddd")}</p>
                  <div className="w-full aspect-square rounded-lg mx-auto mb-1"
                    style={{backgroundColor: entry?.color || "#1e293b"}} />
                  {entry
                    ? <p className="text-xs">{MOODS.find(m=>m.key===entry.mood)?.label}</p>
                    : <p className="text-xs text-slate-600">-</p>}
                </div>
              )
            })}
          </div>
          <button onClick={handleInsight}
            className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm mb-3">
            🤖 AI 分析本周情绪
          </button>
          {insight && (
            <div className="glass p-4 rounded-xl">
              <p className="text-sm text-slate-300">{insight}</p>
            </div>
          )}
        </div>
      )}

      {tab === "stats" && (
        <div className="fade-in">
          <h2 className="text-xl font-bold mb-4">情绪分布</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(entries).length > 0 ? MOODS.map(m => {
              const count = Object.values(entries).filter(e => e.mood === m.key).length
              const total = Object.entries(entries).length
              const pct = total > 0 ? Math.round(count / total * 100) : 0
              return (
                <div key={m.key} className="glass p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex-shrink-0" style={{backgroundColor: m.color}} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{m.label}</p>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                      <div className="h-full rounded-full" style={{width: pct + "%", backgroundColor: m.color}} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">{count}天</span>
                </div>
              )
            }) : (
              <p className="text-slate-500 col-span-2 text-center py-8">还没有记录</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
