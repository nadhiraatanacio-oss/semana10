"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoWarning } from "react-icons/io5";

export default function PokemonError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center p-8 min-h-[70vh]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md text-center text-gray-700">
        <IoWarning size={70} className="mx-auto text-red-500" />
        <h2 className="text-3xl font-bold mt-4">¡Ups! Algo salió mal</h2>
        <p className="mt-2 text-gray-500">{error.message}</p>
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={() => reset()}
            className="bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-5 rounded-lg transition"
          >
            Reintentar
          </button>
          <Link
            href="/pokemon"
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-5 rounded-lg transition"
          >
            Volver
          </Link>
        </div>
      </div>
    </div>
  );
}