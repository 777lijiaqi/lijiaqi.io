/* --- static/js/script.js --- */

/* --- 1. 配置区 --- */
const playlist = [
    { title: "最重要的小事-五月天", src: "static/music/最重要的小事_五月天.mp3" },
    { title: "步步-五月天", src: "static/music/步步-五月天.mp3" }
];

const typingText = "Embedding intelligence into reality...";

/* --- 2. 核心逻辑 --- */

// --- 打字机效果 ---
const typeWriterElement = document.getElementById('typewriter');
let typeIndex = 0;

function typeWriter() {
    if (typeWriterElement && typeIndex < typingText.length) {
        typeWriterElement.innerHTML += typingText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 100);
    }
}
window.addEventListener('load', typeWriter);

// --- 页面跳转与滚动 (关键修改：增加 Hash 更新) ---
function scrollToSection(id) {
    const element = document.getElementById(id);
    if(element) {
        // 1. 平滑滚动
        const headerOffset = 80; // 导航栏高度补偿
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        // 2. 手动更新 URL 参数 (Hash)
        if(history.pushState) {
            history.pushState(null, null, '#' + id);
        }
    }
}

// --- 滚动监听 (Scroll Spy) & URL 自动更新 ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-btn');

window.addEventListener('scroll', () => {
    let current = '';
    
    // 遍历板块确定当前位置
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // -150 是为了提前一点触发
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    // 1. 导航栏高亮
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });

    // 2. 【核心新增】滚动时静默更新 URL Hash
    // 使用 replaceState 不会产生废弃的历史记录堆栈
    if (current && window.location.hash !== '#' + current) {
        if(history.replaceState) {
            history.replaceState(null, null, '#' + current);
        }
    }
});

// --- 页面加载时处理 Hash 定位 (解决导航栏遮挡问题) ---
window.addEventListener('DOMContentLoaded', () => {
    if (window.location.hash) {
        const id = window.location.hash.substring(1); // 去掉 #
        setTimeout(() => {
            scrollToSection(id);
        }, 100); // 稍微延迟等待布局稳定
    }
});

// --- 滚动监听 (动画效果) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// --- 音乐播放器逻辑 ---
const audio = document.getElementById('bg-music');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const muteBtn = document.getElementById('mute-btn');
const songTitle = document.getElementById('song-title');

if(audio && playBtn) {
    let currentTrackIndex = 0;
    let isPlaying = false;

    function loadTrack(index) {
        audio.src = playlist[index].src;
        songTitle.innerText = playlist[index].title;
    }

    function playMusic() {
        audio.play().then(() => {
            isPlaying = true;
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(error => { console.log("等待交互播放"); });
    }

    function pauseMusic() {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.innerHTML = audio.muted ? 
            '<i class="fas fa-volume-mute" style="color:#ff4d4d"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    });

    playBtn.addEventListener('click', () => {
        isPlaying ? pauseMusic() : playMusic();
    });

    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if(isPlaying) playMusic();
    }

    function prevTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if(isPlaying) playMusic();
    }

    nextBtn.addEventListener('click', nextTrack);
    prevBtn.addEventListener('click', prevTrack);
    audio.addEventListener('ended', nextTrack);

    loadTrack(currentTrackIndex);
    audio.volume = 0.5;
}