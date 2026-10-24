import Link from "next/link";
import Image from "next/image";
import { SimpleCharacter } from "@/types/character";

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-400",
};

export default function CharacterCard({ character }: { character: SimpleCharacter }) {
  return (
    <Link
      href={`/rickandmorty/${character.id}`}
      className="group bg-gray-900/80 border border-emerald-500/20 rounded-2xl overflow-hidden shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          loading="lazy" // Lazy Loading: la imagen se carga solo cuando aparece en pantalla
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute top-3 left-3 bg-black/70 text-xs px-2 py-1 rounded-full">
          #{character.id}
        </span>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold truncate group-hover:text-emerald-400 transition">
          {character.name}
        </h2>
        <p className="text-sm text-gray-300 flex items-center gap-2 mt-1">
          <span className={`w-2.5 h-2.5 rounded-full ${statusColors[character.status] ?? "bg-gray-400"}`} />
          {character.status} · {character.species}
        </p>
        <p className="text-xs text-gray-400 mt-1">{character.gender}</p>
      </div>
    </Link>
  );
}