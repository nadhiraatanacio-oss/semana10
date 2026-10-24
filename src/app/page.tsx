import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold">Laboratorio 10 — Next.js</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/pokemon" className="bg-purple-700 hover:bg-purple-600 font-bold py-3 px-8 rounded-lg transition">
          Pokédex (Laboratorio)
        </Link>
        <Link href="/rickandmorty" className="bg-emerald-600 hover:bg-emerald-500 font-bold py-3 px-8 rounded-lg transition">
          Rick and Morty (Tarea)
        </Link>
      </div>
    </main>
  );
}