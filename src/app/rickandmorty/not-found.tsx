import Link from "next/link";

export default function CharacterNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-8">
      <h2 className="text-6xl font-extrabold text-emerald-400">404</h2>
      <p className="text-2xl font-bold mt-3">Este personaje no existe en ninguna dimensión</p>
      <Link href="/rickandmorty" className="mt-6 bg-emerald-600 hover:bg-emerald-500 font-bold py-3 px-6 rounded-lg transition">
        ← Volver a personajes
      </Link>
    </div>
  );
}