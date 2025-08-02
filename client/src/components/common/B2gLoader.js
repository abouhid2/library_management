const B2gLoader = () => {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{`
        .cover-left, .cover-right {
          transform-origin: center bottom;
          transform-box: fill-box;
        }
        .cover-left {
          animation: openLeft 1s ease-in-out infinite alternate;
        }
        .cover-right {
          animation: openRight 1s ease-in-out infinite alternate;
        }
        @keyframes openLeft {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(-40deg); }
        }
        @keyframes openRight {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(40deg); }
        }
      `}</style>

      {/* Left Cover */}
      <rect
        x="30"
        y="50"
        width="50"
        height="100"
        rx="5"
        ry="5"
        fill="#3b2a1a"
        className="cover-left"
      />
      {/* Right Cover */}
      <rect
        x="120"
        y="50"
        width="50"
        height="100"
        rx="5"
        ry="5"
        fill="#3b2a1a"
        className="cover-right"
      />
      {/* Spine */}
      <rect x="80" y="50" width="40" height="100" fill="#3b2a1a" />
      {/* Text */}
      <text
        x="55"
        y="115"
        fontSize="36"
        fill="white"
        fontFamily="Georgia, serif"
      >
        B
      </text>
      <text
        x="95"
        y="115"
        fontSize="28"
        fill="white"
        fontFamily="Georgia, serif"
      >
        2
      </text>
      <text
        x="145"
        y="115"
        fontSize="36"
        fill="white"
        fontFamily="Georgia, serif"
      >
        G
      </text>
    </svg>
  );
};

export default B2gLoader;
