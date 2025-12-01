/* --- 1. 文档数据源 (Database) --- */
const documents = [
    {
        title: "Makefile构建指南",
        category: "linux",
        desc: "深入理解 Makefile 编译原理、规则、伪目标及常用函数，掌握大型项目构建技巧。",
        tags: ["Build System", "GCC", "Automation"],
        icon: "fas fa-file-code",
        link: "archive/Makefile学习.html" // 跳转链接
    },
    {
        title: "STM32 HAL库开发实战",
        category: "stm32",
        desc: "基于 STM32H7 的外设驱动开发，涵盖 GPIO、UART、DMA 及中断优先级配置。",
        tags: ["Embedded", "ARM", "Driver"],
        icon: "fas fa-microchip",
        link: "#" 
    },
    {
        title: "Linux 内核裁剪笔记",
        category: "linux",
        desc: "如何通过 menuconfig 配置内核选项，减小体积并优化启动速度。",
        tags: ["Kernel", "Bootloader", "Optimization"],
        icon: "fab fa-linux",
        link: "#" 
    },
    {
        title: "C语言指针与内存管理",
        category: "lang",
        desc: "深度解析指针数组、函数指针以及堆栈内存泄漏的排查方法。",
        tags: ["C/C++", "Memory", "Algorithm"],
        icon: "fas fa-code",
        link: "#" 
    },
    {
        title: "Altium Designer 多层板设计",
        category: "hardware",
        desc: "四层板叠层设计、阻抗匹配计算及差分走线规则详解。",
        tags: ["PCB", "EDA", "Hardware"],
        icon: "fas fa-layer-group",
        link: "#" 
    },
    {
        title: "I2C 通信协议波形分析",
        category: "hardware",
        desc: "使用逻辑分析仪抓取 I2C 时序，解决 ACK 丢失与总线死锁问题。",
        tags: ["Protocol", "Debug", "Signal"],
        icon: "fas fa-wave-square",
        link: "#" 
    }
];

/* --- 2. 渲染逻辑 (Render Logic) --- */
const listContainer = document.getElementById('document-list');
const countLabel = document.getElementById('doc-count');

function renderList(data) {
    listContainer.innerHTML = ''; // 清空当前列表
    
    if (data.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem;">No matching modules found.</div>`;
        countLabel.innerText = 0;
        return;
    }

    countLabel.innerText = data.length;

    data.forEach((doc, index) => {
        // 创建卡片 HTML
        const card = document.createElement('a');
        card.href = doc.link;
        card.className = 'doc-item';
        card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`; // 瀑布流动画
        card.style.opacity = '0'; // 初始隐藏，配合动画

        // 生成标签 HTML
        const tagsHtml = doc.tags.map(tag => `<span class="doc-tag">#${tag}</span>`).join('');

        card.innerHTML = `
            <div class="doc-icon"><i class="${doc.icon}"></i></div>
            <div class="doc-content">
                <div class="doc-title">${doc.title}</div>
                <div class="doc-desc">${doc.desc}</div>
                <div class="doc-tags">${tagsHtml}</div>
            </div>
            <div class="doc-arrow"><i class="fas fa-chevron-right"></i></div>
        `;

        listContainer.appendChild(card);
    });
}

/* --- 3. 搜索与筛选逻辑 (Search & Filter) --- */
const searchInput = document.getElementById('search-input');
const catBtns = document.querySelectorAll('.cat-btn');

let currentCategory = 'all';
let currentSearch = '';

// 核心过滤函数
function filterDocuments() {
    const filtered = documents.filter(doc => {
        // 1. 匹配分类
        const matchCat = currentCategory === 'all' || doc.category === currentCategory;
        // 2. 匹配搜索关键词 (标题或描述)
        const term = currentSearch.toLowerCase();
        const matchSearch = doc.title.toLowerCase().includes(term) || 
                            doc.desc.toLowerCase().includes(term);
        
        return matchCat && matchSearch;
    });

    renderList(filtered);
}

// 监听搜索框输入
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    filterDocuments();
});

// 监听分类按钮点击
catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除其他按钮激活状态
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 更新当前分类
        currentCategory = btn.getAttribute('data-category');
        filterDocuments();
    });
});

// 注入动画 CSS
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleSheet);

/* --- 4. 初始化 --- */
// 页面加载时渲染所有数据
renderList(documents);
