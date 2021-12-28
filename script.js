const player = document.querySelector('.player');
const video = document.querySelector('.video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const speed = document.querySelector('.player-speed');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const repeat = document.getElementById('repeat');
const arrowNext = document.getElementById('arrownext');
// Video

const videoLists = [
    {
        name: 'video1'
    },

    {
        name: 'video(2)'
    },
    {
        name: 'video(3)'
    },
    {
        name: 'video(4)'
    },


];
// Play & Pause ----------------------------------- //

// Repeat Video
let repeatButton = false;
let updateArrow = true;
function repeatVideo() {
    repeatButton = true;
    updateArrow = false;
    arrowNext.style.color = "white";
    repeat.style.color = "var(--primary-color)";
}



function showPlayIcon() {
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
}
function togglePlay() {
    if (video.paused) {
        playBtn.classList.replace('fa-play', 'fa-pause');
        playBtn.setAttribute('title', 'Pause');
        video.play();
    }
    else {
        video.pause();
        showPlayIcon();
    }
}


// update Dom
let videoIndex = 0;

function loadVideo(videoList) {
    video.src = `video/${videoList.name}.mp4`;
    video.play();
}

function updateArrowNext() {
    repeatButton = false;
    arrowNext.style.color = "var(--primary-color)";
    repeat.style.color = "white";
    updateArrow = true;
}

function playNext() {

    videoIndex++;
    if (videoIndex > videoLists.length - 1) {
        videoIndex = 0;
    }
    loadVideo(videoLists[videoIndex]);
    playBtn.classList.replace('fa-play', 'fa-pause');
    video.play();
}
let next = false;
function nextVideo() {
    next = true;
    if (repeatButton === false && next === false) {
        playNext()
    }
    if (next === true) {
        playNext()
    }


}
function prevVideo() {
    videoIndex--;
    if (videoIndex < 0) {
        videoIndex = videoLists.length - 1;
    }
    loadVideo(videoLists[videoIndex]);
    playBtn.classList.replace('fa-play', 'fa-pause');
    video.play();
}

// Progress Bar ---------------------------------- //

// Calculate display time format
function displayTime(time) {
    const minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    seconds = seconds > 9 ? seconds : `0${seconds}`;
    return `${minutes}:${seconds}`
}

//update Progress bar as video plays
function updateProgress(e) {
    if (video.currentTime) {
        currentTime.textContent = `${displayTime(video.currentTime)} / `;
        duration.textContent = `${displayTime(video.duration)}`
    }
    progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;

    if (video.currentTime == video.duration) {
        //nextVideo(); 
        if (updateArrow) {
            videoIndex++;
            if (videoIndex > videoLists.length - 1) {
                videoIndex = 0;
            }
            loadVideo(videoLists[videoIndex]);
        }

        if (repeatButton) {
            loadVideo(videoLists[videoIndex]);
        }
    }
}

// Click to seek within the video

function setProgress(e) {
    const newTime = e.offsetX / progressRange.offsetWidth;
    progressBar.style.width = `${newTime * 100}%`;
    video.currentTime = newTime * video.duration;
    console.log(newTime);
}

// Volume Controls --------------------------- //
let lastVolume = 1;


// Volume Bar
function changeVolume(e) {
    let volume = e.offsetX / volumeRange.offsetWidth;
    if (volume < 0.1) {
        volume = 0;
    }
    if (volume > 0.9) {
        volume = 1;
    }
    volumeBar.style.width = `${volume * 100}%`;
    video.volume = volume;
    // Change Ion depending on volume
    volumeIcon.className = '';
    if (volume > 0.7) {
        volumeIcon.classList.add('fas', 'fa-volume-up');
    } else if (volume < 0.7 && volume > 0) {
        volumeIcon.classList.add('fas', 'fa-volume-down');
    } else if (volume === 0) {
        volumeIcon.classList.add('fas', 'fa-volume-off');
    }
    lastVolume = volume;
}

// Mute/Unmute
function toggleMute() {
    volumeIcon.className = '';
    if (video.volume) {
        lastVolume = video.volume;
        video.volume = 0;
        volumeBar.style.width = 0;
        volumeIcon.classList.add('fas', 'fa-volume-mute');
        volumeIcon.setAttribute('title', 'Unmute');
    } else {
        video.volume = lastVolume;
        volumeBar.style.width = `${lastVolume * 100}%`;
        volumeIcon.classList.add('fas', 'fa-volume-up');
        volumeIcon.setAttribute('title', 'Mute');
    }

}


// Change Playback Speed -------------------- //
function changeSpeed() {
    video.playbackRate = speed.value;
}


// Fullscreen ------------------------------- //

/* View in fullscreen */
function openFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        /* Firefox */
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        /* IE/Edge */
        element.msRequestFullscreen();
    }
    video.classList.add('video-fullscreen');
}

/* Close fullscreen */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
    }
    video.classList.remove('video-fullscreen');
}



let fullscreen = false;

// Toggle Fullscreen
function toggleFullscreen() {
    if (!fullscreen) {
        openFullscreen(player);
    } else {
        closeFullscreen();
    }
    fullscreen = !fullscreen;
}


// Event Listener

video.addEventListener('click', togglePlay);
playBtn.addEventListener('click', togglePlay);
nextBtn.addEventListener('click', nextVideo);
prevBtn.addEventListener('click', prevVideo);
video.addEventListener('ended', showPlayIcon);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);
repeat.addEventListener('click', repeatVideo);
arrowNext.addEventListener('click', updateArrowNext);