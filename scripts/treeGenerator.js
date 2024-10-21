export function renderGameTree(initialBoard, width = 800, height = 600) {
    const PLAYER_X = 0; 
    const PLAYER_O = 1;

    function convertBoardTo1D(board) {
        return board.flat().map(cell => (cell === '_' ? 2 : cell)); 
    }

    function generateGameTree(board, currentPlayer, depth, maxDepth) {
        const winner = checkWinner(board);
        const nodeId = `${board.join(',')}-${currentPlayer}`;

        const label = board.map(cell => (cell === 2 ? ' ' : cell === 0 ? 'X' : 'O')).join(' ');

        const node = {
            id: nodeId,
            label: label,
            children: []
        };

        if (winner !== null || depth >= maxDepth) {
            return node;
        }

        for (let i = 0; i < 9; i++) {
            if (board[i] === 2) {
                const newBoard = [...board];
                newBoard[i] = currentPlayer;
                const nextPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
                const childNode = generateGameTree(newBoard, nextPlayer, depth + 1, maxDepth);
                node.children.push(childNode);
            }
        }

        return node;
    }

    function checkWinner(board) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] !== 2 && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return board.every(cell => cell !== 2) ? 'Draw' : null;
    }

    function initGameTree(initialBoard) {
        const maxDepth = 2;
        const oneDBoard = convertBoardTo1D(initialBoard);
        return generateGameTree(oneDBoard, PLAYER_X, 0, maxDepth);
    }

    const nodes = [];
    const edges = [];

    function traverseTree(node, parentId = null) {
        const nodeId = node.id;
        if (!nodes.find(n => n.id === nodeId)) {
            nodes.push({ id: nodeId, label: node.label });
        }

        if (parentId) {
            edges.push({ from: parentId, to: nodeId });
        }

        node.children.forEach(child => traverseTree(child, nodeId));
    }

    const gameTree = initGameTree(initialBoard);
    traverseTree(gameTree);

    let container = document.getElementById('gameTreeContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'gameTreeContainer';
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
        container.style.backgroundColor = '#43115B';
        document.body.appendChild(container);
    }

    const data = {
        nodes: new vis.DataSet(nodes),
        edges: new vis.DataSet(edges)
    };

    const options = {
        layout: {
            hierarchical: {
                direction: 'UD',
                sortMethod: 'directed',
                nodeSpacing: 200,
                treeSpacing: 200
            }
        },
        physics: false,
        nodes: {
            color: {
                background: '#48D2FE',
                border: '#1F1F1F'
            },
            font: {
                color: '#000000',
                size: 12
            }
        },
        edges: {
            color: {
                color: '#E2BE00',
                highlight: '#E2BE00',
                hover: '#E2BE00'
            },
            width: 2
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            zoomView: true
        }
    };

    if (window.network) {
        window.network.setData(data);
        window.network.moveTo({ scale: 0.5, animation: true });
    } else {
        window.network = new vis.Network(container, data, options);
        window.network.moveTo({ scale: 0.5, animation: true });
    }
}
