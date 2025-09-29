document.addEventListener('DOMContentLoaded', () => {
    const dragArea = document.querySelector('.skill-tree-drag-area');
    const viewportWrapper = document.querySelector('.viewport-wrapper');
    const svg = document.querySelector('.skill-tree-connectors');
    const allNodes = document.querySelectorAll('.skill-node');
    const nodeCenter = document.getElementById('node-center'); 

    if (!dragArea || !viewportWrapper || !svg || allNodes.length === 0) {
        return;
    }

    let isDragging = false;
    let startX, startY;
    let scrollLeft, scrollTop;
    let lines = {}; 
    let hasInitialized = false; 
/*                  




                                เพิ่มเส้นเชื่อมมมมม




*/
    const connections = [
        { start: 'node-center', end: 'node-art' },
        { start: 'node-center', end: 'node-volunteer' },
        { start: 'node-center', end: 'node-eng-main' },
        { start: 'node-center', end: 'node-work' },
        { start: 'node-eng-main', end: 'node-Roblox' },
        { start: 'node-work', end: 'node-comp' },
        { start: 'node-art', end: 'node-FL' }
    ];










    // **[จุดสำคัญที่ 1] กลับไปใช้ getCenter ที่ทำให้เส้นตรง**
    const getCenter = (el) => {
        const rect = el.getBoundingClientRect();
        const dragRect = dragArea.getBoundingClientRect(); 

        return {
            x: (rect.left + rect.width / 2) - dragRect.left,
            y: (rect.top + rect.height / 2) - dragRect.top
        };
    };

    const drawConnection = (startNodeId, endNodeId) => {
        const startNode = document.getElementById(startNodeId);
        const endNode = document.getElementById(endNodeId);
        
        if (!startNode || !endNode) {
            return null;
        }
        
        const startCenter = getCenter(startNode);
        const endCenter = getCenter(endNode);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dAttr = `M ${startCenter.x} ${startCenter.y} L ${endCenter.x} ${endCenter.y}`;
        
        line.setAttribute('d', dAttr);
        line.setAttribute('class', 'connection-line');
        line.setAttribute('id', `line-${startNodeId}-${endNodeId}`); 
        line.style.zIndex = '4'; 
        
        svg.appendChild(line);

        // **[จุดสำคัญที่ 2] ลบ Logic อนิเมชันเส้นทั้งหมดออก**
        // เส้นจะปรากฏทันทีเพราะไม่มี stroke-dasharray/offset ใน CSS
        
        return line;
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const targetNode = entry.target;

            if (entry.isIntersecting) {
                // Node Fade In
                targetNode.style.opacity = '1'; 
                
                // ลบ Logic การจัดการเส้นออก (ไม่มีอนิเมชันเส้นแล้ว)
                
                observer.unobserve(targetNode);
            }
        });
    }, { 
        root: viewportWrapper,
        threshold: 0.1
    });

    const initializeTree = () => {
        if (hasInitialized) return; 
        hasInitialized = true;

        const dragWidth = dragArea.offsetWidth;
        const dragHeight = dragArea.offsetHeight;
        const viewWidth = viewportWrapper.offsetWidth;
        const viewHeight = viewportWrapper.offsetHeight;

        // เลื่อนไปยังจุดกึ่งกลาง
        viewportWrapper.scrollLeft = (dragWidth / 2) - (viewWidth / 2);
        viewportWrapper.scrollTop = (dragHeight / 2) - (viewHeight / 2);
        
        // **[จุดสำคัญที่ 3] ใช้ requestAnimationFrame เพื่อให้แน่ใจว่า Scroll เสร็จแล้ว ก่อนวาดเส้น**
        // การคำนวณ BoundingRect จะแม่นยำหลังจากการ Scroll เสร็จ
        requestAnimationFrame(() => {
             connections.forEach(conn => {
                const lineElement = drawConnection(conn.start, conn.end);
                if (lineElement) {
                    lines[`line-${conn.start}-${conn.end}`] = lineElement;
                }
            });
            
            connections.forEach(conn => {
                const endNode = document.getElementById(conn.end);
                if (endNode && conn.end !== 'node-center') {
                    observer.observe(endNode);
                }
            });
        });
    };

    window.onload = initializeTree; 
    
    dragArea.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || e.target.closest('a') || e.target.closest('.skill-node')) return; 
        
        isDragging = true;
        e.preventDefault(); 
        
        startX = e.pageX;
        startY = e.pageY;
        
        scrollLeft = viewportWrapper.scrollLeft;
        scrollTop = viewportWrapper.scrollTop;
        
        dragArea.classList.add('active-drag');
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        dragArea.classList.remove('active-drag');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const dx = e.pageX - startX;
        const dy = e.pageY - startY;
        
        viewportWrapper.scrollLeft = scrollLeft - dx;
        viewportWrapper.scrollTop = scrollTop - dy;
    });
});