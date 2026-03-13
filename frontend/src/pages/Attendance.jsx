import { useState, useEffect } from "react";
import { COLORS } from "../utils/constants";
import api from "../api";

export default function Attendance() {
    const [members, setMembers] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [searchQuery, setSearchQuery] = useState("");
    const [attendanceStatus, setAttendanceStatus] = useState({});
    const [toast, setToast] = useState(null);

    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        // Fetch members once
        api.get("members/").then(res => {
            setMembers(res.data);
        }).catch(err => console.error(err));
    }, []);

    useEffect(() => {
        // Fetch attendance for selected date
        api.get(`attendance/?date=${selectedDate}`).then(res => {
            setAttendanceRecords(res.data);
            const statusMap = {};
            res.data.forEach(record => {
                statusMap[record.member] = record.status;
            });
            setAttendanceStatus(statusMap);
        }).catch(err => console.error(err));
    }, [selectedDate]);

    const handleStatusChange = (memberId, status) => {
        setAttendanceStatus(prev => ({
            ...prev,
            [memberId]: status
        }));
    };

    const saveAttendance = () => {
        const payload = members.map(m => ({
            member: m.id,
            status: attendanceStatus[m.id] || "Absent" // default Absent if not marked
        }));

        api.post("attendance/bulk_save/", {
            date: selectedDate,
            records: payload
        }).then(() => {
            showToast("Attendance saved successfully!");
            // Refetch to sync any timestamps
            api.get(`attendance/?date=${selectedDate}`).then(res => setAttendanceRecords(res.data));
        }).catch(err => {
            console.error(err);
            showToast("Error saving attendance", "error");
        });
    };

    // Derived state for summary
    const totalMembers = members.length;
    const presentCount = members.filter(m => attendanceStatus[m.id] === "Present").length;
    const lateCount = members.filter(m => attendanceStatus[m.id] === "Late").length;
    const absentCount = totalMembers - presentCount - lateCount; // Unmarked default to absent

    // Filtered members for display
    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toString().includes(searchQuery) ||
        m.plan.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="fade-in">
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
                    <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2 }}>ATTENDANCE</h1>
                    <p style={{ color: COLORS.muted, fontSize: 14 }}>Mark and track daily member attendance</p>
                </div>
                <button onClick={saveAttendance} style={{ background: COLORS.green, color: "#fff", border: "none", borderRadius: 10, padding: "12px 22px", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }}>
                    💾 Save Attendance
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
                {[
                    { label: "Total Members", value: totalMembers, icon: "👥", color: COLORS.blue },
                    { label: "Members Present", value: presentCount + lateCount, icon: "✅", color: COLORS.green },
                    { label: "Members Absent", value: absentCount, icon: "❌", color: COLORS.red },
                ].map(s => (
                    <div key={s.label} style={{ background: COLORS.card, borderRadius: 14, padding: "20px", border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                        <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: "'Bebas Neue'", letterSpacing: 1 }}>{s.value}</div>
                        <div style={{ fontSize: 13, color: COLORS.muted }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1, position: "relative" }}>
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="🔍 Search members by name, ID, or plan..."
                        style={{ width: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 16px", color: COLORS.text, fontSize: 14 }}
                    />
                </div>
                <div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "11px 16px", color: COLORS.text, fontSize: 14, minWidth: 160 }}
                    />
                </div>
            </div>

            {/* Roster Table */}
            <div style={{ background: COLORS.card, borderRadius: 14, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ background: COLORS.cardAlt, borderBottom: `1px solid ${COLORS.border}` }}>
                            <th style={{ padding: "14px 20px", fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Member info</th>
                            <th style={{ padding: "14px 20px", fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>ID & Plan</th>
                            <th style={{ padding: "14px 20px", fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Time Marked</th>
                            <th style={{ padding: "14px 20px", fontSize: 12, color: COLORS.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Attendance Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map(m => {
                            const currentVal = attendanceStatus[m.id] || "Absent";
                            const record = attendanceRecords.find(r => r.member === m.id);

                            return (
                                <tr key={m.id} style={{ borderBottom: `1px solid ${COLORS.border}10` }}>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ fontWeight: 600, color: COLORS.text, fontSize: 15 }}>{m.name}</div>
                                        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{m.email}</div>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ fontWeight: 500, color: COLORS.text, fontSize: 13, marginBottom: 4 }}>ID: #{m.id}</div>
                                        <span style={{ background: `${COLORS.accent}22`, color: COLORS.accent, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{m.plan}</span>
                                    </td>
                                    <td style={{ padding: "14px 20px", fontSize: 13, color: COLORS.muted }}>
                                        {record ? record.time.substring(0, 5) : "--:--"}
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button
                                                onClick={() => handleStatusChange(m.id, "Present")}
                                                style={{
                                                    padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                                    border: `1px solid ${currentVal === "Present" ? COLORS.green : COLORS.border}`,
                                                    background: currentVal === "Present" ? `${COLORS.green}25` : "transparent",
                                                    color: currentVal === "Present" ? COLORS.green : COLORS.muted
                                                }}
                                            >Present</button>
                                            <button
                                                onClick={() => handleStatusChange(m.id, "Late")}
                                                style={{
                                                    padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                                    border: `1px solid ${currentVal === "Late" ? COLORS.accent : COLORS.border}`,
                                                    background: currentVal === "Late" ? `${COLORS.accent}25` : "transparent",
                                                    color: currentVal === "Late" ? COLORS.accent : COLORS.muted
                                                }}
                                            >Late</button>
                                            <button
                                                onClick={() => handleStatusChange(m.id, "Absent")}
                                                style={{
                                                    padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                                                    border: `1px solid ${currentVal === "Absent" ? COLORS.red : COLORS.border}`,
                                                    background: currentVal === "Absent" ? `${COLORS.red}25` : "transparent",
                                                    color: currentVal === "Absent" ? COLORS.red : COLORS.muted
                                                }}
                                            >Absent</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {filteredMembers.length === 0 && (
                            <tr><td colSpan="4" style={{ padding: "30px", textAlign: "center", color: COLORS.muted }}>No members found for this query.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
