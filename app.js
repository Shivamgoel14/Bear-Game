document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.querySelector(".grid-container");
    const size = 4;
    const maxBearValue = 4; 
    let grid = Array(size).fill().map(() => Array(size).fill(0));
    const images = [
        'images/child-bear.jpeg',   // Represents 2
        'images/big-bear.jpg',     // Represents 4
        'images/Adult-Bear.jpg',   // Represents 8
        'images/Senior-bear.jpeg'  // Represents 16
    ];

    function createBoard() {
        for (let i = 0; i < size * size; i++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            gridContainer.appendChild(cell);
        }
        addBear();
        addBear();
        updateBoard();
    }

    function addBear() {
        let emptyCells = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length > 0) {
            let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[r][c] = 1; // 1 represents a small bear (2 in 2048)
        }
    }

    function updateBoard() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach((cell, i) => {
            const row = Math.floor(i / size);
            const col = i % size;
            cell.innerHTML = '';
            if (grid[row][col] !== 0) {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                const img = document.createElement("img");
                img.src = images[Math.min(grid[row][col] - 1, maxBearValue - 1)];
                tile.appendChild(img);
                cell.appendChild(tile);
            }
        });
    }

    function move(direction) {
        let moved = false;
        if (direction === "up" || direction === "down") {
            for (let c = 0; c < size; c++) {
                let col = [];
                for (let r = 0; r < size; r++) {
                    col.push(grid[r][c]);
                }
                const newCol = direction === "up" ? slide(col) : slide(col.reverse()).reverse();
                for (let r = 0; r < size; r++) {
                    if (grid[r][c] !== newCol[r]) {
                        moved = true;
                        grid[r][c] = newCol[r];
                    }
                }
            }
        } else if (direction === "left" || direction === "right") {
            for (let r = 0; r < size; r++) {
                let row = grid[r].slice();
                const newRow = direction === "left" ? slide(row) : slide(row.reverse()).reverse();
                if (grid[r].toString() !== newRow.toString()) {
                    moved = true;
                    grid[r] = newRow;
                }
            }
        }
        if (moved) {
            addBear();
            updateBoard();
            if (isGameOver()) {
                setTimeout(() => {
                    alert("Game Over!");
                }, 200);
            }
        }
    }

    function slide(array) {
        let newArray = array.filter(val => val);
        for (let i = 0; i < newArray.length - 1; i++) {
            if (newArray[i] === newArray[i + 1] && newArray[i] < maxBearValue) {
                newArray[i]++;
                newArray.splice(i + 1, 1);
                newArray.push(0);
            }
        }
        while (newArray.length < size) {
            newArray.push(0);
        }
        return newArray;
    }

    function isGameOver() {
        // Check if any cell is empty
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === 0) {
                    console.log('Empty cell found, game continues');
                    return false;
                }
            }
        }
        // Check if any adjacent cells can merge
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (c < size - 1 && grid[r][c] === grid[r][c + 1] && grid[r][c] < maxBearValue) {
                    console.log('Possible merge found horizontally, game continues');
                    return false;
                }
                if (r < size - 1 && grid[r][c] === grid[r + 1][c] && grid[r][c] < maxBearValue) {
                    console.log('Possible merge found vertically, game continues');
                    return false;
                }
            }
        }
        console.log('No moves left, game over');
        return true;
    }

    function addBear() {
        let emptyCells = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (grid[r][c] === 0) {
                    emptyCells.push({ r, c });
                }
            }
        }
        if (emptyCells.length > 0) {
            let { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            grid[r][c] = 1; // 1 represents a small bear (2 in 2048)
            updateScore(2); // Increment score by 2 when a bear is added
        }
    }
    
    let score = 0;
    
    function updateScore(points) {
        score += points;
        document.getElementById("score").textContent = score;
    }

    function handleKeyPress(e) {
        if (e.key === "ArrowUp") move("up");
        if (e.key === "ArrowDown") move("down");
        if (e.key === "ArrowLeft") move("left");
        if (e.key === "ArrowRight") move("right");
    }

    document.addEventListener("keydown", handleKeyPress);
    createBoard();
});
