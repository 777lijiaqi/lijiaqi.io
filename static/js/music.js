/* --- static/js/music.js --- */
/* 全局音乐播放器：支持跨页面状态继承与路径自动修正 */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Music Player: System Online.");

    // --- 1. 播放列表配置 (文件名必须准确) ---
    const playlistData = [
        { title: "最重要的小事-五月天", file: "最重要的小事_五月天.mp3" },
        { title: "步步-五月天", file: "步步-五月天.mp3" }
        { title: "OAOA-五月天", file: "OAOA-五月天.mp3" }
    ];

    // --- 2. 路径处理 (核心修复点) ---
    // 检查 HTML 是否定义了 ROOT_PATH，如果没有定义，默认为 ./ (根目录)
    const rootPath = (typeof window.ROOT_PATH !== 'undefined') ? window.ROOT_PATH : './';
    const musicBasePath = rootPath + "static/music/";

    console.log("Current Music Path Base:", musicBasePath); // 调试日志

    // --- 3. 获取 DOM ---
    const audio = document.getElementById('bg-music');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const muteBtn = document.getElementById('mute-btn');
    const songTitle = document.getElementById('song-title');

    // 如果当前页面没有播放器组件，直接退出
    if (!audio || !playBtn) return;

    // --- 4. 状态变量 ---
    let currentTrackIndex = 0;
    
    // --- 5. 核心功能函数 ---

    // 加载歌曲资源
    function loadTrack(index) {
        const targetSrc = musicBasePath + playlistData[index].file;
        
        // 只有当路径改变时才重新赋值 src，防止闪断
        if (audio.src.indexOf(playlistData[index].file) === -1) {
            audio.src = targetSrc;
            songTitle.innerText = playlistData[index].title;
        }
    }

    // 尝试播放 (处理浏览器拦截)
    function tryPlayMusic() {
        var playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // 播放成功
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                // 开始记录状态
                localStorage.setItem('music_playing', 'true');
            }).catch(error => {
                // 播放被拦截 (这是正常现象)
                console.log("Auto-play blocked by browser. Waiting for interaction.");
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                // 虽然被拦截，但我们标记为‘原本应该是播放状态’
                // 用户点击任何地方后，我们可以尝试恢复（这里暂不实现太复杂的全局点击恢复，仅由用户点击播放键恢复）
            });
        }
    }

    // 暂停
    function pauseMusic() {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        localStorage.setItem('music_playing', 'false');
    }

    // 更新按钮状态图标
    function updatePlayIcon() {
        if (!audio.paused) {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // --- 6. 状态记忆：保存与恢复 ---

    // 每一秒保存一次进度 (比 beforeunload 更可靠，防止崩溃丢失)
    audio.addEventListener('timeupdate', () => {
        localStorage.setItem('music_time', audio.currentTime);
    });

    // 保存当前歌曲索引和音量
    function saveConfig() {
        localStorage.setItem('music_index', currentTrackIndex);
        localStorage.setItem('music_volume', audio.volume);
    }

    // 恢复状态 (页面加载时调用)
    function restoreState() {
        const savedIndex = localStorage.getItem('music_index');
        const savedTime = localStorage.getItem('music_time');
        const savedStatus = localStorage.getItem('music_playing');
        const savedVolume = localStorage.getItem('music_volume');

        // 1. 恢复音量
        if (savedVolume !== null) audio.volume = parseFloat(savedVolume);
        else audio.volume = 0.5;

        // 2. 恢复歌曲
        if (savedIndex !== null) currentTrackIndex = parseInt(savedIndex);
        loadTrack(currentTrackIndex); // 设置 src

        // 3. 恢复进度和播放状态
        // 必须等待音频元数据加载完毕，才能设置 currentTime
        audio.addEventListener('loadedmetadata', function() {
            if (savedTime !== null) {
                audio.currentTime = parseFloat(savedTime);
            }
            
            // 如果之前是播放状态，尝试续播
            if (savedStatus === 'true') {
                tryPlayMusic();
            }
        }, { once: true }); // 仅执行一次
    }

    // --- 7. 事件监听 ---

    playBtn.addEventListener('click', () => {
        if (audio.paused) tryPlayMusic();
        else pauseMusic();
        saveConfig();
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlistData.length) % playlistData.length;
        loadTrack(currentTrackIndex);
        saveConfig();
        // 切歌后，等待加载完自动播放
        audio.addEventListener('loadedmetadata', () => tryPlayMusic(), { once: true });
    });

    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlistData.length;
        loadTrack(currentTrackIndex);
        saveConfig();
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
        saveConfig();
        audio.addEventListener('loadedmetadata', () => tryPlayMusic(), { once: true });
    });

    // --- 8. 启动 ---
    restoreState();
});
