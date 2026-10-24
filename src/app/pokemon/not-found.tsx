import Link from "next/link";
import { IoSearch } from "react-icons/io5";

export default function PokemonNotFound() {
  return (
    <div className="flex items-center justify-center p-8 min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center text-gray-700">
        <IoSearch size={70} className="mx-auto text-purple-700" />
        <h2 className="text-5xl font-bold mt-4">404</h2>
        <p className="text-xl font-semibold mt-2">Pokémon no encontrado</p>
        <p className="text-gray-500 mt-1">Este Pokémon no existe en la Pokédex.</p>
        <Link
          href="/pokemon"
          className="inline-block mt-6 bg-black hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          ← Volver al Pokédex
        </Link>
      </div>
    </div>
  );
}