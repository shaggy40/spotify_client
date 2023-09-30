
import SingleSongCard from "../components/shared/SingleSongCard"
import { useState, useEffect } from "react"
import { makeAuthenticatedGETRequest } from "../utils/ServerHelper"

import LoggedInContainer from "../containers/LoggedInContainer"

const Mymusic = () =>{
  const [songData,setSongData] = useState([]);
     useEffect(()=>{
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest(
        "/song/get/mysongs"
      )
      // console.log(response);
      setSongData(response.data);
    }
    getData();
   },[])

  return(
    <LoggedInContainer currActiveScr={"mymusic"}>
      <div className="text-white text-xl font-semibold pb-4 pl-2 pt-8">
                 My Songs
             </div>
           <div className="space-y-3 overflow-auto">
             {songData.map((item) => {
                    return <SingleSongCard key={JSON.stringify(item)} info={item} playSound={()=>{}}/>;
                })}
                
            </div>
    </LoggedInContainer> 
  )
}


export default Mymusic
