import { FaPlay, FaArrowUp } from "react-icons/fa";
import { CgPlayTrackNext } from "react-icons/cg";
import { IoStop } from "react-icons/io5";
import { BiSolidSlideshow } from "react-icons/bi";

import SleepTimerFloatingButton from "./SleepTimerFloatingButton";
import SettingsFloatingButton from "./SettingsFloatingButton";
import FloatingButton from "./FloatingButton";
import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

const FloatingControls = ({
  isVisible,
  scrollToTop,
  scrollToPlayingEpisode,
  scrollToLastPlayedEpisode,
  episode,
  playNext,
  playPrevious,
  stopPlaying,
  playLastPlayedEpisode,
}) => {
  const { lastPlayedSeason, lastPlayedEpisode } = useStore(
    useShallow((s) => ({
      lastPlayedSeason: s.lastPlayedSeason,
      lastPlayedEpisode: s.lastPlayedEpisode,
    })),
  );
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-row gap-2 justify-center items-center">
      {episode !== null ? (
        <>
          <SleepTimerFloatingButton />
          {/* play next button  */}
          <FloatingButton
            onClick={playNext}
            title="Play Next"
            aria-label="Play Next"
          >
            <CgPlayTrackNext className="size-5 lg:size-6  rotate-180" />
          </FloatingButton>
          {/* stop playing button  */}
          <FloatingButton
            onClick={stopPlaying}
            title="Stop Playing"
            aria-label="Stop Playing"
          >
            <IoStop className="size-5 lg:size-6 " />
          </FloatingButton>
          {/* play previous button  */}
          <FloatingButton
            onClick={playPrevious}
            title="Play Previous"
            aria-label="Play Previous"
          >
            <CgPlayTrackNext className="size-5 lg:size-6 " />
          </FloatingButton>
          {/* scroll to playing episode button  */}
          <FloatingButton
            onClick={scrollToPlayingEpisode}
            title="Scroll to playing episode"
            aria-label="Scroll to playing episode"
          >
            <BiSolidSlideshow className="size-5 lg:size-6 " />
          </FloatingButton>
        </>
      ) : lastPlayedEpisode !== null && lastPlayedSeason !== null ? (
        <>
          {/* play last played episode button  */}
          <FloatingButton
            onClick={playLastPlayedEpisode}
            title="Play Last Played Episode"
            aria-label="Play Last Played Episode"
          >
            <FaPlay className="size-5 lg:size-6 " />
          </FloatingButton>
          {/* scroll to last played episode button  */}
          <FloatingButton
            onClick={scrollToLastPlayedEpisode}
            title="Scroll to last played episode"
            aria-label="Scroll to last played episode"
          >
            <BiSolidSlideshow className="size-5 lg:size-6 " />
          </FloatingButton>
        </>
      ) : null}

      {/* Scroll to top button */}
      <FloatingButton
        onClick={scrollToTop}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="size-5 lg:size-6 " />
      </FloatingButton>
      <SettingsFloatingButton />
    </div>
  );
};

export default FloatingControls;
