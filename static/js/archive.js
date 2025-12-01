/* --- 1. 文档数据源 (Database) --- */
const documents = [
    {
        title: "HAL库定时器精准延时",
        category: "STM32",
        desc: "基于STM32F411的定时器外设，编写阻塞式精准延时驱动。",
        tags: ["STM32", "TIM", "DELAY"],
        icon: "fas fa-microchip",
        link: "#" 
    },
    {
        title: "I2C 通信协议波形分析",
        category: "STM32",
        desc: "使用逻辑分析仪抓取 I2C 时序，解决 ACK 丢失与总线死锁问题。",
        tags: ["Protocol", "Debug", "Signal"],
        icon: "fas fa-wave-square",
        link: "#" 
    },
    {
        title: "Makefile构建指南",
        category: "LINUX",
        desc: "深入理解 Makefile 编译原理、规则、伪目标及常用函数，掌握大型项目构建技巧。",
        tags: ["Makefile", "GCC", "Automation"],
        icon: "fas fa-file-code",
        link: "linux/Makefile学习.html" // 跳转链接
    },
    {
        title: "Linux 内核裁剪笔记",
        category: "LINUX",
        desc: "如何通过 menuconfig 配置内核选项，减小体积并优化启动速度。",
        tags: ["Kernel", "Bootloader", "Optimization"],
        icon: "fab fa-linux",
        link: "#" 
    },
    {
        title: "C语言指针与内存管理",
        category: "C/C++",
        desc: "深度解析指针数组、函数指针以及堆栈内存泄漏的排查方法。",
        tags: ["C/C++", "Memory", "Algorithm"],
        icon: "fas fa-code",
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

// 定义全局变量 (必须用 let，因为它们会变)
let currentCategory = 'all';
let currentSearch = '';

// 核心过滤函数
function filterDocuments() {
    console.log("正在筛选 -> 分类:", currentCategory, " 关键词:", currentSearch); // 调试日志

    const filtered = documents.filter(doc => {
        // 1. 匹配分类 (如果是 all 则匹配所有)
        const matchCat = (currentCategory === 'ALL') || (doc.category === currentCategory);
        
        // 2. 匹配搜索关键词 (标题或描述)
        const term = currentSearch.toLowerCase().trim();
        const matchSearch = doc.title.toLowerCase().includes(term) || 
                            doc.desc.toLowerCase().includes(term);
        
        return matchCat && matchSearch;
    });

    renderList(filtered);
}

// --- 关键修复点：按钮点击监听 ---
catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 1. 视觉交互：移除其他按钮的高亮，点亮当前按钮
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 2. 数据更新：获取按钮上的 data-category 属性
        const newCategory = btn.getAttribute('data-category');
        currentCategory = newCategory;

        // 3. ⚠️ 核心步骤：重新执行筛选函数！
        // 之前可能漏掉了这一步，导致点击后界面不刷新
        filterDocuments();
    });
});

// --- 搜索框输入监听 ---
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value;
    filterDocuments();
});

// 注入动画 CSS (防止多次注入)
if (!document.getElementById('dynamic-style')) {
    const styleSheet = document.createElement("style");
    styleSheet.id = 'dynamic-style';
    styleSheet.innerText = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(styleSheet);
}

/* --- 4. 初始化与自动筛选 (Auto Filter on Load) --- */
function init() {
    // 1. 获取 URL 中的参数 (例如 ?cat=stm32)
    const urlParams = new URLSearchParams(window.location.search);
    const targetCategory = urlParams.get('cat');

    // 2. 如果 URL 里有分类参数，且不是 'all'
    if (targetCategory && targetCategory !== 'ALL') {
        currentCategory = targetCategory;

        // 同步顶部按钮的高亮状态
        catBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-category') === targetCategory) {
                btn.classList.add('active');
            }
        });
    } else {
        currentCategory = 'ALL';
    }

    // 3. 执行一次初始筛选
    filterDocuments();
}

// 启动
init();
