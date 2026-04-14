"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <Screen text="Cargando..." />;

  if (!user) return <LoginScreen />;

  return <AppScreen user={user} />;
}

function Screen({ text }: any) {
  return (
    <main style={styles.center}>
      <h2>{text}</h2>
    </main>
  );
}

// 🔐 LOGIN + REGISTRO
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      alert("Error al iniciar sesión");
    }
  };

  const register = async () => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Crear perfil inicial
      await setDoc(doc(db, "users", res.user.uid), {
        peso: "",
        meta: "",
        progreso: [],
        pro: false,
      });

    } catch {
      alert("Error al registrarse");
    }
  };

  return (
    <main style={styles.center}>
      <h1>🔥 FitStartPro</h1>

      <input placeholder="Correo" onChange={(e)=>setEmail(e.target.value)} style={styles.input}/>
      <input type="password" placeholder="Contraseña" onChange={(e)=>setPassword(e.target.value)} style={styles.input}/>

      <button onClick={login} style={styles.button}>Login</button>
      <button onClick={register} style={styles.button}>Crear cuenta</button>
    </main>
  );
}

// 📱 APP PRINCIPAL
function AppScreen({ user }: any) {
  const [tab, setTab] = useState("home");
  const [completados, setCompletados] = useState<string[]>([]);
  const [perfil, setPerfil] = useState<any>({});

  // 🔥 Cargar datos del usuario
  useEffect(() => {
    const cargar = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setCompletados(data.progreso || []);
        setPerfil(data);
      }
    };

    cargar();
  }, [user]);

  // 🔥 Guardar progreso en nube
  useEffect(() => {
    if (!user) return;

    const guardar = async () => {
      await setDoc(doc(db, "users", user.uid), {
        ...perfil,
        progreso: completados,
      });
    };

    guardar();
  }, [completados]);

  const toggle = (ej: string) => {
    setCompletados((prev) =>
      prev.includes(ej)
        ? prev.filter((e) => e !== ej)
        : [...prev, ej]
    );
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        {tab === "home" && <h2>Bienvenido {user.email}</h2>}

        {tab === "rutinas" && (
          <>
            <h2>Rutinas</h2>

            {["Push ups", "Sentadillas", "Abdominales"].map((ej, i) => (
              <p
                key={i}
                onClick={() => toggle(ej)}
                style={{
                  cursor: "pointer",
                  color: completados.includes(ej) ? "#22c55e" : "white",
                }}
              >
                {completados.includes(ej) ? "✅ " : ""}{ej}
              </p>
            ))}
          </>
        )}

        {tab === "perfil" && (
          <>
            <h2>Perfil</h2>

            <input
              placeholder="Peso"
              value={perfil.peso || ""}
              onChange={(e) =>
                setPerfil({ ...perfil, peso: e.target.value })
              }
              style={styles.input}
            />

            <input
              placeholder="Meta"
              value={perfil.meta || ""}
              onChange={(e) =>
                setPerfil({ ...perfil, meta: e.target.value })
              }
              style={styles.input}
            />

            <p>Plan: {perfil.pro ? "PRO 🔥" : "FREE"}</p>

            <button onClick={() => signOut(auth)} style={styles.button}>
              Cerrar sesión
            </button>
          </>
        )}
      </div>

      <nav style={styles.nav}>
        <button onClick={()=>setTab("home")} style={styles.navItem}>🏠</button>
        <button onClick={()=>setTab("rutinas")} style={styles.navItem}>🏋️</button>
        <button onClick={()=>setTab("perfil")} style={styles.navItem}>👤</button>
      </nav>
    </main>
  );
}

// 🎨 estilos
const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  card: { padding: "20px", textAlign: "center" },
  nav: { display: "flex", justifyContent: "space-around", background: "#111827", padding: "10px" },
  navItem: { background: "none", border: "none", color: "white", fontSize: "20px" },
  center: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "#0f172a", color: "white" },
  input: { margin: "10px", padding: "10px", borderRadius: "8px" },
  button: { marginTop: "10px", padding: "10px", background: "#22c55e", border: "none", borderRadius: "8px", color: "white" },
};