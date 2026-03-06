import sakuraImg from "../assets/sakura.jpg";
import tokyoImg from "../assets/tokyo.jpg";
import nightChill from "../assets/sfx/night-chill.mp3";
import winterCity from "../assets/sfx/winter-city.mp3";
import winterWalk from "../assets/sfx/winter-walk.mp3";

export const THEME_LIST = [
  { id: "tokyo", name: "Tokyo Night", bg: `url(${tokyoImg})` },
  { id: "sakura", name: "Spring Sakura", bg: `url(${sakuraImg})` },
  { id: "dark", name: "Deep Space", bg: "none", colorClass: "bg-slate-950" },
];

export const PLAYLIST = [
  { title: "Night Chill", src: nightChill },
  { title: "Winter City", src: winterCity },
  { title: "Winter Walk", src: winterWalk },
];
