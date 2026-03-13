import { useState, useEffect } from "react";
import { COLORS } from "../utils/constants";
import api from "../api";

export default function Trainers() {
    const [trainers, setTrainers] = useState([]);

    useEffect(() => {
        api.get("trainers/").then(res => setTrainers(res.data)).catch(err => console.error(err));
    }, []);

    return (
        <div className="fade-in">
            <h1 style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: COLORS.text, letterSpacing: 2, marginBottom: 6 }}>TRAINERS</h1>
            <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 24 }}>{trainers.length} certified trainers on staff</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
                {trainers.map(t => (
                    <div key={t.id} className="hover-lift" style={{ background: COLORS.card, borderRadius: 14, padding: "24px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 54, height: 54, borderRadius: "50%", background: `${COLORS.purple}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: COLORS.purple, fontWeight: 700 }}>
                    {t.name.split(" ").length > 1 ? t.name.split(" ")[1][0] : t.name[0]}
                </div>
                <div>
                    <div style={{ fontWeight: 700, color: COLORS.text, fontSize: 16 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: COLORS.purple }}>{t.specialty}</div>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                {[
                    { label: "Experience", value: `${t.experience} yrs` },
                {label: "Members", value: t.members },
                {label: "Rating", value: `⭐ ${t.rating}` },
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
          </div >
        ))
}
{ trainers.length === 0 && <div style={{ color: COLORS.muted }}>No trainers found. Add some in the admin panel!</div> }
      </div >
    </div >
  );
}
