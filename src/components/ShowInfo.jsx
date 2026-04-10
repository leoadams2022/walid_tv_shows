import React from "react";

import {
  RatingStar,
  TabItem,
  Tabs,
  Rating,
  Badge,
  Avatar,
} from "flowbite-react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

import { HiOutlineExternalLink } from "react-icons/hi";
import {
  FaStar,
  FaCalendarAlt,
  FaFilm,
  FaTv,
  FaUsers,
  FaPlay,
  FaVideo,
  FaImage,
} from "react-icons/fa";

import { getTVDetails } from "../tmdb/tv";
import { addShow, getShowById } from "../database/db";

const ShowInfo = () => {
  const [data, setData] = React.useState(null);

  const { showId } = useStore(
    useShallow((state) => ({
      showId: state.showId,
    })),
  );

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to get image URL
  const getImageUrl = (path, size = "original") => {
    if (!path) return "/api/placeholder/400/600";
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  React.useEffect(() => {
    (async () => {
      const localData = await getShowById(`${showId}_show_info`); // localStorage.getItem(`${showId}_show_info`);
      if (localData) {
        // console.log("show_info: ", JSON.parse(localData));
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
  if (!data) return <div>Loading Show Info...</div>;

  // Main backdrop image
  const backdropUrl = getImageUrl(data.backdrop_path, "original");
  const posterUrl = getImageUrl(data.poster_path, "w500");

  return (
    <div className="min-h-screen bg ">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] min-h-125 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/70 to-transparent" />
        </div>

        <div className="relative h-full container mx-auto px-4 flex items-end pb-12">
          <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-8 items-start">
            {/* Poster */}
            <div className="hidden md:block w-64 rounded-lg overflow-hidden shadow-2xl shrink-0">
              <img
                // src={"https://image.tmdb.org/t/p/w500"}
                src={posterUrl}
                alt={data.name}
                className="w-full h-auto"
                onError={(e) => {
                  e.target.src = `https://placehold.co/256x384?text=no+image`;
                  e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                }}
              />
            </div>

            {/* Title and Info */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                {data.name}
              </h1>
              {data.tagline && (
                <p className="text-xl text-gray-300 italic mb-4">
                  {data.tagline}
                </p>
              )}

              <div className="flex flex-wrap gap-4 items-center mb-6">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold">{data.vote_average}</span>
                  <span className="text-gray-400">
                    ({data.vote_count} votes)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>
                    {formatDate(data.first_air_date)} -{" "}
                    {formatDate(data.last_air_date)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FaTv className="text-gray-400" />
                  <span>
                    {data.number_of_seasons} Seasons • {data.number_of_episodes}{" "}
                    Episodes
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {data.genres.map((genre) => (
                  <Badge key={genre.id} color="purple" size="sm">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs aria-label="Show information tabs">
              {/* Overview Tab */}
              <TabItem title="Overview" icon={FaFilm}>
                <div className="py-4">
                  <h3 className="text-xl font-semibold mb-3 dark:text-white">
                    Synopsis
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {data.overview}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Status
                      </h4>
                      <p className="text-gray-900 dark:text-white">Ended</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Original Network
                      </h4>
                      <p className="text-gray-900 dark:text-white">
                        {data.networks.map((n) => n.name).join(", ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Production Companies
                      </h4>
                      <p className="text-gray-900 dark:text-white">
                        {data.production_companies
                          .filter((c) => c.name)
                          .map((c) => c.name)
                          .join(", ")}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        Homepage
                      </h4>
                      {data.homepage ? (
                        <a
                          href={data.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 flex items-center gap-1"
                        >
                          Visit Official Site{" "}
                          <HiOutlineExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <p className="text-gray-900 dark:text-white">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabItem>

              {/* Cast Tab */}
              <TabItem title="Cast" icon={FaUsers}>
                <div className="py-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {data.credits.cast.slice(0, 12).map((actor) => (
                      <div
                        key={actor.credit_id}
                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <Avatar
                          img={getImageUrl(actor.profile_path, "w185")}
                          alt={actor.name}
                          rounded
                          size="md"
                          onError={(e) => {
                            e.target.src = `https://placehold.co/500?text=no+image`;
                            e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {actor.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            as {actor.character}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabItem>

              {/* Crew Tab */}
              <TabItem title="Crew" icon={FaVideo}>
                <div className="py-4">
                  <div className="space-y-3">
                    {data.credits.crew.slice(0, 15).map((member) => (
                      <div
                        key={member.credit_id}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {member.job}
                          </p>
                        </div>
                        {member.profile_path && (
                          <Avatar
                            img={getImageUrl(member.profile_path, "w185")}
                            alt={member.name}
                            rounded
                            size="sm"
                            onError={(e) => {
                              e.target.src = `https://placehold.co/500?text=no+image`;
                              e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabItem>

              {/* Media Tab */}
              <TabItem title="Media" icon={FaImage}>
                <div className="py-4">
                  {data.videos?.results?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-3 dark:text-white">
                        Trailers & Videos
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.videos.results.map((video) => (
                          <div
                            key={video.id}
                            className="relative group cursor-pointer"
                          >
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                              <img
                                src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                alt={video.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://placehold.co/400x224?text=no+image`;
                                  e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                                }}
                              />
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <FaPlay className="w-12 h-12 text-white" />
                              </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                              {video.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.images?.backdrops?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3 dark:text-white">
                        Backdrops
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {data.images.backdrops
                          .slice(0, 9)
                          .map((image, index) => (
                            <div
                              key={index}
                              className="rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition"
                            >
                              <img
                                // src="https:"
                                src={getImageUrl(image.file_path, "w500")}
                                alt={`Backdrop ${index + 1}`}
                                className="w-full h-auto"
                                onError={(e) => {
                                  e.target.src = `https://placehold.co/400x224?text=no+image`;
                                  e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                                }}
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabItem>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">
                Created By
              </h3>
              <div className="space-y-3 mb-6">
                {data.created_by.map((creator) => (
                  <div key={creator.id} className="flex items-center gap-3">
                    <Avatar
                      img={getImageUrl(creator.profile_path, "w185")}
                      alt={creator.name}
                      rounded
                      size="md"
                      onError={(e) => {
                        e.target.src = `https://placehold.co/500?text=no+image`;
                        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {creator.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Creator
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      First Air Date
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(data.first_air_date)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Last Air Date
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {formatDate(data.last_air_date)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Popularity
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {Math.round(data.popularity)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <Rating>
                  <RatingStar filled={data.vote_average >= 2} />
                  <RatingStar filled={data.vote_average >= 4} />
                  <RatingStar filled={data.vote_average >= 6} />
                  <RatingStar filled={data.vote_average >= 8} />
                  <RatingStar filled={data.vote_average >= 10} />
                  <p className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {data.vote_average} out of 10
                  </p>
                </Rating>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowInfo;
