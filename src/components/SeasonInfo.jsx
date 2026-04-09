import React from "react";

import { TabItem, Tabs, Badge, Card } from "flowbite-react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

import { HiCollection } from "react-icons/hi";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FaStar, FaUsers, FaVideo, FaImage } from "react-icons/fa";
import { SiPaloaltonetworks } from "react-icons/si";
import { GrFormNextLink } from "react-icons/gr";

import { getTVDetails, getTVSeasonDetails } from "../tmdb/tv";
import { addSeason, getSeasonById } from "../database/db";

const SeasonInfo = () => {
  const [data, setData] = React.useState(null);
  const [showInfo, setShowInfo] = React.useState(null);
  const {
    season,
    setSeason,
    episode,
    setEpisode,
    seasonToView,
    setSeasonToView,
    setEpisodeToView,
    setShowSidebar,
    setProgress,
    showId,
  } = useStore(
    useShallow((s) => ({
      season: s.season,
      setSeason: s.setSeason,
      episode: s.episode,
      setEpisode: s.setEpisode,
      seasonToView: s.seasonToView,
      setSeasonToView: s.setSeasonToView,
      setEpisodeToView: s.setEpisodeToView,
      setShowSidebar: s.setShowSidebar,
      setProgress: s.setProgress,
      showId: s.showId,
    })),
  );
  //! HIMYM_SHOW_DETAILS
  // const data = HIMYM_SHOW_DETAILS.seasons.find(
  //   (s) => s.season_number === seasonToView,
  // );

  React.useEffect(() => {
    (async () => {
      const localData = await getSeasonById(
        `${showId}_season_info_${seasonToView}`,
      );
      // localStorage.getItem(
      //   `${showId}_season_info_${seasonToView}`,
      // );
      if (localData) {
        // console.log("season_info local: ", JSON.parse(localData));
        // const ld = JSON.parse(localData);
        // setData(ld);
        console.log("season_info local: ", localData);
        setData(localData.data);
        return;
      }
      const d = await getTVSeasonDetails(showId, seasonToView, {
        append_to_response: "images,credits",
      });
      await addSeason({
        id: `${showId}_season_info_${seasonToView}`,
        data: d,
      });
      // console.log("season_info: ", d);
      // localStorage.setItem(
      //   `${showId}_season_info_${seasonToView}`,
      //   JSON.stringify(d),
      // );
      setData(d);
    })();
    (async () => {
      const localData = localStorage.getItem(`${showId}_show_info`);
      if (localData) {
        // console.log("show_info: ", JSON.parse(localData));
        setShowInfo(JSON.parse(localData));
        return;
      }
      const d = await getTVDetails(showId, {
        append_to_response: "images,credits",
      });
      localStorage.setItem(`${showId}_show_info`, JSON.stringify(d));
      setShowInfo(d);
    })();
  }, [seasonToView, showId]);

  const nextSeason = React.useMemo(
    () =>
      showInfo?.seasons.find((s) => s.season_number === seasonToView + 1) ||
      null,
    [seasonToView, showInfo],
  );

  const prevSeason = React.useMemo(
    () =>
      showInfo?.seasons.find((s) => s.season_number === seasonToView - 1) ||
      null,
    [seasonToView, showInfo],
  );

  if (!data || !showInfo) return <div>Loading Season Info...</div>;

  const posterUrl = `https://image.tmdb.org/t/p/w500${data.poster_path}`;

  const playEpisode = (e, ep) => {
    e.stopPropagation();
    if (season === seasonToView && episode === ep.episode_number) return;
    // console.log("play button");
    setProgress(0);
    setSeason(seasonToView);
    setEpisode(ep.episode_number);
    setShowSidebar(false);
  };

  const goToNextSeason = () => {
    if (!nextSeason) return;
    setSeasonToView(nextSeason.season_number);
    console.log(nextSeason.season_number);
  };

  const goToPrevSeason = () => {
    if (!prevSeason) return;
    setSeasonToView(prevSeason.season_number);
    console.log(prevSeason.season_number);
  };

  return (
    <div className="flex flex-col w-full gap-16">
      <Card>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center justify-between">
          <img
            src={posterUrl}
            alt={data.name}
            className="min-w-52 h-100 rounded-lg shadow-lg"
          />
          <div className="flex-1 flex flex-col gap-4 md:gap-8 ">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-semibold">
                  {data.name}
                </h2>
                <div className="flex gap-2 items-start">
                  {prevSeason ? (
                    <button
                      onClick={goToPrevSeason}
                      className="flex justify-center items-center text-dem italic text-sm md:text-base lg:text-lg cursor-pointer hover:scale-110 transition duration-300"
                    >
                      <GrFormNextLink className="inline-block rotate-180" />{" "}
                      {prevSeason.name}
                    </button>
                  ) : null}
                  {prevSeason && nextSeason ? <p>||</p> : null}
                  {nextSeason ? (
                    <button
                      onClick={goToNextSeason}
                      className="flex justify-center items-center text-dem italic text-sm md:text-base lg:text-lg cursor-pointer hover:scale-110 transition duration-300"
                    >
                      {nextSeason.name}{" "}
                      <GrFormNextLink className="inline-block" />
                    </button>
                  ) : null}
                </div>
              </div>
              <div div className="flex gap-2">
                {/* air_date */}
                <Badge color="info">{data.air_date}</Badge>
                <Badge color="info">{data.episode_count} Episodes</Badge>
                <Badge color="warning">
                  <div className="flex items-center gap-1">
                    {data.vote_average} <FaStar />
                  </div>
                </Badge>
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
        {/* episodes */}
        <TabItem title="Episodes" icon={HiCollection}>
          <Card>
            {data.episodes.map((ep) => (
              <Card
                onClick={() => setEpisodeToView(ep.episode_number)}
                className={`cursor-pointer ${season === seasonToView && episode === ep.episode_number ? "ring-2 ring-sky-500" : ""}`}
                key={ep.id}
              >
                <div className="flex gap-2 items-center">
                  <div className="hidden md:block w-32 lg:w-42 rounded-lg shadow-lg relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${ep.still_path}`}
                      alt={ep.name}
                      className="w-full rounded-lg"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/500?text=no+image`;
                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      }}
                    />
                    <button
                      onClick={(e) => playEpisode(e, ep)}
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-8 lg:size-10 ${season === seasonToView && episode === ep.episode_number ? "text-sky-500" : "text-white"} cursor-pointer transition duration-300 ease-in-out transform hover:scale-110`}
                    >
                      <FaRegCirclePlay className="size-full shadow-2xl " />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-wrap flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div className="flex gap-2 items-center text-sm sm:text-base md:text-lg lg:text-xl line-clamp-1">
                      <button
                        onClick={(e) => playEpisode(e, ep)}
                        className={`md:hidden size-8 ${season === seasonToView && episode === ep.episode_number ? "text-sky-500" : "text-white"} cursor-pointer transition duration-300 ease-in-out transform hover:scale-90`}
                      >
                        <FaRegCirclePlay className="size-full shadow-2xl " />
                      </button>
                      <p>{ep.episode_number}</p>
                      <p>{ep.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                      {season === seasonToView &&
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
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Card>
        </TabItem>
        {/* cast */}
        <TabItem title="Cast" icon={FaUsers}>
          <Card>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Cast</h2>
              <div className="flex flex-wrap gap-4">
                {data.credits.cast.map((person) => (
                  <div
                    key={person.id}
                    title={person.name}
                    className="relative text rounded-lg flex flex-col items-center justify-center"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                      alt={person.name}
                      className="w-46 h-56 rounded-full object-cover object-top shadow-sm"
                    />
                    <div className="p-3 text-center">
                      <p className="font-bold">{person.original_name}</p>
                      <p className="text-dem text-sm">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabItem>
        {/* crew */}
        <TabItem title="Crew" icon={FaVideo}>
          <Card>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Crew</h2>
              <div className="flex flex-wrap gap-4">
                {data.credits.crew.map((person) => (
                  <div
                    key={person.id}
                    title={person.name}
                    className="relative rounded-lg flex flex-col items-center justify-center"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                      alt={person.name}
                      className="w-46 h-56 rounded-full object-cover object-top shadow-sm"
                    />
                    {/* <div className="w-full h-full absolute inset-0 bg-linear-to-t from-gray-50 via-gray-50/50 dark:from-gray-800 to-transparent"></div> */}
                    <div className="p-3 text-center">
                      <p className="font-bold">{person.original_name}</p>
                      <p className="text-dem text-sm">{person.job}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabItem>
        {/* networks  */}
        <TabItem title="Networks" icon={SiPaloaltonetworks}>
          <Card>
            <div>
              <h2 className="text-2xl font-semibold mb-4">Networks</h2>
              <div className="flex flex-wrap gap-4">
                {data.networks.map((network) => (
                  <div
                    key={network.id}
                    title={network.name}
                    className="relative p-2"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${network.logo_path}`}
                      alt={network.name}
                      className="w-56  object-cover object-top"
                    />
                    {/* <div className="w-full h-full absolute inset-0 bg-linear-to-t from-gray-50 via-gray-50/50 dark:from-gray-800 to-transparent"></div> */}
                    {/* <div className="p-3 ">{network.name}</div> */}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabItem>
        {/* Media */}
        <TabItem title="Media" icon={FaImage}>
          <Card>
            {data.images?.posters?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 dark:text-white">
                  Posters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {data.images?.posters.slice(0, 9).map((image, index) => (
                    <div
                      key={index}
                      className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                        alt={`Backdrop ${index + 1}`}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabItem>
      </Tabs>
    </div>
  );
};

export default SeasonInfo;
