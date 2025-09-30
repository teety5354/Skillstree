// ในไฟล์ script-project.js

document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('slider-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const images = document.querySelectorAll('.slider-image');

    if (!track || images.length === 0) return; // ตรวจสอบว่ามีองค์ประกอบครบ

    let currentIndex = 0;
    const totalImages = images.length;

    // ฟังก์ชันสำหรับเลื่อนรูปภาพ
    const updateSlider = () => {
        // คำนวณตำแหน่งการเลื่อน (เป็นเปอร์เซ็นต์)
        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
    };

    // ปุ่ม Next
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages; // วนลูปกลับไป 0 เมื่อถึงรูปสุดท้าย
        updateSlider();
    });

    // ปุ่ม Previous
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages; // วนลูปกลับไปรูปสุดท้ายเมื่อถึง 0
        updateSlider();
    });

    // เริ่มต้นให้แสดงรูปแรก
    updateSlider();
});
document.addEventListener('DOMContentLoaded', () => {
    
    const bgMusic = document.getElementById('bg-music');
    const hoverSound = document.getElementById('hover-sound');
    let hasInteracted = false; 

    // ------------------------------------
    // 1. Logic การเล่น BG Music (เมื่อผู้ใช้คลิกครั้งแรก)
    // ------------------------------------
    const playMusicOnInteraction = () => {
        if (!hasInteracted && bgMusic) {
            bgMusic.volume = 0.1; // ปรับระดับเสียง
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    hasInteracted = true;
                }).catch(error => {
                    // Autoplay ถูกบล็อก (ปกติ)
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


    // ------------------------------------
    // 2. Logic การหยุด/เล่นเสียง เมื่อสลับแท็บ
    // ------------------------------------
    document.addEventListener('visibilitychange', () => {
        if (hasInteracted && bgMusic) { 
            if (document.hidden) {
                bgMusic.pause();
            } else {
                bgMusic.play().catch(error => {
                    // ป้องกัน error หากเบราว์เซอร์ยังบล็อกการเล่นอยู่
                });
            }
        }
    });


    // ------------------------------------
    // 3. Logic เสียง Hover (Sound Effect)
    // ------------------------------------
    const playHoverSound = () => {
        if (hoverSound) {
            hoverSound.currentTime = 0; // รีเซ็ตเวลาเพื่อเล่นซ้ำได้ทันที
            hoverSound.volume = 0.5;    // ปรับระดับเสียง
            hoverSound.play().catch(e => {
                // จัดการ Error
            });
        }
    };

    // องค์ประกอบทั้งหมดที่ต้องการให้มีเสียง Hover
    const hoverElements = document.querySelectorAll(
        '.profile-circle, .start-button, .social-icon'
    );

    // ใส่ Listener ให้กับทุกองค์ประกอบ
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', playHoverSound);
    });

});