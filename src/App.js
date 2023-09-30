import "./output.css"
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginComponent from "./routes/Login";
import SignupComponent from "./routes/Signup";
import HomeComponent from "./routes/Home";
import { useCookies } from "react-cookie";
import LoggedInHome from "./routes/LoggedInHome";
import UploadSong from "./routes/UploadSong";
import Mymusic from "./routes/Mymusic";
import { useState } from "react";
import songContext from "./contexts/songContext";
import SearchPage from "./routes/SearchPage";
import Library from "./routes/Library";
import SinglePlaylistView from "./routes/SinglePlayListView";

function App() {
  const [currentSong,setCurrentSong] = useState(null);
  const [cookie,setCookie] = useCookies(["token"]);
  const[soundPlayed,setSoundPlayed] = useState(null);
  const [isPaused,setIsPaused] = useState(true);
  console.log(cookie);
  return (
    <div className="w-screen h-screen font-poppins">
      <BrowserRouter>
      {cookie.token?(
        //Logged in routes
        <songContext.Provider value={{currentSong,setCurrentSong,soundPlayed,setSoundPlayed,isPaused,setIsPaused}}>
        <Routes> 
        <Route path ="/" element={<LoggedInHome/>}/>
        <Route path="/home" element={<LoggedInHome/>}/>
        <Route path="/uploadSong" element={<UploadSong/>}/>
        <Route path="/mymusic" element={<Mymusic/>}/>
        <Route path="/search" element={<SearchPage/>}/>
        <Route path="/library" element={<Library/>}/>
        <Route path="/playlist/:playlistId" element={<SinglePlaylistView/>} />
        <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
        </songContext.Provider>
      ):(
        //Logged out routes
        <Routes>
            <Route path="/home" element={<HomeComponent/>}/>
            <Route path ="/login" element={<LoginComponent/>}/>
            <Route path="/signup" element={<SignupComponent/>}/>
            <Route path="*" element={<Navigate to="/home"/>}/>
        </Routes>
      )
      }
      </BrowserRouter>
    </div>
  );
}

export default App;
