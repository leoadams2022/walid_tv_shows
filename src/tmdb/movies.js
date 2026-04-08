import { tmdbFetch } from "./client";

export const getPopularMovies = async (page = 1) => {
  const d = await tmdbFetch("/movie/popular", {
    page,
    // append_to_response: "genres",
  });
  // console.log("getPopularMovies: ", d);
  return d;
};

export const getTrendingMovies = (page = 1) =>
  tmdbFetch("/trending/movie/week", { page });

export async function getLatestMoviesByVsembed(type = "movie", page = 1) {
  try {
    let vsembedData = await fetch(
      `https://vsembed.ru/movies/latest/page-${page}.json`,
    );
    vsembedData = await vsembedData.json();
    // const ids = vsembedData.result.map((movie) => movie.tmdb_id);
    // console.log("ids: ", ids);
    const results = await Promise.all(
      vsembedData.result.map(async (item) => {
        if (!item?.tmdb_id) return;
        const data = await tmdbFetch(`/${type}/${item.tmdb_id}`);
        return { ...data, quality: item.quality || null };
      }),
    );

    return {
      page,
      results: results.filter((item) => item !== undefined),
      total_pages: vsembedData.pages,
      total_results: vsembedData.result.length * vsembedData.pages,
    };
  } catch (error) {
    console.error("Error fetching TMDB details:", error);
    throw error;
  }
}

export const getTopRatedMovies = (page = 1) =>
  tmdbFetch("/movie/top_rated", { page });

export const getNowPlayingMovies = (page = 1) =>
  tmdbFetch("/movie/now_playing", { page });

export const getMovieGenres = () => {
  console.log("getMovieGenres");
  return tmdbFetch("/genre/movie/list");
};

export const getMovieDetails = (id) => tmdbFetch(`/movie/${id}`);

export const getMovieCredits = (id) => tmdbFetch(`/movie/${id}/credits`);

export const getMovieVideos = (id) => tmdbFetch(`/movie/${id}/videos`);
