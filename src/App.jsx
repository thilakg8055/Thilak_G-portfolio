import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import BootLoader from "./components/robotics/BootLoader";
import RoboCursor from "./components/robotics/RoboCursor";
import NeuralBackground from "./components/robotics/NeuralBackground";
import ScrollHUD from "./components/robotics/ScrollHUD";
import "./index.css";

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="grain scanlines">
      <BootLoader onDone={() => setBooted(true)} />
      <RoboCursor />
      <NeuralBackground />
      <Navbar ready={booted} />
      <main className="relative">
        <Hero ready={booted} />
        <Work />
        <Experience />
        <Skills />
        <Contact />
      </main>
      {booted && <ScrollHUD />}
    </div>
  );
}
