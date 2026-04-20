"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔐 Detectar usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => unsubscribe();
  }, []);

  // 💾 Guardar progreso
  const guardarProgreso = async () => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      setSaving(true);

      await setDoc(
        doc(db, "usuarios", user.uid),
        {
          peso,
          meta,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      alert("Progreso guardado ✅");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  // 💳 Suscripción PayPal
  const handleSubscribe = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
      });

      const data = await res.json();

      const approvalUrl = data?.links?.find(
        (l: any) => l.rel === "approve"
      )?.href;

      if (!approvalUrl) {
        console.error(data);
        alert("Error con PayPal");
        return;
      }

      window.location.href = approvalUrl;
    } catch (error) {
      console.error(error);
      alert("Error al suscribirse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 15,
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <h1>💪 FitStartPro</h1>

      {/* 👤 Usuario */}
      {user ? (
        <p>Bienvenido: {user.email}</p>
      ) : (
        <p>No has iniciado sesión</p>
      )}

      {/* 🔥 BOTÓN PRO */}
      <button
        onClick={handleSubscribe}
        disabled={loading}
        style={{
          padding: 10,
          borderRadius: 8,
          border: "none",
          background: "#28a745",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {loading ? "Procesando..." : "💳 Empieza GRATIS 3 días"}
      </button>

      {/* 📊 FORMULARIO PROGRESO */}
      <input
        placeholder="peso"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
        style={{ padding: 10 }}
      />

      <input
        placeholder="meta"
        value={meta}
        onChange={(e) => setMeta(e.target.value)}
        style={{ padding: 10 }}
      />

      <button
        onClick={guardarProgreso}
        disabled={saving}
        style={{
          padding: 10,
          borderRadius: 8,
          border: "none",
          background: "#0070f3",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {saving ? "Guardando..." : "Guardar"}
      </button>
    </main>
  );
}