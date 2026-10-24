import { Character, CharacterListResponse } from "@/types/character";

const API = "https://rickandmortyapi.com/api/character";
const BLOCK = 100; // personajes por petición

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

type CacheOptions = { cache: "force-cache" } | { next: { revalidate: number } };

// fetch con reintentos si la API responde 429 (demasiadas peticiones)
async function fetchJson<T>(url: string, options: CacheOptions): Promise<T> {
  for (let intento = 0; intento < 5; intento++) {
    const res = await fetch(url, options);
    if (res.ok) return res.json();
    if (res.status !== 429) throw new Error(`Error en la API (código ${res.status})`);
    await wait(1500 * (intento + 1));
  }
  throw new Error("La API está saturada, intenta más tarde");
}

// Total de personajes (info.count)
export async function getCharacterCount(options: CacheOptions): Promise<number> {
  const data = await fetchJson<CharacterListResponse>(API, options);
  return data.info.count;
}

// Trae un bloque de 100 personajes en UNA sola petición: /api/character/1,2,3,...,100
async function getBlock(block: number, options: CacheOptions): Promise<Character[]> {
  const ids = Array.from({ length: BLOCK }, (_, i) => block * BLOCK + i + 1);
  const data = await fetchJson<Character[] | Character>(`${API}/${ids.join(",")}`, options);
  return Array.isArray(data) ? data : [data];
}

// Todos los personajes, bloque por bloque
export async function getAllCharacters(options: CacheOptions): Promise<Character[]> {
  const count = await getCharacterCount(options);
  const blocks = Math.ceil(count / BLOCK);
  const all: Character[] = [];
  for (let b = 0; b < blocks; b++) {
    all.push(...(await getBlock(b, options)));
  }
  return all;
}

// Un personaje por Id: reutiliza el bloque en caché en vez de pedirlo solo
export async function getCharacterById(id: number, options: CacheOptions): Promise<Character | null> {
  const block = Math.floor((id - 1) / BLOCK);
  const characters = await getBlock(block, options);
  return characters.find((c) => c.id === id) ?? null;
}