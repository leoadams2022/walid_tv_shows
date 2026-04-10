import React from "react";

import { Badge, Breadcrumb, BreadcrumbItem } from "flowbite-react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

import { HiHome } from "react-icons/hi";
import { FaStar } from "react-icons/fa";

import { getTVDetails } from "../tmdb/tv";

import SeasonInfo from "./SeasonInfo";
import EpisodeInfo from "./EpisodeInfo";
import { addShow, getShowById } from "../database/db";

const Seasons = () => {
  const [data, setData] = React.useState(null);
  const {
    season,
    seasonToView,
    episodeToView,
    setSeasonToView,
    setEpisodeToView,
    showId,
    hideSpecials,
  } = useStore(
    useShallow((s) => ({
      season: s.season,
      seasonToView: s.seasonToView,
      episodeToView: s.episodeToView,
      setSeasonToView: s.setSeasonToView,
      setEpisodeToView: s.setEpisodeToView,
      showId: s.showId,
      hideSpecials: s.hideSpecials,
    })),
  );
  //! HIMYM_SHOW_DETAILS
  // const data = HIMYM_SHOW_DETAILS.seasons;
  React.useEffect(() => {
    (async () => {
      const localData = await getShowById(`${showId}_show_info`); // localStorage.getItem(`${showId}_show_info`);
      if (localData) {
        console.log("localData seasons: ", localData);
        // setData(JSON.parse(localData));
        setData(localData.data);
        return;
      }
      const d = await getTVDetails(showId, {
        append_to_response: "images,credits",
      });
      // localStorage.setItem(`${showId}_show_info`, JSON.stringify(d));
      await addShow({
        id: `${showId}_show_info`,
        data: d,
      });
      setData(d);
    })();
  }, [showId]);
  if (!showId) return <div>No Show Selected</div>;
  if (!data) return <div>Loading Seasons...</div>;

  return (
    <div className="container mx-auto p-4  ">
      <div className="mb-4">
        <Breadcrumb aria-label="Default breadcrumb example">
          <BreadcrumbItem
            onClick={() => {
              setSeasonToView(null);
              setEpisodeToView(null);
            }}
            className=" cursor-pointer"
            icon={HiHome}
          >
            Seasons
          </BreadcrumbItem>
          {seasonToView !== null && (
            <BreadcrumbItem
              onClick={() => setEpisodeToView(null)}
              className=" cursor-pointer"
            >
              Season {seasonToView}
            </BreadcrumbItem>
          )}
          {episodeToView !== null && (
            <BreadcrumbItem>Episode {episodeToView}</BreadcrumbItem>
          )}
        </Breadcrumb>
      </div>
      {/* Seasons Grid  */}
      {seasonToView === null && episodeToView === null && (
        <div
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 place-content-center place-items-center`}
        >
          {data.seasons.map((s) => {
            if (hideSpecials && s.season_number === 0) return null;
            return (
              <div
                onClick={() => setSeasonToView(s.season_number)}
                key={s.id}
                className={`w-32 sm:w-42 md:w-52 rounded-lg shadow-lg relative cursor-pointer hover:scale-110 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl ${season === s.season_number ? "ring-2 ring-sky-500" : ""}`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${s.poster_path}`}
                  alt={s.name}
                  className="w-full h-auto rounded-t-lg"
                  onError={(e) => {
                    e.target.src = `https://placehold.co/500?text=no+image`;
                    e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                  }}
                />
                <div className="w-full h-12 rounded-b-lg bg-pop text-pop p-2">
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {s.name}
                  </h3>
                </div>
                <div className=" absolute top-0 left-0 w-full flex justify-between p-1">
                  <Badge color="success" size="xs">
                    {s.episode_count} Ep
                  </Badge>
                  {/* <Badge color="success">{s.air_date}</Badge> */}
                  <Badge color="warning" size="xs">
                    <div className="flex items-center gap-1">
                      {s.vote_average} <FaStar />
                    </div>
                  </Badge>
                </div>
                <div className=" absolute bottom-12 left-0 w-fit flex flex-col justify-between p-1 gap-1">
                  {season === s.season_number && (
                    <Badge color="info" size="xs">
                      Playing
                    </Badge>
                  )}
                  <Badge color="success" size="xs">
                    {s.air_date}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Season Info  */}
      {seasonToView !== null && episodeToView === null && <SeasonInfo />}
      {/* Episode Info  */}
      {seasonToView !== null && episodeToView !== null && <EpisodeInfo />}
    </div>
  );
};

export default Seasons;
