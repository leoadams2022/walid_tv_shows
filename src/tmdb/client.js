const BASE_URL = "https://api.themoviedb.org/3";
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export async function tmdbFetch(endpoint, params = {}) {
  // console.log(endpoint);
  const url = new URL(BASE_URL + endpoint);

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value),
  );

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("TMDB request failed");
  }

  return res.json();
}
