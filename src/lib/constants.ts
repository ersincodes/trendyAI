import instaIcon from "../assets/icons/insta.png";
import fbIcon from "../assets/icons/fb.png";
import xIcon from "../assets/icons/x.png";
import linkedinIcon from "../assets/icons/linkedin.png";
import type { SocialImg } from "../types";

const socialImgs: SocialImg[] = [
  {
    name: "instagram",
    imgPath: instaIcon,
    url: "https://www.instagram.com/ersinbahaar/",
  },
  {
    name: "facebook",
    imgPath: fbIcon,
    url: "https://www.facebook.com/ersin.bahar.2025/",
  },
  { name: "x", imgPath: xIcon, url: "https://x.com/ersindesigns" },
  {
    name: "linkedin",
    imgPath: linkedinIcon,
    url: "https://www.linkedin.com/in/ersin-bahar/",
  },
];

export { socialImgs };
