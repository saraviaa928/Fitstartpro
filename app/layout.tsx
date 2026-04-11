import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FitStartPro",
  description: "App de rutinas y nutrición para un estilo de vida saludable",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
