import React from "react";

import { Badge } from "flowbite-react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

import { FaStar, FaInfo } from "react-icons/fa";

import useScrollToTop from "../hooks/useScrollToTop";

import { getTVDetails, getTVSeasonDetails } from "../tmdb/tv";

import FloatingControls from "./FloatingControls";
import {
  addToAllEpisodes,
  getAllEpisodesById,
  getSeasonById,
  getShowById,
} from "../database/db";

const Playlist = ({ playNextEpisode, playPreviousEpisode }) => {
  const [data, setData] = React.useState(null);
  const {
    season,
    episode,
    setSeason,
    setEpisode,
    setProgress,
    setShowSidebar,
    setActiveSection,
    setSeasonToView,
    setEpisodeToView,
    lastPlayedSeason,
    lastPlayedEpisode,
    showId,
    hideSpecials,
    autoScrollToNewPlayedEpisode,
    remainingTime,
    startTimerAutomatically,
    startTimer,
    stopTimer,
  } = useStore(
    useShallow((s) => ({
      season: s.season,
      episode: s.episode,
      setSeason: s.setSeason,
      setEpisode: s.setEpisode,
      setProgress: s.setProgress,
      setShowSidebar: s.setShowSidebar,
      setActiveSection: s.setActiveSection,
      setSeasonToView: s.setSeasonToView,
      setEpisodeToView: s.setEpisodeToView,
      lastPlayedSeason: s.lastPlayedSeason,
      lastPlayedEpisode: s.lastPlayedEpisode,
      showId: s.showId,
      hideSpecials: s.hideSpecials,
      autoScrollToNewPlayedEpisode: s.autoScrollToNewPlayedEpisode,
      remainingTime: s.remainingTime,
      startTimerAutomatically: s.startTimerAutomatically,
      startTimer: s.startTimer,
      stopTimer: s.stopTimer,
    })),
  );
  // const getPlayerTime = useStore(useShallow((s) => s.getPlayerTime()));

  const episodesListRef = React.useRef(null);
  // isVisible,
  const { scrollToTop, scrollToElementById } = useScrollToTop(
    episodesListRef,
    100,
  );

  //! HIMYM_SHOW_DETAILS
  // const episodesList = React.useMemo(
  //   () =>
  //     HIMYM_SHOW_DETAILS.seasons.flatMap((season) =>
  //       season.data.episodes.map((episode) => ({
  //         ...episode,
  //         season_number: season.season_number,
  //       })),
  //     ),
  //   [],
  // );
  const playEpisode = (ep) => {
    if (remainingTime === null && startTimerAutomatically) {
      startTimer(60);
    }
    setProgress(0);
    setSeason(ep.season_number);
    setEpisode(ep.episode_number);
    setShowSidebar(false);
  };
  const showEpisodeInfo = (e, ep) => {
    e.stopPropagation();
    setSeasonToView(ep.season_number);
    setEpisodeToView(ep.episode_number);
    setActiveSection(2);
  };

  const playLastPlayedEpisode = () => {
    if (
      (lastPlayedSeason !== 0 && !lastPlayedSeason) ||
      (lastPlayedEpisode !== 0 && !lastPlayedEpisode)
    ) {
      console.log(
        "no last played episode",
        lastPlayedSeason,
        lastPlayedEpisode,
      );
      return;
    }
    if (hideSpecials && lastPlayedSeason === 0) {
      alert("Lst played episode is a Specials and they are hidden");
      return;
    }
    if (remainingTime === null && startTimerAutomatically) {
      startTimer(60);
    }
    setSeason(lastPlayedSeason);
    setEpisode(lastPlayedEpisode);
  };

  const stopPlaying = () => {
    if (remainingTime) {
      stopTimer();
    }
    setSeason(null);
    setEpisode(null);
  };

  React.useEffect(() => {
    (async () => {
      if (!showId) {
        console.error("showId is not defined");
        return;
      }
      const localData = await getAllEpisodesById(`${showId}_all_episodes`); // localStorage.getItem(`${showId}_all_episodes`);
      if (localData) {
        console.log("local_all_episodes: ", localData);
        const ld = localData.data; // JSON.parse(localData);
        setData(ld);
        return;
      }
      // const show_info_seasons =
      //   JSON.parse(localStorage.getItem(`${showId}_show_info`)).seasons ||
      //   (await getTVDetails(showId).seasons);
      let local_show_info_seasons = await getShowById(`${showId}_show_info`);
      local_show_info_seasons = local_show_info_seasons
        ? local_show_info_seasons?.data
        : null;
      local_show_info_seasons = local_show_info_seasons
        ? local_show_info_seasons?.seasons
        : null;
      console.log("local_show_info_seasons: ", local_show_info_seasons);

      const show_info_seasons = local_show_info_seasons
        ? local_show_info_seasons
        : await getTVDetails(showId)?.seasons;
      console.log("show_info_seasons: ", show_info_seasons);

      const seasonPromises = show_info_seasons.map(async (s) => {
        let season_episodes;
        let local_season = await getSeasonById(
          `${showId}_season_info_${s.season_number}`,
        );
        local_season = local_season ? local_season?.data : null;
        console.log("local_season: ", local_season);
        //  localStorage.getItem(
        //   `${showId}_season_info_${s.season_number}`,
        // );

        if (local_season) {
          // const local_season_episodes = JSON.parse(local_season).episodes;
          const local_season_episodes = local_season?.episodes;
          season_episodes = local_season_episodes;
          console.log("local_season_episodes: ", local_season_episodes);
        } else {
          const fetched_season_episodes = await getTVSeasonDetails(
            showId,
            s.season_number,
          );
          season_episodes = fetched_season_episodes.episodes;
          console.log("fetched_season_episodes: ", fetched_season_episodes);
          // console.log("fetched_season_episodes: ", fetched_season_episodes);
        }

        return season_episodes.map((e) => ({
          ...e,
          season_number: s.season_number,
        }));
      });

      const allSeasonEpisodes = await Promise.all(seasonPromises);
      const all_episodes = allSeasonEpisodes.flat();
      // localStorage.setItem(
      //   `${showId}_all_episodes`,
      //   JSON.stringify(all_episodes),
      // );
      // console.log("all_epi?sodes: ", all_episodes);
      await addToAllEpisodes({
        id: `${showId}_all_episodes`,
        data: all_episodes,
      });
      setData(all_episodes);
    })();
  }, [showId]);

  React.useEffect(() => {
    if (autoScrollToNewPlayedEpisode && season && episode) {
      console.log("autoScrollToNewPlayedEpisode");
      scrollToElementById(`s${season}e${episode}`, 0, "auto");
    }
  }, [
    autoScrollToNewPlayedEpisode,
    episode,
    scrollToElementById,
    season,
    data, // added so the useEffect will run when data changes
  ]);

  if (!showId) return <div>No Show Selected</div>;
  if (!data) return <div>Loading Play List...</div>;

  return (
    <div
      ref={episodesListRef}
      className="py-4 px-6 w-full h-[calc(100svh-5rem)] overflow-y-auto bg flex flex-col gap-4 relative"
    >
      {/* Episodes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="text-2xl font-semibold ">Episodes</div>
        {data.map((ep) => {
          if (hideSpecials && ep.season_number === 0) return null;
          return (
            <div
              onClick={() => playEpisode(ep)}
              key={ep.id}
              id={`s${ep.season_number}e${ep.episode_number}`}
              className={` p-3 sm:p-4 rounded-lg  bg-white shadow-md dark:bg-gray-800 cursor-pointer ${season === ep.season_number && episode === ep.episode_number ? "border-2 border-sky-500" : lastPlayedSeason === ep.season_number && lastPlayedEpisode === ep.episode_number ? "border-2 border-amber-500" : "border border-gray-200 dark:border-gray-700 "}`}
            >
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex flex-wrap flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <div className="flex-1 flex gap-2 items-center text-xs sm:text-sm md:text-base lg:text-lg line-clamp-1">
                    <p className="font-bold bg-black text-white px-2 py-0.5 rounded-md">
                      S{ep.season_number} E{ep.episode_number}
                    </p>
                    <p className="flex-1  line-clamp-1">{ep.name}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    {season === ep.season_number &&
                      episode === ep.episode_number && (
                        <Badge color="info" size="xs">
                          Playing
                        </Badge>
                      )}
                    {ep.air_date ? (
                      <Badge color="success" size="xs">
                        <div className=" ">{ep.air_date}</div>
                      </Badge>
                    ) : null}
                    {ep.vote_average ? (
                      <Badge color="warning" size="xs">
                        <div className="flex items-center gap-1">
                          {ep.vote_average} <FaStar />
                        </div>
                      </Badge>
                    ) : null}

                    <Badge
                      onClick={(e) => showEpisodeInfo(e, ep)}
                      color="info"
                      size="xs"
                    >
                      <div className="flex items-center gap-1">
                        Info <FaInfo />
                      </div>
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <FloatingControls
        isVisible={true}
        scrollToTop={scrollToTop}
        scrollToPlayingEpisode={() =>
          scrollToElementById(`s${season}e${episode}`)
        }
        scrollToLastPlayedEpisode={() =>
          scrollToElementById(`s${lastPlayedSeason}e${lastPlayedEpisode}`)
        }
        episode={episode}
        playNext={playNextEpisode}
        playPrevious={playPreviousEpisode}
        stopPlaying={stopPlaying}
        playLastPlayedEpisode={playLastPlayedEpisode}
      />
    </div>
  );
};

export default Playlist;
