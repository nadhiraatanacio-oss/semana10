"use client";

import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import CharacterCard from "@/components/CharacterCard";
import { CharacterListResponse, SimpleCharacter } from "@/types/character";

interface Filters {
  name: string;
  status: string;
  type: string;
  gender: string;
}

const emptyFilters: Filters = { name: "", status: "", type: "", gender: "" };

const toSimple = (data: CharacterListResponse): SimpleCharacter[] =>
  data.results.map(({ id, name, status, species, gender, image }) => ({
    id, name, status, species, gender, image,
  }));

export default function CharacterSearch({ initialCharacters }: { initialCharacters: SimpleCharacter[] }) {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [results, setResults] = useState<SimpleCharacter[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSearching = Object.values(filters).some((v) => v.trim() !== "");

  // CSR: cada vez que cambian los filtros se consulta la API desde el navegador
  useEffect(() => {
    if (!isSearching) return;

    const controller = new AbortController();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value.trim()) params.append(key, value.trim());
    });

    // Debounce: espera 400 ms después de que el usuario deja de escribir
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/?${params}`, {
          signal: controller.signal,
        });
        if (res.status === 404) {
          setResults([]);
          setTotal(0);
          setNextPage(null);
          setError("No se encontraron personajes con esos filtros.");
          return;
        }
        if (!res.ok) throw new Error("Error al buscar personajes");
        const data: CharacterListResponse = await res.json();
        setResults(toSimple(data));
        setTotal(data.info.count);
        setNextPage(data.info.next);
      } catch (err) {
        if ((err as Error).name !== "AbortError") setError("Ocurrió un error al buscar.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters, isSearching]);

  const loadMore = async () => {
    if (!nextPage) return;
    setLoading(true);
    try {
      const res = await fetch(nextPage);
      const data: CharacterListResponse = await res.json();
      setResults((prev) => [...prev, ...toSimple(data)]);
      setNextPage(data.info.next);
    } finally {
      setLoading(false);
    }
  };

  const update = (key: keyof Filters, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const list = isSearching ? results : initialCharacters;

  const inputClass =
    "bg-gray-900 border border-emerald-500/30 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div>
      {/* Filtros */}
      <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-5 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-1">
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Nombre (ej. rick)"
              value={filters.name}
              onChange={(e) => update("name", e.target.value)}
              className={`${inputClass} w-full pl-9`}
            />
          </div>
          <select value={filters.status} onChange={(e) => update("status", e.target.value)} className={inputClass}>
            <option value="">Estado: todos</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
          <input
            type="text"
            placeholder="Tipo (ej. Parasite)"
            value={filters.type}
            onChange={(e) => update("type", e.target.value)}
            className={inputClass}
          />
          <select value={filters.gender} onChange={(e) => update("gender", e.target.value)} className={inputClass}>
            <option value="">Género: todos</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="genderless">Genderless</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-400">
          <span>
            {isSearching
              ? loading && results.length === 0
                ? "Buscando..."
                : `${total} resultado(s) — búsqueda en tiempo real (CSR)`
              : `${initialCharacters.length} personajes — lista generada en el servidor (SSG)`}
          </span>
          {isSearching && (
            <button onClick={() => setFilters(emptyFilters)} className="text-emerald-400 hover:text-lime-300">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {isSearching && error && <p className="text-center text-red-400 text-lg my-10">{error}</p>}

      {/* Grilla de personajes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {list.map((character) => (
          <CharacterCard key={character.id} character={character} />
        ))}
      </div>

      {isSearching && nextPage && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-bold py-3 px-8 rounded-lg transition"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}
    </div>
  );
}