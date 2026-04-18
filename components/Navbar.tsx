"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav style={styles.nav}>
      <button
        style={pathname === "/" ? styles.active : styles.btn}
        onClick={() => router.push("/")}
      >
        🏠 Inicio
      </button>

      <button
        style={pathname === "/rutinas" ? styles.active : styles.btn}
        onClick={() => router.push("/rutinas")}
      >
        🏋️ Rutinas
      </button>

      <button
        style={pathname === "/perfil" ? styles.active : styles.btn}
        onClick={() => router.push("/perfil")}
      >
        👤 Perfil
      </button>
    </nav>
  );
}

const styles: any = {
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#020617",
    display: "flex",
    justifyContent: "space-around",
    padding: "10px",
  },
  btn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
  },
  active: {
    background: "transparent",
    border: "none",
    color: "#22c55e",
    fontWeight: "bold",
  },
};