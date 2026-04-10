// db.js
import { Dexie } from "dexie";

export const db = new Dexie("myDatabase");
db.version(2).stores({
  show_info: "id",
  season_info: "id",
  episode_info: "id",
  all_episodes: "id",
});

// ========== SHOW_INFO FUNCTIONS ==========

// Add or update a show
export async function addShow(show) {
  try {
    await db.show_info.put(show);
    return show;
  } catch (error) {
    console.error("Error adding show:", error);
    return null;
  }
}

// Get show by id - returns null if not found
export async function getShowById(id) {
  try {
    const show = await db.show_info.get(id);
    return show || null;
  } catch (error) {
    console.error("Error getting show by id:", error);
    return null;
  }
}

// Get show by name - returns null if not found
export async function getShowByName(name) {
  try {
    const show = await db.show_info.where("name").equals(name).first();
    return show || null;
  } catch (error) {
    console.error("Error getting show by name:", error);
    return null;
  }
}

// Get all shows - returns empty array if none found
export async function getAllShows() {
  try {
    const shows = await db.show_info.toArray();
    return shows;
  } catch (error) {
    console.error("Error getting all shows:", error);
    return [];
  }
}

// Delete show by id - returns true if deleted, false if not found or error
export async function deleteShow(id) {
  try {
    const count = await db.show_info.where("id").equals(id).delete();
    return count > 0;
  } catch (error) {
    console.error("Error deleting show:", error);
    return false;
  }
}

// Get all shows whose ID starts with the given prefix
export async function getShowInfoByIdPrefix(prefix) {
  try {
    const shows = await db.show_info.where("id").startsWith(prefix).toArray();
    return shows;
  } catch (error) {
    console.error("Error getting show_info by ID prefix:", error);
    return [];
  }
}

// Delete all shows whose ID starts with the given prefix
export async function deleteShowInfoByIdPrefix(prefix) {
  if (!prefix || typeof prefix !== "string") {
    console.warn(
      "deleteShowInfoByIdPrefix called with invalid prefix:",
      prefix,
    );
    return 0;
  }
  try {
    const count = await db.show_info.where("id").startsWith(prefix).delete();
    return count;
  } catch (error) {
    console.error("Error deleting show_info by ID prefix:", error);
    return 0;
  }
}

// ========== SEASON_INFO FUNCTIONS ==========

// Add or update a season
export async function addSeason(season) {
  try {
    await db.season_info.put(season);
    return season;
  } catch (error) {
    console.error("Error adding season:", error);
    return null;
  }
}

// Get season by id - returns null if not found
export async function getSeasonById(id) {
  try {
    const season = await db.season_info.get(id);
    return season || null;
  } catch (error) {
    console.error("Error getting season by id:", error);
    return null;
  }
}

// Get season by name - returns null if not found
export async function getSeasonByName(name) {
  try {
    const season = await db.season_info.where("name").equals(name).first();
    return season || null;
  } catch (error) {
    console.error("Error getting season by name:", error);
    return null;
  }
}

// Get seasons by season_number - returns empty array if none found
export async function getSeasonsByNumber(seasonNumber) {
  try {
    const seasons = await db.season_info
      .where("season_number")
      .equals(seasonNumber)
      .toArray();
    return seasons;
  } catch (error) {
    console.error("Error getting seasons by number:", error);
    return [];
  }
}

// Get all seasons - returns empty array if none found
export async function getAllSeasons() {
  try {
    const seasons = await db.season_info.toArray();
    return seasons;
  } catch (error) {
    console.error("Error getting all seasons:", error);
    return [];
  }
}

// Delete season by id - returns true if deleted, false if not found or error
export async function deleteSeason(id) {
  try {
    const count = await db.season_info.where("id").equals(id).delete();
    return count > 0;
  } catch (error) {
    console.error("Error deleting season:", error);
    return false;
  }
}

export async function getSeasonsInfoByIdPrefix(prefix) {
  try {
    const seasons = await db.season_info
      .where("id")
      .startsWith(prefix)
      .toArray();
    return seasons;
  } catch (error) {
    console.error("Error getting season_info by ID prefix:", error);
    return [];
  }
}

export async function deleteSeasonsInfoByIdPrefix(prefix) {
  try {
    const count = await db.season_info.where("id").startsWith(prefix).delete();
    return count;
  } catch (error) {
    console.error("Error deleting season_info by ID prefix:", error);
    return 0;
  }
}

// ========== EPISODE_INFO FUNCTIONS ==========

// Add or update an episode
export async function addEpisode(episode) {
  try {
    await db.episode_info.put(episode);
    return episode;
  } catch (error) {
    console.error("Error adding episode:", error);
    return null;
  }
}

// Get episode by id - returns null if not found
export async function getEpisodeById(id) {
  try {
    const episode = await db.episode_info.get(id);
    return episode || null;
  } catch (error) {
    console.error("Error getting episode by id:", error);
    return null;
  }
}

// Get episode by name - returns null if not found
export async function getEpisodeByName(name) {
  try {
    const episode = await db.episode_info.where("name").equals(name).first();
    return episode || null;
  } catch (error) {
    console.error("Error getting episode by name:", error);
    return null;
  }
}

// Get episodes by season_number - returns empty array if none found
export async function getEpisodesBySeasonNumber(seasonNumber) {
  try {
    const episodes = await db.episode_info
      .where("season_number")
      .equals(seasonNumber)
      .toArray();
    return episodes;
  } catch (error) {
    console.error("Error getting episodes by season number:", error);
    return [];
  }
}

