export interface CharacterPlace {
  name: string;
  url: string;
}

export interface Character {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Female" | "Male" | "Genderless" | "unknown";
  origin: CharacterPlace;
  location: CharacterPlace;
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterListResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Character[];
}

// Versión reducida para las tarjetas (menos datos enviados al navegador)
export interface SimpleCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}