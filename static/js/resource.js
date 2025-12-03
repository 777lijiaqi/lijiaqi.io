/* --- static/js/resource.js --- */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Resource.js: System Online.");

    /* --- 1. 资源数据源 --- */
    const resources = [
        {
            title: "STM32外设驱动源码",
            category: "stm32",
            desc: "ST 官方英文参考手册，包含寄存器定义与电气特性。",
            tags: ["PDF", "Reference"],
            icon: "fas fa-file-pdf",
            link: "#" 
        },
        {
            title: "linux驱动程序",
            category: "linuxdriver", // 注意：需与按钮 data-category 一致
            desc: "Windows 平台 Modbus RTU/TCP 调试工具，支持主从模式。",
            tags: ["Tool", "Debug"],
            icon: "fas fa-toolbox",
            link: "#"
        },
        {
            title: "linux应用源码",
            category: "linuxc", // 注意：需与按钮 data-category 一致
            desc: "通用的增量式/位置式 PID 控制算法实现模板。",
            tags: ["Source Code", "Algorithm"],
            icon: "fas fa-code",
            link: "#"
        },
        {
            title: "OHTER",
            category: "all", 
            desc: "从 Bootloader 到文件系统的完整学习路径规划。",
            tags: ["Guide", "Roadmap"],
            icon: "fas fa-map-signs",
            link: "#"
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
        
            if (isExternal) {
                // 1. 外部链接 (GitHub下载)：直接用原链接，不加 ?from 参数
                card.href = item.link;
                card.target = "_blank"; // 在新窗口打开/下载
            } else {
                // 2. 内部链接 (网页跳转)：加上 ?from 参数以便返回
                card.href = `${item.link}?from=${encodeURIComponent(currentCategory)}`;
                // 内部链接通常不需要 target="_blank"
            }
            
            card.className = 'doc-item';
            card.style.opacity = '0';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
        
            const tagsHtml = item.tags.map(tag => `<span class="doc-tag">#${tag}</span>`).join('');
        
            // 根据是下载还是跳转，显示不同的箭头图标
            const actionIcon = isExternal ? 'fa-download' : 'fa-chevron-right';
        
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
