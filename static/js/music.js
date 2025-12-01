/* --- static/js/music.js --- */
/* 音乐播放器核心逻辑 - 支持多页面记忆播放 */

document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 定义播放列表 (注意：src 只需要写文件名，路径由下面的逻辑自动处理)
    const playlistData = [
        { title: "最重要的小事-五月天", file: "最重要的小事_五月天.mp3" },
        { title: "步步-五月天", file: "步步-五月天.mp3" }
    ];

    // 2. 获取当前页面的路径前缀 (由 HTML 定义的 ROOT_PATH 决定，如果没有则默认为 ./)
    // 根目录 index.html -> ./static/music/
    // 二级目录 project/project.html -> ../static/music/
    const rootPath = (typeof window.ROOT_PATH !== 'undefined') ? window.ROOT_PATH : './';
    const musicBasePath = rootPath + "static/music/";

    // 3. 获取 DOM 元素
    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const muteBtn = document.getElementById('mute-btn');
    const songTitle = document.getElementById('song-title');

    // 如果当前页面没有播放器控件，直接退出，防止报错
    if (!audio || !playBtn) return;

    // 4. 状态变量
    let currentTrackIndex = 0;
    let isPlaying = false;

    // --- 核心：从 LocalStorage 读取记忆 ---
    function loadState() {
        const savedIndex = localStorage.getItem('music_index');
        const savedTime = localStorage.getItem('music_time');
        const savedStatus = localStorage.getItem('music_playing');
        const savedVolume = localStorage.getItem('music_volume');

        if (savedIndex !== null) currentTrackIndex = parseInt(savedIndex);
        
        // 加载歌曲
        loadTrack(currentTrackIndex);

        // 恢复进度
        if (savedTime !== null) audio.currentTime = parseFloat(savedTime);
        
        // 恢复音量
        if (savedVolume !== null) audio.volume = parseFloat(savedVolume);

        // 恢复播放状态 (如果是播放状态，尝试自动播放)
        if (savedStatus === 'true') {
            playMusic(true); // true 表示是恢复播放，不需要重置时间
        }
    }

    // --- 核心：保存状态到 LocalStorage ---
    function saveState() {
        localStorage.setItem('music_index', currentTrackIndex);
        localStorage.setItem('music_time', audio.currentTime);
        localStorage.setItem('music_playing', isPlaying); // 保存当前是否在播放
        localStorage.setItem('music_volume', audio.volume);
    }

    // 页面关闭/刷新/跳转前保存状态
    window.addEventListener('beforeunload', saveState);

    // --- 播放器功能函数 ---

    function loadTrack(index) {
        // 拼接正确的路径
        audio.src = musicBasePath + playlistData[index].file;
        songTitle.innerText = playlistData[index].title;
    }

    function playMusic(isRestore = false) {
        // 浏览器自动播放策略限制：如果没有用户交互，play() 可能会失败
        var playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                isPlaying = true;
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                
                // 给按钮添加旋转动画类 (可选)
                const icon = document.querySelector('.music-control'); 
                if(icon) icon.classList.add('rotating');

            }).catch(error => {
                console.log("浏览器阻止了自动播放 (需要用户点击一次页面):", error);
                // 虽然自动播放失败，但我们保持 isPlaying 状态，等待用户点击
                isPlaying = false; 
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            });
        }
    }

    function pauseMusic() {
        audio.pause();
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }

    // --- 事件监听 ---

    playBtn.addEventListener('click', () => {
        if (isPlaying) pauseMusic();
        else playMusic();
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlistData.length) % playlistData.length;
        loadTrack(currentTrackIndex);
        playMusic();
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
        loadTrack(currentTrackIndex);
        playMusic();
    });

    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.innerHTML = audio.muted ? 
            '<i class="fas fa-volume-mute" style="color:#ff4d4d"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    });

    // 自动播放下一首
    audio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
        loadTrack(currentTrackIndex);
        playMusic();
    });

    // 实时保存进度 (每秒保存一次，防止意外崩溃)
    audio.addEventListener('timeupdate', () => {
        // 只有在播放时才频繁保存，避免性能浪费
        if(isPlaying) { 
            localStorage.setItem('music_time', audio.currentTime);
        }
    });

    // --- 启动 ---
    // 设置默认音量
    audio.volume = 0.5;
    // 加载并尝试恢复状态
    loadState();
});