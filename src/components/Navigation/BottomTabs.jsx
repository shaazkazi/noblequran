import { Link, useLocation } from "react-router-dom";

const BottomTabs = () => {
  const location = useLocation();

  return (
    <nav className="ios-bottom-tabs">
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
          >
            <img
              src={icon}
              alt={label}
              className={`w-6 h-6 tab-icon transition-transform duration-200 ${
                isActive ? "scale-110 opacity-100" : "opacity-80"
              }`}
            />
            <span className="text-xs mt-1">{label}</span>
            {isActive && (
              <span className="absolute bottom-0 w-6 h-[3px] bg-ios-primary rounded-full"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomTabs;
