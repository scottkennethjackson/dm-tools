import "./globals.css";


export const metadata = {
  title: "DM Tools",
  description: "A suite of web-based tools for Dungeon Masters to speed up game preparation and manage sessions in real time. Includes NPC generation, loot creation, and combat initiative tracking.",
  icons: {
    icon: "/icons/favicon_io/favicon.ico",
    apple: "/icons/favicon_io/apple-touch-icon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
