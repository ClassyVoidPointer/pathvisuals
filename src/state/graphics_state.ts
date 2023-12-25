import { AlgoGrid } from "../useGrid"
import { 
    _get_coordinates 
} from "../helpers/grid_helpers";
import { gridLogicState } from "./logic_state";
import { toolbar } from "../tools";

interface AlgoColors {
    visited_cell: string[],
    obstacle: string[],
    source: string[],
    target: string[],
    curr_cell: string[],
    path: string[]
    border_cell: string[]
    border_grid: string[],
    n_cell: string[],
};

export interface GridSettings {
    border: number,
    gap: number,
    grid_width: number,
    grid_height: number,

    cell_width: number,
    cell_height: number,
    cell_border: number,

    rows: number,
    cols: number,
    total_cells: number,
    
    start_x: number,
    start_y: number,

    max_rows: number,
    max_cols: number,
    min_rows: number,
    min_cols: number,

    min_border: number,
    max_border: number,

    max_gap: number,
    min_gap: number
}

const useGridUIState = () => {
    let colors: AlgoColors = {
	visited_cell: ["orange"],
	obstacle: ["grey"],
	source: ["green"],
	target: ["red"],
	border_grid: ['black'],
	border_cell: ['black'],
	path: ["yellow"],
	curr_cell: ["cyan"],
	n_cell: ["pink"],
    };

    let gridEl: HTMLDivElement | null = document.getElementById("algo-grid") as HTMLDivElement; 

    let sourceHTML: HTMLDivElement | null = null;
    let targetHTML: HTMLDivElement | null = null;
    let obsHTML: HTMLDivElement[] = [];
    let final_path: HTMLDivElement[] = []
    let visitedHTML: HTMLDivElement[] = []

    // potentially store the visited_cells
    const set_gridel = (id: string) => {
	gridEl = document.getElementById(id) as HTMLDivElement;
    }

    const activate_curr_cell = (cell: number) => {
	const cellHTML = gridEl!.children[cell];
	cellHTML.classList.remove(...colors.visited_cell);
	cellHTML.classList.add(...colors.curr_cell); 
    }

    const deactivate_curr_cell = (cell: number) => {
	const cellHTML = gridEl!.children[cell];
	cellHTML.classList.remove(...colors.curr_cell); 
	cellHTML.classList.add(...colors.visited_cell);
    }

    const activate_n_cell = (cell: number) => {
	gridEl!.children[cell].classList.add(...colors.n_cell);
    }

    const deactivate_n_cell = (cell: number) => {
	gridEl!.children[cell].classList.remove(...colors.n_cell);
    }

    const draw_final_path = (cells: number[]) => {
	if (!gridEl) {
	    console.log("grid is null");
	    return;
	}

	// a valid path contains the source and target cells 
	// respectively at the beginning and at the end
	// we do not want to activate or deactivate those 2
	for (let i = 1; i < cells.length; i++) {
	    // all the other cells should be set so far
	    // in the visited state
	    // so we need only to remove that class
	    deactivate_cell_visited(cells[i]);
	    activate_cell_path(cells[i]);
	}
    }

    const activate_cell_path = (cell: number) => {
	if (gridEl) {
	    const cellHTML = gridEl.children[cell] as HTMLDivElement;
	    cellHTML.classList.add(...colors.path)
	    final_path.push(cellHTML);
	} else {
	    console.log("grid is null");
	}
    }

    const deactivate_cell_path = (cell: number) => {
	if (gridEl) {
	    gridEl.children[cell].classList.remove(...colors.path)
	} else {
	    console.log("grid is null");
	}
    }

    const add_text_weight = (cell: number, weight: number) => {
	let weight_string = String(weight);
	if (weight == Infinity) {
	    weight_string = "∞";
	}
	gridEl.children[cell].textContent = weight_string;
    }

    const activate_cell_visited = (cell: number) => {
	if (gridEl) {
	    const cellHTML = gridEl.children[cell] as HTMLDivElement;
	    visitedHTML.push(cellHTML);
	    cellHTML.classList.add(...colors.visited_cell)
	} else {
	    console.log("grid is null");
	}
    }

    const deactivate_all_visited = () => {
	if (gridEl) {
	    for (let cell of visitedHTML) {
		cell.classList.remove(...colors.visited_cell)
	    }
	}
	deactivate_all_path();
	deactivate_all_visited();
    }

    const deactivate_all_path = () => {
	if (gridEl) {
	    for (let cell of visitedHTML) {
		cell.classList.remove(...colors.path);
	    }
	} else {
	    console.log("grid is null");
	}
    }

    const deactivate_cell_visited = (cell: number) => {
	if (gridEl) {
	    gridEl.children[cell].classList.remove(...colors.visited_cell)
	} else {
	    console.log("grid is null");
	}
    }

    const get_gridel = () => gridEl;

    const set_color = (key: keyof AlgoColors, value: string[]): void => {
	colors[key] = value;
    }

    const get_color = (key: keyof AlgoColors): string[] => {
	return colors[key];
    }

    const compute_cell_settings = () => {
	// get the first child of the newly updated grid
	if (gridEl) {
	    const firstChild = gridEl.firstElementChild;
	    const rect = firstChild?.getBoundingClientRect();
	    const width = rect!.width;
	    const height = rect!.height;
	    grid_settings.cell_width = width;
	    grid_settings.cell_height = height;
	} else {
	    console.log("dom grid not attached");
	}
    }

    const deactivate_all = () => {
	deactivate_source_cell();
	deactivate_target_cell();
	deactivate_obs_cells()
    }

    const clear = () => {
	deactivate_all();
	deactivate_all_path();
	deactivate_all_visited();
    }

    const update_rows = (rows: number) => {
	gridEl!.innerHTML = '';
	grid_settings.rows = rows;
	draw();
	compute_cell_settings();
    }

    const update_cols = (cols: number) => {
	gridEl!.innerHTML = '';
	grid_settings.cols = cols;
	draw();
	compute_cell_settings();
    }

    const _set_rows = (rows: number) => {
	if (rows < grid_settings["min_rows"] || rows > grid_settings["max_rows"]) {
	    console.log("Exceeding maximum amount of rows")
	    return;
	}
	grid_settings.rows = rows;
	if (gridEl) {
	    gridEl.style.setProperty("grid-template-rows", `repeat(${rows}, 1fr)`);
	}
    }

    const _set_cols = (cols: number) => {
	if (cols < grid_settings["min_cols"] || cols > grid_settings["max_cols"]) {
	    console.log("Exceeding maximum amount of rows")
	    return;
	}

	grid_settings.cols= cols;

	if (gridEl) {
	    gridEl.style.setProperty("grid-template-columns", `repeat(${cols}, 1fr)`);
	}
    }

    const set_rows = (val: number) => {
	if (val < grid_settings["min_rows"] || val > grid_settings["max_rows"]) {
	    console.log("Exceeding maximum amount of rows")
	    return;
	}
	if (gridEl) {
	    gridEl.style.setProperty("grid-template-rows", `repeat(${val}, 1fr)`);
	    update_rows(val);
	} else {
	    console.log("gridEl not attached!");
	}
    }

    const set_cols = (val: number) => {
	if (val < grid_settings["min_cols"] || val > grid_settings["max_cols"]) {
	    console.log("Exceeding maximum amount of cols")
	    return;
	}
	if (gridEl) {
	    gridEl.style.setProperty("grid-template-columns", `repeat(${val}, 1fr)`);
	    update_cols(val);
	} else {
	    console.log("gridEl not attached!");
	}
    }

    const set_grid_border = (val: number) => {
	if (val < grid_settings["min_border"] || val > grid_settings["max_border"]) {
	    console.log("Invalid border size")
	    return;
	}
	grid_settings["border"] = val;
	if (gridEl) {
	    gridEl.style.setProperty("border", `${val}px`);
	    build();
	} else {
	    console.log("gridEl not attached!");
	}
    }

    const set_cell_border = (val: number) => {
	if (val < grid_settings["min_border"] || val > grid_settings["max_border"]) {
	    console.log("Invalid border size")
	    return;
	}
	grid_settings.cell_border = val;
	if (gridEl) {
	    // maybe find a better way in the future, this looks kind of dirty
	    const root = document.querySelector(':root') as HTMLElement;
	    root!.style.setProperty('--border-width', `${val}px`);
	} else {
	    console.log("gridEl not attached!");
	}
    }

    const build = () => {
	draw();
	compute_cell_settings();
    }

    const compute_grid_settings = () => {
	if (!gridEl) return;
	const rect = gridEl.getBoundingClientRect();
	const width = rect.width;
	const height = rect.height;
	const start_x = rect.x;
	const start_y = rect.y;

	grid_settings.start_x = start_x;
	grid_settings.start_y = start_y;
	grid_settings.grid_width = width;
	grid_settings.grid_height = height;

	AlgoGrid.set_rows(grid_settings.rows);
	AlgoGrid.set_cols(grid_settings.cols);
    }

    const create = (rows: number, cols: number) => {
	_set_rows(rows);
	_set_cols(cols);

	draw();

	compute_grid_settings();
	compute_cell_settings();
    }

    const draw = () => {
	if (gridEl == null) {
	    console.log("grid is null");
	    return;
	}
	for (let i = 0; i < grid_settings.rows; i++) {
	    for (let j = 0; j < grid_settings.cols; j++) {
		const cell = document.createElement("div");
		if (grid_settings.gap) {
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
		gridEl.appendChild(cell);
	    }
	}
    }

    const set_gap = (val: number) => {
	if (val < grid_settings.min_gap || val > grid_settings.max_gap) {
	    console.log("Invalid gap size")
	    return;
	}
	grid_settings.gap = val;
	if (gridEl) {
	    gridEl.style.setProperty("gap", `${val}px`);
	    _update_gap();
	} else {
	    console.log("gridEl not attached!");
	}

    }

    gridEl.addEventListener("click", (e) => {
	const mouseX = e.clientX;
	const mouseY = e.clientY;
	return handleMouseDown(mouseX, mouseY);
    });

    const handleMouseDown = (x: number, y: number) => {
	const coords: { row: number, col: number } | null = _get_coordinates(grid_settings, x, y);
	if (coords === null) return;
	const { row, col } = coords;
	if (gridLogicState.is_setting_source()) {
	    activate_source_cell(row * grid_settings["cols"] + col);
	    
	    // save the source into the actual grid that will be used 
	    // by dijkstra's algorithm
	    AlgoGrid.set_source(row, col);

	    // save the current state in the logic statemachine
	    gridLogicState.goto_source_is_set();

	    // go into the unset state in the toolbar
	    toolbar.goto_source_is_set(); 
	}

	else if (gridLogicState.is_setting_target()) {
	    activate_target_cell(row * grid_settings["cols"] + col);
	    
	    // save the source into the actual grid that will be used 
	    // by dijkstra's algorithm
	    AlgoGrid.set_target(row, col);

	    // save the current state in the logic statemachine
	    gridLogicState.goto_target_is_set();

	    toolbar.goto_target_is_set();
	}

	else if (gridLogicState.is_setting_obs()) {
	    activate_obs_cell(row * grid_settings["cols"] + col);
	    
	    // save the source into the actual grid that will be used 
	    // by dijkstra's algorithm
	    AlgoGrid.save_obstacle(row, col);

	    // save the current state in the logic statemachine
	    gridLogicState.goto_obs_is_set();

	    toolbar.goto_obs_is_set();
	}
    }

    const _update_gap = () => {
	if (grid_settings.gap > 0) {
	    _update_gap_yesgap();
	} else {
	    _update_gap_nogap(); 
	}
	compute_cell_settings();
    }

    const _update_gap_yesgap = () => {
	for (let i = 0; i < grid_settings.rows; i++) {
	    let start = i * grid_settings.cols;
	    for (let j = 0; j < grid_settings.cols; j++) {
		const cell = gridEl!.children[start + j];
		cell.classList.add("algo-cell-full");
	    } 
	}
    }

    const _update_gap_nogap = () => {
	for (let i = 0; i < grid_settings.rows; i++) {
	    let start = i * grid_settings.cols;
	    for (let j = 0; j < grid_settings.cols; j++) {
		const cell = gridEl!.children[start + j];
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

   const _get_coordinates = (settings: any, x: number, y: number) => {
	if (grid_settings.gap > 0) {
	    return _get_coordinates_yesgap(settings, x, y);
	}
	return _get_coordinates_nogap(settings, x, y);
    }

    const _get_coordinates_yesgap = (settings: any, x: number, y: number) => {
	const gap = grid_settings.gap;
	const actualX = x - grid_settings.start_x;
	const actualY = y - grid_settings.start_y;
	const cellW = grid_settings.cell_width;
	const cellH = grid_settings.cell_height;

	const totalCellWidth = cellW + gap;
	const maybeCol= Math.floor(actualX / totalCellWidth);
	const xCompare = cellW * ( maybeCol + 1 ) + gap * maybeCol;

	const totalCellHeight = cellH + gap;
	const maybeRow = Math.floor(actualY / totalCellHeight);
	const yCompare = cellH * ( maybeRow + 1 ) + gap * maybeRow;
	if (actualX > xCompare || actualY > yCompare) {
	    return null;
	}
	return { row: maybeRow, col: maybeCol };
    }

    const _get_coordinates_nogap = (settings: any, x: number, y: number) => {
	const gap = grid_settings.gap;
	const actualX = x - grid_settings.start_x;
	const actualY = y - grid_settings.start_y;
	const cellW = grid_settings.cell_width;
	const cellH = grid_settings.cell_height;
	const col = Math.floor(actualX / cellW);
	const row = Math.floor(actualY / cellH);
	return { row, col }
    }

    const grid_settings: GridSettings = {
	cell_width: 0,
	cell_height: 0,
	cell_border: 1,

	start_x: 0,
	start_y: 0,

	rows: 0,
	cols: 0,
	total_cells: 0,
	grid_width: 0,
	grid_height: 0,

	max_rows: 40,
	min_rows: 0,
	max_cols: 40,
	min_cols: 0,

	border: 0,
	min_border: 0,
	max_border: 5,

	gap: 0,
	max_gap: 10,
	min_gap: 0,

    }

    const set_grid_property = (key: keyof GridSettings, val: number) => {
	grid_settings[key] = val;
    }

    const get_grid_property = (key: keyof GridSettings) => {
	return grid_settings[key];
    }

    const activate_source_cell = (cell: number) => {
	if (gridEl) {
	    sourceHTML = gridEl.children[cell] as HTMLDivElement;
	    return gridEl.children[cell].classList.add(...colors["source"]);
	}
	console.error("grid dom element is not set!");
    }

    const activate_target_cell = (cell: number) => {
	if (gridEl) {
	    targetHTML = gridEl.children[cell] as HTMLDivElement;
	    return gridEl.children[cell].classList.add(...colors["target"]);
	}
	console.error("grid dom element is not set!");
    }

    const activate_obs_cell = (cell: number) => {
	if (gridEl) {
	    obsHTML.push(gridEl.children[cell] as HTMLDivElement);
	    return gridEl.children[cell].classList.add(...colors["obstacle"]);
	}
	console.error("grid dom element is not set!");
    }

    const deactivate_source_cell = () => {
	if (gridEl && sourceHTML) {
	    sourceHTML.classList.remove(...colors["source"]);
	    sourceHTML = null;
	 } else {
	    console.error("grid dom element is not set!");
	 }
    }

    const deactivate_target_cell = () => {
	if (gridEl && targetHTML) {
	    targetHTML.classList.remove(...colors["target"]);
	    targetHTML = null;
	} else {
	    console.error("grid dom element is not set!");
	}
    }

    const deactivate_obs_cells = () => {
	if (gridEl && obsHTML.length > 0) {
	    for (let obs of obsHTML) {
		obs.classList.remove(...colors["obstacle"]);
	    }
	} else {
	    console.error("grid dom element is not set!");
	}
    }

    const set_initial_text_weights = (cells: number[]) => {
	cells.forEach((weight, index) => {
	   add_text_weight(index, weight); 
	})
    }

    return {
	set_color,
	get_color,
	get_grid_property,
	set_grid_property,
	set_gridel,
	get_gridel,

	activate_obs_cell,
	activate_source_cell,
	activate_target_cell,
	activate_cell_visited,
	activate_cell_path,

	deactivate_source_cell,
	deactivate_target_cell,
	deactivate_obs_cells,
	deactivate_cell_path,
	deactivate_cell_visited,

	clear,
	create,
	build,

	set_gap,
	set_rows, 
	set_cols,
	set_grid_border,
	set_cell_border,
	draw_final_path,
	add_text_weight,
	activate_curr_cell,
	deactivate_curr_cell,
	activate_n_cell,
	deactivate_n_cell,
	set_initial_text_weights,
    }
}

export const gridUiState = useGridUIState();
