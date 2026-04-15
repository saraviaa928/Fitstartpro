"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

//////////////////////////////////////////////////////
// 🔐 CONFIG ADMIN
//////////////////////////////////////////////////////
const ADMIN_EMAIL = "angelsaravia.1620@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //////////////////////////////////////////////////////
  // 🔐 VALIDAR ADMIN
  //////////////////////////////////////////////////////
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u || u.email !== ADMIN_EMAIL) {
        setLoading(false);
        router.push("/");
        return;
      }

      setUser(u);
      await cargarUsuarios();
    });

    return () => unsubscribe();
  }, [router]);

  //////////////////////////////////////////////////////
  // 📥 CARGAR USUARIOS
  //////////////////////////////////////////////////////
  const cargarUsuarios = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "usuarios"));

      const data: any[] = [];

      querySnapshot.forEach((docItem) => {
        data.push({
          id: docItem.id,
          ...docItem.data(),
        });
      });

      setUsuarios(data);
    } catch (error) {
      console.error("❌ Error cargando usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  //////////////////////////////////////////////////////
  // 🔄 TOGGLE PRO
  //////////////////////////////////////////////////////
  const togglePro = async (id: string, actual: boolean) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        pro: !Boolean(actual),
      });

      alert("✅ Estado PRO actualizado");
      await cargarUsuarios();
    } catch (error) {
      console.error("❌ Error actualizando PRO:", error);
      alert("Error al actualizar");
    }
  };

  //////////////////////////////////////////////////////
  // 🔐 LOGOUT
  //////////////////////////////////////////////////////
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  //////////////////////////////////////////////////////
  // ⏳ LOADING
  //////////////////////////////////////////////////////
  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Cargando panel admin...</p>
      </div>
    );
  }

  //////////////////////////////////////////////////////
  // 🧠 UI
  //////////////////////////////////////////////////////
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🧠 Panel Admin</h1>

      <p style={{ marginBottom: "10px" }}>
        👋 {user?.email}
      </p>

      <button onClick={handleLogout} style={styles.logout}>
        Cerrar sesión
      </button>

      {usuarios.length === 0 && (
        <p>No hay usuarios aún</p>
      )}

      {usuarios.map((u) => (
        <div key={u.id} style={styles.card}>
          <p><strong>ID:</strong> {u.id}</p>
          <p><strong>Email:</strong> {u.email || "No disponible"}</p>
          <p><strong>Peso:</strong> {u.peso || "-"}</p>
          <p><strong>Meta:</strong> {u.meta || "-"}</p>
          <p><strong>Racha:</strong> {u.racha || 0}</p>

          <p>
            <strong>PRO:</strong>{" "}
            <span style={{ color: u.pro ? "#22c55e" : "#ef4444" }}>
              {u.pro ? "Activo" : "No"}
            </span>
          </p>

          <button
            style={{
              ...styles.button,
              background: u.pro ? "#ef4444" : "#22c55e",
            }}
            onClick={() => togglePro(u.id, u.pro)}
          >
            {u.pro ? "Quitar PRO" : "Hacer PRO"}
          </button>
        </div>
      ))}
    </main>
  );
}

//////////////////////////////////////////////////////
// 🎨 ESTILOS
//////////////////////////////////////////////////////
const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "20px",
  },
  title: {
    marginBottom: "10px",
  },
  card: {
    background: "#1f2937",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "10px",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  logout: {
    background: "#ef4444",
    padding: "10px",
    border: "none",
    color: "white",
    marginBottom: "20px",
    borderRadius: "8px",
  },
  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0f172a",
    color: "white",
  },
};