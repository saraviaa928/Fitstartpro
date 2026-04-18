"use client";

import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const go = (path: string) => router.push(path);

  return (
    <nav style={styles.nav}>
      <button
        style={pathname === "/" ? styles.active : styles.btn}
        onClick={() => go("/")}
      >
        🏠
        <span>Inicio</span>
      </button>

      <button
        style={pathname === "/rutinas" ? styles.active : styles.btn}
        onClick={() => go("/rutinas")}
      >
        🏋️
        <span>Rutinas</span>
      </button>

      <button
        style={pathname === "/perfil" ? styles.active : styles.btn}
        onClick={() => go("/perfil")}
      >
        👤
        <span>Perfil</span>
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
    padding: "10px 0",
    borderTop: "1px solid #1e293b",
    zIndex: 100,
  },
  btn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "12px",
  },
  active: {
    background: "transparent",
    border: "none",
    color: "#22c55e",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "bold",
  },
};