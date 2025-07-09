import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CreatePaper from "./components/papers/CreatePaper";
import Home from "./components/pages/Home";
import PreviewPaper from "./components/pages/PreviewPaper";
import SavedPapers from "./components/pages/SavedPapers";
import Settings from "./components/pages/Settings";
import SubjectivePaper from "./components/papers/SubjectivePaper"; 
import ObjectivePaper from "./components/papers/ObjectivePaper"; 
import BothPaper from "./components/papers/Bothpaper";

function App() {
  return (
    <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preview-paper" element={<PreviewPaper />} />
          <Route path="/saved-papers" element={<SavedPapers />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/create-paper" element={<CreatePaper />} />
          <Route path="/subjective" element={<SubjectivePaper />} />
          <Route path="/objective" element={<ObjectivePaper />} />
          <Route path="/both" element={<BothPaper />} />
        </Routes>
    </div>
  );
}

export default App;
