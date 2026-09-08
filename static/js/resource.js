/* --- static/js/resource.js --- */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Resource.js: System Online.");

    /* --- 1. 资源数据源 --- */
    const resources = [
        {
            title: "Linux Driver Mentor 智能体技能包 (linux-driver-mentor.7z)",
            category: "agent_skill",
            desc: "嵌入式 Linux 驱动开发教学导师 Agent Skill，支持总线模型解析、API 零截断源码拆解、并发与防御性编码审查。",
            tags: ["Agent Skill", "Linux驱动", "7z压缩包"],
            icon: "fas fa-robot",
            link: "agent_skill/linux-driver-mentor.7z" 
        },
        {
            title: "DHT20温湿度传感器驱动",
            category: "stm32",
            desc: "基于HAL库的DHT20温湿度传感器驱动源码。",
            tags: ["C源码", "Reference"],
            icon: "fas fa-code",
            link: "https://github.com/777lijiaqi/STM32-/archive/refs/heads/DHT20-Driver.zip" 
        },
        {
            title: "定时器精准延时驱动",
            category: "stm32",
            desc: "基于HAL库的定时器精准延时驱动源码。",
            tags: ["C源码", "Reference"],
            icon: "fas fa-code",
            link: "https://github.com/777lijiaqi/STM32-/archive/refs/heads/TIM-Delay-Driver.zip" 
        },
        {
            title: "串口重定向(DEBUG)驱动",
            category: "stm32",
            desc: "基于HAL库的串口重定向(DEBUG)驱动源码。",
            tags: ["C源码", "Reference"],
            icon: "fas fa-code",
            link: "https://github.com/777lijiaqi/STM32-/archive/refs/heads/Usart-Debug-Driver.zip" 
        },
        {
            title: "DHT20温湿度传感器数据手册",
            category: "datasheet",
            desc: "DHT20温湿度传感器数据手册",
            tags: ["Datasheet"],
            icon: "fas fa-pdf",
            link: "https://github.com/777lijiaqi/Datasheet/blob/Temperature-Humidity-Sensor/DHT20.pdf" 
        },
        {
            title: "AD590S温湿度传感器数据手册",
            category: "datasheet",
            desc: "AD590S温湿度传感器数据手册",
            tags: ["Datasheet"],
            icon: "fas fa-pdf",
            link: "https://github.com/777lijiaqi/Datasheet/blob/Temperature-Humidity-Sensor/AD590S.pdf" 
        },
        {
            title: "HDC3020温湿度传感器数据手册",
            category: "datasheet",
            desc: "HDC3020温湿度传感器数据手册",
            tags: ["Datasheet"],
            icon: "fas fa-pdf",
            link: "https://github.com/777lijiaqi/Datasheet/blob/Temperature-Humidity-Sensor/HDC3020.pdf" 
        },
        {
            title: "HDC3120温湿度传感器数据手册",
            category: "datasheet",
            desc: "HDC3120温湿度传感器数据手册",
            tags: ["Datasheet"],
            icon: "fas fa-pdf",
            link: "https://github.com/777lijiaqi/Datasheet/blob/Temperature-Humidity-Sensor/HDC3120.pdf" 
        },
        {
            title: "LMT70温湿度传感器数据手册",
            category: "datasheet",
            desc: "LMT70温湿度传感器数据手册",
            tags: ["Datasheet"],
            icon: "fas fa-pdf",
            link: "https://github.com/777lijiaqi/Datasheet/blob/Temperature-Humidity-Sensor/LMT70.pdf" 
        }
    ];

    const listContainer = document.getElementById('document-list');
    const countLabel = document.getElementById('doc-count');
    const searchInput = document.getElementById('search-input');
    const catBtns = document.querySelectorAll('.cat-btn');

    let currentCategory = 'all';
    let currentSearch = '';

    /* --- 2. 渲染函数 --- */
    function renderList(data) {
        listContainer.innerHTML = '';
        
        if (data.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem; font-family:'Fira Code'">SYSTEM: No Resources Found.</div>`;
            if(countLabel) countLabel.innerText = 0;
            return;
        }

        if(countLabel) countLabel.innerText = data.length;

        /* --- 修改 renderList 中的卡片生成逻辑 --- */
        
        data.forEach((item, index) => {
            const card = document.createElement('a');
            
            // 判断是否为外部链接 (以 http 开头)
            const isExternal = item.link.startsWith('http');
            // 判断是否为直接下载资源 (.7z, .zip, .tar.gz, .pdf)
            const isDownload = isExternal || item.link.match(/\.(7z|zip|tar\.gz|tar\.xz|pdf)$/i);
        
            if (isExternal) {
                // 1. 外部链接 (GitHub下载)：直接用原链接，不加 ?from 参数
                card.href = item.link;
                card.target = "_blank"; // 在新窗口打开/下载
            } else if (isDownload) {
                // 2. 本地直接下载文件 (如 .7z 压缩包)
                card.href = item.link;
                card.setAttribute('download', '');
            } else {
                // 3. 内部链接 (网页跳转)：加上 ?from 参数以便返回
                card.href = `${item.link}?from=${encodeURIComponent(currentCategory)}`;
                // 内部链接通常不需要 target="_blank"
            }
            
            card.className = 'doc-item';
            card.style.opacity = '0';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        
            const tagsHtml = item.tags.map(tag => `<span class="doc-tag">#${tag}</span>`).join('');
        
            // 根据是下载还是跳转，显示不同的图标
            const actionIcon = isDownload ? 'fa-download' : 'fa-chevron-right';
        
            card.innerHTML = `
                <div class="doc-icon"><i class="${item.icon}"></i></div>
                <div class="doc-content">
                    <div class="doc-title">${item.title}</div>
                    <div class="doc-desc">${item.desc}</div>
                    <div class="doc-tags">${tagsHtml}</div>
                </div>
                <div class="doc-arrow"><i class="fas ${actionIcon}"></i></div>
            `;
            listContainer.appendChild(card);
        });
    }

    /* --- 3. 筛选逻辑 --- */
    function filterResources() {
        const filtered = resources.filter(item => {
            // 这里为了匹配更宽松，全部转小写比较
            const itemCat = item.category.toLowerCase();
            const curCat = currentCategory.toLowerCase();
            
            // 关键：data-category 里的值必须和数据源里的 category 字段一致
            const matchCat = (curCat === 'all') || (itemCat === curCat);
            
            const term = currentSearch.toLowerCase().trim();
            const matchSearch = item.title.toLowerCase().includes(term) || 
                                item.desc.toLowerCase().includes(term);
            
            return matchCat && matchSearch;
        });

        renderList(filtered);
    }

    /* --- 4. URL 更新逻辑 --- */
    function updateUrl(cat) {
        if (history.pushState) {
            const newUrl = window.location.pathname + `?cat=${encodeURIComponent(cat)}`;
            window.history.pushState({path:newUrl}, '', newUrl);
        }
    }

    /* --- 5. 事件监听 --- */
    catBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            catBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.getAttribute('data-category');
            
            updateUrl(currentCategory);
            filterResources();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterResources();
        });
    }

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(styleSheet);

    /* --- 6. 初始化 --- */
    const urlParams = new URLSearchParams(window.location.search);
    const targetCategory = urlParams.get('cat') ? urlParams.get('cat').toLowerCase() : 'all';

    console.log("Resource Init:", targetCategory);
    currentCategory = targetCategory;

    catBtns.forEach(btn => {
        btn.classList.remove('active');
        // 注意：HTML 里的 data-category 要么全小写，要么和这里对应
        if (btn.getAttribute('data-category').toLowerCase() === targetCategory) {
            btn.classList.add('active');
        }
    });

    filterResources();
});
