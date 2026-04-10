import React from "react";

import { ToggleSwitch } from "flowbite-react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

import { IoSettings } from "react-icons/io5";

import ThemeToggle from "./ThemeToggle";

const SettingsFloatingButton = () => {
  const {
    isAutoPlay,
    setIsAutoPlay,
    isAutoPlayNext,
    setIsAutoPlayNext,
    hideSpecials,
    setHideSpecials,
    season,
    // episode,
    setSeason,
    setEpisode,
    setProgress,
    seasonToView,
    // episodeToView,
    setSeasonToView,
    setEpisodeToView,
  } = useStore(
    useShallow((s) => ({
      isAutoPlay: s.isAutoPlay,
      setIsAutoPlay: s.setIsAutoPlay,
      isAutoPlayNext: s.isAutoPlayNext,
      setIsAutoPlayNext: s.setIsAutoPlayNext,
      hideSpecials: s.hideSpecials,
      setHideSpecials: s.setHideSpecials,
      season: s.season,
      // episode: s.episode,
      setSeason: s.setSeason,
      setEpisode: s.setEpisode,
      setProgress: s.setProgress,
      seasonToView: s.seasonToView,
      // episodeToView: s.episodeToView,
      setSeasonToView: s.setSeasonToView,
      setEpisodeToView: s.setEpisodeToView,
    })),
  );

  const [showOptions, setShowOptions] = React.useState(false);

  const buttonRef = React.useRef(null);
  const optionsRef = React.useRef(null);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // hide the options when the user clicks outside the options div or the button
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        optionsRef.current &&
        !optionsRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [buttonRef, optionsRef]);

  return (
    <div className="flex items-center justify-center relative">
      <button
        ref={buttonRef}
        className={` p-2 sm:p-3 lg:p-4  text-white transition-all duration-300 ease-in-out rounded-full shadow-lg bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer`}
        onClick={toggleOptions}
        aria-label="Settings"
        title="Settings"
      >
        <IoSettings className="size-5 lg:size-6 " />
      </button>
      {showOptions && (
        <div
          className={` absolute bottom-11 sm:bottom-13 md:bottom-14 lg:bottom-16 right-2 bg-pop text-pop  bg-gray-800 p-2 rounded-md text-white z-50 space-y-2`}
          ref={optionsRef}
        >
          <ThemeToggle />
          <ToggleSwitch
            checked={isAutoPlay}
            label="Auto Play"
            onChange={setIsAutoPlay}
            className="text-nowrap"
          />
          <ToggleSwitch
            checked={isAutoPlayNext}
            label="Auto Play Next"
            onChange={setIsAutoPlayNext}
            className="text-nowrap"
          />
          <ToggleSwitch
            checked={hideSpecials}
            label="Hide Specials"
            onChange={(v) => {
              setHideSpecials(v);
              if (season === 0) {
                setSeason(null);
                setEpisode(null);
                setProgress(0);
              }
              if (seasonToView == 0) {
                // console.log(
                //   "we have set seasonToView to null cuz it was 0",
                //   seasonToView,
                // );
                setSeasonToView(null);
                setEpisodeToView(null);
              }
            }}
            className="text-nowrap"
          />
        </div>
      )}
    </div>
  );
};

export default SettingsFloatingButton;
