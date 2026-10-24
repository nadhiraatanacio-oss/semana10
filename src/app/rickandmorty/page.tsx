import { SimpleCharacter } from "@/types/character";
import CharacterSearch from "@/components/CharacterSearch";
import { getAllCharacters } from "@/lib/rickandmorty";

export default async function RickAndMortyHome() {
  // force-cache: la respuesta se guarda en caché y se reutiliza (SSG)
  const all = await getAllCharacters({ cache: "force-cache" });

  const characters: SimpleCharacter[] = all.map(
    ({ id, name, status, species, gender, image }) => ({ id, name, status, species, gender, image })
  );

  return (
    <main className="max-w-7xl mx-auto p-6 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-lime-300 mb-2">
        Personajes
      </h1>
      <p className="text-gray-400 mb-8">
        Lista renderizada en el servidor con caché forzada. Busca por nombre, estado, tipo o género.
      </p>
      <CharacterSearch initialCharacters={characters} />
    </main>
  );
}