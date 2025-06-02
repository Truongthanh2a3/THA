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
            // piece.draggable = true; // Bỏ drag & drop chuột
            
            // Tính toán vị trí background cho mỗi mảnh
            const row = Math.floor(i / 3);
            const col = i % 3;
            piece.style.backgroundImage = `url(${this.imageA})`;
            piece.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
            
            // Lưu vị trí đúng
            this.correctPositions.push(i);
            
            // Thêm event listeners cho cảm ứng (touch)
            piece.addEventListener('touchstart', this.handleTouchStart.bind(this));
            piece.addEventListener('touchend', this.handleTouchEnd.bind(this));
            
            this.grid.appendChild(piece);
            this.pieces.push(piece);
        }
        
        // Xáo trộn các mảnh
        this.shufflePieces();
        // Biến lưu mảnh đang chọn
        this.selectedPiece = null;
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

    handleTouchStart(e) {
        e.preventDefault();
        const piece = e.target.closest('.puzzle-piece');
        if (!piece) return;
        // Nếu chưa chọn mảnh nào, chọn mảnh này
        if (!this.selectedPiece) {
            this.selectedPiece = piece;
            piece.classList.add('dragging');
        } else if (this.selectedPiece === piece) {
            // Nếu chạm lại chính nó thì bỏ chọn
            piece.classList.remove('dragging');
            this.selectedPiece = null;
        } else {
            // Nếu đã chọn mảnh trước đó, thực hiện hoán đổi
            this.swapPieces(this.selectedPiece, piece);
            this.selectedPiece.classList.remove('dragging');
            this.selectedPiece = null;
        }
    }

    handleTouchEnd(e) {
        // Không cần xử lý gì thêm ở đây
    }

    swapPieces(pieceA, pieceB) {
        const indexA = this.pieces.indexOf(pieceA);
        const indexB = this.pieces.indexOf(pieceB);
        if (indexA > -1 && indexB > -1 && pieceA !== pieceB) {
            // Hoán đổi vị trí trong mảng
            [this.pieces[indexA], this.pieces[indexB]] = [this.pieces[indexB], this.pieces[indexA]];
            // Hoán đổi vị trí trong DOM
            const nextA = pieceA.nextSibling;
            const nextB = pieceB.nextSibling;
            this.grid.insertBefore(pieceA, nextB);
            this.grid.insertBefore(pieceB, nextA);
            // Kiểm tra hoàn thành
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
        this.message.innerHTML = 'Chúc mừng em đã hoàn thành trò chơi nho nhỏ này nhé!<br><br>' +
            'Anh làm ra cái mini game này là để thay thế cho những chủ đề thú vị<br>' +
            'hay những câu chuyện cười trong cuộc nói chuyện của mình.<br><br>' +
            'Anh dân IT nên anh có thể sẽ hơi nhạt<br>' +
            'nhưng mà anh sẽ làm cho em thứ anh giỏi nhất :33';
        this.message.classList.add('show');
        this.message.style.textAlign = 'center';
        this.message.style.padding = '18px 8px 8px 8px';
        this.message.style.margin = '0 auto 12px auto';
        this.message.style.maxWidth = '95vw';
        this.message.style.wordBreak = 'break-word';
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
            const audio = document.getElementById('bgMusic');
            if (audio) {
                localStorage.setItem('bgMusicTime', audio.currentTime);
            }
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

    // Phát nhạc từ thời điểm đã lưu (nếu có)
    const savedTime = localStorage.getItem('bgMusicTime');
    if (audio && savedTime) {
        audio.currentTime = parseFloat(savedTime);
        audio.play();
        localStorage.removeItem('bgMusicTime');
    }
}); 