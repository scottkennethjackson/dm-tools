import "./globals.css";
import DiceTray from "@/components/DiceTray";


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
      <body className="antialiased bg-black text-white">
        <DiceTray />
        {children}
        <p className="absolute bottom-0.5 px-4 w-full text-sm text-center text-gray-400">Dungeons & Dragons, D&D, and the dragon ampersand are © and trademark Wizards of the Coast.</p>
      </body>
    </html>
  );
}
