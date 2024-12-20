console.log("yeyyyyy")


let currentSong = new Audio();

function convertToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60); // Calculate minutes
    const remainingSeconds = Math.floor(seconds % 60);   // Calculate seconds
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`; // Pad seconds if less than 10
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/assets/songs/", { mode: 'no-cors' })
    let response = await a.text()
    // console.log(a)
    // console.log(response)

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}


const playMusic = (track, pause=false) => {
    // let audio = new Audio("/assets//songs/" + track + ".mp3")
    if (track.endsWith(".mp3")) {
        currentSong.src = "/assets//songs/" + track
    }else {
        currentSong.src = "/assets//songs/" + track + ".mp3"
    }

    if (!pause) {
        currentSong.play();
        play.src = "assets/musicplay/playbutton.svg"
    }
    
    
    document.querySelector("#songName").innerHTML = decodeURI(track.split("-")[1].split(".")[0])
    document.querySelector("#songArtist").innerHTML = decodeURI(track.split("-")[0])
    document.querySelector(".currenttime").innerHTML  = "00:00"
    document.querySelector(".totaltime").innerHTML = "00:00"
    
}

async function main() {
    
    // get the list of all songs 
    let songs = await getSongs()

    playMusic(songs[1], true)


    // Show all the songs in the playlist
    let songUl = document.querySelector(".songs-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songArr = song.replaceAll("%20", " ").split("-")
        songUl.innerHTML += `<li>
        <img src="assets/music.svg" alt="music">
                        <div class="song-info">
                            <div>${songArr[1].split(".")[0]}</div>
                            <div>${songArr[0]}</div>
                        </div>
                        <p>Play now</p>
                        <img src="assets/musicplay/pausebutton.svg" alt="">
        
        </li>` 
    }


    // Attach an event listener to each song

    Array.from(document.querySelector(".songs-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", ()=>{       
            playMusic(e.querySelector(".song-info").getElementsByTagName("div")[1].innerHTML + "- " +e.querySelector(".song-info").getElementsByTagName("div")[0].innerHTML.trim())
        })
    });


    // Atttach event listener to play,previous,next
    let previous = document.querySelector("#previous")

    let playbutton = document.querySelector("#play")
    playbutton.addEventListener("click", () => {
        if (currentSong.paused){
            currentSong.play()
            playbutton.src = "assets/musicplay/playbutton.svg"
        }else{
            currentSong.pause()
            playbutton.src = "assets/musicplay/pausebutton.svg"
        }
    })

    





    // Listent for timeupdate event 
    currentSong.addEventListener("timeupdate", () =>{
        console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".currenttime").innerHTML  = `${convertToMinutesSeconds(currentSong.currentTime)}`
        document.querySelector(".totaltime").innerHTML = `${convertToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration)*100 + "%"
    })





    // Adding event listener to seek bar
    document.querySelector(".play").addEventListener("click", (e) => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = (percent + "%")
        currentSong.currentTime = (currentSong.duration * percent )/100
    })

    document.querySelector(".circle").addEventListener("seeked", (e) => {
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left = (percent + "%")
        currentSong.currentTime = (currentSong.duration * percent )/100
    })
}

main()  
