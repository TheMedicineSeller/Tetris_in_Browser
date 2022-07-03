document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))

    const startButton = document.querySelector('#start_button')
    
    const scoreDisplay = document.querySelector('#score')
    let Score = 0 

    /* --------CONSTANTS--------
        width,
        Oblock, Iblock ... ,Zblock,
        BLOCKS,
        StyleMap
    */
    const width = 10
    const Oblock = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]
    const Iblock = [
        [1, width + 1, width*2 + 1, width*3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width*2 + 1, width*3 + 1],
        [width, width + 1, width + 2, width + 3]
        
    ]
    const Tblock = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width*2 + 1],
        [width, width + 1, width + 2, width*2 + 1],
        [1, width, width + 1, width*2 + 1]
    ]
    const Lblock = [
        [1, width + 1, width*2 + 1, 2],
        [width, width + 1, width + 2, width*2 + 2],
        [1, width + 1, width*2 + 1, width*2],
        [width, width*2, width*2 + 1, width*2 + 2]
    ]
    const Zblock = [
        [0, width, width + 1, width*2 + 1],
        [width + 1, width + 2, width*2, width*2 + 1],
        [0, width, width + 1, width*2 + 1],
        [width + 1, width + 2, width*2, width*2 + 1]
    ]

    const BLOCKS = [Oblock, Iblock, Tblock, Lblock, Zblock]

    const styleMap = [
        'Oblock',
        'Iblock',
        'Tblock',
        'Lblock',
        'Zblock'
    ]
    /* --------GLOBAL VARIABLES--------
        Blockidx,
        BlockOrientationidx,
        currentBlock,
        position
    */
    const initial_offset = Math.floor(Math.random() * (width - 1))
    let Blockidx = Math.floor(Math.random() * BLOCKS.length)
    let NextBlockidx = 0

    let BlockOrientationidx = Math.floor(Math.random() * BLOCKS[Blockidx].length)

    let currentBlock = BLOCKS[Blockidx][BlockOrientationidx]
    let position = initial_offset

    function draw() {
        currentBlock.forEach(idx => {
            squares[idx + position].classList.add('tetris_block')
            squares[idx + position].classList.add(styleMap[Blockidx])
        })
    }

    function erase() {
        currentBlock.forEach(idx => {
            squares[idx + position].classList.remove('tetris_block')
            squares[idx + position].classList.remove(styleMap[Blockidx])
        })
    }
    
    function HandleCollision() {
        if (currentBlock.some(idx => squares[position + idx + width].classList.contains('static_block'))) {
            currentBlock.forEach(idx => squares[position + idx].classList.add('static_block'))

            // Create and actuate new block
            Blockidx = NextBlockidx
            NextBlockidx = Math.floor(Math.random() * BLOCKS.length)
            position = Math.floor(Math.random() * (width - 1))
            
            currentBlock = BLOCKS[Blockidx][BlockOrientationidx]
            draw()
            displayUpcomingBlock()
            UpdateScore()

            if(currentBlock.some(idx => squares[position + idx].classList.contains('static_block'))) {
                scoreDisplay.innerHTML = 'GAME OVER'
                clearInterval(timerID)
            }
        }
    }
    
    function fall() {
        erase()
        position += width
        draw()
        HandleCollision()
    }

    function moveLeft() {
        erase()
        if (! currentBlock.some(idx => ((position + idx) % width) === 0))
            position -= 1
        if (currentBlock.some(idx => squares[position + idx].classList.contains('static_block')))
            position += 1
        draw()
    }
    function moveRight() {
        erase()
        if (! currentBlock.some(idx => ((position + idx) % width) === width - 1))
            position += 1
        if (currentBlock.some(idx => squares[position + idx].classList.contains('static_block')))
            position -= 1
        draw()
    }

    function rotateBlock() {
        erase()
        BlockOrientationidx ++
        if (BlockOrientationidx === 4)
            BlockOrientationidx = 0
        currentBlock = BLOCKS[Blockidx][BlockOrientationidx]
        draw()
    }
    

    function EventHandler (event) {
        if (event.keyCode === 65) {
            moveLeft()
        }
        else if (event.keyCode === 87) {
            rotateBlock()
        }
        else if (event.keyCode === 68) {
            moveRight()
        }
        else if (event.keyCode === 83) {
            fall()
        }
    }
    
    /*The type specifies when the evnetHandler needs to be called. 'keyup' makes EventHandling call whenever a key is released after press and keydown, on press*/
    document.addEventListener('keyup', EventHandler)
    
    const view_squares = document.querySelectorAll('.view_grid div')
    const offset = 1
    
    const view_width = 4
    const unrotatedBLOCKS = [
        [0, 1, view_width, view_width + 1],
        [1, view_width + 1, view_width*2 + 1, view_width*3 + 1],
        [1, view_width, view_width + 1, view_width + 2],
        [1, view_width + 1, view_width*2 + 1, 2],
        [0, view_width, view_width + 1, view_width*2 + 1]
    ]

    let view_currentidx = 0

    function displayUpcomingBlock () {
        view_squares.forEach(square => {
            square.classList.remove('tetris_block')
            square.classList.remove(styleMap[Blockidx])
        })
        
        unrotatedBLOCKS[NextBlockidx].forEach(idx => {
            view_squares[offset + idx].classList.add('tetris_block')
            view_squares[offset + idx].classList.add(styleMap[NextBlockidx])
        })
    }

    function UpdateScore () {
        for (let rowstart = 0; rowstart < 199; rowstart += width) {
            const row = [rowstart, rowstart+1, rowstart+2, rowstart+3, rowstart+4, rowstart+5, rowstart+6, rowstart+7, rowstart+8, rowstart+9]
            
            if (row.every(idx => squares[idx].classList.contains('static_block'))) {
                Score += 10
                scoreDisplay.innerHTML = 'SCORE : ' + Score
                
                row.forEach(idx => {
                    // Remove all classes
                    squares[idx].removeAttribute("class")
                })

                const rowRemoved = squares.splice(rowstart, width)
                squares = rowRemoved.concat(squares)
                squares.forEach(square => grid.appendChild(square))
            }
        }
    }

    /* EVENT LOOP TIMER DECLARATION */
    let timerID

    startButton.addEventListener('click', () => {
        if (timerID) {
            clearInterval(timerID)
            timerID = null
        }
        else {
            draw()
            timerID = setInterval(fall, 1000)
            NextBlockidx = Math.floor(Math.random() * BLOCKS.length)
            displayUpcomingBlock()
        }
    })
    
})