import { useState } from "react"
import LoggedInContainer from "../containers/LoggedInContainer"
import { Icon } from "@iconify/react"
import { makeAuthenticatedGETRequest } from "../utils/ServerHelper";
import SingleSongCard from "../components/shared/SingleSongCard";

const SearchPage = () =>{
    const [isInputFocused,setIsInputFocused] = useState(false);
    const [searchText,setSearchText] = useState("");
    const [songData,setSongData] = useState([]);
    console.log(searchText);
    
    const searchSong = async () =>{
       const response = await makeAuthenticatedGETRequest(
       "/song/get/songname/" + searchText);
       console.log(response);
       setSongData(response.data);
      //  setSearchText("");
    }

   return(
    <LoggedInContainer currActiveScr={"search"}>
       <div className="w-full py-4">
        <div className={`w-1/3 p-3 text-sm rounded-full bg-gray-800 px-5 flex text-white space-x-3 items-center ${isInputFocused ? "border border-white":""}`}>
          <Icon icon="ic:outline-search" className="text-lg"/>
        <input
          type="text"
          placeholder="What do you want to listen to?"
          className="w-full bg-gray-800 focus:outline-none"
          onFocus={()=>{
            setIsInputFocused(true);
          }}
          onBlur={()=>{
            setIsInputFocused(false);
          }}
          value={searchText}
          onChange={(e)=>{
            setSearchText(e.target.value)
          }}
          onKeyDown={(e)=>{
            if(e.key==="Enter"){
               searchSong();
            }
          }}
          />
          </div>
          {songData.length > 0 ? (
          <div className="pt-10 space-y-3"> 
          <div className="text-white">Shwoing search result for <span className="font-bold">{searchText}</span></div>
          {songData.map((item) => {
                    return <SingleSongCard info={item} key={JSON.stringify(item)} playSound={()=>{}}/>;
                })}
          </div>
          ):(
            <div className="text-gray-500 pt-10">
              Nothing to show here.
            </div>
          )
          }
       </div>
    </LoggedInContainer>
   )
}
export default SearchPage