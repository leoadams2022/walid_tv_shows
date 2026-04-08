const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

async function tmdbFetch(endpoint, page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3${endpoint}?page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );

  return res.json();
}

export const getPopularMovies = (page) => tmdbFetch("/movie/popular", page);
