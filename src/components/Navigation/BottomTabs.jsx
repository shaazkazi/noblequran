import { Link, useLocation } from "react-router-dom";

const BottomTabs = () => {
  const location = useLocation();

  return (
    <nav
      className="ios-bottom-tabs fixed bottom-0 left-0 w-full flex justify-around items-center bg-[var(--ios-background)] border-t border-gray-300 shadow-md z-100"
      style={{
        height: "calc(55px + env(safe-area-inset-bottom))", // Adjusts height dynamically
        paddingBottom: "env(safe-area-inset-bottom)", // Prevents home bar overlap
      }}
    >
      {[
        { path: "/", label: "Surahs", icon: "/surahs.svg" },
        { path: "/reciters", label: "Reciters", icon: "/mic.svg" },
        { path: "/settings", label: "Settings", icon: "/settings.svg" },
      ].map(({ path, label, icon }) => {
        const isActive = location.pathname === path;

        return (
          <Link
            key={path}
            to={path}
            className={`relative flex flex-col items-center transition-all duration-200 ${
              isActive ? "text-ios-primary font-medium" : "text-gray-600"
            }`}
            style={{ marginBottom: "5px" }} // Slight lift to avoid home bar
          >
            <img
              src={icon}
              alt={label}
              className={`w-5 h-5 transition-transform duration-200 ${
                isActive ? "scale-110 opacity-100" : "opacity-80"
              }`}
            />
            <span className="text-xs mt-1">{label}</span>
            {isActive && (
              <span className="absolute -bottom-1 w-6 h-[3px] bg-ios-primary rounded-full transition-all duration-200"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomTabs;
