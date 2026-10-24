import { CharacterListResponse, SimpleCharacter } from "@/types/character";
import CharacterSearch from "@/components/CharacterSearch";

const API = "https://rickandmortyapi.com/api/character";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// force-cache: la respuesta se guarda en caché y se reutiliza (SSG)
async function getPage(url: string): Promise<CharacterListResponse> {
  // Reintenta si la API responde 429 (demasiadas peticiones seguidas)
  for (let intento = 0; intento < 5; intento++) {
    const res = await fetch(url, { cache: "force-cache" });
    if (res.ok) return res.json();
    if (res.status !== 429) {
      throw new Error(`Error al cargar personajes (código ${res.status})`);
    }
    await wait(1000 * (intento + 1));
  }
  throw new Error("Error al cargar personajes (la API está saturada)");
}

// Recorre las páginas una por una usando info.next
async function getAllCharacters(): Promise<SimpleCharacter[]> {
  const characters: SimpleCharacter[] = [];
  let url: string | null = API;

  while (url) {
    const data: CharacterListResponse = await getPage(url);
    data.results.forEach(({ id, name, status, species, gender, image }) =>
      characters.push({ id, name, status, species, gender, image })
    );
    url = data.info.next;
  }

  return characters;
}

export default async function RickAndMortyHome() {
  const characters = await getAllCharacters();

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