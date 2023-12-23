export const _create_grid = (el: HTMLElement, rows: number, cols: number, gap: boolean) => {
    el.style.setProperty("grid-template-columns", `repeat(${cols}, 1fr`);
    el.style.setProperty("grid-template-rows", `repeat(${rows}, 1fr`);
    for (let i = 0; i < rows; i++) {
	for (let j = 0; j < cols; j++) {
	    const cell = document.createElement("div");
	    if (gap) {
		cell.classList.add("algo-cell-full");
	    } else {
		if (j == 0) {
		    cell.classList.add("algo-first-col-cell");
		}
		if (i == 0) {
		    cell.classList.add("algo-first-row-cell");
		}
		cell.classList.add("algo-cell");
	    }
	    el.appendChild(cell);
	}
    }
}

export const _update_gap = (el: HTMLElement, rows: number, cols: number, gap: boolean) => {
    if (gap) return _update_gap_yesgap(el, rows, cols);
    return _update_gap_nogap(el, rows, cols); 
}

const _update_gap_yesgap = (el: HTMLElement, rows: number, cols: number) => {
    for (let i = 0; i < rows; i++) {
	let start = i * cols;
	for (let j = 0; j < cols; j++) {
	    const cell = el.children[start + j];
	    cell.classList.add("algo-cell-full");
	} 
    }
}

const _update_gap_nogap = (el: HTMLElement, rows: number, cols: number) => {
    for (let i = 0; i < rows; i++) {
	let start = i * cols;
	for (let j = 0; j < cols; j++) {
	    const cell = el.children[start + j];
	    cell.classList.remove("algo-cell-full");
	    if (j == 0) {
		cell.classList.add("algo-first-col-cell");    
	    }
	    if (i == 0) {
		cell.classList.add('algo-first-row-cell');
	    }
	    cell.classList.add("algo-cell");
	 }
    } 
}

export const _get_coordinates = (settings: any, x: number, y: number) => {
    if (settings["gap"] > 0) {
	return _get_coordinates_yesgap(settings, x, y);
    }
    return _get_coordinates_nogap(settings, x, y);
}

const _get_coordinates_yesgap = (settings: any, x: number, y: number) => {
    const gap = settings["gap"];
    const actualX = x - settings["startX"];
    const actualY = y - settings["startY"];
    const cellW = settings["cellW"];
    const cellH = settings["cellH"];

    const totalCellWidth = cellW + settings["gap"];
    const maybeCol= Math.floor(actualX / totalCellWidth);
    const xCompare = cellW * ( maybeCol + 1 ) +  settings["gap"] * maybeCol;

    const totalCellHeight = cellH + settings["gap"];
    const maybeRow = Math.floor(actualY / totalCellHeight);
    const yCompare = cellH * ( maybeRow + 1 ) + settings["gap"] * maybeRow;
    if (actualX > xCompare || actualY > yCompare) {
	return null;
    }
    return { row: maybeRow, col: maybeCol };

}

const _get_coordinates_nogap = (settings: any, x: number, y: number) => {
    const gap = settings["gap"];
    const actualX = x - settings["startX"];
    const actualY = y - settings["startY"];
    const cellW = settings["cellW"];
    const cellH = settings["cellH"];
    const col = Math.floor(actualX / cellW);
    const row = Math.floor(actualY / cellH);
    return { row, col }

}

