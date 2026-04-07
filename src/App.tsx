import { HashRouter as Router, Routes, Route } from "react-router-dom";

import MainLayout from "@/components/Layout/MainLayout";
import FileHistory from "@/pages/FileHistory";
import FileRequest from "@/pages/FileRequest";
import Home from "@/pages/Home";
import LinkManagement from "@/pages/LinkManagement";
import LinkDetail from "@/pages/LinkManagement/LinkDetail";
import ReceiveFile from "@/pages/ReceiveFile";
import SearchResults from "@/pages/SearchResults";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/receiveFile"
            element={<ReceiveFile />}
          />
          <Route
            path="/linkManagement"
            element={<LinkManagement />}
          />
          <Route
            path="/linkdetail/:uniqueUrl"
            element={<LinkDetail />}
          />
          <Route
            path="/fileHistory"
            element={<FileHistory />}
          />
          <Route
            path="/fileRequest"
            element={<FileRequest />}
          />
          <Route
            path="/searchResults"
            element={<SearchResults />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
