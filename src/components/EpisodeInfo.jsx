import React from "react";

import { TabItem, Tabs, Badge, Card } from "flowbite-react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

import { FaRegCirclePlay } from "react-icons/fa6";
import { FaStar, FaVideo, FaClock } from "react-icons/fa";
import { GrFormNextLink } from "react-icons/gr";

import { getTVEpisodeDetails, getTVSeasonDetails } from "../tmdb/tv";
import { addEpisode, getEpisodeById } from "../database/db";

const EpisodeInfo = () => {
  const [data, setData] = React.useState(null);
  const [nextEpisode, setNextEpisode] = React.useState(null);
  const [prevEpisode, setPrevEpisode] = React.useState(null);
  const {
    season,
    episode,
    seasonToView,
    episodeToView,
    setEpisodeToView,
    setSeason,
    setEpisode,
    setShowSidebar,
    setProgress,
    showId,
  } = useStore(
    useShallow((s) => ({
      season: s.season,
      episode: s.episode,
      seasonToView: s.seasonToView,
      episodeToView: s.episodeToView,
      setEpisodeToView: s.setEpisodeToView,
      setSeason: s.setSeason,
      setEpisode: s.setEpisode,
      setShowSidebar: s.setShowSidebar,
      setProgress: s.setProgress,
      showId: s.showId,
    })),
  );

  React.useEffect(() => {
    (async () => {
      const localData = await getEpisodeById(
        `${showId}_episode_info_${seasonToView}_${episodeToView}`,
      );
      //  localStorage.getItem(
      //   `${showId}_episode_info_${seasonToView}_${episodeToView}`,
      // );
      if (localData) {
        // console.log("episode_info_ local: ", JSON.parse(localData));
        // const ld = JSON.parse(localData);
        // setData(ld);
        console.log("episode_info_ local: ", localData);
        setData(localData.data);
        return;
      }
      const d = await getTVEpisodeDetails(showId, seasonToView, episodeToView, {
        append_to_response: "images,credits",
      });

      await addEpisode({
        id: `${showId}_episode_info_${seasonToView}_${episodeToView}`,
        data: d,
      });
      // localStorage.setItem(
      //   `${showId}_episode_info_${seasonToView}_${episodeToView}`,
      //   JSON.stringify(d),
      // );
      setData(d);
    })();
    (async () => {
      const localData = localStorage.getItem(
        `${showId}_season_info_${seasonToView}`,
      );
      if (localData) {
        console.log("season_info local: ", JSON.parse(localData));
        const ld = JSON.parse(localData);
        setNextEpisode(
          ld.episodes.find((ep) => ep.episode_number === episodeToView + 1) ||
            null,
        );

        setPrevEpisode(
          ld.episodes.find((ep) => ep.episode_number === episodeToView - 1) ||
            null,
        );
        return;
      }
      const d = await getTVSeasonDetails(showId, seasonToView, {
        append_to_response: "images,credits",
      });

      localStorage.setItem(
        `${showId}_season_info_${seasonToView}`,
        JSON.stringify(d),
      );
      setNextEpisode(
        d.episodes.find((ep) => ep.episode_number === episodeToView + 1) ||
          null,
      );

      setPrevEpisode(
        d.episodes.find((ep) => ep.episode_number === episodeToView - 1) ||
          null,
      );
    })();
  }, [episodeToView, seasonToView, showId]);

  const goToNextEpisode = () => {
    setProgress(0);
    setTimeout(() => {
      setEpisodeToView(nextEpisode.episode_number);
    }, 100);
  };

  const goToPrevEpisode = () => {
    setProgress(0);
    setTimeout(() => {
      setEpisodeToView(prevEpisode.episode_number);
    }, 100);
  };

  if (!data) return <div>Loading Episode Info...</div>;

  //! HIMYM_SHOW_DETAILS
  // const data = HIMYM_SHOW_DETAILS.seasons
  //   .find((season) => season.season_number === seasonToView)
  //   .data.episodes.find((episode) => episode.episode_number === episodeToView);
  const posterUrl = `https://image.tmdb.org/t/p/w500${data.still_path}`;
  return (
    <div className="flex flex-col w-full gap-16">
      <Card>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-between">
          <div className="w-62 lg:w-100 rounded-lg shadow-lg relative">
            <img
              // src={"https://image.tmdb.org/t/p/w500"}
              src={posterUrl}
              alt={data.name}
              className="w-full rounded-lg"
              onError={(e) => {
                e.target.src = `https://placehold.co/400x224?text=no+image`;
                e.target.onerror = null; // Prevent infinite loop if placeholder also fails
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (season === seasonToView && episode === data.episode_number)
                  return;
                // console.log("play button");
                setProgress(0);
                setSeason(seasonToView);
                setEpisode(episodeToView);
                setShowSidebar(false);
              }}
              className={` absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-16 lg:size-26  cursor-pointer transition duration-300 ease-in-out transform hover:scale-110 ${season === seasonToView && episode === data.episode_number ? "text-sky-500" : "text-white"}`}
            >
              <FaRegCirclePlay className="size-full shadow-2xl " />
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-4 md:gap-8 ">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold">
                  {data.name}
                </h2>
                <div className="flex gap-2 items-start">
                  {prevEpisode ? (
                    <button
                      onClick={goToPrevEpisode}
                      className="flex justify-center items-center line-clamp-1 text-dem italic text-sm md:text-base lg:text-lg cursor-pointer hover:scale-110 transition duration-300"
                    >
                      <GrFormNextLink className="inline-block rotate-180" />{" "}
                      {prevEpisode.name}
                    </button>
                  ) : null}
                  {prevEpisode && nextEpisode ? <p>||</p> : null}
                  {nextEpisode ? (
                    <button
                      onClick={goToNextEpisode}
                      className="flex justify-center items-center line-clamp-1 text-dem italic text-sm md:text-base lg:text-lg cursor-pointer hover:scale-110 transition duration-300"
                    >
                      {nextEpisode.name}{" "}
                      <GrFormNextLink className="inline-block" />
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {season === seasonToView && episode === data.episode_number ? (
                  <Badge color="info" size="xs">
                    Playing
                  </Badge>
                ) : null}
                {data.episode_number ? (
                  <Badge color="success">Episode {data.episode_number}</Badge>
                ) : null}
                {data.air_date ? (
                  <Badge color="success">{data.air_date}</Badge>
                ) : null}
                {data.vote_average ? (
                  <Badge color="warning">
                    <div className="flex items-center gap-1">
                      {data.vote_average} <FaStar />
                    </div>
                  </Badge>
                ) : null}
                {data.runtime ? (
                  <Badge color="warning">
                    <div className="flex items-center gap-1">
                      {data.runtime} <FaClock />
                    </div>
                  </Badge>
                ) : null}
              </div>
            </div>
            {data.overview ? (
              <p className="text-gray-600 text-dem">
                <span className="font-semibold text mb-2">overview:</span>
                <br />
                {data.overview}
              </p>
            ) : null}
          </div>
        </div>
      </Card>
      <Tabs variant="underline">
        {/* crew */}
        <TabItem title="Crew" icon={FaVideo}>
          <Card>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Crew</h2>
              <div className="flex flex-wrap gap-4">
                {data.crew.map((person) => (
                  <div
                    key={person.id}
                    title={person.name}
                    className="relative rounded-lg flex flex-col items-center justify-center"
                  >
                    <img
                      // src={"https://image.tmdb.org/t/p/w500"}
                      src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                      alt={person.name}
                      className="w-46 h-56 rounded-full object-cover object-top shadow-sm"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/500?text=no+image`;
                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      }}
                    />
                    {/* <div className="w-full h-full absolute inset-0 bg-linear-to-t from-gray-50 via-gray-50/50 dark:from-gray-800 to-transparent"></div> */}
                    <div className="p-3 text-center">
                      <p className="font-bold">{person.name}</p>
                      <p className="text-dem text-sm">{person.job}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabItem>

        {/* guest_stars */}
        <TabItem title="Guest Stars" icon={FaVideo}>
          <Card>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Crew</h2>
              <div className="flex flex-wrap gap-4">
                {data.guest_stars.map((person) => (
                  <div
                    key={person.id}
                    title={person.name}
                    className="relative rounded-lg flex flex-col items-center justify-center"
                  >
                    <img
                      // src={"https://image.tmdb.org/t/p/w500"}
                      src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                      alt={person.name}
                      className="w-46 h-56 rounded-full object-cover object-top shadow-sm"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/500?text=no+image`;
                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      }}
                    />
                    {/* <div className="w-full h-full absolute inset-0 bg-linear-to-t from-gray-50 via-gray-50/50 dark:from-gray-800 to-transparent"></div> */}
                    <div className="p-3 text-center">
                      <p className="font-bold">{person.name}</p>
                      <p className="text-dem text-sm">as: {person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default EpisodeInfo;
