// useScrollToTop.js
import { useState, useEffect, useCallback } from "react";

export const useScrollToTop = (elementRef, threshold = 300) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const toggleVisibility = () => {
      setIsVisible(element.scrollTop > threshold);
    };

    element.addEventListener("scroll", toggleVisibility);
    return () => element.removeEventListener("scroll", toggleVisibility);
  }, [elementRef, threshold]);

  const scrollToTop = useCallback(() => {
    if (elementRef?.current) {
      elementRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [elementRef]);

  // New: Scroll to element by ID within the scrollable container
  const scrollToElementById = useCallback(
    (elementId, offset = 0) => {
      if (!elementRef?.current) return;

      const container = elementRef.current;
      const targetElement = container.querySelector(`#${elementId}`);

      if (!targetElement) {
        console.warn(`Element with id "${elementId}" not found in container`);
        return;
      }

      const targetPosition = targetElement.offsetTop;

      container.scrollTo({
        top: targetPosition - offset,
        behavior: "smooth",
      });
    },
    [elementRef],
  );

  // New: Scroll to element by ID in the main document (window)
  const scrollToElementInWindow = useCallback((elementId, offset = 0) => {
    const targetElement = document.getElementById(elementId);

    if (!targetElement) {
      console.warn(`Element with id "${elementId}" not found in document`);
      return;
    }

    const targetPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: targetPosition - offset,
      behavior: "smooth",
    });
  }, []);

  // New: Generic scroll to any element (DOM node)
  const scrollToElement = useCallback(
    (targetElement, offset = 0) => {
      if (!elementRef?.current || !targetElement) return;

      const container = elementRef.current;

      // Check if target is within the scrollable container
      if (container.contains(targetElement)) {
        const targetPosition = targetElement.offsetTop;
        container.scrollTo({
          top: targetPosition - offset,
          behavior: "smooth",
        });
      } else {
        // Scroll in window if element is outside container
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: targetPosition - offset,
          behavior: "smooth",
        });
      }
    },
    [elementRef],
  );

  return {
    isVisible,
    scrollToTop,
    scrollToElementById,
    scrollToElementInWindow,
    scrollToElement,
  };
};

export default useScrollToTop;
