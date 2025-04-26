import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Balloon {
  id: number;
  letter: string;
  image: string;
  letterImage: string;
  x: number;
  y: number;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Mapping for the letter images (ensure the images exist in your assets folder)
const LETTER_IMAGE_MAP: { [key: string]: string } = {
  A: "Symbol 10001.png",
  B: "Symbol 10002.png",
  C: "Symbol 10003.png",
  D: "Symbol 10004.png",
  E: "Symbol 10005.png",
  F: "Symbol 10006.png",
  G: "Symbol 10007.png",
  H: "Symbol 10008.png",
  I: "Symbol 10009.png",
  J: "Symbol 10010.png",
  K: "Symbol 10011.png",
  L: "Symbol 10012.png",
  M: "Symbol 10013.png",
  N: "Symbol 10014.png",
  O: "Symbol 10015.png",
  P: "Symbol 10016.png",
  Q: "Symbol 10017.png",
  R: "Symbol 10018.png",
  S: "Symbol 10019.png",
  T: "Symbol 10020.png",
  U: "Symbol 10021.png",
  V: "Symbol 10022.png",
  W: "Symbol 10023.png",
  X: "Symbol 10024.png",
  Y: "Symbol 10025.png",
  Z: "Symbol 10026.png",
};

function App() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [targetLetter, setTargetLetter] = useState<string>(""); 
  const [score, setScore] = useState(0);
  const [correctPops, setCorrectPops] = useState(0);  // Count correct pops
  const [gameOver, setGameOver] = useState(false);  // Game Over Flag
  const containerRef = useRef<HTMLDivElement>(null);

  const popSound = new Audio("/assets/pop.mp3");
  const inflateSound = new Audio("/assets/inflate.mp3");
  const gameMusic = new Audio("/assets/game_music.mp3");

  useEffect(() => {
    generateBalloons();
    gameMusic.loop = true;
    gameMusic.volume = 0.4;
    gameMusic.play().catch((e) => console.log("Autoplay Blocked"));
  }, []);

  useEffect(() => {
    if (correctPops >= 10) {
      setGameOver(true);  // End the game after 10 correct pops
    }
  }, [correctPops]);

  const generateBalloons = () => {
    const shuffled = LETTERS.sort(() => 0.5 - Math.random()).slice(0, 10);
    const newBalloons = shuffled.map((letter, index) => ({
      id: Date.now() + index,
      letter,
      image: `/assets/balloons/balloon (${(index % 10) + 1}).png`,
      letterImage: `/assets/letters/${LETTER_IMAGE_MAP[letter]}`,
      x: Math.random() * 500,
      y: Math.random() * 400,
    }));
    setBalloons(newBalloons);
    setTargetLetter(shuffled[Math.floor(Math.random() * shuffled.length)]);
  };

  const handlePop = (id: number, letter: string) => {
    if (letter === targetLetter) {
      setScore((prev) => prev + 1);
      setCorrectPops((prev) => prev + 1);
      popSound.play();
      generateBalloons(); // Generate new balloons and a new target letter
    } else {
      setScore((prev) => (prev > 0 ? prev - 1 : 0)); // Wrong pop - optional
    }
    setBalloons((prev) => prev.filter((balloon) => balloon.id !== id)); // Remove popped balloon
  };

  const handlePump = () => {
    inflateSound.play();
    generateBalloons();  // Restart the game after reset
    setScore(0);
    setCorrectPops(0);
    setGameOver(false);
  };

  return (
    <div className="game-container" ref={containerRef}>
      <div className="hud">
        <h1 className="title">🎈 Alphabet Balloon Blast 🎈</h1>
        <h2 className="target">
          Target Letter: <span className="highlight">{targetLetter}</span>
        </h2>
        <h2 className="score">Score: {score}</h2>
        {gameOver && (
          <button className="reset-button" onClick={handlePump}>
            Restart Game
          </button>
        )}
      </div>

      <img src="/assets/pop.png" className="machine" alt="Machine" />
      <img
        src="/assets/machine.png"
        className="pump"
        alt="Pump"
        onClick={handlePump}
      />

      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="balloon"
          style={{ transform: `translate(${balloon.x}px, ${balloon.y}px)` }}
          onClick={() => handlePop(balloon.id, balloon.letter)}
        >
          <img
            src={balloon.image}
            className="balloon-img floating"
            alt="Balloon"
          />
          <img
            src={balloon.letterImage}
            className="letter-img"
            alt={balloon.letter}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
