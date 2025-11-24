import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// import ThreeScroll from "./ThreeScroll";
import ThreeScroll from "./CSSScroll";
import { useRef } from "react";

const pieces = [
  {
    url: "/04/ascii-bedroom-archive/",
    title: "ASCII Bedroom Memoir",
  },
  {
    url: "/04/airs/",
    title: "Airs",
  },
  {
    url: "https://pureinformation.stream/",
    title: "Pure Information",
  },
  {
    url: "https://blairjohnsonpoetry.com/spoilia/",
    title: "Spoilia",
  },
  {
    url: "/04/a-shimmering/",
    title: "A Shimmering",
  },
  {
    url: "https://navigation-queues-navigation-cues.f451.studio/",
    title: "Navigation Queues Navigation Cues",
  },
  {
    url: "/04/answered-interruptions/",
    title: "Answered Interruptions",
  },
  {
    url: "/04/nica-marimba/",
    title: "Nica Marimba",
  },
  {
    url: "/04/cavity/",
    title: "cavity!",
  },
  {
    url: "/04/new-legibility/",
    title: "A New Legibility",
  },
  {
    url: "https://ifeelsomuchsha.me/",
    title: "I feel so much shame",
  },
  {
    url: "http://blairs.computer/",
    title: "../documents/​files/​memories/​mydigitalhoard",
  },
];

function App() {
  const [activeLink, setActiveLink] = useState(null);
  const linkRef = useRef();

  useEffect(() => {
    function handleScroll() {
      if (window.innerWidth > 800) {
        let active = null;
        const scrollY = window.scrollY;
        pieces.forEach((d, i) => {
          const z = 1200 + i * 1000;
          if (z - scrollY > -1680 && !active) {
            active = d;
          }
        });
        setActiveLink(active);
      }
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
      <ThreeScroll />
    </div>
  );
}

export default App;
