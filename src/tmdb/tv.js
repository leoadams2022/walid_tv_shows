import { tmdbFetch } from "./client";

export const getPopularTV = async (page = 1) => {
  const d = await tmdbFetch("/tv/popular", { page });
  console.log("getPopularTV: ", d);
  return d;
};

export const getTrendingTV = (page = 1) =>
  tmdbFetch("/trending/tv/week", { page });

export async function getLatestTvByVsembed(type = "tv", page = 1) {
  try {
    let vsembedData = await fetch(
      `https://vsembed.ru/tvshows/latest/page-${page}.json`,
    );
    vsembedData = await vsembedData.json();
    const results = await Promise.all(
      vsembedData.result.map(async (item) => {
        if (item?.tmdb_id === undefined || item?.tmdb_id === null) {
          // console.log("item.tmdb_id: ", item.tmdb_id);
          return;
        }

        const data = await tmdbFetch(`/${type}/${item.tmdb_id}`);
        return { ...data };
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
export async function getLatestEpisodeTvByVsembed(type = "tv", page = 1) {
  try {
    let vsembedData = await fetch(
      `https://vsembed.ru/episodes/latest/page-${page}.json`,
    );
    vsembedData = await vsembedData.json();
    vsembedData = deduplicateByTmdbId(vsembedData);
    const results = await Promise.all(
      vsembedData.result.map(async (item) => {
        if (item?.tmdb_id === undefined || item?.tmdb_id === null) {
          // console.log("item.tmdb_id: ", item.tmdb_id);
          return;
        }

        const data = await tmdbFetch(`/${type}/${item.tmdb_id}`);
        return {
          ...data,
          quality: item.quality || null,
          season: item.season || null,
          episode: item.episode || null,
        };
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

export const getTopRatedTV = (page = 1) => tmdbFetch("/tv/top_rated", { page });

export const getTVDetails = (id, params) => {
  // console.log("getTVDetails: ", id);
  return tmdbFetch(`/tv/${id}`, params);
};

export const getTVSeasonDetails = (id, season, params) =>
  tmdbFetch(`/tv/${id}/season/${season}`, params);

export const getTVEpisodeDetails = (id, season, episode, params) =>
  tmdbFetch(`/tv/${id}/season/${season}/episode/${episode}`, params);

export const getTvCredits = (id) => tmdbFetch(`/tv/${id}/credits`);

export const getTvVideos = (id) => tmdbFetch(`/tv/${id}/videos`);

function deduplicateByTmdbId(rowData) {
  // Create a map to store the best object for each tmdb_id
  const bestItems = new Map();

  // Loop through all objects in rowData.result
  rowData.result.forEach((item) => {
    const { tmdb_id, season, episode } = item;

    // If we haven't seen this tmdb_id before, add it to the map
    if (!bestItems.has(tmdb_id)) {
      bestItems.set(tmdb_id, item);
    } else {
      // Compare with existing item for this tmdb_id
      const existingItem = bestItems.get(tmdb_id);

      // Check if current item has higher season, or same season but higher episode
      if (
        season > existingItem.season ||
        (season === existingItem.season && episode > existingItem.episode)
      ) {
        bestItems.set(tmdb_id, item);
      }
    }
  });

  // Replace the original array with the deduplicated one
  rowData.result = Array.from(bestItems.values());

  return rowData;
}
