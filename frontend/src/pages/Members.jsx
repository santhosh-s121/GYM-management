import { useState, useEffect } from "react";
import { COLORS, planColors, planFees } from "../utils/constants";
import api from "../api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({ name: "", email: "", phone: "", plan: "Basic", age: "", gender: "Male", fee: 1200 });
  const [filterPlan, setFilterPlan] = useState("All");

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMembers = () => {
    api.get("members/").then(res => setMembers(res.data)).catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const addMember = () => {
    if (!newMember.name || !newMember.email || !newMember.phone || !newMember.age) { showToast("Fill all required fields", "error"); return; }

    const payload = {
      ...newMember,
      age: parseInt(newMember.age, 10) || 0,
      fee: parseInt(newMember.fee, 10) || 0
    };

    api.post("members/", payload)
      .then(() => {
        fetchMembers();
        setShowAddMember(false);
        setNewMember({ name: "", email: "", phone: "", plan: "Basic", age: "", gender: "Male", fee: 1200 });
        showToast("Member added successfully!");
      })
      .catch((err) => {
        console.error(err);
        const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Error adding member";
        showToast("Error: " + errorMsg, "error");
      });
  };

  const deleteMember = (id) => {
    api.delete(`members/${id}/`).then(() => {
      fetchMembers();
      setSelectedMember(null);
      showToast("Member removed", "error");
    });
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    api.patch(`members/${id}/`, { status: newStatus }).then(() => {
      fetchMembers();
      if (selectedMember) setSelectedMember(prev => ({ ...prev, status: newStatus }));
      showToast("Status updated");
    });
  };

  const markPaid = (id) => {
    api.patch(`members/${id}/`, { paid: true }).then(() => {
      fetchMembers();
      if (selectedMember) setSelectedMember(prev => ({ ...prev, paid: true }));
      showToast("Payment marked as received!");
    });
  };

  const filteredMembers = members.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.email.toLowerCase().includes(memberSearch.toLowerCase());
    const matchPlan = filterPlan === "All" || m.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  return (
    <>
      <div className="fade-in">
        {/* Toast */}
        {toast && (
          <div style={{
            position: "fixed", top: 24, right: 24, zIndex: 9999, padding: "14px 22px",
            background: toast.type === "error" ? COLORS.red : COLORS.green, color: "#fff",
            borderRadius: 10, fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            animation: "fadeIn 0.3s ease"
          }}>
            {toast.type === "error" ? "❌ " : "✅ "}{toast.msg}
          </div>
        )}

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
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${planColors[m.plan] || COLORS.blue}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: planColors[m.plan] || COLORS.blue }}>
                  {m.name ? m.name[0].toUpperCase() : "?"}
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
      </div>

      {/* Member Detail Panel */}
      {selectedMember && (
        <div style={{ position: "fixed", top: 0, right: 0, width: 360, height: "100vh", background: COLORS.cardAlt, borderLeft: `1px solid ${COLORS.border}`, padding: 28, zIndex: 9999, overflowY: "auto" }}>
          <button onClick={() => setSelectedMember(null)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: COLORS.muted, fontSize: 22, cursor: "pointer" }}>✕</button>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${planColors[selectedMember.plan]}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: planColors[selectedMember.plan], marginBottom: 16 }}>
            {selectedMember.name ? selectedMember.name[0] : "?"}
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
            <button onClick={() => toggleStatus(selectedMember.id, selectedMember.status)} style={{ padding: "11px", borderRadius: 10, border: `1px solid ${COLORS.border}`, background: "none", color: COLORS.text, fontWeight: 600, cursor: "pointer" }}>
              {selectedMember.status === "Active" ? "⏸ Deactivate" : "▶ Activate"} Member
            </button>
            {!selectedMember.paid && (
              <button onClick={() => markPaid(selectedMember.id)} style={{ padding: "11px", borderRadius: 10, border: "none", background: COLORS.green, color: "#fff", fontWeight: 700, cursor: "pointer" }}>
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
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
          <div style={{ background: COLORS.card, borderRadius: 18, padding: 36, width: 480, border: `1px solid ${COLORS.border}` }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 24, color: COLORS.accent, letterSpacing: 2, marginBottom: 24 }}>ADD NEW MEMBER</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { label: "Full Name *", key: "name", type: "text", placeholder: "John Doe" },
                { label: "Email *", key: "email", type: "email", placeholder: "john@email.com" },
                { label: "Phone *", key: "phone", type: "text", placeholder: "9876543210" },
                { label: "Age *", key: "age", type: "number", placeholder: "25" },
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
    </>
  );
}
