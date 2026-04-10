import { create } from "zustand";
import { persist } from "zustand/middleware";
const INITIAL_shows = [
  {
    id: 1100,
    // name: "How I Met Your Mother",
  },
  {
    id: 1668,
    // name: "Friends",
  },
  {
    id: 1400,
    // name: "Seinfeld",
  },
  {
    id: 1418,
    // name: "The Big Bang Theory",
  },
  {
    id: 3452,
    // name: "Frasier",
  },
  {
    id: 2316,
    // name: "The Office",
  },
  {
    id: 39340,
    // name: "2 Broke Girls",
  },
  {
    id: 8592,
    // name: "Parks And Recreation",
  },
  {
    id: 2691,
    // name: "Tow and A Half Men",
  },
  {
    id: 52,
    // name: "That 70's Show",
  },
  {
    id: 1421,
    // name: "Modern Family",
  },
  {
    id: 4556,
    // name: "Scrubs",
  },
  {
    id: 2710,
    // name: "It's Always Sunny in Philadelphia",
  },
  {
    id: 49011,
    // name: "Mom",
  },
  {
    id: 71728,
    // name: "Young Sheldon",
  },
];
const isValid = (state) => {
  // zero is valid
  if (state === 0) return true;
  return state ? true : false;
};

const useStore = create(
  persist(
    (set, get) => ({
      // State
      activeSection: 0,
      showSidebar: false,

      shows: INITIAL_shows,

      showId: INITIAL_shows[0].id,

      // Show Related
      season: null,
      episode: null,
      lastPlayedSeason: null,
      lastPlayedEpisode: null,
      seasonToView: null,
      episodeToView: null,
      progress: 0,

      duration: 0,

      isPlaying: true,
      isFullScreen: false,
      isAutoPlay: true,
      isAutoPlayNext: true,
      hideSpecials: false, // setHideSpecials

      // Timer
      timer: null, // in minutes or null for off
      remainingTime: null, // in milliseconds
      timerInterval: null, // Store the interval ID

      // Actions
      setActiveSection: (activeSection) => set({ activeSection }),

      setShowSidebar: (showSidebar) => set({ showSidebar }),

      addShowById: (id) => {
        const { shows } = get();
        set({
          shows: [
            ...shows,
            {
              id,
              season: null,
              episode: null,
              lastPlayedSeason: null,
              lastPlayedEpisode: null,
              seasonToView: null,
              episodeToView: null,
              progress: 0,
            },
          ],
        });
      },

      removeShowById: (id) => {
        const { shows } = get();
        set({
          shows: shows.filter((show) => show.id !== id),
        });
      },

      resetShows: () => {
        const { shows } = get();
        const initShows = INITIAL_shows.map((s) => {
          const currentShow = shows.find((show) => show.id === s.id);
          return {
            id: s.id,
            season: currentShow?.season ? currentShow?.season : null,
            episode: currentShow?.episode ? currentShow?.episode : null,
            lastPlayedSeason: currentShow?.lastPlayedSeason
              ? currentShow?.lastPlayedSeason
              : null,
            lastPlayedEpisode: currentShow?.lastPlayedEpisode
              ? currentShow?.lastPlayedEpisode
              : null,
            seasonToView: currentShow?.seasonToView
              ? currentShow?.seasonToView
              : null,
            episodeToView: currentShow?.episodeToView
              ? currentShow?.episodeToView
              : null,
            progress: currentShow?.progress ? currentShow?.progress : 0,
          };
        });
        set({
          shows: initShows,
        });
      },

      setShowId: (id) => {
        const { shows } = get();
        const show = shows.find((show) => show.id === id);
        console.log(show);
        set({
          showId: id,
          season: isValid(show?.season) ? show.season : null,
          episode: isValid(show?.episode) ? show.episode : null,
          lastPlayedSeason: isValid(show?.lastPlayedSeason)
            ? show.lastPlayedSeason
            : null,
          lastPlayedEpisode: isValid(show?.lastPlayedEpisode)
            ? show.lastPlayedEpisode
            : null,
          seasonToView: isValid(show?.seasonToView) ? show.seasonToView : null,
          episodeToView: isValid(show?.episodeToView)
            ? show.episodeToView
            : null,
          progress: isValid(show?.progress) ? show.progress : 0,
        });
      },

      setSeason: (s) => {
        const { season, shows, showId } = get();
        set({
          season: s,
          lastPlayedSeason: season,
          shows: shows.map((show) => {
            if (show.id === showId) {
              return { ...show, season: s, lastPlayedSeason: season };
            }
            return show;
          }),
        });
      },
      setEpisode: (e) => {
        const { episode, shows, showId } = get();
        set({
          episode: e,
          lastPlayedEpisode: episode,
          isPlaying: !!e,
          shows: shows.map((show) => {
            if (show.id === showId) {
              return { ...show, episode: e, lastPlayedEpisode: episode };
            }
            return show;
          }),
        });
      },

      setSeasonToView: (s) => {
        const { shows, showId } = get();
        set({
          seasonToView: s,
          shows: shows.map((show) => {
            if (show.id === showId) {
              return { ...show, seasonToView: s };
            }
            return show;
          }),
        });
      },
      setEpisodeToView: (e) => {
        const { shows, showId } = get();
        set({
          episodeToView: e,
          shows: shows.map((show) =>
            show.id === showId ? { ...show, episodeToView: e } : show,
          ),
        });
      },

      setProgress: (p) => {
        const { shows, showId } = get();
        set({
          progress: p,
          shows: shows.map((show) =>
            show.id === showId ? { ...show, progress: p } : show,
          ),
        });
      },

      setDuration: (duration) => set({ duration }),

      stopPlaying: () => {
        const { season, episode, shows, showId } = get();
        set({
          isPlaying: false,
          season: null,
          episode: null,
          lastPlayedEpisode: episode,
          lastPlayedSeason: season,
          shows: shows.map((show) => {
            if (show.id === showId) {
              return {
                ...show,
                season: null,
                episode: null,
                lastPlayedEpisode: episode,
                lastPlayedSeason: season,
              };
            }
            return show;
          }),
        });
      },

      setFullScreen: (isFullScreen) => {
        set({ isFullScreen });
      },

      setIsAutoPlay: (isAutoPlay) => {
        set({ isAutoPlay });
      },

      setIsAutoPlayNext: (isAutoPlayNext) => {
        set({ isAutoPlayNext });
      },

      setHideSpecials: (hideSpecials) => {
        set({ hideSpecials });
      },

      setTimer: (timer) => set({ timer }),

      setRemainingTime: (remainingTime) => set({ remainingTime }),

      // Start timer with countdown
      startTimer: (minutes) => {
        // Clear any existing timer
        get().clearTimerInterval();

        const remainingTimeMs = minutes * 60 * 1000;

        set({
          timer: minutes,
          remainingTime: remainingTimeMs,
        });

        // Start the countdown interval
        const intervalId = setInterval(() => {
          const { remainingTime } = get();

          if (remainingTime === null || remainingTime <= 0) {
            // Time's up! Stop playing
            get().stopPlaying();
            get().clearTimerInterval();
          } else {
            // Decrease remaining time by 1 second
            set({ remainingTime: remainingTime - 1000 });
          }
        }, 1000);

        set({ timerInterval: intervalId });
      },

      // Stop/cancel the timer
      stopTimer: () => {
        get().clearTimerInterval();
        set({
          timer: null,
          remainingTime: null,
        });
      },

      // Clear interval helper
      clearTimerInterval: () => {
        const { timerInterval } = get();
        if (timerInterval) {
          clearInterval(timerInterval);
          set({ timerInterval: null });
        }
      },

      getFormatRemainingTime: () => {
        const { remainingTime } = get();
        if (remainingTime === null) return "Off";
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
      },

      getPlayerTime: () => {
        const { progress, duration } = get();
        const progressMinutes = Math.floor(progress / 60);
        const progressSeconds = Math.floor(progress % 60);

        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        return `${progressMinutes}:${progressSeconds} / ${durationMinutes}:${durationSeconds}`;
      },
    }),
    {
      name: "timer-storage",
      // Don't persist timer-related state
      // partialize: (state) => ({

      // }),
    },
  ),
);

// Optional: Cleanup function for when app closes
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    const store = useStore.getState();
    if (store.timerInterval) {
      clearInterval(store.timerInterval);
    }
  });
}

export default useStore;
