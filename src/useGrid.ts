const createGrid = () => {
    let grid: number[] = []
    let source: number | null = null;
    let target: number | null = null;
    let obstacles: number[] = []

    let rows = 0;
    let cols = 0;
    let total_cells = 0

    const get_total_cells = (): number => {
	return total_cells;
    }

    const set_cols = (_cols: number) => {
	cols = _cols;
	total_cells = cols * rows;
	unset_all();
    }

    const set_rows = (_rows: number) => {
	rows = _rows;
	total_cells = rows * cols;
	unset_all();
    }

    const create = () => {
	grid = Array(rows * cols).fill(Infinity);	
	_set_source_from_index();
	_set_obstacles_from_indexes();
	total_cells = rows * cols;
    }

    const reset = () => {
	source = null;
	target = null;
	obstacles = [];

	for (let i = 0; i < total_cells; i++) {
	    grid[i] = Infinity
	}
    }

    const get_source = () => source;
    const get_target = () => target
    const get_obstacles = () => obstacles;

    const set_obstacle = (row: number, col: number) => {
	if (can_be_obstacle(row, col)) {
	    grid[row * cols + col] = -1;
	}
    }

    const _set_obstacles_from_indexes = () => {
	for (let index of obstacles) {
	    grid[index] = -1;
	}
    }

    const set_source = (row: number, col: number) => {
	if (can_be_source(row, col)) {
	    source = row * cols + col
	}
    }

    const _set_source_from_index = () => {
	if (source !== null) {
	    grid[source] = 0;
	} else {
	    console.log("source not set, watch out!");
	}
    }

    const set_target = (row: number, col: number) => {
	if (can_be_target(row, col)) {
	    target = row * cols + col;
	}
    }

    const get_weight_from_index = (index: number): number => {
	return grid[index];
    }

    const set_weight_from_index = (index: number, val: number) => {
	grid[index] = val;
    }

    const reset_weights = () => {
	for (let i = 0; i < total_cells; i++) {
	    const weight = grid[i];
	    if (weight === 0 || weight === -1) {
		continue;
	    }
	    grid[i] = Infinity;
	}
    }

    const can_be_obstacle = (row: number, col: number): boolean => {
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

    const reset_obstacles = () => {
	obstacles = [];
    }

    const save_obstacle = (row: number, col: number) => {
	if (can_be_obstacle(row, col)) {
	    obstacles.push(row * cols + col);
	}
    }
    
    const is_obstacle = (row: number, col: number) => {
	return grid[row * cols + col] == -1;
    }

    const is_obstacle_from_index = (index: number) => {
	return grid[index] == -1;
    }

    const _isSource = (index: number) => {
	return index === source;
    }

    const is_source_from_index = (index: number) => {
	return index === source;
    }

    const is_target_from_index = (index: number) => {
	return index === target;
    }

    const is_source = (row: number, col: number) => {
	return row * cols + col === source;
    }
    
    const can_be_source = (row: number, col: number) => {
	const index = row * cols + col;
	return !_isTarget(index) && !_isObstacle(index);
    }

    const can_be_target = (row: number, col: number) => {
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

    const is_target = (row: number, col: number) => {
	return row * cols + col === target;
    }

    const source_is_set = () => source !== null;
    const target_is_set = () => target !== null;
    const has_obstacles = () => obstacles.length > 0;

    const unset_source = () => { source = null }
    const unset_target = () => { target = null }
    const unset_obstacles = () => { 
	obstacles = []
    }

    const get_neighbours_as_indexes = (index: number): number[] => {
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

    const get_cells = () => {
	return grid;	
    }

    const _actual_neighbours = (indexes: number[]): number[] => {
	let actual_neighbours = [];
	for (let n of indexes) {
	    if (!is_obstacle_from_index(n)) {
		actual_neighbours.push(n);
	    }
	}
	return actual_neighbours;
    }

    const unset_all = () => {
	unset_source();	
	unset_target();
	unset_obstacles();
	grid = Array(rows * cols).fill(Infinity);	
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

    const get_rows = () => rows;
    const get_cols = () => cols;

    return {
	create,
	can_be_obstacle,
	can_be_source,
	can_be_target,
	repr,
	get_cols,
	get_rows,

	get_weight_from_index,
	set_weight_from_index,
	get_neighbours_as_indexes,

	save_obstacle,
	unset_all,

	set_target,
	set_source,
	set_obstacle,
	set_cols,
	set_rows,

	get_obstacles,
	get_source,
	get_target,


	is_target,
	is_source,
	is_obstacle,
	is_source_from_index,
	is_target_from_index,
	is_obstacle_from_index,


	unset_source,
	unset_target,
	unset_obstacles,

	target_is_set,
	source_is_set,
	has_obstacles,

	get_cells,
	get_total_cells,
	reset,
	reset_weights,
	reset_obstacles,
    }
}

export const AlgoGrid = createGrid();
