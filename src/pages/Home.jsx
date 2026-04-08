import React from "react";

import { Tabs, TabItem } from "flowbite-react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

import { IoIosArrowForward } from "react-icons/io";
import { RiHome2Fill, RiPlayList2Fill } from "react-icons/ri";
import { FaLayerGroup } from "react-icons/fa6";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { SiMyshows } from "react-icons/si";
import { MdViewComfy } from "react-icons/md";

import {
  getTVDetails,
  // getTVDetails,
  getTVEpisodeDetails,
  getTVSeasonDetails,
} from "../tmdb/tv";

import ShowInfo from "../components/ShowInfo";
import Seasons from "../components/Seasons";
import Playlist from "../components/Playlist";
import VidFastEmbed from "../components/VidFastEmbed";
import { useSwipeable } from "react-swipeable";
import Shows from "../components/Shows";

const tabsTheme = {
  base: "flex flex-col gap-2 h-full",
  tablist: {
    base: "flex text-center min-h-14 justify-center ",
    variant: {
      underline:
        "-mb-px flex-wrap border-b border-gray-200 dark:border-gray-700",
    },
    tabitem: {
      base: "flex items-center justify-center rounded-t-lg p-4 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
      variant: {
        underline: {
          base: "rounded-t-lg",
          active: {
            on: "rounded-t-lg border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-500",
            off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
          },
        },
      },
      icon: "mr-2 h-5 w-5",
    },
  },
  tabitemcontainer: {
    base: "h-[calc(100%-3.5rem)] overflow-y-auto",
    variant: {
      underline: "",
    },
  },
  tabpanel: "py-0",
};

