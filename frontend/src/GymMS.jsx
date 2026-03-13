import { useState, useEffect } from "react";

const COLORS = {
  bg: "#0a0c10",
  card: "#12151c",
  cardAlt: "#181c26",
  accent: "#f0b429",
  accentDim: "#b8891f",
  green: "#22c55e",
  red: "#ef4444",
  blue: "#3b82f6",
  purple: "#a855f7",
  text: "#f1f5f9",
  muted: "#64748b",
  border: "#1e2533",
};

const initMembers = [
  { id: 1, name: "Arjun Sharma", email: "arjun@email.com", phone: "9876543210", plan: "Premium", joined: "2024-01-10", status: "Active", age: 28, gender: "Male", fee: 2500, paid: true },
  { id: 2, name: "Priya Nair", email: "priya@email.com", phone: "9123456780", plan: "Basic", joined: "2024-02-15", status: "Active", age: 24, gender: "Female", fee: 1200, paid: true },
  { id: 3, name: "Rahul Menon", email: "rahul@email.com", phone: "9988776655", plan: "Premium", joined: "2024-03-01", status: "Inactive", age: 32, gender: "Male", fee: 2500, paid: false },
  { id: 4, name: "Sneha Iyer", email: "sneha@email.com", phone: "9345678901", plan: "Gold", joined: "2024-03-20", status: "Active", age: 27, gender: "Female", fee: 1800, paid: true },
  { id: 5, name: "Vikram Das", email: "vikram@email.com", phone: "9012345678", plan: "Basic", joined: "2024-04-05", status: "Active", age: 35, gender: "Male", fee: 1200, paid: false },
  { id: 6, name: "Kavya Reddy", email: "kavya@email.com", phone: "9765432109", plan: "Gold", joined: "2024-04-18", status: "Active", age: 22, gender: "Female", fee: 1800, paid: true },
];

const initTrainers = [
  { id: 1, name: "Coach Raj Kumar", specialty: "Strength & Conditioning", experience: 8, members: 15, rating: 4.8, status: "Active", salary: 35000 },
  { id: 2, name: "Coach Anita Singh", specialty: "Yoga & Flexibility", experience: 5, members: 20, rating: 4.9, status: "Active", salary: 28000 },
  { id: 3, name: "Coach Dev Patel", specialty: "Cardio & HIIT", experience: 6, members: 12, rating: 4.7, status: "Active", salary: 30000 },
  { id: 4, name: "Coach Meena Joseph", specialty: "Nutrition & Weight Loss", experience: 10, members: 18, rating: 5.0, status: "Active", salary: 40000 },
];

const initEquipment = [
  { id: 1, name: "Treadmill", count: 8, condition: "Good", lastService: "2024-12-01", nextService: "2025-06-01" },
  { id: 2, name: "Bench Press", count: 5, condition: "Excellent", lastService: "2024-11-15", nextService: "2025-05-15" },
  { id: 3, name: "Dumbbells Set", count: 20, condition: "Good", lastService: "2024-10-01", nextService: "2025-04-01" },
  { id: 4, name: "Elliptical", count: 4, condition: "Fair", lastService: "2024-09-20", nextService: "2025-03-20" },
  { id: 5, name: "Pull-up Bar", count: 6, condition: "Excellent", lastService: "2024-12-10", nextService: "2025-06-10" },
];

const attendance = [
  { day: "Mon", count: 45 }, { day: "Tue", count: 62 }, { day: "Wed", count: 58 },
  { day: "Thu", count: 70 }, { day: "Fri", count: 80 }, { day: "Sat", count: 95 }, { day: "Sun", count: 40 },
];

const revenue = [
  { month: "Oct", amount: 85000 }, { month: "Nov", amount: 92000 }, { month: "Dec", amount: 78000 },
  { month: "Jan", amount: 110000 }, { month: "Feb", amount: 98000 }, { month: "Mar", amount: 120000 },
];

const planColors = { Basic: "#3b82f6", Gold: "#f0b429", Premium: "#a855f7" };

