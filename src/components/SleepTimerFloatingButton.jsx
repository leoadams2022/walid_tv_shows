import React from "react";

import useStore from "../zustand/useStore";
import { useShallow } from "zustand/shallow";

import { GiNightSleep } from "react-icons/gi";

const SLEEP_TIMER_PRESETS = [
  { label: "1 min", minutes: 1 },
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "Never", minutes: null },
];
const SleepTimerFloatingButton = () => {
  const [startTimer, stopTimer, remainingTime] = useStore(
    useShallow((state) => [
      state.startTimer,
      state.stopTimer,
      state.remainingTime,
    ]),
  );
  // eslint-disable-next-line no-unused-vars
  const [selectedPreset, setSelectedPreset] = React.useState({
    label: "Never",
    minutes: null,
  });
  const [showOptions, setShowOptions] = React.useState(false);
  const [optionsPosition, setOptionsPosition] = React.useState(null);

  const buttonRef = React.useRef(null);

  const toggleOptions = () => {
    if (!showOptions) {
      const space = getAvailableSpace(buttonRef.current);
      setOptionsPosition(space.mostAvailSpaceX);
    }
    setShowOptions(!showOptions);
  };

  const handleOptionClick = (preset) => {
    setSelectedPreset(preset);
    setShowOptions(false);
    preset.minutes ? startTimer(preset.minutes) : stopTimer();
  };

  const getFormatRemainingTime = useStore(
    useShallow((s) => s.getFormatRemainingTime()),
  );

  // hide the options when the user clicks outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [buttonRef]);

  return (
    <div className="flex items-center justify-center relative">
      <button
        ref={buttonRef}
        className={` p-2 sm:p-3 lg:p-4  text-white transition-all duration-300 ease-in-out rounded-full shadow-lg bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer`}
        onClick={toggleOptions}
        aria-label="Sleep timer"
        title="Sleep timer"
      >
        {remainingTime ? (
          getFormatRemainingTime
        ) : (
          <GiNightSleep className="size-5 lg:size-6 " />
        )}
      </button>
      {showOptions && (
        <div
          className={` absolute bottom-11 sm:bottom-13 md:bottom-14 lg:bottom-16 bg-pop text-pop bg-gray-800 p-2 rounded-md text-white z-50`}
          style={{
            left: optionsPosition
              ? optionsPosition.direction === "right"
                ? "50%"
                : "auto"
              : "auto",
            right: optionsPosition
              ? optionsPosition.direction === "left"
                ? "50%"
                : "auto"
              : "auto",
          }}
        >
          {SLEEP_TIMER_PRESETS.map((preset, i) => (
            <div
              key={preset.label}
              onClick={() => handleOptionClick(preset)}
              className={`w-22 px-2 py-1 cursor-pointer hover:bg-gray-700 ${i > 0 && "border-t border-gray-700"}`}
            >
              {preset.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SleepTimerFloatingButton;

/**
 * Calculates the available space around an element within the viewport.
 * @param {HTMLElement} element - The DOM element to measure around.
 * @returns {Object} Object containing available space in all directions and the most available directions.
 */
function getAvailableSpace(element) {
  // Get element's position relative to the viewport
  const rect = element.getBoundingClientRect();

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate space in each direction (can be negative if element is outside viewport)
  const left = rect.left;
  const right = viewportWidth - rect.right;
  const top = rect.top;
  const bottom = viewportHeight - rect.bottom;

  // Determine which side has the most space horizontally and vertically
  const mostAvailSpaceX =
    left >= right
      ? { direction: "left", value: left }
      : { direction: "right", value: right };

  const mostAvailSpaceY =
    top >= bottom
      ? { direction: "top", value: top }
      : { direction: "bottom", value: bottom };

  // Return the complete object
  return {
    mostAvailSpaceX,
    mostAvailSpaceY,
    AvailSpace: { left, right, top, bottom },
  };
}
