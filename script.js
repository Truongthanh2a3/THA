class PuzzleGame {
    constructor() {
        this.grid = document.getElementById('puzzleGrid');
        this.message = document.getElementById('message');
        this.pieces = [];
        this.correctPositions = [];
        this.isComplete = false;
        
        // Đường dẫn ảnh
        this.imageA = 'imageA.jpg'; // Ảnh chính cần ghép
        this.imageB = 'imageB.jpg'; // Ảnh bất ngờ
        
        this.init();
    }

    init() {
        // Tạo 9 mảnh ghép
        for (let i = 0; i < 9; i++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.draggable = true;
            
            // Tính toán vị trí background cho mỗi mảnh
            const row = Math.floor(i / 3);
            const col = i % 3;
            piece.style.backgroundImage = `url(${this.imageA})`;
            piece.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
            
            // Lưu vị trí đúng
            this.correctPositions.push(i);
            
            // Thêm các event listeners
            piece.addEventListener('dragstart', this.handleDragStart.bind(this));
            piece.addEventListener('dragend', this.handleDragEnd.bind(this));
            piece.addEventListener('dragover', this.handleDragOver.bind(this));
            piece.addEventListener('drop', this.handleDrop.bind(this));
            
            this.grid.appendChild(piece);
            this.pieces.push(piece);
        }
        
        // Xáo trộn các mảnh
        this.shufflePieces();
    }

    shufflePieces() {
        // Xáo trộn mảng pieces
        for (let i = this.pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.pieces[i], this.pieces[j]] = [this.pieces[j], this.pieces[i]];
        }
        // Xóa hết các mảnh khỏi grid
        this.grid.innerHTML = '';
        // Thêm lại các mảnh theo thứ tự mới
        this.pieces.forEach(piece => this.grid.appendChild(piece));
    }

    handleDragStart(e) {
        e.target.classList.add('dragging');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const draggingPiece = document.querySelector('.dragging');
        const dropTarget = e.target.closest('.puzzle-piece');
        
        if (draggingPiece && dropTarget && draggingPiece !== dropTarget) {
            // Lấy chỉ số của hai mảnh trong mảng pieces
            const draggingIndex = this.pieces.indexOf(draggingPiece);
            const dropIndex = this.pieces.indexOf(dropTarget);

            // Hoán đổi vị trí trong DOM
            if (draggingIndex > -1 && dropIndex > -1) {
                // Hoán đổi vị trí trong mảng
                [this.pieces[draggingIndex], this.pieces[dropIndex]] = [this.pieces[dropIndex], this.pieces[draggingIndex]];

                // Hoán đổi vị trí trong DOM
                const draggingNext = draggingPiece.nextSibling;
                const dropNext = dropTarget.nextSibling;
                this.grid.insertBefore(draggingPiece, dropNext);
                this.grid.insertBefore(dropTarget, draggingNext);
            }

            // Kiểm tra xem đã hoàn thành chưa
            this.checkCompletion();
        }
    }

    checkCompletion() {
        // Kiểm tra thứ tự các mảnh trong mảng pieces
        let isCorrect = true;
        for (let i = 0; i < this.pieces.length; i++) {
            const row = Math.floor(i / 3);
            const col = i % 3;
            const correctPos = `${-col * 100}% ${-row * 100}%`;
            if (this.pieces[i].style.backgroundPosition !== correctPos) {
                isCorrect = false;
                break;
            }
        }
        if (isCorrect && !this.isComplete) {
            this.isComplete = true;
            this.showSurprise();
        }
    }

    showSurprise() {
        // Xóa hoàn toàn các mảnh ghép khỏi DOM
        this.pieces.forEach(piece => {
            if (piece.parentNode) {
                piece.parentNode.removeChild(piece);
            }
        });
        // Hiện ảnh B với hiệu ứng fade-in
        const finish = document.getElementById('puzzleFinish');
        finish.style.backgroundImage = `url(${this.imageB})`;
        finish.classList.add('show');
        finish.classList.remove('clickable');
        finish.onclick = null;
        this.message.textContent = 'Chúc mừng em đã hoàn thành trò chơi nho nhỏ này, nhấp vào để nhận món quà nho nhỏ luôn nhé';
        this.message.classList.add('show');
        // Thêm sticker bên dưới lời chúc
        let sticker = document.getElementById('giftSticker');
        if (!sticker) {
            sticker = document.createElement('img');
            sticker.id = 'giftSticker';
            sticker.src = 'sticker.png'; // Bạn cần thêm file sticker.png vào thư mục
            sticker.alt = 'Nhận quà';
            sticker.className = 'gift-sticker';
            sticker.style.marginTop = '16px';
            sticker.style.cursor = 'pointer';
            this.message.parentNode.appendChild(sticker);
        }
        sticker.onclick = () => {
            window.location.href = '/heart/index.html';
        };
    }
}

// Khởi tạo game khi trang đã load
window.addEventListener('load', () => {
    new PuzzleGame();

    // Xử lý nút bật/tắt nhạc
    const audio = document.getElementById('bgMusic');
    const btn = document.getElementById('toggleMusic');
    if (audio && btn) {
        btn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                btn.textContent = '🎵';
            } else {
                audio.pause();
                btn.textContent = '🔇';
            }
        });
        // Đặt icon đúng trạng thái ban đầu
        audio.addEventListener('play', () => btn.textContent = '🎵');
        audio.addEventListener('pause', () => btn.textContent = '🔇');
    }
}); 