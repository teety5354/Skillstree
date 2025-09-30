// ในไฟล์ script1.js

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