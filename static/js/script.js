/* --- 1. 自定义配置区 (Modify This Area) --- */

// 背景音乐播放列表 (可以添加 MP3 文件的 URL)
const playlist = [
    {
        title: "最重要的小事-五月天",
        src: "static/music/最重要的小事_五月天.mp3" 
    },
    {
        title: "步步-五月天",
        src: "static/music/步步-五月天.mp3"
    }
];

// 打字机显示的文字
const typingText = "Embedding intelligence into reality...";


/* --- 2. 核心逻辑代码 --- */

// --- 打字机效果 ---
const typeWriterElement = document.getElementById('typewriter');
let typeIndex = 0;

function typeWriter() {
    if (typeIndex < typingText.length) {
        typeWriterElement.innerHTML += typingText.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 100);
    }
}
// 页面加载后启动打字
window.addEventListener('load', typeWriter);


// --- 页面跳转与滚动 ---
function scrollToSection(id) {
    const element = document.getElementById(id);
    if(element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// 滚动监听 (动画效果)
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

let currentTrackIndex = 0;
let isPlaying = false;

// 初始化播放器
function loadTrack(index) {
    audio.src = playlist[index].src;
    songTitle.innerText = playlist[index].title;
}

// 播放音乐
function playMusic() {
    // 浏览器可能会拦截自动播放，需要用户交互捕获错误
    audio.play().then(() => {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }).catch(error => {
        console.log("等待用户交互以播放音乐");
    });
}

// 暂停音乐
function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// 切换静音
muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    if(audio.muted) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute" style="color:#ff4d4d"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
});

// 播放/暂停按钮点击
playBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

// 下一首
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    loadTrack(currentTrackIndex);
    if(isPlaying) playMusic();
}

// 上一首
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrackIndex);
    if(isPlaying) playMusic();
}

nextBtn.addEventListener('click', nextTrack);
prevBtn.addEventListener('click', prevTrack);

// 自动循环播放：当一首结束后自动播下一首
audio.addEventListener('ended', nextTrack);

// 初始化加载第一首
loadTrack(currentTrackIndex);
// 设置默认音量
audio.volume = 0.5;


// --- 导航栏滚动监听 (Scroll Spy) ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-btn');

window.addEventListener('scroll', () => {
    let current = '';
    
    // 遍历所有板块，判断当前视口在哪里
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // -150 是为了提前一点点触发高亮，体验更好
        if (scrollY >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    // 移除所有 active，给当前对应的加 active
    navLinks.forEach(link => {
        link.classList.remove('active');
        // 检查链接 href 是否包含当前板块 id
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});
