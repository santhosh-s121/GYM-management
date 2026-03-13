import { NavLink, Outlet } from "react-router-dom";
import { COLORS } from "../utils/constants.js";

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

export default function Layout() {
    const tabs = [
        { key: "/", icon: "📊", label: "Dashboard" },
        { key: "/members", icon: "👥", label: "Members" },
        { key: "/trainers", icon: "🏋️", label: "Trainers" },
        { key: "/equipment", icon: "🔧", label: "Equipment" },
        { key: "/payments", icon: "💰", label: "Payments" },
        { key: "/attendance", icon: "📅", label: "Attendance" },
    ];

    return (
        <>
            <style>{css}</style>
            <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "'DM Sans', sans-serif" }}>
                {/* Sidebar */}
                <aside style={{ width: 240, background: COLORS.card, borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 100 }}>
                    <div style={{ padding: "28px 24px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: COLORS.accent, letterSpacing: 2 }}>⚡MASTER GYM</div>
                        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Gym Management System</div>
                    </div>

                    <nav style={{ padding: "16px 12px", flex: 1 }}>
                        {tabs.map(item => (
                            <NavLink
                                key={item.key}
                                to={item.key}
                                style={({ isActive }) => ({
                                    display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", textDecoration: "none",
                                    borderRadius: 10, border: "none", marginBottom: 4, cursor: "pointer", textAlign: "left",
                                    background: isActive ? `${COLORS.accent}18` : "transparent",
                                    color: isActive ? COLORS.accent : COLORS.muted,
                                    fontWeight: isActive ? 600 : 400, fontSize: 14, transition: "all 0.2s",
                                    borderLeft: isActive ? `3px solid ${COLORS.accent}` : "3px solid transparent",
                                })}
                            >
                                <span style={{ fontSize: 18 }}>{item.icon}</span> {item.label}
                            </NavLink>
                        ))}
                    </nav >

                    <div style={{ padding: "16px 20px", borderTop: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 12, color: COLORS.muted }}>Logged in as</div>
                        <div style={{ fontSize: 14, color: COLORS.text, fontWeight: 600, marginTop: 2 }}>Admin</div>
                        <div style={{ display: "inline-block", background: `${COLORS.green}22`, color: COLORS.green, fontSize: 11, padding: "2px 8px", borderRadius: 20, marginTop: 4 }}>● Online</div>
                    </div>
                </aside>

                {/* Main Content */}
                <main style={{ marginLeft: 240, flex: 1, padding: "28px 32px", minHeight: "100vh" }}>
                    <Outlet />
                </main>
            </div>
        </>
    );
}
