// app/layout.tsx

import "./globals.css";

// ... font configurations

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased bg-[#050505]`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}