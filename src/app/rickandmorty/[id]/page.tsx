import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Character } from "@/types/character";
import { getCharacterById, getCharacterCount } from "@/lib/rickandmorty";

const TEN_DAYS = 864000; // 60 * 60 * 24 * 10 segundos

// ISR: la página se regenera como máximo cada 10 días
export const revalidate = 864000;

interface CharacterPageProps {
  params: Promise<{ id: string }>;
}

async function getCharacter(id: string): Promise<Character> {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId < 1) notFound();

  const character = await getCharacterById(numId, { next: { revalidate: TEN_DAYS } });
  if (!character) notFound(); // muestra not-found.tsx

  return character;
}

// SSG: genera una ruta estática por cada Id del total de personajes
export async function generateStaticParams() {
  const count = await getCharacterCount({ next: { revalidate: TEN_DAYS } });

  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
  }));
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params;
  const character = await getCharacter(id);
  return {
    title: `${character.name} - Rick and Morty`,
    description: `${character.name}: ${character.species}, ${character.status}`,
  };
}

const statusColors: Record<string, string> = {
  Alive: "bg-green-500",
  Dead: "bg-red-500",
  unknown: "bg-gray-500",
};

const idFromUrl = (url: string) => url.split("/").pop();

export default async function CharacterDetail({ params }: CharacterPageProps) {
  const { id } = await params;
  const character = await getCharacter(id);

  const fields = [
    { label: "Id", value: character.id },
    { label: "Estado", value: character.status },
    { label: "Especie", value: character.species },
    { label: "Tipo", value: character.type || "—" },
    { label: "Género", value: character.gender },
    { label: "Origen", value: character.origin.name },
    { label: "Ubicación actual", value: character.location.name },
    { label: "N.º de episodios", value: character.episode.length },
    {
      label: "Creado",
      value: new Date(character.created).toLocaleDateString("es-PE", {
        year: "numeric", month: "long", day: "numeric",
      }),
    },
  ];

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-8">
      <div className="bg-gray-900/80 border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/40">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 relative">
            <Image
              src={character.image}
              alt={character.name}
              width={300}
              height={300}
              priority
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-3/5 p-8">
            <p className="text-emerald-400 font-semibold">#{character.id}</p>
            <h1 className="text-4xl font-extrabold mt-1">{character.name}</h1>
            <span
              className={`inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[character.status]}`}
            >
              {character.status}
            </span>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {fields.map((f) => (
                <div key={f.label} className="bg-black/40 rounded-xl p-3">
                  <dt className="text-xs uppercase tracking-wide text-gray-400">{f.label}</dt>
                  <dd className="font-semibold mt-1">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="p-8 border-t border-emerald-500/20">
          <h2 className="text-xl font-bold mb-3">Episodios en los que aparece</h2>
          <div className="flex flex-wrap gap-2">
            {character.episode.map((ep) => (
              <span key={ep} className="bg-emerald-900/60 border border-emerald-500/30 text-sm px-3 py-1 rounded-full">
                Ep. {idFromUrl(ep)}
              </span>
            ))}
          </div>

          <div className="mt-6 text-sm text-gray-400 space-y-1 break-all">
            <p><strong className="text-gray-300">URL del personaje:</strong> {character.url}</p>
            <p><strong className="text-gray-300">URL de origen:</strong> {character.origin.url || "—"}</p>
            <p><strong className="text-gray-300">URL de ubicación:</strong> {character.location.url || "—"}</p>
          </div>
        </div>

        <div className="p-8 bg-black/40">
          <Link
            href="/rickandmorty"
            className="inline-block bg-emerald-600 hover:bg-emerald-500 font-bold py-3 px-6 rounded-lg transition"
          >
            ← Volver a personajes
          </Link>
        </div>
      </div>
    </main>
  );
}