/* --- static/js/music.js --- */
/* 增强版：带状态记忆与防中断优化的音乐控制器 */

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. 配置区 ---
    const playlistData = [
        { title: "最重要的小事-五月天", file: "最重要的小事_五月天.mp3" },
        { title: "步步-五月天", file: "步步-五月天.mp3" }
    ];

    // 获取路径前缀
    const rootPath = (typeof window.ROOT_PATH !== 'undefined') ? window.ROOT_PATH : './';
    const musicBasePath = rootPath + "static/music/";

    // 获取元素
    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const muteBtn = document.getElementById('mute-btn');
    const songTitle = document.getElementById('song-title');

    if (!audio || !playBtn) return;

    let currentTrackIndex = 0;
    let isPlaying = false; // 内部状态标记

    // --- 核心功能函数 ---

    function loadTrack(index) {
        audio.src = musicBasePath + playlistData[index].file;
        songTitle.innerText = playlistData[index].title;
        // 注意：这里不要立即 play，等待 loadedmetadata 事件
    }

    // 尝试播放音乐 (兼容浏览器策略)
    function tryPlayMusic() {
        var playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // 播放成功
                isPlaying = true;
                updatePlayBtnUI();
            }).catch(error => {
                // 播放被阻止 (通常是因为页面刚加载完，用户还没点击)
                console.log("自动播放被浏览器拦截 (这是正常现象，需用户点击):", error);
                isPlaying = false; // 标记为未播放
                updatePlayBtnUI();
            });
        }
    }

    function pauseMusic() {
        audio.pause();
        isPlaying = false;
        updatePlayBtnUI();
    }

    function updatePlayBtnUI() {
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            // 可选：添加旋转动画
            // document.getElementById('music-icon')?.classList.add('rotating');
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // --- 状态记忆：保存与恢复 ---

    function saveState() {
        // 只有当音乐确实在播放，或者用户意图是播放时，才保存 true
        // 这里的 !audio.paused 是最准确的判断
        localStorage.setItem('music_index', currentTrackIndex);
        localStorage.setItem('music_time', audio.currentTime);
        localStorage.setItem('music_playing', !audio.paused); // 关键：保存真实的播放状态
        localStorage.setItem('music_volume', audio.volume);
    }

    function loadState() {
        const savedIndex = localStorage.getItem('music_index');
        const savedTime = localStorage.getItem('music_time');
        const savedStatus = localStorage.getItem('music_playing');
        const savedVolume = localStorage.getItem('music_volume');

        // 1. 恢复歌曲索引
        if (savedIndex !== null) currentTrackIndex = parseInt(savedIndex);
        loadTrack(currentTrackIndex);

        // 2. 恢复音量
        if (savedVolume !== null) audio.volume = parseFloat(savedVolume);

        // 3. 【关键优化】等待音频元数据加载完，再恢复进度和播放
        // 这样可以避免 "The element has no supported sources" 错误
        audio.addEventListener('loadedmetadata', function() {
            if (savedTime !== null) {
                audio.currentTime = parseFloat(savedTime);
            }
            
            // 4. 如果之前的状态是“正在播放”，则尝试自动续播
            if (savedStatus === 'true') {
                tryPlayMusic();
            }
        }, { once: true }); // 只执行一次，防止后续切歌时干扰
    }

    // --- 事件监听 ---

    // 页面关闭/刷新前保存
    window.addEventListener('beforeunload', saveState);

    // 按钮点击
    playBtn.addEventListener('click', () => {
        if (audio.paused) tryPlayMusic();
        else pauseMusic();
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlistData.length) % playlistData.length;
        loadTrack(currentTrackIndex);
        // 切歌时，我们要等到 loadedmetadata 后自动播放，或者手动触发
        audio.addEventListener('loadedmetadata', () => tryPlayMusic(), { once: true });
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
        loadTrack(currentTrackIndex);
        audio.addEventListener('loadedmetadata', () => tryPlayMusic(), { once: true });
    });

    muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.innerHTML = audio.muted ? 
            '<i class="fas fa-volume-mute" style="color:#ff4d4d"></i>' : 
            '<i class="fas fa-volume-up"></i>';
    });

    audio.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
        loadTrack(currentTrackIndex);
        audio.addEventListener('loadedmetadata', () => tryPlayMusic(), { once: true });
    });

    // --- 启动 ---
    loadState();
});