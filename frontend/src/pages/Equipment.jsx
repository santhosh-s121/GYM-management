import { useState, useEffect } from "react";
import { COLORS } from "../utils/constants";
import api from "../api";

export default function Equipment() {
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        api.get("equipment/").then(res => setEquipment(res.data)).catch(err => console.error(err));
    }, []);

    return (
        <div className="fade-in">
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2, marginBottom: 6 }}>EQUIPMENT</h1>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>Track and manage gym equipment</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
                {equipment.map(e => {
                    const condColor = e.condition === "Excellent" ? COLORS.green : e.condition === "Good" ? COLORS.blue : COLORS.accent;
                    return (
                        <div key={e.id} className="hover-lift" style={{ background: COLORS.card, borderRadius: 14, padding: "22px", border: `1px solid ${COLORS.border}` }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}></div>
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
                {equipment.length === 0 && <div style={{ color: COLORS.muted }}>No equipment found!</div>}
            </div >
        </div >
    );
}
