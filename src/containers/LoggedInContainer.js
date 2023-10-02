import spotify_logo from"../assest/images/spotify_logo_white.svg"
import IconText from "../components/shared/IconText"
import {Icon} from "@iconify/react"
import TextWithHover from "../components/shared/TextWithHover"
import {useRef, useState } from "react";
import {Howl} from 'howler';
import { useContext ,useLayoutEffect} from "react";
import songContext from "../contexts/songContext";
import { useNavigate } from "react-router-dom";
import CreatePlaylist from "../modals/CreatePlaylist";
import AddToPlaylist from "../modals/AddToPlaylist";
import { makeAuthenticatedPOSTRequest } from "../utils/ServerHelper";


const LoggedInContainer = ({children,  currActiveScr})=>{
  const [createPlaylistOpen,setCreatePlaylistOpen] = useState(false);
  const [addToPlaylistOpen,setAddToPlaylistOpen] = useState(false);
  const {currentSong,setCurrentSong,soundPlayed,setSoundPlayed,isPaused,setIsPaused} = useContext(songContext);
  const navigate = useNavigate();

  const firstUpdate = useRef(true);

  const [userData,setUserData] = useState([]);
  useEffect(()=>{
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest(
        "/playlist/get/userDetails"
      )
      // console.log(response);
      setUserData(response.data);
    }
    getData();
   },[])

  useLayoutEffect(()=>{
    if(firstUpdate.current)
    {
      firstUpdate.current = false;
      return;
    }
    if(!currentSong){
      return;
    }
    changeSong(currentSong.track);
  },[currentSong && currentSong.track]);

  const addSongToPlaylist = async (playlistId) => {
    const songId = currentSong._id;

    const data = {playlistId, songId};
    const response = await makeAuthenticatedPOSTRequest(
        "/playlist/add/song",
        data
    );
    if(response.data._id){
        setAddToPlaylistOpen(false);
    }
};
  

  const playSound = () =>{
    if(!soundPlayed){
      return;
    }
    soundPlayed.play();
  }

  const changeSong = (src) => {
    if(soundPlayed){
      soundPlayed.stop();
      
    }
    let sound = new Howl({
      src:[src],
      html5: true,
    });
    setSoundPlayed(sound);
    sound.play();
    setIsPaused(false);
  }

  const pauseSound = () =>{
     soundPlayed.pause();
  }

  const togglePlaySound = () =>{
    if(isPaused){
      playSound(currentSong.track);
      setIsPaused(false);
    }
    else{
      pauseSound();
      setIsPaused(true);
    }
  }

  const nav = (param) => {
    navigate(param);
  };
 
   return (
   <div className="h-full w-full bg-app-black">
    {createPlaylistOpen && <CreatePlaylist closeModal={()=>{setCreatePlaylistOpen(false)}}/>}
    {addToPlaylistOpen && <AddToPlaylist closeModal={()=>{setAddToPlaylistOpen(false)}} addSongToPlaylist={addSongToPlaylist}/>}
    <div className={`${currentSong? "h-9/10" : "h-full"} w-full flex`}> 
       <div className="h-full w-1/5 bg-black flex flex-col justify-between pb-10   ">
         <div>   
          <div className="logoDiv p-6">
            <img src={spotify_logo} alt="spotify logo" width={125 }/>
          </div>
          <div className="py-5">
            <IconText iconName={"material-symbols:home"} displayText = {"Home"} active={currActiveScr === "Home"} targetLink={"/home"}/>
            <IconText iconName={"material-symbols:search-rounded"} displayText = {"Search"} active={currActiveScr === "search"} targetLink={"/search"}/>
            <IconText iconName={"mdi:bookshelf"} displayText = {"Library"} active={currActiveScr==="library"} targetLink={"/library"}/>
            <IconText iconName={"entypo:music"} displayText = {"My music"} active={currActiveScr === "mymusic"}  targetLink={"/mymusic"}/>
          </div>
          <div className="pt-5">
          <IconText iconName={"material-symbols:add-box"} displayText = {"Create Playlist"} onClick={()=>{setCreatePlaylistOpen(true)}}/>
          <IconText iconName={"mdi:cards-heart"} displayText = {"Liked Songs"}/>
          </div>
         </div>
          <div className="px-5">
                    <div className="border border-gray-400 text-white w-2/5 flex px-2 py-1 rounded-full items-center justify-center hover:border-white cursor-pointer">
                        <Icon icon="carbon:earth-europe-africa" />
                        <div className="ml-2 text-sm font-semibold">
                            English
                        </div>
                    </div>
                </div>
       </div>

       <div className="h-full w-4/5 bg-app-black overflow-auto">
        <div className="navbar w-full h-1/10 bg-black bg-opacity-30 flex items-center justify-end">
          <div className="w-1/2 flex h-full">
            <div className="w-2/3 flex justify-around items-center">
             <TextWithHover displayText={"Premium"}/>
             <TextWithHover displayText={"Support"}/>
             <TextWithHover displayText={"Download"}/>
             <div className="h-1/2 border-r border-white"></div>
            </div>
            <div className="w-1/3 flex justify-around h-full items-center">
             <TextWithHover displayText={"Upload Song"} onClick={()=> nav('/uploadsong')}/>
             <div className="bg-white w-10 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer">
             {(userData.firstName).substring(0,1)+(userData.lastName).substring(0,1)}
              </div>
            </div>
          </div>
        </div>
        <div className="content p-8 pt-0 overflow-auto">
          {children}
        </div>
       </div>
      </div>
      {/* This div is the current playing song */}
      {
        currentSong &&
        <div className="w-full h-1/10 flex bg-black bg-opacity-30 text-white flex items-center px-4">
          <div className="w-1/4 flex items-center">
           <img src={currentSong.thumbnail}
           alt="CurrentSong Thumbnail"
           className="h-14 w-14 rounded"
           />
           <div className="pl-4">
            <div className="text-sm hover:underline cursor-pointer">{currentSong.name}</div>
            <div className="text-xs text-gray-500 hover:underline cursor-pointer">{currentSong.artist.firstName + " " + currentSong.artist.lastName}</div>
           </div>
           </div>
           <div className="w-1/2 flex justify-center h-full flex-col items-center">
            <div className="flex w-1/3 justify-between items-center">
               <Icon 
               icon="ph:shuffle-fill"  
               fontSize={30} 
               className="cursor-pointe text-gray-500 hover:text-white"
               />
               <Icon 
               icon="mdi:skip-previous-outline" 
               fontSize={30} 
               className="cursor-pointe text-gray-500 hover:text-white"
               />
               <Icon 
               icon={isPaused?"ic:baseline-play-circle":"ic:baseline-pause-circle"} 
               fontSize={45} 
               className="cursor-pointe text-gray-500 hover:text-white" 
               onClick={togglePlaySound}
               />
               <Icon 
               icon="mdi:skip-next-outline" 
               fontSize={30} 
               className="cursor-pointe text-gray-500 hover:text-white"
               />
               <Icon 
               icon="ic:twotone-repeat" 
               fontSize={30} 
               className="cursor-pointe text-gray-500 hover:text-white"
               />
            </div>
            {/* <div>Progress Bar</div> */}
           </div>
           <div className="w-1/4 flex justify-end pr-4 space-x-4">
           <Icon icon="ic:round-playlist-add"
            fontSize={30} 
            className="cursor-pointe text-gray-500 hover:text-white"
            onClick={()=>{setAddToPlaylistOpen(true)}}
            />
            <Icon icon="ph:heart-bold"
            fontSize={30} 
            className="cursor-pointe text-gray-500 hover:text-white"
            />
           </div>
        </div>
        }
    </div>
    )
}



export default LoggedInContainer
