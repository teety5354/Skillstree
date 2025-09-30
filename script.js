document.addEventListener('DOMContentLoaded', () => {
    const dragArea = document.querySelector('.skill-tree-drag-area');
    const viewportWrapper = document.querySelector('.viewport-wrapper');
    const svg = document.querySelector('.skill-tree-connectors');
    const allNodes = document.querySelectorAll('.skill-node');
    const nodeCenter = document.getElementById('node-center'); 

    const hoverSound = document.getElementById('hover-sound'); // ดึง Audio Element

    document.addEventListener('visibilitychange', () => {
        // ตรวจสอบว่ามีปฏิสัมพันธ์แรกเกิดขึ้นแล้วหรือไม่ (เพื่อป้องกันการเล่นที่ไม่ตั้งใจ)
        if (hasInteracted) { 
            // document.hidden เป็น true เมื่อแท็บถูกย่อ/สลับไปที่อื่น
            if (document.hidden) {
                // หยุดเสียงเมื่อแท็บถูกซ่อน
                bgMusic.pause();
            } else {
                // เล่นเสียงต่อเมื่อแท็บกลับมาทำงาน
                // ต้องใช้ Promise เพื่อจัดการกับเบราว์เซอร์อย่างปลอดภัย
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // ป้องกัน error หากเบราว์เซอร์ยังบล็อกการเล่นอยู่
                        console.log("Could not resume background music.");
                    });
                }
            }
        }
    });
    // ฟังก์ชันควบคุมการเล่นเสียง
    const playHoverSound = () => {
        if (hoverSound) {
            // สำคัญ: ต้องรีเซ็ตเวลาไปที่ 0 เพื่อให้เล่นซ้ำได้ทันที
            hoverSound.currentTime = 0; 
            hoverSound.volume = 0.5; // กำหนดระดับเสียงสำหรับ SFX
            hoverSound.play().catch(e => {
                // จัดการ Error หากเบราว์เซอร์บล็อกการเล่น
            });
        }
    };

    // ใส่ Listener ให้กับทุก Node
    allNodes.forEach(node => {
        // เมื่อเมาส์ชี้เข้า
        node.addEventListener('mouseenter', () => {
            playHoverSound();
            
            // (ถ้าคุณยังคงใช้ Logic การปรับ Z-index เพื่อแก้ปัญหาโดนทับ
            //  คุณอาจต้องเพิ่ม Logic z-index ที่นี่ด้วย แต่ถ้า CSS ทำงานแล้วก็ไม่จำเป็น)
        });

        // เมื่อเมาส์ชี้ออก
        node.addEventListener('mouseleave', () => {
            // ส่วนใหญ่ไม่ทำอะไรกับเสียงเมื่อออก (ปล่อยให้เสียงสั้น ๆ จบเอง)
        });
    });

    const bgMusic = document.getElementById('bg-music');
    let hasInteracted = false;
    
    // ฟังเหตุการณ์การโต้ตอบครั้งแรก (เช่น การคลิกหรือแตะ)
    const playMusicOnInteraction = () => {
        if (!hasInteracted) {
            bgMusic.volume = 0.1; // กำหนดระดับเสียง (0.0 ถึง 1.0)
            const playPromise = bgMusic.play();
            
            // จัดการกับ Promise ที่เบราว์เซอร์คืนค่ามา (เพื่อป้องกัน error)
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    hasInteracted = true;
                }).catch(error => {
                    // Autoplay ถูกบล็อก (เช่น ใน Chrome/Safari)
                    console.log("Autoplay was prevented. User must interact first.");
                });
            }
            // ลบ Listener ทิ้งเมื่อมีการเล่นครั้งแรก
            document.removeEventListener('click', playMusicOnInteraction);
            document.removeEventListener('touchstart', playMusicOnInteraction);
        }
    };
    
    // ติดตั้ง Listener เพื่อรอการโต้ตอบครั้งแรก
    document.addEventListener('click', playMusicOnInteraction);
    document.addEventListener('touchstart', playMusicOnInteraction);

    if (!dragArea || !viewportWrapper || !svg || allNodes.length === 0) {
        return;
    }

    let isDragging = false;
    let startX, startY;
    let scrollLeft, scrollTop;
    let lines = {}; 
    let hasInitialized = false; 


// ฟังก์ชันดึงพิกัดที่ถูกต้องจาก Mouse Event หรือ Touch Event
    const getClientCoords = (e) => {
    // ถ้ามี touches (คือ Touch Event) ให้ใช้ touches[0]
        if (e.touches && e.touches.length) {
            return { 
                pageX: e.touches[0].pageX, 
                pageY: e.touches[0].pageY 
            };
        }
    // ถ้าไม่ใช่ (คือ Mouse Event) ให้ใช้ e โดยตรง
        return { 
            pageX: e.pageX, 
            pageY: e.pageY 
        };
    };

    
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
        { start: 'node-Roblox', end: 'node-Lua' },
        { start: 'node-Roblox', end: 'node-Luau' },
        { start: 'node-volunteer', end: 'node-kaya' },


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
    
    // --- MOUSE EVENTS ---
dragArea.addEventListener('mousedown', (e) => {
    // ป้องกันการลากเมื่อกดบน Node หรือ Element ที่คลิกได้
    if (e.button !== 0 || e.target.closest('a') || e.target.closest('.skill-node')) return; 
    
    isDragging = true;
    e.preventDefault(); 
    
    const coords = getClientCoords(e);
    startX = coords.pageX;
    startY = coords.pageY;
    
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
    
    const coords = getClientCoords(e);
    const dx = coords.pageX - startX;
    const dy = coords.pageY - startY;
    
    viewportWrapper.scrollLeft = scrollLeft - dx;
    viewportWrapper.scrollTop = scrollTop - dy;
});


// --- TOUCH EVENTS (เพิ่มใหม่สำหรับมือถือ) ---

dragArea.addEventListener('touchstart', (e) => {
    // ป้องกันการลากเมื่อกดบน Node หรือ Element ที่คลิกได้
    if (e.touches.length > 1 || e.target.closest('a') || e.target.closest('.skill-node')) return;

    isDragging = true;
    // ใช้ e.preventDefault() เพื่อป้องกันเบราว์เซอร์ลากหน้าจอเอง
    e.preventDefault(); 
    
    const coords = getClientCoords(e);
    startX = coords.pageX;
    startY = coords.pageY;
    
    scrollLeft = viewportWrapper.scrollLeft;
    scrollTop = viewportWrapper.scrollTop;
    
    dragArea.classList.add('active-drag');
}, { passive: false }); // passive: false จำเป็นสำหรับ e.preventDefault()

document.addEventListener('touchend', () => {
    isDragging = false;
    dragArea.classList.remove('active-drag');
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    // ตรวจสอบว่ายังมีนิ้วสัมผัสอยู่
    if (e.touches.length === 0) return; 

    const coords = getClientCoords(e);
    const dx = coords.pageX - startX;
    const dy = coords.pageY - startY;
    
    viewportWrapper.scrollLeft = scrollLeft - dx;
    viewportWrapper.scrollTop = scrollTop - dy;
}, { passive: false });
});