const style = (obj) => obj;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0c10; color: #f1f5f9; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #12151c; }
  ::-webkit-scrollbar-thumb { background: #f0b429; border-radius: 2px; }
  input, select, textarea { outline: none; font-family: 'DM Sans', sans-serif; }
  button { cursor: pointer; font-family: 'DM Sans', sans-serif; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
  .fade-in { animation: fadeIn 0.35s ease forwards; }
  .stat-bar { transition: width 0.8s cubic-bezier(.4,0,.2,1); }
  .hover-lift:hover { transform: translateY(-2px); transition: transform 0.2s; }
`;

export default function GymMS() {
  const [tab, setTab] = useState("dashboard");
  const [members, setMembers] = useState(initMembers);
  const [trainers] = useState(initTrainers);
  const [equipment] = useState(initEquipment);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [toast, setToast] = useState(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", phone: "", plan: "Basic", age: "", gender: "Male", fee: 1200 });
  const [filterPlan, setFilterPlan] = useState("All");

  const planFees = { Basic: 1200, Gold: 1800, Premium: 2500 };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const activeMembers = members.filter(m => m.status === "Active").length;
  const totalRevenue = members.filter(m => m.paid).reduce((a, m) => a + m.fee, 0);
  const pendingFees = members.filter(m => !m.paid).reduce((a, m) => a + m.fee, 0);

  const addMember = () => {
    if (!newMember.name || !newMember.email || !newMember.phone) { showToast("Fill all required fields", "error"); return; }
    const mem = { ...newMember, id: Date.now(), joined: new Date().toISOString().split("T")[0], status: "Active", paid: false, fee: planFees[newMember.plan] };
    setMembers(prev => [mem, ...prev]);
    setShowAddMember(false);
    setNewMember({ name: "", email: "", phone: "", plan: "Basic", age: "", gender: "Male", fee: 1200 });
    showToast("Member added successfully!");
  };

  const deleteMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    setSelectedMember(null);
    showToast("Member removed", "error");
  };

  const toggleStatus = (id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" } : m));
    showToast("Status updated");
  };

  const markPaid = (id) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, paid: true } : m));
    showToast("Payment marked as received!");
  };

  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    const matchPlan = filterPlan === "All" || m.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const maxRevenue = Math.max(...revenue.map(r => r.amount));
  const maxAttendance = Math.max(...attendance.map(a => a.count));

  return (
    <>
      <style>{css}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', sans-serif" }}>

        {/* Sidebar */}
        <aside style={{ width: 240, background: COLORS.card, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}>
          <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: COLORS.accent, letterSpacing: 2 }}>⚡ IRON PEAK</div>
            <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Gym Management System</div>
          </div>

          <nav style={{ padding: "16px 12px", flex: 1 }}>
            {[
              { key: "dashboard", icon: "📊", label: "Dashboard" },
              { key: "members", icon: "👥", label: "Members" },
              { key: "trainers", icon: "🏋️", label: "Trainers" },
              { key: "equipment", icon: "🔧", label: "Equipment" },
              { key: "payments", icon: "💰", label: "Payments" },
              { key: "attendance", icon: "📅", label: "Attendance" },
            ].map(item => (
              <button key={item.key} onClick={() => setTab(item.key)} style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px",
                borderRadius: 10, border: "none", marginBottom: 4, cursor: "pointer", textAlign: "left",
                background: tab === item.key ? `${COLORS.accent}18` : "transparent",
                color: tab === item.key ? COLORS.accent : COLORS.muted,
                fontWeight: tab === item.key ? 600 : 400, fontSize: 14, transition: "all 0.2s",
                borderLeft: tab === item.key ? `3px solid ${COLORS.accent}` : "3px solid transparent",
              }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
            <div style={{ fontSize: 12, color: COLORS.muted }}>Logged in as</div>
            <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 600, marginTop: 2 }}>Admin</div>
            <div style={{ display: "inline-block", background: `${COLORS.green}22`, color: COLORS.green, fontSize: 11, padding: "2px 8px", borderRadius: 20, marginTop: 4 }}>● Online</div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ marginLeft: 240, flex: 1, padding: "28px 32px", minHeight: "100vh" }}>

          {/* Toast */}
          {toast && (
            <div style={{
              position: "fixed", top: 24, right: 24, zIndex: 999, padding: "14px 22px",
              background: toast.type === "error" ? COLORS.red : COLORS.green, color: "#fff",
              borderRadius: 10, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              animation: "fadeIn 0.3s ease"
            }}>
              {toast.type === "error" ? "❌ " : "✅ "}{toast.msg}
            </div>
          )}

          {/* DASHBOARD */}
          {tab === "dashboard" && (
            <div className="fade-in">
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2 }}>DASHBOARD</h1>
                <p style={{ color: COLORS.muted, fontSize: 14 }}>Welcome back, Admin! Here's your gym at a glance.</p>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Total Members", value: members.length, icon: "👥", color: COLORS.blue, sub: `${activeMembers} active` },
                  { label: "Monthly Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "💰", color: COLORS.green, sub: "Paid members" },
                  { label: "Pending Fees", value: `₹${pendingFees.toLocaleString()}`, icon: "⚠️", color: COLORS.accent, sub: `${members.filter(m => !m.paid).length} members` },
                  { label: "Active Trainers", value: trainers.length, icon: "🏋️", color: COLORS.purple, sub: "All certified" },
                ].map((s, i) => (
                  <div key={i} className="hover-lift" style={{ background: COLORS.card, borderRadius: 14, padding: "20px 22px", border: `1px solid ${COLORS.border}`, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -10, right: -10, fontSize: 52, opacity: 0.06 }}>{s.icon}</div>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{s.icon}</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'Bebas Neue'", letterSpacing: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: s.color, marginTop: 4, opacity: 0.8 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 28 }}>
                {/* Revenue Chart */}
                <div style={{ background: COLORS.card, borderRadius: 14, padding: "24px", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 20 }}>📈 Monthly Revenue</div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
                    {revenue.map((r, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <div style={{ fontSize: 10, color: COLORS.muted }}>₹{(r.amount / 1000).toFixed(0)}k</div>
                        <div style={{ width: "100%", background: `${COLORS.accent}22`, borderRadius: "6px 6px 0 0", position: "relative", height: `${(r.amount / maxRevenue) * 110}px` }}>
                          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: `linear-gradient(180deg, ${COLORS.accent}, ${COLORS.accentDim})`, borderRadius: "6px 6px 0 0", height: "100%", opacity: i === revenue.length - 1 ? 1 : 0.65 }} />
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.muted }}>{r.month}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Distribution */}
                <div style={{ background: COLORS.card, borderRadius: 14, padding: "24px", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 20 }}>🎯 Plan Distribution</div>
                  {["Basic", "Gold", "Premium"].map(plan => {
                    const count = members.filter(m => m.plan === plan).length;
                    const pct = Math.round((count / members.length) * 100);
                    return (
                      <div key={plan} style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{plan}</span>
                          <span style={{ fontSize: 13, color: planColors[plan], fontWeight: 700 }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height: 8, background: `${planColors[plan]}20`, borderRadius: 4, overflow: "hidden" }}>
                          <div className="stat-bar" style={{ height: "100%", background: planColors[plan], borderRadius: 4, width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Members */}
              <div style={{ background: COLORS.card, borderRadius: 14, padding: "24px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 16 }}>🆕 Recent Members</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      {["Name", "Plan", "Joined", "Status", "Fee Paid"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.slice(0, 5).map(m => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${COLORS.border}10` }}>
                        <td style={{ padding: "12px 12px", fontSize: 14, color: COLORS.text, fontWeight: 500 }}>{m.name}</td>
                        <td style={{ padding: "12px 12px" }}><span style={{ background: `${planColors[m.plan]}22`, color: planColors[m.plan], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{m.plan}</span></td>
                        <td style={{ padding: "12px 12px", fontSize: 13, color: COLORS.muted }}>{m.joined}</td>
                        <td style={{ padding: "12px 12px" }}><span style={{ color: m.status === "Active" ? COLORS.green : COLORS.red, fontSize: 13, fontWeight: 600 }}>● {m.status}</span></td>
                        <td style={{ padding: "12px 12px" }}><span style={{ color: m.paid ? COLORS.green : COLORS.accent, fontSize: 13, fontWeight: 600 }}>{m.paid ? "✓ Paid" : "⏳ Pending"}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MEMBERS */}
          {tab === "members" && (
            <div className="fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2 }}>MEMBERS</h1>
                  <p style={{ color: COLORS.muted, fontSize: 14 }}>{members.length} total members registered</p>
                </div>
                <button onClick={() => setShowAddMember(true)} style={{ background: COLORS.accent, color: "#000", border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
                  + Add Member
                </button>
              </div>

              {/* Filters */}
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <input value={memberSearch} onChange={e => setMemberSearch(e.target.value)} placeholder="🔍  Search members..." style={{ flex: 1, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "11px 16px", color: COLORS.text, fontSize: 14 }} />
                {["All", "Basic", "Gold", "Premium"].map(p => (
                  <button key={p} onClick={() => setFilterPlan(p)} style={{ padding: "11px 18px", borderRadius: 10, border: `1px solid ${filterPlan === p ? COLORS.accent : COLORS.border}`, background: filterPlan === p ? `${COLORS.accent}18` : COLORS.card, color: filterPlan === p ? COLORS.accent : COLORS.muted, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                    {p}
                  </button>
                ))}
              </div>

              {/* Member Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {filteredMembers.map(m => (
                  <div key={m.id} onClick={() => setSelectedMember(m)} className="hover-lift" style={{ background: COLORS.card, borderRadius: 14, padding: "20px", border: `1px solid ${selectedMember?.id === m.id ? COLORS.accent : COLORS.border}`, cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${planColors[m.plan]}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: planColors[m.plan] }}>
                        {m.name[0]}
                      </div>
                      <span style={{ background: `${planColors[m.plan]}22`, color: planColors[m.plan], padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{m.plan}</span>
                    </div>
                    <div style={{ fontWeight: 600, color: COLORS.text, fontSize: 15, marginBottom: 3 }}>{m.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 10 }}>{m.email}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: m.status === "Active" ? COLORS.green : COLORS.red, fontWeight: 600 }}>● {m.status}</span>
                      <span style={{ fontSize: 12, color: m.paid ? COLORS.green : COLORS.accent, fontWeight: 600 }}>{m.paid ? "✓ Paid" : "⚠ Pending"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Member Detail Panel */}
              {selectedMember && (
                <div style={{ position: "fixed", top: 0, right: 0, width: 360, height: "100vh", background: COLORS.cardAlt, borderLeft: `1px solid ${COLORS.border}`, padding: 28, zIndex: 200, overflowY: "auto" }}>
                  <button onClick={() => setSelectedMember(null)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: COLORS.muted, fontSize: 22, cursor: "pointer" }}>✕</button>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${planColors[selectedMember.plan]}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: planColors[selectedMember.plan], marginBottom: 16 }}>
                    {selectedMember.name[0]}
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: COLORS.text, letterSpacing: 1 }}>{selectedMember.name}</div>
                  <span style={{ background: `${planColors[selectedMember.plan]}22`, color: planColors[selectedMember.plan], padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 20 }}>{selectedMember.plan} Plan</span>

                  {[
                    ["📧 Email", selectedMember.email],
                    ["📱 Phone", selectedMember.phone],
                    ["🎂 Age", selectedMember.age + " years"],
                    ["⚥ Gender", selectedMember.gender],
                    ["📅 Joined", selectedMember.joined],
                    ["💰 Monthly Fee", `₹${selectedMember.fee}`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                      <span style={{ fontSize: 13, color: COLORS.muted }}>{k}</span>
                      <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}

                  <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                    <button onClick={() => toggleStatus(selectedMember.id)} style={{ padding: "11px", borderRadius: 10, border: `1px solid ${COLORS.border}`, background: "none", color: COLORS.text, fontWeight: 600, cursor: "pointer" }}>
                      {selectedMember.status === "Active" ? "⏸ Deactivate" : "▶ Activate"} Member
                    </button>
                    {!selectedMember.paid && (
                      <button onClick={() => { markPaid(selectedMember.id); setSelectedMember(prev => ({ ...prev, paid: true })); }} style={{ padding: "11px", borderRadius: 10, border: "none", background: COLORS.green, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                        ✓ Mark as Paid
                      </button>
                    )}
                    <button onClick={() => deleteMember(selectedMember.id)} style={{ padding: "11px", borderRadius: 10, border: "none", background: COLORS.red, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                      🗑 Remove Member
                    </button>
                  </div>
                </div>
              )}

              {/* Add Member Modal */}
              {showAddMember && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300 }}>
                  <div style={{ background: COLORS.card, borderRadius: 18, padding: 36, width: 480, border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: COLORS.accent, letterSpacing: 2, marginBottom: 24 }}>ADD NEW MEMBER</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                      {[
                        { label: "Full Name *", key: "name", type: "text", placeholder: "John Doe" },
                        { label: "Email *", key: "email", type: "email", placeholder: "john@email.com" },
                        { label: "Phone *", key: "phone", type: "text", placeholder: "9876543210" },
                        { label: "Age", key: "age", type: "number", placeholder: "25" },
                      ].map(f => (
                        <div key={f.key}>
                          <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{f.label}</div>
                          <input type={f.type} value={newMember[f.key]} onChange={e => setNewMember(prev => ({ ...prev, [f.key]: e.target.value }))} placeholder={f.placeholder}
                            style={{ width: "100%", background: COLORS.cardAlt, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 14 }} />
                        </div>
                      ))}
                      <div>
                        <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Plan</div>
                        <select value={newMember.plan} onChange={e => setNewMember(prev => ({ ...prev, plan: e.target.value, fee: planFees[e.target.value] }))}
                          style={{ width: "100%", background: COLORS.cardAlt, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 14 }}>
                          <option>Basic</option><option>Gold</option><option>Premium</option>
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase" }}>Gender</div>
                        <select value={newMember.gender} onChange={e => setNewMember(prev => ({ ...prev, gender: e.target.value }))}
                          style={{ width: "100%", background: COLORS.cardAlt, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", color: COLORS.text, fontSize: 14 }}>
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ background: `${COLORS.accent}11`, borderRadius: 10, padding: "10px 14px", marginTop: 14, fontSize: 14, color: COLORS.accent, fontWeight: 600 }}>
                      Monthly Fee: ₹{newMember.fee}
                    </div>
                    <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
                      <button onClick={() => setShowAddMember(false)} style={{ flex: 1, padding: "12px", borderRadius: 10, border: `1px solid ${COLORS.border}`, background: "none", color: COLORS.muted, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                      <button onClick={addMember} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "none", background: COLORS.accent, color: "#000", fontWeight: 700, cursor: "pointer" }}>Add Member</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TRAINERS */}
          {tab === "trainers" && (
            <div className="fade-in">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2, marginBottom: 6 }}>TRAINERS</h1>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>{trainers.length} certified trainers on staff</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {trainers.map(t => (
                  <div key={t.id} className="hover-lift" style={{ background: COLORS.card, borderRadius: 14, padding: "24px", border: `1px solid ${COLORS.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 54, height: 54, borderRadius: "50%", background: `${COLORS.purple}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: COLORS.purple, fontWeight: 700 }}>
                        {t.name.split(" ")[1][0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: COLORS.text, fontSize: 16 }}>{t.name}</div>
                        <div style={{ fontSize: 13, color: COLORS.purple }}>{t.specialty}</div>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                      {[
                        { label: "Experience", value: `${t.experience} yrs` },
                        { label: "Members", value: t.members },
                        { label: "Rating", value: `⭐ ${t.rating}` },
                      ].map(s => (
                        <div key={s.label} style={{ background: COLORS.cardAlt, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>{s.value}</div>
                          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 14, color: COLORS.green, fontWeight: 700 }}>₹{t.salary.toLocaleString()}/mo</span>
                      <span style={{ background: `${COLORS.green}22`, color: COLORS.green, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>● {t.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EQUIPMENT */}
          {tab === "equipment" && (
            <div className="fade-in">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2, marginBottom: 6 }}>EQUIPMENT</h1>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Track and manage gym equipment</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {equipment.map(e => {
                  const condColor = e.condition === "Excellent" ? COLORS.green : e.condition === "Good" ? COLORS.blue : COLORS.accent;
                  return (
                    <div key={e.id} className="hover-lift" style={{ background: COLORS.card, borderRadius: 14, padding: "22px", border: `1px solid ${COLORS.border}` }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>🏋️</div>
                      <div style={{ fontWeight: 700, color: COLORS.text, fontSize: 16, marginBottom: 4 }}>{e.name}</div>
                      <div style={{ fontSize: 13, color: COLORS.muted, marginBottom: 14 }}>Qty: {e.count} units</div>
                      <div style={{ background: `${condColor}18`, borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 2 }}>Condition</div>
                        <div style={{ fontSize: 14, color: condColor, fontWeight: 700 }}>{e.condition}</div>
                      </div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>Last Service: <span style={{ color: COLORS.text }}>{e.lastService}</span></div>
                      <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Next Service: <span style={{ color: COLORS.accent }}>{e.nextService}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {tab === "payments" && (
            <div className="fade-in">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2, marginBottom: 6 }}>PAYMENTS</h1>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Manage fee collection and dues</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total Collected", value: `₹${totalRevenue.toLocaleString()}`, color: COLORS.green, icon: "✅" },
                  { label: "Total Pending", value: `₹${pendingFees.toLocaleString()}`, color: COLORS.accent, icon: "⚠️" },
                  { label: "Collection Rate", value: `${Math.round((members.filter(m=>m.paid).length/members.length)*100)}%`, color: COLORS.blue, icon: "📊" },
                ].map(s => (
                  <div key={s.label} style={{ background: COLORS.card, borderRadius: 14, padding: "22px", border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Bebas Neue'", letterSpacing: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: COLORS.muted }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                <div style={{ padding: "18px 24px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 15, fontWeight: 600, color: COLORS.text }}>💳 Fee Status</div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: COLORS.cardAlt }}>
                      {["Member", "Plan", "Amount", "Status", "Action"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "12px 20px", fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} style={{ borderBottom: `1px solid ${COLORS.border}10` }}>
                        <td style={{ padding: "14px 20px" }}>
                          <div style={{ fontWeight: 600, color: COLORS.text, fontSize: 14 }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: COLORS.muted }}>{m.email}</div>
                        </td>
                        <td style={{ padding: "14px 20px" }}><span style={{ background: `${planColors[m.plan]}22`, color: planColors[m.plan], padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{m.plan}</span></td>
                        <td style={{ padding: "14px 20px", fontWeight: 700, color: COLORS.text }}>₹{m.fee}</td>
                        <td style={{ padding: "14px 20px" }}><span style={{ color: m.paid ? COLORS.green : COLORS.accent, fontWeight: 600, fontSize: 13 }}>{m.paid ? "✓ Paid" : "⏳ Pending"}</span></td>
                        <td style={{ padding: "14px 20px" }}>
                          {!m.paid && <button onClick={() => markPaid(m.id)} style={{ background: COLORS.green, color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>Mark Paid</button>}
                          {m.paid && <span style={{ fontSize: 12, color: COLORS.muted }}>Cleared</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ATTENDANCE */}
          {tab === "attendance" && (
            <div className="fade-in">
              <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2, marginBottom: 6 }}>ATTENDANCE</h1>
              <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Weekly attendance tracking</p>

              <div style={{ background: COLORS.card, borderRadius: 14, padding: "28px", border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 24 }}>📅 This Week's Attendance</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 180 }}>
                  {attendance.map((a, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{a.count}</div>
                      <div style={{ width: "100%", background: `${COLORS.blue}15`, borderRadius: "8px 8px 0 0", height: `${(a.count / maxAttendance) * 150}px`, position: "relative" }}>
                        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${COLORS.blue}, #1d4ed8)`, borderRadius: "8px 8px 0 0", opacity: a.day === "Sat" ? 1 : 0.6 }} />
                      </div>
                      <div style={{ fontSize: 13, color: COLORS.muted, fontWeight: 500 }}>{a.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
                {[
                  { label: "Peak Day", value: "Saturday", sub: "95 members", icon: "🔥" },
                  { label: "Weekly Avg", value: "64/day", sub: "Consistent growth", icon: "📈" },
                  { label: "Active Now", value: "23", sub: "In the gym", icon: "🏋️" },
                  { label: "Monthly Total", value: "1,856", sub: "Visits this month", icon: "📊" },
                ].map(s => (
                  <div key={s.label} style={{ background: COLORS.card, borderRadius: 14, padding: "20px", border: `1px solid ${COLORS.border}` }}>
                    <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, fontFamily: "'Bebas Neue'", letterSpacing: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: COLORS.muted }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.accent, marginTop: 4 }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
