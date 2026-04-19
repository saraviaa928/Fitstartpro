"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";

import { loginUser, registerUser } from "@/services/authService";
import {
  createUserDoc,
  getUserData,
  updateUserData,
} from "@/services/userService";

export default function Home() {
  const user = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [peso, setPeso] = useState("");
  const [meta, setMeta] = useState("");
  const [progreso, setProgreso] = useState(0);
  const [racha, setRacha] = useState(0);

  // 🔥 SaaS
  const [premium, setPremium] = useState(false);

  //////////////////////////////////////////
  // LOGIN / REGISTER
  //////////////////////////////////////////
  const handleAuth = async () => {
    try {
      const res = await loginUser(email, password);

      const data: any = await getUserData(res.user.uid);

      if (data) {
        setPeso(data.peso || "");
        setMeta(data.meta || "");
        setProgreso(data.progreso || 0);
        setRacha(data.racha || 0);
        setPremium(data.premium || false);
      }
    } catch {
      const res = await registerUser(email, password);
      await createUserDoc(res.user.uid, email);
      alert("✅ Cuenta creada");
    }
  };

  //////////////////////////////////////////
  // CARGAR DATOS
  //////////////////////////////////////////
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const data: any = await getUserData(user.uid);

      if (data) {
        setPeso(data.peso || "");
        setMeta(data.meta || "");
        setProgreso(data.progreso || 0);
        setRacha(data.racha || 0);
        setPremium(data.premium || false);
      }
    };

    load();
  }, [user]);

  //////////////////////////////////////////
  // GUARDAR PROGRESO
  //////////////////////////////////////////
  const guardar = async () => {
    if (!user) return;

    const pesoNum = parseFloat(peso);
    const metaNum = parseFloat(meta);

    if (isNaN(pesoNum) || isNaN(metaNum)) {
      alert("Valores inválidos");
      return;
    }

    const nuevoProgreso = Math.min((pesoNum / metaNum) * 100, 100);

    await updateUserData(user.uid, {
      peso,
      meta,
      progreso: nuevoProgreso,
      racha: racha + 1,
    });

    setProgreso(nuevoProgreso);
    setRacha(racha + 1);

    alert("✅ Progreso guardado");
  };

  //////////////////////////////////////////
  // 💳 SUSCRIPCIÓN PAYPAL
  //////////////////////////////////////////
  const suscribirse = async () => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }

    try {
      const res = await fetch("/api/paypal/create-subscription", {
        method: "POST",
        body: JSON.stringify({ uid: user.uid }),
      });

      const data = await res.json();

      if (data.approve) {
        window.location.href = data.approve;
      } else {
        alert("Error al iniciar suscripción");
      }
    } catch (err) {
      console.error(err);
      alert("Error con PayPal");
    }
  };

  //////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>💪 FitStartPro</h1>

      {!user ? (
        <div style={styles.card}>
          <h2>Login / Registro</h2>

          <input
            style={styles.input}
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.btn} onClick={handleAuth}>
            Entrar / Crear cuenta
          </button>
        </div>
      ) : (
        <>
          <div style={styles.card}>
            <p>👋 {user.email}</p>
          </div>

          {/* 🔒 PAYWALL */}
          {!premium && (
            <div style={styles.card}>
              <h3>🔒 Desbloquea FitStartPro PRO</h3>
              <p>
                Rutinas avanzadas, nutrición personalizada y seguimiento completo
              </p>

              <button style={styles.btnPremium} onClick={suscribirse}>
                💳 Suscribirme $4.99/mes
              </button>
            </div>
          )}

          {/* 🔥 CONTENIDO PREMIUM */}
          {premium && (
            <div style={styles.card}>
              <h3>🔥 Modo PRO activo</h3>
              <p>Acceso completo desbloqueado</p>
            </div>
          )}

          <div style={styles.card}>
            <h3>📊 Progreso</h3>

            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progreso}%`,
                }}
              />
            </div>

            <p>{progreso.toFixed(0)}%</p>
          </div>

          <div style={styles.card}>
            <h3>🔥 Racha</h3>
            <p style={styles.big}>{racha} días</p>
          </div>

          <div style={styles.card}>
            <input
              style={styles.input}
              placeholder="Peso"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Meta"
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
            />

            <button style={styles.btn} onClick={guardar}>
              Guardar progreso
            </button>
          </div>
        </>
      )}
    </main>
  );
}

//////////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////////
const styles: any = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(#020617, #0f172a)",
    color: "white",
    padding: "20px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "bold",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    marginTop: "10px",
    background: "#0f172a",
    color: "white",
  },

  btn: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#22c55e",
    borderRadius: "10px",
    border: "none",
    color: "white",
    fontWeight: "bold",
  },

  btnPremium: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    background: "#f59e0b",
    borderRadius: "10px",
    border: "none",
    color: "black",
    fontWeight: "bold",
  },

  progressBar: {
    height: "10px",
    background: "#334155",
    borderRadius: "10px",
    marginTop: "10px",
  },

  progressFill: {
    height: "100%",
    background: "#22c55e",
    borderRadius: "10px",
  },

  big: {
    fontSize: "28px",
    fontWeight: "bold",
  },
};