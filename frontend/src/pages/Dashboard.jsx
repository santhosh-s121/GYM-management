import { useState, useEffect } from "react";
import { COLORS, planColors } from "../utils/constants";
import api from "../api";

// Fallback data if API is empty
const revenue = [
    { month: "Oct", amount: 85000 }, { month: "Nov", amount: 92000 }, { month: "Dec", amount: 78000 },
    { month: "Jan", amount: 110000 }, { month: "Feb", amount: 98000 }, { month: "Mar", amount: 120000 },
];

export default function Dashboard() {
    const [members, setMembers] = useState([]);
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        api.get("members/").then(res => setMembers(res.data)).catch(err => console.error(err));
        api.get("trainers/").then(res => setTrainers(res.data)).catch(err => console.error(err));
    }, []);

    const activeMembers = members.filter(m => m.status === "Active").length;
    const totalRevenue = members.filter(m => m.paid).reduce((a, m) => a + m.fee, 0);
    const pendingFees = members.filter(m => !m.paid).reduce((a, m) => a + m.fee, 0);

    const maxRevenue = Math.max(...revenue.map(r => r.amount));

    return (
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
                {label: "Pending Fees", value: `₹${pendingFees.toLocaleString()}`, icon: "⚠️", color: COLORS.accent, sub: `${members.filter(m => !m.paid).length} members` },
                {label: "Active Trainers", value: trainers.length, icon: "🏋️", color: COLORS.purple, sub: "All certified" },
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

      {/* Charts Row */ }
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
        </div >

        {/* Plan Distribution */ }
        < div style = {{
            background: COLORS.card, borderRadius: 14, padding: "24px", border: `1px solid ${COLORS.border}` }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginBottom: 20 }}>🎯 Plan Distribution</div>
          {["Basic", "Gold", "Premium"].map(plan => {
            const count = members.filter(m => m.plan === plan).length;
            const pct = members.length > 0 ? Math.round((count / members.length) * 100) : 0;
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
  );
}
