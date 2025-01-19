import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import withAuthentication from "./components/withAuthentication";
import StudySetsPage from "./pages/StudySetsPage";
import StudySetDetailPage from "./pages/StudySetDetail";
import StudySessionPage from "./pages/StudySessionPage";

const ProtectedUpload = withAuthentication(Upload);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<ProtectedUpload />} />
          <Route path="/study-sets" element={<StudySetsPage />} />
          <Route
            path="/study-set/:studySetId"
            element={<StudySetDetailPage />}
          />
          <Route
            path="/study-set/:studySetId/study-session"
            element={<StudySessionPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
