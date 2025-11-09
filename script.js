let currentsong= new Audio();
let curfolder;
let fld;
let songs;

function formatTime(seconds) {

    if (isNaN(seconds)) {
        throw new Error("Input should be a number.");
    }
     seconds=Math.floor(seconds);
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');


    return `${paddedMinutes}:${paddedSeconds}`;
}



async function getsongs(folder){
    curfolder=folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}`)
    let response = await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith("mp3")){
            songs.push(element.href.split(`${folder}`)[1]);
        
        }
        
    }
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML="";
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML + ` <li><div class="info">
        <img class="invert" src="music.svg" alt="">
        <h5>${song}</h5>
    </div>
    <div class="playnow">
        <h5>Play Now</h5>
    <img class="invert" src="play2.svg" alt="">
</div>
    </li>`
        
    }
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").lastElementChild.innerHTML.trim());
        playmusic(e.querySelector(".info").lastElementChild.innerHTML.trim())

    })
});

   return songs
}
function playmusic(track,pause=false){
    currentsong.src=`${curfolder}`+track;
    if(!pause){
           currentsong.play();
    document.getElementById("play2").src="paused.svg"; 
    }

    document.querySelector(".songinfo").innerHTML=decodeURI(track) ;
    document.querySelector(".songtime").innerHTML="00:00/00:00";
   
}  
 async function displayalbum(){
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let anchors =div.getElementsByTagName("a");
    let array = Array.from(anchors);
    let cardcontainer=document.querySelector(".cardcontainer")
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs")){
          let foldername=e.href.split("/").slice(-2)[0];
          let a = await fetch(`http://127.0.0.1:3000/songs/${foldername}/info.json`)
          let response = await a.json();
          cardcontainer.innerHTML=cardcontainer.innerHTML+`
          <div data-folder="${foldername}"class="card">
          <div class="button2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="60" height="60">
                  <circle cx="50" cy="50" r="45" fill="rgb(30, 215, 96)"/>
                  <polygon points="35,25 75,50 35,75" fill="black"/>
                </svg>
          </div>
          <img src="/songs/${foldername}/cover.jpg" alt="">
          <h2>${response.Title}</h2>
          <p>${response.Description}</p>
      </div>`

          
        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async Object1 =>{
    console.log(Object1.currentTarget.dataset.folder)
             songs=await getsongs(`/songs/${Object1.currentTarget.dataset.folder}/`);
         playmusic(songs[0])
        })
     })
}



 async function main(){

await getsongs("/songs/silentsongs/");
    playmusic(songs[0],true)
  
   
displayalbum();
   
   play2.addEventListener("click",()=>{
    if(currentsong.paused){
        currentsong.play();
        document.getElementById("play2").src="paused.svg";
    }
    else{
        currentsong.pause();
        document.getElementById("play2").src="play2.svg";


    }
   })
   currentsong.addEventListener("timeupdate",()=>{
   document.querySelector(".songtime").innerHTML=`${formatTime(currentsong.currentTime)}/${formatTime(currentsong.duration)}`
   document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%";
   })
   document.querySelector(".line").addEventListener("click",e=>{
    let percentage=(e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left=percentage+"%";
    currentsong.currentTime=((currentsong.duration)*percentage)/100;

   })
   document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0px";
   })
   document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%";
   })
   let i=0;
   next.addEventListener("click",()=>{
  
    if(i<songs.length && i>=0){
        i++;
        playmusic(songs[i]);
        
    }
    

   })
   pre.addEventListener("click",()=>{
  
    if(i<songs.length && i>=0){
        i--;
        playmusic(songs[i]);
        
    }
    

   })
   document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
      currentsong.volume=parseInt(e.target.value)/100
      if (currentsong.volume>0){
      document.querySelector(".volume").getElementsByTagName("img")[0].src= document.querySelector(".volume").getElementsByTagName("img")[0].src.replace("mute.svg","volume.svg")}
   })
  document.querySelector(".volume").getElementsByTagName("img")[0].addEventListener("click",e=>{
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg")
          
          currentsong.volume=0
          document.querySelector(".volume").getElementsByTagName("input")[0].value=0
    }
    else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg")
        
        currentsong.volume=0.1
        document.querySelector(".volume").getElementsByTagName("input")[0].value=10
    }

  })
} 
main()
