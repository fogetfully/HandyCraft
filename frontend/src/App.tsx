import { Navigate, Route, Routes } from "react-router";
import Header from "./components/Header";

import PostsPage from "./pages/PostsPage";
import PostsDetailPage from "./pages/PostsDetailPage";
import ChatsPage from "./pages/ChatsPage";
import ChatDetailPage from "./pages/ChatDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AddPostPage from "./pages/AddPostPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";


function App() {


  return (
    <div>
      <Header/>
      <Routes>

          <Route path={"/"} element={<Navigate to={"/posts"} replace />} />
          <Route path={"posts"} element={< PostsPage />} />
          <Route path={"posts/:id"} element={< PostsDetailPage />} />
          <Route path={"chats"} element={< ChatsPage />} />
          <Route path={"chats/:id"} element={< ChatDetailPage />} />
          <Route path={"profile"} element={< ProfilePage />} />
          <Route path={"add-post"} element={< AddPostPage />} />

          <Route path={"register"} element={< RegisterPage />} />
          <Route path={"login"} element={< LoginPage />} />

          <Route path={"*"} element={<h2>Not found!</h2>} />

      </Routes>
    </div>
  );
}

export default App;