export default function Home() {
  const sideBarSwipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      // console.log("Swiped left");
      handleSwipeLeft(false);
    },
    onSwipedRight: () => {
      // console.log("Swiped right");
      handleSwipeRight();
    },
    trackMouse: true,
    delta: 50, // Minimum swipe distance
    velocity: 0.2, // Minimum velocity
  });

  const [data, setData] = React.useState(null);
  const tabsRef = React.useRef(null);
  const {
    showSidebar,
    setShowSidebar,
    activeSection: activeTab,
    setActiveSection: setActiveTab,
    season,
    episode,
    setSeason,
    setEpisode,
    setProgress,
    isFullScreen,
    setFullScreen,
    remainingTime,
    showId,
  } = useStore(
    useShallow((s) => ({
      showSidebar: s.showSidebar,
      setShowSidebar: s.setShowSidebar,
      activeSection: s.activeSection,
      setActiveSection: s.setActiveSection,
      season: s.season,
      episode: s.episode,
      setSeason: s.setSeason,
      setEpisode: s.setEpisode,
      setProgress: s.setProgress,
      isFullScreen: s.isFullScreen,
      setFullScreen: s.setFullScreen,
      remainingTime: s.remainingTime,
      showId: s.showId,
    })),
  );
  const getFormatRemainingTime = useStore(
    useShallow((s) => s.getFormatRemainingTime()),
  );

  const playerContainerRef = React.useRef(null);

  const handleSwipeLeft = () => {
    console.log("Swiped left");
    if (activeTab !== 3) {
      tabsRef.current?.setActiveTab(activeTab + 1);
      return;
    } else {
      toggleEplist(false);
    }
  };

  const handleSwipeRight = () => {
    console.log("Swiped right");
    if (activeTab !== 0) {
      tabsRef.current?.setActiveTab(activeTab - 1);
      return;
    }
  };
  const toggleEplist = (o = null) => {
    if (o === null) {
      setActiveTab(o);
      return;
    }
    setShowSidebar(!showSidebar);
  };
  React.useEffect(() => {
    // console.log("tabsRef.current?.setActiveTab", tabsRef.current);
    // console.log("activeTab", activeTab);
    tabsRef.current?.setActiveTab(activeTab);
  }, [activeTab, data]);

  const playNextEpisode = () => {
    //! HIMYM_SHOW_DETAILS;
    let nextEpisode = data.find(
      (ep) => ep.season_number === season && ep.episode_number === episode + 1,
    );

    if (nextEpisode) {
      // Move to next episode in same season
      setProgress(0);
      setTimeout(() => {
        setEpisode(episode + 1);
      }, 100);
    } else {
      nextEpisode = data.reduce((highest, current) => {
        if (current.season_number === season + 1) {
          if (!highest || current.episode_number < highest.episode_number) {
            return current;
          }
        }
        return highest;
      }, null);

      if (nextEpisode) {
        setProgress(0);
        setTimeout(() => {
          setSeason(nextEpisode.season_number);
          setEpisode(nextEpisode.episode_number);
        }, 100);
      }
    }
  };
  const playPreviousEpisode = () => {
    // 1. If we aren't at the first episode, just go back one
    if (episode > 1) {
      setProgress(0);
      setTimeout(() => {
        setEpisode(episode - 1);
      }, 100);
    } else {
      const previousEpisode = data.reduce((highest, current) => {
        if (current.season_number === season - 1) {
          if (!highest || current.episode_number > highest.episode_number) {
            return current;
          }
        }
        return highest;
      }, null);

      if (previousEpisode) {
        setProgress(0);
        setTimeout(() => {
          setSeason(previousEpisode.season_number);
          setEpisode(previousEpisode.episode_number);
        }, 100);
      }
    }
  };

  React.useEffect(() => {
    if (!episode || !season) return;
    //! HIMYM_SHOW_DETAILS
    (async () => {
      let local_playingEpisode = localStorage.getItem(
        `${showId}_episode_info_${season}_${episode}`,
      );
      if (local_playingEpisode) {
        local_playingEpisode = JSON.parse(local_playingEpisode);
      } else {
        const fetched_playingEpisode = await getTVEpisodeDetails(
          showId,
          season,
          episode,
          {
            append_to_response: "images,credits",
          },
        );
        localStorage.setItem(
          `${showId}_episode_info_${season}_${episode}`,
          JSON.stringify(fetched_playingEpisode),
        );
        local_playingEpisode = fetched_playingEpisode;
      }
      const playingEpisode = local_playingEpisode;

      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: `${episode} ${playingEpisode.name}`,
          artist: "How I Met Your Mother",
          album: `Season ${season}`,
          artwork: [
            {
              src: `https://image.tmdb.org/t/p/w500${playingEpisode.still_path}`,
              sizes: "512x512",
              type: "image/jpg",
            },
          ],
        });

        navigator.mediaSession.setActionHandler("nexttrack", playNextEpisode);
        navigator.mediaSession.setActionHandler(
          "previoustrack",
          playPreviousEpisode,
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode, season, data]);

  const toggleFullscreen = () => {
    const elem = playerContainerRef.current;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.() || elem.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    // Note: setFullScreen(true/false) will be handled by the useEffect
  };

  // Sync state if user presses ESC key to exit
  React.useEffect(() => {
    const handler = () => {
      setFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, [setFullScreen]);

  React.useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      if (!document.documentElement.classList.contains("dark"))
        document.documentElement.classList.add("dark");
      if (document.documentElement.classList.contains("light"))
        document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-color-mode", "dark");
    } else {
      if (document.documentElement.classList.contains("dark"))
        document.documentElement.classList.remove("dark");
      if (!document.documentElement.classList.contains("light"))
        document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-color-mode", "light");
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      const localData = localStorage.getItem(`${showId}_all_episodes`);
      if (localData) {
        // console.log("episode_info_ local: ", JSON.parse(localData));
        const ld = JSON.parse(localData);
        setData(ld);
        return;
      }
      const show_info_seasons =
        JSON.parse(localStorage.getItem(`${showId}_show_info`)).seasons ||
        (await getTVDetails(showId).seasons);

      const seasonPromises = show_info_seasons.map(async (s) => {
        let season_episodes;
        const local_season = localStorage.getItem(
          `${showId}_season_info_${s.season_number}`,
        );

        if (local_season) {
          const local_season_episodes = JSON.parse(local_season).episodes;
          season_episodes = local_season_episodes;
          // console.log("local_season_episodes: ", local_season_episodes);
        } else {
          const fetched_season_episodes = await getTVSeasonDetails(
            showId,
            s.season_number,
          );
          season_episodes = fetched_season_episodes.episodes;
          // console.log("fetched_season_episodes: ", fetched_season_episodes);
        }

        return season_episodes.map((e) => ({
          ...e,
          season_number: s.season_number,
        }));
      });

      const allSeasonEpisodes = await Promise.all(seasonPromises);
      const all_episodes = allSeasonEpisodes.flat();
      localStorage.setItem(
        `${showId}_all_episodes`,
        JSON.stringify(all_episodes),
      );
      // console.log("all_epi?sodes: ", all_episodes);
      setData(all_episodes);
    })();
  }, [showId]);

  if (!data) return <div>Loading Home...</div>;

  return (
    <div ref={playerContainerRef} className="w-screen h-svh bg text relative ">
      {/* Sidebar */}
      <div
        className={`z-10 absolute top-0 left-0 ${showSidebar ? "translate-x-0" : "-translate-x-full"} w-full h-full  transition-all duration-300 shadow-2xl bg `}
      >
        <div
          className="w-full h-full overflow-x-hidden"
          {...sideBarSwipeHandlers}
        >
          <Tabs
            aria-label="Tabs with underline"
            variant="underline"
            ref={tabsRef}
            onActiveTabChange={(tab) => setActiveTab(tab)}
            theme={tabsTheme}
          >
            <TabItem title="Shows" icon={SiMyshows}>
              <Shows />
            </TabItem>
            <TabItem title="Show Info" icon={MdViewComfy}>
              <ShowInfo />
            </TabItem>
            <TabItem title="Seasons" icon={FaLayerGroup}>
              <Seasons />
            </TabItem>
            <TabItem title="Playlist" icon={RiPlayList2Fill}>
              <Playlist
                playNextEpisode={playNextEpisode}
                playPreviousEpisode={playPreviousEpisode}
              />
            </TabItem>
          </Tabs>
        </div>
        <button
          onClick={toggleEplist}
          className={`${showSidebar ? "right-0 rounded-l-2xl" : " -right-10 rounded-r-2xl opacity-40"}   absolute top-1/3 -translate-y-1/2 size-10 bg-pop text-pop flex justify-center items-center cursor-pointer transition-all duration-300`}
        >
          <IoIosArrowForward
            className={`size-6 ${showSidebar ? "rotate-180" : ""} transition-all duration-300`}
          />
        </button>
      </div>
      {/* player  */}
      <div className={`w-full h-full relative`}>
        <VidFastEmbed />
        {remainingTime ? (
          <p className="absolute top-5 left-5 text-sm md:text-base lg:text-lg text-white bg-black px-2 py-1 rounded-sm capitalize opacity-60 pointer-events-none">
            {getFormatRemainingTime}
          </p>
        ) : null}
        <button
          onClick={toggleFullscreen}
          className="absolute top-5 right-5 p-1 rounded-full text-white bg-black text-2xl cursor-pointer opacity-60 hover:opacity-100 transition-all duration-300"
        >
          <div className="size-5 sm:size-6 md:size-7 lg:size-8 ">
            {isFullScreen ? (
              <AiOutlineFullscreenExit className="size-full " />
            ) : (
              <AiOutlineFullscreen className="size-full " />
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
