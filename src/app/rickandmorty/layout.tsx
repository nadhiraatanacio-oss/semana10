import { ReactNode } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { GiPortal } from "react-icons/gi";

export const metadata: Metadata = {
  title: "Rick and Morty - Next.js",
  description: "Explora los personajes de Rick and Morty",
};

export default function RickAndMortyLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-emerald-950 to-gray-900 text-white">
      <nav className="bg-black/40 backdrop-blur-sm sticky top-0 z-50 border-b border-emerald-500/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/rickandmorty"
            className="text-2xl font-bold text-emerald-400 hover:text-lime-300 transition flex items-center gap-2"
          >
            <GiPortal size={32} /> Rick and Morty Wiki
          </Link>
          <Link href="/pokemon" className="text-sm text-gray-300 hover:text-white transition">
            Ir a Pokédex →
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}