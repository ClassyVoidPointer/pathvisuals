import { 
    _create_grid, 
    _update_gap, 
    _get_coordinates,
    create_grid_state,
} from "./helpers/grid_helpers";

import {
    focusButton,
    defocusButton,
    focusDangerButton,
    defocusDangerButton,
} from "./helpers/button_helpers";

import { useDijkstra } from "./dijkstra";


export const useGrid = () => {
    const el: HTMLElement = document.getElementById("algo-grid") as HTMLElement;
    const source_button: HTMLButtonElement = document.getElementById("algo-button-set-source") as HTMLButtonElement;
    const target_button: HTMLButtonElement = document.getElementById("algo-button-set-target") as HTMLButtonElement;
    const obstacles_button: HTMLButtonElement = document.getElementById("algo-button-set-obstacles") as HTMLButtonElement;
    const run_button: HTMLButtonElement = document.getElementById("algo-button-run") as HTMLButtonElement;

    const step_one_button: HTMLButtonElement = document.getElementById("algo-button-step-one") as HTMLButtonElement;
    const step_all_button: HTMLButtonElement = document.getElementById("algo-button-step-all") as HTMLButtonElement;
    const clear_button: HTMLButtonElement = document.getElementById("algo-button-clear") as HTMLButtonElement;

    let is_finished: boolean = false;
    let can_be_run: boolean = false;
    let is_setting_source = false;
    let is_setting_target = false;
    let is_setting_obstacles = false;

    let dijkstra: any = null;
    let colors = {
	path_color: "red",
	visited_color: "grey",
	source_color: "green",
	target_color: "red",
	obstacle_color: "blue",
    }
    let obstacle_color = "blue";

    let path_color = "yellow";
    let final_path: number[] = []

    step_one_button?.addEventListener("click", (ev) => {
	if (is_finished || !can_be_run) return;
	if (!dijkstra.step_one()) {
	} else {
	    final_path = dijkstra.get_path();
	    draw_path();
	    is_finished = true;
	    can_be_run = false;

	    step_one_button.classList.add("hide");
	    step_all_button.classList.add("hide");
	    clear_button.classList.remove("hide");
	} 
    })

    clear_button?.addEventListener("click", (ev) => {
	unsetAll();
	is_finished = false;	
	dijkstra.clean();
	for (let cell of final_path) {
	    el.children[cell].classList.remove(path_color);
	}
	clear_button.classList.add("hide");
	run_button.classList.remove("hide");
    })

    step_all_button?.addEventListener("click", (ev) => {
	if (is_finished || !can_be_run) return;
	dijkstra.stepall();

	final_path = dijkstra.get_path();
	draw_path();

	step_one_button.classList.add("hide");
	step_all_button.classList.add("hide");
	clear_button.classList.remove("hide");
    })

    const draw_path = () => {
	const children = el.children;
	for (let cell of final_path) {
	    children[cell].classList.replace("grey", path_color);	
	}
    }
    
    source_button?.addEventListener("click", (ev) => {
	if (grid_state.sourceIsSet()) {
	    return unsetSource();
	};
	
	focusButton(source_button);
	is_setting_source = true;
	if (is_setting_target) {
	    is_setting_target = false;
	    defocusButton(target_button);
	}
	if (is_setting_obstacles) {
	    defocusButton(obstacles_button);
	    is_setting_obstacles = false;
	}
    })

    target_button?.addEventListener("click", (ev) => {
	if (grid_state.targetIsSet()) {
	    return unsetTarget();
	};
	focusButton(target_button);
	is_setting_target = true;
	if (is_setting_source) {
	    defocusButton(source_button);
	    is_setting_source = false;
	}
	if (is_setting_obstacles) {
	    defocusButton(obstacles_button);
	    is_setting_obstacles = false;
	}
    })

    obstacles_button?.addEventListener("click", (ev) => {
	if (grid_state.hasObstacles()) {
	    defocusButton(obstacles_button);
	    return unsetObstacles();
	};
	focusButton(obstacles_button);
	is_setting_obstacles = true;
	if (is_setting_source) {
	    is_setting_source = false;
	    defocusButton(source_button);
	}
	if (is_setting_target) {
	    is_setting_target = false;
	    defocusButton(target_button);
	}
    })

    run_button?.addEventListener("click", (ev) => {
	if (grid_state.sourceIsSet() && grid_state.targetIsSet()) {
	    grid_state.create()
	    dijkstra = useDijkstra(grid_state, el);
	    run_button.classList.add("hide");
	    step_one_button.classList.remove("hide");
	    step_all_button.classList.remove("hide");
	    can_be_run = true;
	} 
    })

    const drawPath = (path: number[]) => {
	for (let elem of path) {
	    const children = el.children;
	    activate_cell(children[elem] as HTMLElement, "yellow");
	}
    }

    const deactivate_cell = (cellHTML: HTMLElement, classname: string) => {
	cellHTML.classList.remove(classname);
    }

    const activate_cell = (cellHTML: HTMLElement, classname: string) => {
	cellHTML.classList.add(classname);
    }

    const unsetSource = () => {
	grid_state.unsetSource();
	deactivate_cell(source_html!, "teal");
	source_html = null;
	defocusDangerButton(source_button);
	changeButtonText(source_button, "Set source");
    }

    const changeButtonText = (buttonEl: HTMLButtonElement, text: string) => {
	buttonEl.textContent = text;
    }

    const unsetTarget = () => {
	grid_state.unsetTarget();
	deactivate_cell(target_html!, "red");
	target_html = null;
	defocusDangerButton(target_button);
	changeButtonText(target_button, "Set target");
    }

    const unsetObstacles = () => {
	grid_state.unsetObstacles();
	for (let cell of obstacles_html) {
	    deactivate_cell(cell, obstacle_color);
	}
	obstacles_html = [];
	changeButtonText(obstacles_button, "Set obstacles");
	defocusDangerButton(obstacles_button);
	obstacle_text_changed = false;
    }

    const setSource = (cell: { row: number, col: number }) => {
	const { row, col } = cell;
	if (grid_state.canBeSource(row, col)) {
	    grid_state.setSource(row, col);
	    source_html = el.children[grid_state.getSource()!] as HTMLElement;
	    activate_cell(source_html, "teal")
	    focusDangerButton(source_button);
	    changeButtonText(source_button, "Unset source");
	    is_setting_source = false;
	}
    }

    const setTarget = (cell: { row: number, col: number }) => {
	const { row, col } = cell;
	if (grid_state.canBeTarget(row, col)) {
	    grid_state.setTarget(row, col);
	    target_html = el.children[row * settings["cols"] + col] as HTMLElement;
	    activate_cell(target_html, "red")
	    changeButtonText(target_button, "Unset target");
	    focusDangerButton(target_button);
	    is_setting_target = false;
	}
    }

    let obstacle_text_changed = false;

    const setObstacle = (cell: { row: number, col: number }) => {
	const { row, col } = cell;
	if (grid_state.canBeObstacle(row, col)) {
	    // here use save for performance reasons
	    // setObstacles modifies the underlying grid
	    // this might be changed in the future for consistency
	    grid_state.saveObstacle(row, col);
	    const obstacle_html = el.children[row * settings["cols"] + col] as HTMLElement;
	    activate_cell(obstacle_html, obstacle_color);
	    obstacles_html.push(obstacle_html);
	    if (!obstacle_text_changed) {
		focusDangerButton(obstacles_button);
		changeButtonText(obstacles_button, "Unset Obstacles");
		obstacle_text_changed = true;
	    }
	}
    }


    let settings: any = {};
    const grid_state = create_grid_state();

    let source_html: HTMLElement | null = null;
    let target_html: HTMLElement | null = null;
    let obstacles_html: HTMLElement[] = [];

    let inputRow: HTMLInputElement = document.getElementById("algo-input-row-number") as HTMLInputElement;
    let inputCol: HTMLInputElement = document.getElementById("algo-input-col-number") as HTMLInputElement;
    let inputGap: HTMLInputElement = document.getElementById("algo-input-gap") as HTMLInputElement;
    let inputBorder: HTMLInputElement = document.getElementById("algo-input-border") as HTMLInputElement;

    const create = (rows: number, cols: number) => {
	el.style.setProperty("grid-template-columns", `repeat(${cols}, 1fr`);
	el.style.setProperty("grid-template-rows", `repeat(${rows}, 1fr`);

	const GridEl = el.getBoundingClientRect();
	settings["startX"] = GridEl.x;
	settings["startY"] = GridEl.y;
	settings["width"] = GridEl.width;
	settings["height"] = GridEl.height;
	settings["rows"] = rows;
	settings["cols"] = cols;
	settings["gap"] = 0;

	_create_grid(el , rows, cols, settings["gap"] > 0);
	setCellSettings();
	grid_state.setCols(cols);
	grid_state.setRows(rows);
    }

    const unsetAll = () => {
	is_setting_source = false;
	is_setting_target = false;
	is_setting_obstacles = false;
	
	if (grid_state.sourceIsSet()) {
	    unsetSource()
	}

	if (grid_state.targetIsSet()) {
	    unsetTarget()
	}

	if (grid_state.hasObstacles()) {
	    unsetObstacles()
	}
    }

    const _update = (rows: number, cols: number) => {
	settings["rows"] = rows;
	settings["cols"] = cols;

	grid_state.setCols(cols);
	grid_state.setRows(rows);

	unsetAll()

	_create_grid(el, rows, cols, settings["gap"]);
	setCellSettings();
    }

    const update = (rows: number, cols: number) => {
	el.innerHTML = "";
	_update(rows, cols);
    }

    const setCellSettings = () => {
	const firstChild = el.children[0];
	const childRect = firstChild.getBoundingClientRect();
	const width = childRect.width;
	const height =  childRect.height;

	settings["cellW"] = width;
	settings["cellH"] = height;
    }

    const getSetting = (val: string) => settings[val];
    const updateSettings = (obj: {}) => {
	settings = {
	    ...settings,
	    ...obj
	}
    }

    inputRow?.addEventListener("change", (ev) => {
	const value = inputRow.value;
	const cols = settings["cols"];
	return update(Number(value), cols);
    })

    inputCol?.addEventListener("change", (ev) => {
	const value = settings["rows"];
	const cols = inputCol.value;
	return update(value, Number(cols));
    })

    inputGap?.addEventListener("change", (ev) => {
	const value = Number(inputGap.value);
	settings["gap"] = value;

	el.style.setProperty("gap", `${value}px`);
	setCellSettings()
	_update_gap(el, settings["rows"], settings["cols"], value > 0);
    })

    inputBorder?.addEventListener("change", (ev) => {
	const stringVal = inputBorder.value;
	const value = Number(stringVal);
	settings["border"] = value;
	const root = document.querySelector(':root') as HTMLElement;
	root!.style.setProperty('--border-width', `${stringVal}px`);
    })

    el?.addEventListener("mousedown", (ev) => { 
	const mouseX = ev.clientX;
	const mouseY = ev.clientY;
	return handleMouseDown(mouseX, mouseY);
    });

    const handleMouseDown = (x: number, y: number) => {
	const coords: { row: number, col: number } | null = _get_coordinates(settings, x, y);
	if (coords == null) return;

	if (!is_setting_source && !is_setting_target && !is_setting_obstacles) return;
	
	// main logic
	if (is_setting_source) {
	    setSource(coords);
	}
	else if (is_setting_target) {
	    setTarget(coords);
	}

	else {
	    setObstacle(coords);	
	}
    }

    return {
	create,
	updateSettings,
	getSetting,
    }
}
