import { AlgoGrid } from "./useGrid"
import { gridUiState } from "./state/graphics_state"
import {gridLogicState} from "./state/logic_state";

export const useDijkstra = () => {
    let target: number | null = null;
    let finished: boolean = false;
    const queue: number[] = [];

    let _qlength: number = 0;

    const _visited_list = Array(AlgoGrid.get_total_cells()).fill(false);
    const _mark_visited = (gridindex: number) => {
	_visited_list[gridindex] = true;
    }

    const _is_visited = (gridindex: number) => _visited_list[gridindex];
    const _pred_list: Array<null | number> = Array(AlgoGrid.get_total_cells()).fill(null);
    const _set_pred = (mainnode: number, prednode: number) => {
	_pred_list[mainnode] = prednode;
    }
    const _get_pred = (node: number): number | null => {
	return _pred_list[node];	
    }

    const _create_queue = () => {
	// first get the source and place it at the beginning of the queue;
	queue.push(AlgoGrid.get_source() as number);
	_qlength++;
	
	// then push all the cells which are not neighbours
	for (let i = 0; i < AlgoGrid.get_cols() * AlgoGrid.get_rows(); i++) {
	    if (AlgoGrid.is_source_from_index(i) || AlgoGrid.is_obstacle_from_index(i)) {
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
	    weights.push(AlgoGrid.get_weight_from_index(queue[i]));
	} 

	for (let i = 0; i < _qlength; i++) {
	    console.log(queue[i], weights[i]);
	} 
    }

    const _update_queue_weight = (gridindex: number, new_weight: number) => {
	const qindex = _get_node_position(gridindex);
	_remove(qindex);
	AlgoGrid.set_weight_from_index(gridindex, new_weight);
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
	return (qindex * 2) + 1;
    }

    const _right = (qindex: number) => {
	return (qindex * 2) + 2;
    }

    const _parent = (qindex: number) => {
	return Math.floor((qindex - 1) / 2);
    }

    const _remove = (qindex: number) => {
	const last = _qlength - 1;
	_swap(qindex, last);
	_qlength--;
	return _godown(qindex);
    }

    const getWeightFromQindex = (qindex: number) => {
	const weight = AlgoGrid.get_weight_from_index(queue[qindex]);
	return weight
    }

    const _godown = (qindex: number): void => {
	const left = _left(qindex);
	const right = _right(qindex);
	const curr_weight = getWeightFromQindex(qindex);
	let min = 0;
	let min_weight = Infinity;
	// first get the minimum position and index
	if (left < _qlength) {
	    min = left;
	    min_weight = getWeightFromQindex(left);
	}

	if (right < _qlength) {
	    const rightWeight = getWeightFromQindex(right);
	    if (rightWeight < min_weight) {
		min_weight = rightWeight;
		min = right;
	    }
	}

	if (curr_weight > min_weight) {
	    _swap(qindex, min);
	    return _godown(min);
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
    
    let previous_ns: number[] = [];
    let previous_curr = -1;

    const visit_neighbours = (currnode: number, currweight: number) => {
	const ns = AlgoGrid.get_neighbours_as_indexes(currnode);
	for (let n of ns) {
	    if (_is_visited(n)) continue;
	    // add a color to the neighbour cell
	    previous_ns.push(n);
	    gridUiState.activate_n_cell(n);
	    const nweight = AlgoGrid.get_weight_from_index(n);
	    const new_potential_weight = currweight + 1;
	    if (new_potential_weight < nweight) {
		gridUiState.add_text_weight(n, new_potential_weight);
		_set_pred(n, currnode);
		_update_queue_weight(n, new_potential_weight);
	    }
	}
    }

    const get_path = (): number[] => {
	let final_path: number[] = [];
	final_path.push(target as number);
	let currnode = target as number;
	console.log(AlgoGrid.get_cells())
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

    const step_all = () => {
	while (!step_one()) { }
    }

    const cleanup_previous_step = () => {
	for (let n of previous_ns) { gridUiState.deactivate_n_cell(n); } 
	if (!AlgoGrid.is_source_from_index(previous_curr) && previous_curr != -1){
	    gridUiState.deactivate_curr_cell(previous_curr);
	}
	previous_ns = [];
	previous_curr = -1;

    }

    const step_one = (): boolean => {
	const currnode: number = _get_min_queue();
	const currweight = AlgoGrid.get_weight_from_index(currnode);

	cleanup_previous_step();

	// give a color to the current node
	if (!AlgoGrid.is_target_from_index(currnode)) {
	    gridUiState.activate_curr_cell(currnode);
	}

	if (_nodes_are_equal(target as number, currnode)) {
	    finished = true;
	    gridLogicState.goto_finished_state();
	    return true;
	}
	
	// first deactivate the old neighbours
	visit_neighbours(currnode, currweight);

	// mark it as visited and activate it
	_mark_visited(currnode);
	gridUiState.add_text_weight(currnode, currweight);

	previous_curr = currnode;
	return false;
    }

    const setup = () => {
	_create_queue();
	target = AlgoGrid.get_target();

	// set the initial text weights inside of the cells
	gridUiState.set_initial_text_weights(AlgoGrid.get_cells());
    };

    setup();
    return {
	step_one,
	step_all,
	get_path,
    }
}