export const create_grid_state = () => {
    let grid: number[] = []
    let source: number | null = null;
    let target: number | null = null;
    let obstacles: number[] = []

    let rows = 0;
    let cols = 0;
    let total_cells = 0

    const setCols = (_cols: number) => {
	cols = _cols;
    }
    const setRows = (_rows: number) => {
	rows = _rows;
    }
    const create = () => {
	grid = Array(rows * cols).fill(Infinity);	
	_set_source_from_index();
	_set_obstacles_from_indexes();
	total_cells = rows * cols;
    }

    const getSource = () => source;
    const getTarget = () => target
    const getObstacles = () => obstacles;

    const setObstacle = (row: number, col: number) => {
	grid[row * cols + col] = -1;
    }

    const _set_obstacles_from_indexes = () => {
	for (let index of obstacles) {
	    grid[index] = -1;
	}
    }

    const setSource = (row: number, col: number) => {
	source = row * cols + col
    }

    const _set_source_from_index = () => {
	if (source !== null) {
	    grid[source] = 0;
	} else {
	    console.log("source not set, watch out!");
	}
    }

    const setTarget = (row: number, col: number) => {
	target = row * cols + col;
    }

    const getWeightFromIndex = (index: number): number => {
	return grid[index];
    }

    const setWeightFromIndex = (index: number, val: number) => {
	grid[index] = val;
    }

    const canBeObstacle = (row: number, col: number): boolean => {
	const index = row * cols + col;
	return (index !== source) && (index !== target) && !_in_obstacles_from_index(index);
    }

    const _in_obstacles_from_index = (index: number): boolean => {
	for (let obs of obstacles) {
	    if (obs === index) {
		return true;
	    }
	}
	return false;
    }

    const saveObstacle = (row: number, col: number) => {
	obstacles.push(row * cols + col);
    }
    
    const isObstacle = (row: number, col: number) => {
	return grid[row * cols + col] == -1;
    }

    const isObstacleFromIndex = (index: number) => {
	return grid[index] == -1;
    }

    const _isSource = (index: number) => {
	return index === source;
    }

    const isSourceFromIndex = (index: number) => {
	return index === source;
    }

    const isTargetFromIndex = (index: number) => {
	return index === target;
    }

    const isSource = (row: number, col: number) => {
	return row * cols + col === source;
    }
    
    const canBeSource = (row: number, col: number) => {
	const index = row * cols + col;
	return !_isTarget(index) && !_isObstacle(index);
    }

    const canBeTarget = (row: number, col: number) => {
	const index = row * cols + col;
	return !_isSource(index) && !_isObstacle(index);
    }

    const _isTarget = (index: number) => target === index;
    const _isObstacle = (index: number) => {
	for (let obs of obstacles) {
	    if (obs === index) return true;
	}
	return false;
    }

    const isTarget = (row: number, col: number) => {
	return row * cols + col === target;
    }

    const sourceIsSet = () => source !== null;
    const targetIsSet = () => target !== null;
    const hasObstacles = () => obstacles.length > 0;

    const unsetSource = () => { source = null }
    const unsetTarget = () => { target = null }
    const unsetObstacles = () => { 
	obstacles = []
    }

    const getNeighboursAsIndexes = (index: number): number[] => {
	// get all the neighbours of a specific node
	// return a list with all the neighbours as indexes
	
	// first check if the index is the first column
	if ((index % cols) === 0) {
	    if (index == 0) {
		// this is the top left cell
		return _actual_neighbours([1, cols]);
	    }

	    // bottom left cell
	    if (index === total_cells - cols) {
		return _actual_neighbours([index - cols, index + 1]);
	    }
	    
	    return _actual_neighbours([ index + 1, index - cols, index + cols ]);
	}

	// check if it belongs to the last column
	if (((index + 1) % cols) === 0) {
	    // check top right
	    if (index === cols - 1) {
		return _actual_neighbours([index - 1, index + cols]);
	    }

	    // check bottom right
	    if (index === total_cells -1) {
		return _actual_neighbours([index - 1, index - cols]);
	    }

	    return _actual_neighbours([index - 1, index + cols, index - cols]);
	}

	// check if it belongs to the first row
	if (index > 0 && index < cols) {
	    return _actual_neighbours([index - 1, index + 1, index + cols]);
	}

	// check if it's the last row
	if (index < total_cells && index > total_cells - cols) {
	    return _actual_neighbours([index - cols, index + 1, index - 1]); 
	}

	// all the borders have been checked, now what's left are the inner columns
	const temp = [index + cols, index - cols, index - 1, index + 1];
	return _actual_neighbours(temp);
    }

    const getCells = () => {
	return grid;	
    }

    const _actual_neighbours = (indexes: number[]): number[] => {
	let actual_neighbours = [];
	for (let n of indexes) {
	    if (!isObstacleFromIndex(n)) {
		actual_neighbours.push(n);
	    }
	}
	return actual_neighbours;
    }

    const unsetAll = () => {
	unsetSource();	
	unsetTarget();
	unsetObstacles();
    }
    
    const repr = () => {
	const stringy = `
	source: ${source},
	target: ${target},
	grid: ${repr_grid()}
	`
	console.log(stringy);
    }

    const repr_grid = () => {
	let finalString = ''
	for (let row = 0; row < rows; row++) {
	    for (let col = 0; col < cols; col++) {
		finalString + col;
	    }
	    finalString + '\n';
	}
	return finalString;
    }

    const getRows = () => rows;
    const getCols = () => cols;

    return {
	create,
	canBeObstacle,
	canBeSource,
	canBeTarget,
	repr,
	getCols,
	getRows,

	getWeightFromIndex,
	setWeightFromIndex,
	getNeighboursAsIndexes,

	saveObstacle,
	unsetAll,

	setTarget,
	setSource,
	setObstacle,
	setCols,
	setRows,

	getObstacles,
	getSource,
	getTarget,


	isTarget,
	isSource,
	isObstacle,
	isSourceFromIndex,
	isTargetFromIndex,
	isObstacleFromIndex,


	unsetSource,
	unsetTarget,
	unsetObstacles,

	targetIsSet,
	sourceIsSet,
	hasObstacles,

	getCells
    }
}
