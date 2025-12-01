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
            link: "#" // 这里可以填文件下载链接，如 ../static/files/stm32.pdf
        },
        {
            title: "linux驱动程序",
            category: "linux",
            desc: "Windows 平台 Modbus RTU/TCP 调试工具，支持主从模式。",
            tags: ["Tool", "Debug"],
            icon: "fas fa-toolbox",
            link: "#"
        },
        {
            title: "linux应用源码",
            category: "linux",
            desc: "通用的增量式/位置式 PID 控制算法实现模板。",
            tags: ["Source Code", "Algorithm"],
            icon: "fas fa-code",
            link: "#"
        },
        {
            title: "otherr",
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

    function renderList(data) {
        listContainer.innerHTML = '';
        
        if (data.length === 0) {
            listContainer.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem; font-family:'Fira Code'">SYSTEM: No Resources Found.</div>`;
            if(countLabel) countLabel.innerText = 0;
            return;
        }

        if(countLabel) countLabel.innerText = data.length;

        data.forEach((item, index) => {
            const card = document.createElement('a');
            const dynamicLink = `${item.link}?from=${encodeURIComponent(currentCategory)}`;
            
            card.href = dynamicLink;
            card.className = 'doc-item';
            card.style.opacity = '0';
            card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;

            const tagsHtml = item.tags.map(tag => `<span class="doc-tag">#${tag}</span>`).join('');

            card.innerHTML = `
                <div class="doc-icon"><i class="${item.icon}"></i></div>
                <div class="doc-content">
                    <div class="doc-title">${item.title}</div>
                    <div class="doc-desc">${item.desc}</div>
                    <div class="doc-tags">${tagsHtml}</div>
                </div>
                <!-- 资源通常是下载或跳转 -->
                <div class="doc-arrow"><i class="fas fa-download"></i></div>
            `;
            listContainer.appendChild(card);
        });
    }

    function filterResources() {
        const filtered = resources.filter(item => {
            const itemCat = item.category.toLowerCase();
            const curCat = currentCategory.toLowerCase();
            const matchCat = (curCat === 'all') || (itemCat === curCat);
            
            const term = currentSearch.toLowerCase().trim();
            const matchSearch = item.title.toLowerCase().includes(term) || 
                                item.desc.toLowerCase().includes(term);
            
            return matchCat && matchSearch;
        });

        renderList(filtered);
    }

    function updateUrl(cat) {
        if (history.pushState) {
            const newUrl = window.location.pathname + `?cat=${encodeURIComponent(cat)}`;
            window.history.pushState({path:newUrl}, '', newUrl);
        }
    }

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

    // 初始化
    const urlParams = new URLSearchParams(window.location.search);
    const targetCategory = urlParams.get('cat') ? urlParams.get('cat').toLowerCase() : 'all';

    currentCategory = targetCategory;

    catBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category').toLowerCase() === targetCategory) {
            btn.classList.add('active');
        }
    });

    filterResources();
});