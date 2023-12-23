
export const useDijkstra = (_grid: any, _el: HTMLElement) => {
    const queue: number[] = [];
    const el = _el;

    let _qlength: number = 0;
    const grid = _grid;

    let curr_cell_classes = ["purple", "lighten-2"];
    let n_cell_classes = ["purple", "lighten-4"];
    let visited_cell_classes = ["purple", "accent-1"];

    const _visited_list = Array(grid.getRows() * grid.getCols()).fill(false);
    const _mark_visited = (gridindex: number) => {
	_visited_list[gridindex] = true;
    }
    const _is_visited = (gridindex: number) => _visited_list[gridindex];
    const _pred_list: Array<null | number> = Array(grid.getRows() * grid.getCols()).fill(null);
    const _set_pred = (mainnode: number, prednode: number) => {
	_pred_list[mainnode] = prednode;
    }
    const _get_pred = (node: number): number | null => {
	return _pred_list[node];	
    }

    const _create_queue = () => {
	// first get the source and place it at the beginning of the queue;
	queue.push(grid.getSource());
	_qlength++;
	
	// then push all the cells which are not neighbours
	for (let i = 0; i < grid.getCols() * grid.getRows(); i++) {
	    if (grid.isSourceFromIndex(i) || grid.isObstacleFromIndex(i)) {
		continue;
	    }
	    queue.push(i);
	    _qlength++;
	}
    }

    const _get_min_queue = (): number => {
	const min = queue[0];
	_remove(0);
	return min;
    }
    
    const _get_node_position = (gridIndex: number): number => {
	for (let i = 0; i < _qlength; i++) {
	    if (queue[i] == gridIndex) return i;
	}
	console.log("oopsy, bad algorithm");
	return 0;
    }


    const _repr_queue = () => {
	const weights = []
	for (let i = 0; i < _qlength; i++) {
	    weights.push(grid.getWeightFromIndex(queue[i]));
	} 

	for (let i = 0; i < _qlength; i++) {
	    console.log(queue[i], weights[i]);
	} 
    }

    const _update_queue_weight= (gridindex: number, new_weight: number) => {
	// in order for this to work the grid must update the weight first
	// first we need to locate the position of the node 
	// inside of the queue
	// we are using a naive approach, so we loop through all the
	// nodes and check if the numbers match
	const qindex = _get_node_position(gridindex);
	// first you remove it using the old weight
	_remove(qindex);
	// now you add it after setting the new weight
	grid.setWeightFromIndex(gridindex, new_weight);
	_push(gridindex);
    }

    const _push = (gridIndex: number) => {
	_qlength++;
	const last = _qlength - 1;
	queue[last] = gridIndex;
	_goup(last);
    }

    const _swap = (qindex: number, q2index: number) => {
	const first = queue[qindex];	
	queue[qindex] = queue[q2index];
	queue[q2index] = first;
    }

    const _left = (qindex: number) => {
	return qindex * 2 + 1;
    }

    const _right = (qindex: number) => {
	return qindex * 2 + 2;
    }

    const _parent = (qindex: number) => {
	return Math.floor(qindex / 2);
    }

    const _remove = (qindex: number) => {
	const last = _qlength - 1;
	_swap(qindex, last);
	_qlength--;
	return _godown(qindex);
    }

    const getWeightFromQindex = (qindex: number) => {
	const weight = grid.getWeightFromIndex(queue[qindex]);
	return weight
    }

    const _godown = (qindex: number): void => {
	const left = _left(qindex);
	const right = _right(qindex);
	const curr_weight = getWeightFromQindex(qindex);
	let min = 0;
	let min_weight = 0;

	if (left < _qlength) {
	    const weight_left = getWeightFromQindex(left);
	    min = left;
	    min_weight = weight_left;
	    if (right < _qlength) {
		const weight_right = getWeightFromQindex(right);
		if (weight_left <= weight_right) {
		    min = left 
		    min_weight = weight_left;
		} else {
		    min = right;
		    min_weight = weight_right;
		}
	    }

	    if (curr_weight > min_weight) {
		_swap(qindex, min);
		return _godown(min);
	    }

	    return;
	}

	else if (right < _qlength) {
	    const weight_right = getWeightFromQindex(right);
	    if (curr_weight > weight_right) {
		_swap(right, qindex);
		return _godown(right);
	    }
	}
    }


    const _goup = (qindex: number): void => {
	if (qindex <= 0) return;
	const curr_weight = getWeightFromQindex(qindex);
	const par = _parent(qindex);
	const weight_parent = getWeightFromQindex(par);
	if (curr_weight < weight_parent) {
	    _swap(qindex, par);
	    return _goup(par);
	}
    }

    const _nodes_are_equal = (node1: number, node2: number) => {	
	return node1 == node2;
    }

    const retrieve_path = () => {
	let final_path: number[] = [];
	let currnode = target;
	const pred = _get_pred(currnode);
	if (pred == null) {
	    return [];
	}
	currnode = pred;
	while (true) {
	    const pred = _get_pred(currnode);
	    if (pred == null) break;
	    final_path.push(currnode);
	    currnode = pred;
	}
	return final_path;
    }

    let target: number = 0;
    let finished = true;

    const setup = () => {
	_create_queue();
	target = grid.getTarget();
    };

    const visit_neighbours = (currnode: number, currweight: number) => {
	const ns = grid.getNeighboursAsIndexes(currnode);
	for (let n of ns) {
	    // run the actual logic
	    const nweight = grid.getWeightFromIndex(n);
	    const new_potential_weight = currweight + 1;
	    if (new_potential_weight < nweight && !_is_visited(n)) {
		activate_n_cell(n);
		_set_pred(n, currnode);
		_update_queue_weight(n, new_potential_weight);
	    }
	}
	// remember the neighbours
	previous_n_cells = ns;
    }

    const activate_cell = (cell: number, classes: string[]) => {
	const dummy = async () => {
	    await new Promise(r => setTimeout(r, 500));
	} 
	dummy()
	const cellHTML = el.children[cell];
	cellHTML.classList.add(...classes);
    }

    const deactivate_cell = (cell: number, classes: string[]) => {
	const cellHTML = el.children[cell];
	cellHTML.classList.remove(...classes);
    }

    const activate_curr_cell = (cell: number) => {
	return activate_cell(cell, curr_cell_classes);
    }

    const deactivate_curr_cell = (cell: number) => {
	deactivate_cell(cell, curr_cell_classes);
	activate_cell(cell, visited_cell_classes);
    }

    const activate_n_cell = (cell: number) => {
	return activate_cell(cell, n_cell_classes);
    }
    
    const deactivate_n_cell = (cell: number) => {
	return deactivate_cell(cell, n_cell_classes);
    }

    let previous_n_cells: number[] = []
    let previous_curr = 0;

    const step_one = (): boolean => {
	// technically when the function returns false
	// the algorithm has ended and you cannot really step into it
	
	// first deactivate the previous curr cell
	if (previous_curr != grid.getSource()) {
	    activate_cell(previous_curr, ["grey"]);
	}

	// deactivate the previous neighbours
	for (let n of previous_n_cells) {
	    deactivate_n_cell(n); 
	}


	const currnode: number = _get_min_queue();
	const currweight = grid.getWeightFromIndex(currnode);

	// activate the current cell
	activate_curr_cell(currnode);

	if (_nodes_are_equal(target, currnode)) {
	    finished = true;
	    return true;
	}

	visit_neighbours(currnode, currweight);
	_mark_visited(currnode);
	previous_curr = currnode;
	return false;
    }

    const stepall = () => {
	while (!step_one()) { }
    }

    const get_path = () => {
	return retrieve_path()
    }

    const clean = () => {
	for (let child of el.children) {
	    child.classList.remove(...visited_cell_classes, "grey");
	}
    }

    setup();

    return {
	step_one,
	stepall,
	get_path,
	clean,

    }

}

