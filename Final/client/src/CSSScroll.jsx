import React, { useRef, useEffect, useState } from "react";
import styles from "./CSSScroll.module.css";

import Piece1 from "./components/pieces/Piece1/Piece1";
import Piece2 from "./components/pieces/Piece2/Piece2";
import Piece3 from "./components/pieces/Piece3/Piece3";

const pieces = [
  {
    id: 1,
    content: <Piece1 />,
  },
  {
    id: 2,
    content: <Piece2 />,
  },
  {
    id: 3,
    content: <Piece3 />,
  },
];

function Piece({ z, cameraZ, children }) {
  const distance = z - cameraZ;

  let opacity = 1;

  // Fade when camera gets close and passes through
  if (distance < 1 && distance > -2) {
    if (distance <= 0) {
      opacity = Math.max(0, 1 - Math.abs(distance) / 2);
    }
  }
  if (distance < -2) {
    opacity = 0;
  }

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: "50vw",
        height: "50vh",
        transform: `translate(-50%, -50%) translateZ(${z}px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.95)",
        color: "#000",
        borderRadius: "0px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        opacity: opacity,
        transition: "opacity 0.1s",
      }}
    >
      {children}
    </div>
  );
}

export default function ThreeScroll() {
  const [cameraZ, setCameraZ] = useState(-200);
  const scrollRef = useRef(-200);
  const spacing = 1000;
  const minZ = -(pieces.length - 1) * spacing - 700;
  const maxZ = -200;

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onWheel = (e) => {
      e.preventDefault();
      scrollRef.current -= e.deltaY;
      scrollRef.current = Math.max(minZ, Math.min(maxZ, scrollRef.current));
      setCameraZ(scrollRef.current);
    };

    const onKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        scrollRef.current += 50;
      } else if (e.key === "ArrowDown") {
        scrollRef.current -= 50;
      }
      scrollRef.current = Math.max(minZ, Math.min(maxZ, scrollRef.current));
      setCameraZ(scrollRef.current);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [minZ, maxZ]);

  return (
    <div className={styles.container}>
      {/* <div className={styles.infoBox}>
        Scroll down to move forward through the pieces
        <br />
        Camera Z: {cameraZ.toFixed(0)}
        <br />
        Piece positions: -500, -2500, -4500
      </div> */}

      <div className={styles.perspectiveWrap}>
        <div
          className={styles.preserve3dWrap}
          style={{ transform: `translateZ(${-cameraZ}px)` }}
        >
          {pieces.map((piece, i) => (
            <Piece key={piece.id} z={-200 - i * spacing} cameraZ={cameraZ}>
              {piece.content}
            </Piece>
          ))}
        </div>
      </div>
    </div>
  );
}
