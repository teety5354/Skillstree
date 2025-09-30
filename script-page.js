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