const FloatingButton = ({ onClick, className, children, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={` p-2 sm:p-3 lg:p-4  text-white transition-all duration-300 ease-in-out rounded-full shadow-lg bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default FloatingButton;
