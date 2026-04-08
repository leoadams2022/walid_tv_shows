import { tmdbFetch } from "./client";

export const searchMovies = async (query, page = 1) => {
  const d = await tmdbFetch("/search/movie", { query, page });
  // console.log("searchMovies: ", d);
  return d;
};

export const searchTV = async (query, page = 1) => {
  const d = await tmdbFetch("/search/tv", { query, page });
  // console.log("searchTV: ", d);
  return d;
};

export const multiSearch = async (query, page = 1) => {
  const d = await tmdbFetch("/search/multi", { query, page });
  // console.log("multiSearch: ", d);
  return d;
};
