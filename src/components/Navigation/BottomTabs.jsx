import { Link, useLocation } from "react-router-dom";

const BottomTabs = () => {
  const location = useLocation();

  return (
    <nav className="ios-bottom-tabs safari_only">
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
            className={`relative flex flex-col items-center justify-center transition-all duration-200 ${
              isActive ? "text-ios-primary font-medium" : "text-gray-600"
            }`}
          >
            <img
              src={icon}
              alt={label}
              className={`tab-icon w-5 h-5 transition-transform duration-200 ${
                isActive ? "scale-105 opacity-100" : "opacity-80"
              }`}
            />
            <span className="text-[12px] mt-1">{label}</span>
            {isActive && (
              <span className="absolute -bottom-[4px] w-5 h-[2px] bg-ios-primary rounded-full transition-all duration-200"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomTabs;
