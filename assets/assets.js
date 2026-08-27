import happy_store from "./happy_store.webp";
import upload_area from "./upload_area.svg";
import hero_model_img from "./hero_model_img.png";
import hero_product_img1 from "./products/headphone.png";
import hero_product_img2 from "./products/smartWatch.png";
import profile_pic1 from "./profile_pic1.jpg";
import profile_pic2 from "./profile_pic2.jpg";
import profile_pic3 from "./profile_pic3.jpg";
import { ClockFadingIcon, HeadsetIcon, SendIcon } from "lucide-react";

export const assets = {
    happy_store,
    upload_area,
    hero_model_img,
    hero_product_img1,
    hero_product_img2,
    profile_pic1,
    profile_pic2,
    profile_pic3,
};

export const categories = [
    "Headphones",
    "Speakers",
    "Watch",
    "Earbuds",
    "Mouse",
    "Decoration",
];

export const ourSpecsData = [
    {
        title: "Free Shipping",
        description: "Enjoy fast, free delivery on every order no conditions, just reliable doorstep.",
        icon: SendIcon,
        accent: "#05DF72",
    },
    {
        title: "7 Days easy Return",
        description: "Change your mind? No worries. Return any item within 7 days.",
        icon: ClockFadingIcon,
        accent: "#FF8904",
    },
    {
        title: "24/7 Customer Support",
        description: "We're here for you. Get expert help with our customer support.",
        icon: HeadsetIcon,
        accent: "#A684FF",
    },
];