import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { FileProtocolNavigation } from "@/components/static/file-protocol-navigation";
import { ThemeSync } from "@/components/theme/theme-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asset Integrity Management | SUCOFINDO",
  description: "Risk-Based Inspection Platform dashboard for asset integrity management."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="assetIntegrityTheme";var s="assetIntegrityThemeSource";var stored=localStorage.getItem(k);var source=localStorage.getItem(s);var isTheme=stored==="dark"||stored==="light";var theme;if(source==="manual"&&isTheme){theme=stored}else{source="system";theme=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.classList.toggle("dark",theme==="dark");document.documentElement.dataset.theme=theme;document.documentElement.dataset.themeSource=source}catch(e){}})();`
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeSync />
        <FileProtocolNavigation />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