// Get episodes by episode_number - returns empty array if none found
export async function getEpisodesByEpisodeNumber(episodeNumber) {
  try {
    const episodes = await db.episode_info
      .where("episode_number")
      .equals(episodeNumber)
      .toArray();
    return episodes;
  } catch (error) {
    console.error("Error getting episodes by episode number:", error);
    return [];
  }
}

// Get episode by season and episode number combined - returns null if not found
export async function getEpisodeBySeasonAndNumber(seasonNumber, episodeNumber) {
  try {
    const episode = await db.episode_info
      .where(["season_number", "episode_number"])
      .equals([seasonNumber, episodeNumber])
      .first();
    return episode || null;
  } catch (error) {
    console.error("Error getting episode by season and number:", error);
    return null;
  }
}

// Get all episodes - returns empty array if none found
export async function getAllEpisodes() {
  try {
    const episodes = await db.episode_info.toArray();
    return episodes;
  } catch (error) {
    console.error("Error getting all episodes:", error);
    return [];
  }
}

// Delete episode by id - returns true if deleted, false if not found or error
export async function deleteEpisode(id) {
  try {
    const count = await db.episode_info.where("id").equals(id).delete();
    return count > 0;
  } catch (error) {
    console.error("Error deleting episode:", error);
    return false;
  }
}

export async function getEpisodeInfoByIdPrefix(prefix) {
  try {
    const episodes = await db.episode_info
      .where("id")
      .startsWith(prefix)
      .toArray();
    return episodes;
  } catch (error) {
    console.error("Error getting episode_info by ID prefix:", error);
    return [];
  }
}

export async function deleteEpisodeInfoByIdPrefix(prefix) {
  try {
    const count = await db.episode_info.where("id").startsWith(prefix).delete();
    return count;
  } catch (error) {
    console.error("Error deleting episode_info by ID prefix:", error);
    return 0;
  }
}

//? ========== ALL_EPISODES FUNCTIONS ==========

// Add or update an episode in all_episodes
export async function addToAllEpisodes(episode) {
  try {
    await db.all_episodes.put(episode);
    return episode;
  } catch (error) {
    console.error("Error adding to all_episodes:", error);
    return null;
  }
}

// Get episode from all_episodes by id - returns null if not found
export async function getAllEpisodesById(id) {
  try {
    const episode = await db.all_episodes.get(id);
    return episode || null;
  } catch (error) {
    console.error("Error getting episode from all_episodes by id:", error);
    return null;
  }
}

// Get episode from all_episodes by name - returns null if not found
export async function getAllEpisodesByName(name) {
  try {
    const episode = await db.all_episodes.where("name").equals(name).first();
    return episode || null;
  } catch (error) {
    console.error("Error getting episode from all_episodes by name:", error);
    return null;
  }
}

// Get episodes from all_episodes by season_number - returns empty array if none found
export async function getAllEpisodesBySeasonNumber(seasonNumber) {
  try {
    const episodes = await db.all_episodes
      .where("season_number")
      .equals(seasonNumber)
      .toArray();
    return episodes;
  } catch (error) {
    console.error(
      "Error getting episodes from all_episodes by season number:",
      error,
    );
    return [];
  }
}

// Get episodes from all_episodes by episode_number - returns empty array if none found
export async function getAllEpisodesByEpisodeNumber(episodeNumber) {
  try {
    const episodes = await db.all_episodes
      .where("episode_number")
      .equals(episodeNumber)
      .toArray();
    return episodes;
  } catch (error) {
    console.error(
      "Error getting episodes from all_episodes by episode number:",
      error,
    );
    return [];
  }
}

// Get all episodes from all_episodes store - returns empty array if none found
export async function getAllEpisodesFromStore() {
  try {
    const episodes = await db.all_episodes.toArray();
    return episodes;
  } catch (error) {
    console.error("Error getting all episodes from all_episodes:", error);
    return [];
  }
}

// Delete episode from all_episodes by id - returns true if deleted, false if not found or error
export async function deleteFromAllEpisodes(id) {
  try {
    const count = await db.all_episodes.where("id").equals(id).delete();
    return count > 0;
  } catch (error) {
    console.error("Error deleting episode from all_episodes:", error);
    return false;
  }
}

export async function getAllEpisodesByIdPrefix(prefix) {
  try {
    const episodes = await db.all_episodes
      .where("id")
      .startsWith(prefix)
      .toArray();
    return episodes;
  } catch (error) {
    console.error("Error getting all_episodes by ID prefix:", error);
    return [];
  }
}

export async function deleteAllEpisodesByIdPrefix(prefix) {
  try {
    const count = await db.all_episodes.where("id").startsWith(prefix).delete();
    return count;
  } catch (error) {
    console.error("Error deleting all_episodes by ID prefix:", error);
    return 0;
  }
}

//? ========== BULK OPERATIONS ==========

// Add multiple shows at once - returns array of successfully added shows
export async function addMultipleShows(shows) {
  try {
    await db.show_info.bulkPut(shows);
    return shows;
  } catch (error) {
    console.error("Error adding multiple shows:", error);
    return [];
  }
}

// Add multiple seasons at once - returns array of successfully added seasons
export async function addMultipleSeasons(seasons) {
  try {
    await db.season_info.bulkPut(seasons);
    return seasons;
  } catch (error) {
    console.error("Error adding multiple seasons:", error);
    return [];
  }
}

// Add multiple episodes at once - returns array of successfully added episodes
export async function addMultipleEpisodes(episodes) {
  try {
    await db.episode_info.bulkPut(episodes);
    return episodes;
  } catch (error) {
    console.error("Error adding multiple episodes:", error);
    return [];
  }
}

export default db;
