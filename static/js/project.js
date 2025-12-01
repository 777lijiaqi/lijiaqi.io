/* --- static/js/project.js --- */

document.addEventListener('DOMContentLoaded', function() {
    console.log("Project.js: System Online.");

    /* --- 1. 项目数据源 --- */
    const projects = [
        {
            title: "基于MODBUS协议的水质检测RTU",
            category: "stm32",
            desc: "基于 STM32H7 与 LwIP 协议栈，实现 MQTT/Modbus 多协议转换。",
            tags: ["STM32", "IoT", "LwIP"],
            icon: "fas fa-network-wired",
            link: "../archive/stm32/gateway.html" // 假设指向归档中的项目文档
        },
        {
            title: "液流称重自动升降仪",
            category: "stm32",
            desc: "基于磁场定向控制算法的高精度无刷电机驱动板设计。",
            tags: ["PCB", "Motor Control"],
            icon: "fas fa-bolt",
            link: "../archive/hardware/foc.html"
        },
        {
            title: "高速高精度ADC测试",
            category: "stm32",
            desc: "IMX6ULL 平台车载仪表盘界面开发，集成 CAN 总线数据读取。",
            tags: ["Linux", "Qt", "CAN"],
            icon: "fab fa-linux",
            link: "../archive/linux/dashboard.html"
        },
        {
            title: "other",
            category: "linux",
            desc: "使用 Verilog 实现的 Sobel 边缘检测硬件加速 IP 核。",
            tags: ["Verilog", "Zynq"],
            icon: "fas fa-microchip",
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
            listContainer.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem; font-family:'Fira Code'">SYSTEM: No Projects Found.</div>`;
            if(countLabel) countLabel.innerText = 0;
            return;
        }

        if(countLabel) countLabel.innerText = data.length;

        data.forEach((item, index) => {
            const card = document.createElement('a');
            // 动态生成 from 参数，方便返回
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
                <div class="doc-arrow"><i class="fas fa-chevron-right"></i></div>
            `;
            listContainer.appendChild(card);
        });
    }

    function filterProjects() {
        const filtered = projects.filter(item => {
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
            filterProjects();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            filterProjects();
        });
    }

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`;
    document.head.appendChild(styleSheet);

    // 初始化参数
    const urlParams = new URLSearchParams(window.location.search);
    const targetCategory = urlParams.get('cat') ? urlParams.get('cat').toLowerCase() : 'all';

    currentCategory = targetCategory;

    catBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category').toLowerCase() === targetCategory) {
            btn.classList.add('active');
        }
    });

    filterProjects();
});