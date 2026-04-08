import React from "react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";
import { getTVSeasonDetails } from "../tmdb/tv";

const VidFastEmbed = () => {
  const {
    id,
    s,
    e,
    setSeason,
    setEpisode,
    isPlaying,
    setProgress,
    setDuration,
    isAutoPlay,
    isAutoPlayNext,
    showId,
  } = useStore(
    useShallow((state) => ({
      id: state.showId,
      s: state.season,
      e: state.episode,
      setSeason: state.setSeason,
      setEpisode: state.setEpisode,
      isPlaying: state.isPlaying,
      setProgress: state.setProgress,
      setDuration: state.setDuration,
      isAutoPlay: state.isAutoPlay,
      isAutoPlayNext: state.isAutoPlayNext,
      showId: state.showId,
    })),
  );

  // Auto-play-next logic
  React.useEffect(() => {
    const handleMessage = (event) => {
      // Security check: Ensure message is from a valid VidFast origin
      const validOrigins = [
        "https://vidfast.pro",
        "https://vidfast.to",
        "https://vidfast.io",
      ];
      if (!validOrigins.includes(event.origin)) return;
      // timeupdate
      if (event.data?.data?.event === "timeupdate") {
        const { currentTime, duration } = event.data.data;

        setProgress(currentTime);
        setDuration(duration);
      }
      // Check if it's a player event and specifically the 'ended' event
      if (
        event.data?.type === "PLAYER_EVENT" &&
        event.data?.data?.event === "ended"
      ) {
        setProgress(0);
        if (isPlaying === false || isAutoPlayNext === false) {
          return;
        }

        setTimeout(() => {
          // Play the next episode
          playNextEpisode();
        }, 100);
      }
    };

    const playNextEpisode = async () => {
      //! HIMYM_SHOW_DETAILS
      // const currentSeasonData = HIMYM_SHOW_DETAILS.seasons.find(
      //   (sea) => sea.season_number === s,
      // );
      let currentSeasonData;
      const local_currentSeasonData = localStorage.getItem(
        `${showId}_season_info_${s}`,
      );
      if (local_currentSeasonData) {
        currentSeasonData = JSON.parse(local_currentSeasonData);
      } else {
        const fetched_currentSeasonData = await getTVSeasonDetails(showId, s, {
          append_to_response: "images,credits",
        });
        localStorage.setItem(
          `${showId}_season_info_${s}`,
          JSON.stringify(fetched_currentSeasonData),
        );
        currentSeasonData = fetched_currentSeasonData;
      }

      if (!currentSeasonData) return;

      const totalEpisodesInSeason = currentSeasonData.episodes.length;

      if (e < totalEpisodesInSeason) {
        // Move to next episode in same season
        setEpisode(e + 1);
      } else {
        // Check if there is a next season
        const nextSeasonNumber = s + 1;
        let nextSeasonExists = null;
        //! HIMYM_SHOW_DETAILS
        //  HIMYM_SHOW_DETAILS.seasons.some(
        //   (sea) => sea.season_number === nextSeasonNumber,
        // );
        const local_nextSeasonExists = localStorage.getItem(
          `${showId}_season_info_${nextSeasonNumber}`,
        );
        if (local_nextSeasonExists) {
          nextSeasonExists = JSON.parse(local_nextSeasonExists);
        } else {
          const fetched_nextSeasonExists = await getTVSeasonDetails(
            showId,
            nextSeasonNumber,
            {
              append_to_response: "images,credits",
            },
          );
          localStorage.setItem(
            `${showId}_season_info_${nextSeasonNumber}`,
            JSON.stringify(fetched_nextSeasonExists),
          );
          nextSeasonExists = fetched_nextSeasonExists;
        }

        if (nextSeasonExists) {
          setSeason(nextSeasonNumber);
          setEpisode(1); // Start at first episode of next season
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [
    s,
    e,
    setSeason,
    setEpisode,
    isPlaying,
    isAutoPlayNext,
    setProgress,
    setDuration,
    showId,
  ]);

  // Use useMemo so the URL string ONLY changes when the episode/show changes.
  // This prevents the iframe from thinking it has a new 'src' when the parent re-renders.
  const finalUrl = React.useMemo(() => {
    const baseUrl = "https://vidfast.pro";
    const embedPath = `/tv/${id}/${s}/${e}`;
    const params = new URLSearchParams({
      autoPlay: isAutoPlay ? "true" : "false",
      theme: "3b82f6",
      title: "true",
      poster: "true",
      hideServer: "false",
      autoNext: "false",
      nextButton: "false",
      startAt: useStore.getState().progress,
      sub: "en",
      fullscreenButton: "false",
    });
    return `${baseUrl}${embedPath}?${params.toString()}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, s, e]); // IMPORTANT: Do NOT put isFullScreen here.

  if (isPlaying === false) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-2xl font-bold text-center text-gray-500">
          Nothing is currently playing.
        </p>
      </div>
    );
  }
  return (
    <iframe
      src={finalUrl}
      className="w-full h-full min-h-100 lg:min-h-full"
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; hmac"
      allowFullScreen
      frameBorder="0"
      title={`Watching Season ${s} Episode ${e}`}
    />
  );
};

export default VidFastEmbed;
