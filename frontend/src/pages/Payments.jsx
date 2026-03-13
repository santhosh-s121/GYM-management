import { useState, useEffect } from "react";
import { COLORS, planColors } from "../utils/constants";
import api from "../api";

export default function Payments() {
    const [members, setMembers] = useState([]);

    const fetchMembers = () => {
        api.get("members/").then(res => setMembers(res.data)).catch(err => console.error(err));
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const markPaid = (id) => {
        api.patch(`members/${id}/`, { paid: true }).then(() => {
      fetchMembers();
    });
  };

  const totalRevenue = members.filter(m => m.paid).reduce((a, m) => a + m.fee, 0);
  const pendingFees = members.filter(m => !m.paid).reduce((a, m) => a + m.fee, 0);
  const collectionRate = members.length > 0 ? Math.round((members.filter(m=>m.paid).length/members.length)*100) : 0;

  return (
    <div className="fade-in">
      <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2, marginBottom: 6 }}>PAYMENTS</h1>
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Manage fee collection and dues</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total Collected", value: `₹${totalRevenue.toLocaleString()}`, color: COLORS.green, icon: "✅" },
          { label: "Total Pending", value: `₹${pendingFees.toLocaleString()}`, color: COLORS.accent, icon: "⚠️" },
          { label: "Collection Rate", value: `${collectionRate}%`, color: COLORS.blue, icon: "📊" },
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
            {members.length === 0 && <tr><td colSpan="5" style={{padding: "20px", textAlign: "center", color: COLORS.muted}}>No members found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
