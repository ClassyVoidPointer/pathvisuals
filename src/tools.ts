import { gridUiState } from "./state/graphics_state"
import { gridLogicState } from "./state/logic_state";
import { useButtonUI } from "./state/button_state";
import { AlgoGrid } from "./useGrid";
import { useDijkstra } from "./useDijkstra";

interface ButtonState {
    goto_is_set_state: (btn: HTMLButtonElement, textContent: string) => void;
    goto_setting_state: (btn: HTMLButtonElement, textContent: string) => void;
    goto_initial_state: (btn: HTMLButtonElement, textContent: string) => void;
}

const useToolsUI = () => {
    const button_state: ButtonState = useButtonUI();

    const source_button: HTMLButtonElement = document.getElementById("algo-button-set-source") as HTMLButtonElement;
    const target_button: HTMLButtonElement = document.getElementById("algo-button-set-target") as HTMLButtonElement;
    const obs_button: HTMLButtonElement = document.getElementById("algo-button-set-obstacles") as HTMLButtonElement;
    const run_button: HTMLButtonElement = document.getElementById("algo-button-run") as HTMLButtonElement;
    const step_one_button: HTMLButtonElement = document.getElementById("algo-button-step-one") as HTMLButtonElement;
    const step_all_button: HTMLButtonElement = document.getElementById("algo-button-step-all") as HTMLButtonElement;

    const input_row: HTMLInputElement = document.getElementById("algo-input-row-number") as HTMLInputElement;
    const input_col: HTMLInputElement = document.getElementById("algo-input-col-number") as HTMLInputElement;
    const input_gap: HTMLInputElement = document.getElementById("algo-input-gap") as HTMLInputElement;
    const input_border: HTMLInputElement = document.getElementById("algo-input-border") as HTMLInputElement;

    source_button?.addEventListener("click", (e) => {
	// initial_state => goto_setting_state
	if (gridLogicState.is_initial_source_state()) {
	    button_state.goto_setting_state(source_button, "Setting...");

	    if (gridLogicState.is_setting_target()) {
		button_state.goto_initial_state(target_button, "Set target");
	    }

	    if (gridLogicState.is_setting_obs() && !gridLogicState.is_obs_set_state()) {
		button_state.goto_initial_state(obs_button, "Set Obstacles");
	    }

	    return gridLogicState.goto_setting_source_state();
	}
	
	if (gridLogicState.is_setting_source()) {
	    gridLogicState.goto_initial_source_state();
	    button_state.goto_initial_state(source_button, "Set source");
	    return;
	}

	if (gridLogicState.is_source_set_state()) {
	    gridLogicState.goto_initial_source_state();
	    button_state.goto_initial_state(source_button, "Set source");
	    gridUiState.deactivate_source_cell();
	}
    })

    target_button?.addEventListener("click", (e) => {
	// initial_state => goto_setting_state
	if (gridLogicState.is_initial_target_state()) {
	    if (gridLogicState.is_setting_source()) {
		button_state.goto_initial_state(source_button, "Set source");
	    }

	    if (gridLogicState.is_setting_obs() && !gridLogicState.is_obs_set_state()) {
		button_state.goto_initial_state(obs_button, "Set Obstacles");
	    }

	    button_state.goto_setting_state(target_button, "Setting...");
	    return gridLogicState.goto_setting_target_state();
	}
	
	else if (gridLogicState.is_setting_target()) {
	    gridLogicState.goto_initial_target_state();
	    button_state.goto_initial_state(target_button, "Set target");
	    return;
	}

	else if (gridLogicState.is_target_set_state()) {
	    // deactivate the target cell
	    gridLogicState.goto_initial_target_state();
	    button_state.goto_initial_state(target_button, "Set target");
	    gridUiState.deactivate_target_cell();
	}
	gridLogicState.state_repr();
    })
    
    obs_button?.addEventListener("click", (e) => {
	// initial_state => goto_setting_state
	if (gridLogicState.is_initial_obs_state()) {
	    if (gridLogicState.is_setting_source()) {
		button_state.goto_initial_state(source_button, "Set source");
	    }

	    if (gridLogicState.is_setting_target()) {
		button_state.goto_initial_state(target_button, "Set target");
	    }

	    gridLogicState.goto_setting_obs_state();
	    return button_state.goto_setting_state(obs_button, "Setting...")
	}
	
	if (gridLogicState.is_setting_obs() && !gridLogicState.is_obs_set_state()) {
	    gridLogicState.goto_initial_obs_state();
	    return button_state.goto_initial_state(obs_button, "Set obstacles");
	}

	if (gridLogicState.is_obs_set_state()) {
	    gridLogicState.goto_initial_obs_state();
	    button_state.goto_initial_state(obs_button, "Set obstacles");
	    gridUiState.deactivate_obs_cells();
	}
    })


    /*****************************************
     * MODIFYING THE STATE
     * **************************************/

    const goto_source_is_set = () => {
	gridLogicState.goto_source_is_set();
	button_state.goto_is_set_state(source_button, "Unset source");
    }

    const goto_target_is_set = () => {
	gridLogicState.goto_target_is_set();
	button_state.goto_is_set_state(target_button, "Unset target");
    }

    const goto_obs_is_set = () => {
	gridLogicState.goto_obs_is_set();
	button_state.goto_is_set_state(obs_button, "Unset obstacles");
    }

    const goto_buttons_initial_state = () => {
	button_state.goto_initial_state(source_button, "Set source");
	button_state.goto_initial_state(target_button, "Set target");
	button_state.goto_initial_state(obs_button, "Set obstacles");
    }

    /**********************************************/
    // HANDLING INPUTS TO MODIFY GRID APPEARANCE
    // ********************************************
    input_row.addEventListener("change", (e) => {
	const input = e.target as HTMLInputElement;
	const rows: number = Number(input.value);
	gridUiState.set_rows(rows);
	AlgoGrid.set_rows(rows);
	goto_buttons_initial_state();
    })

    input_col.addEventListener("change", (e) => {
	const input = e.target as HTMLInputElement;
	const cols: number = Number(input.value);
	gridUiState.set_cols(cols);
	AlgoGrid.set_cols(cols);
	goto_buttons_initial_state();
    })

    input_border.addEventListener("change", (e) => {
	const input = e.target as HTMLInputElement;
	gridUiState.set_cell_border(Number(input.value));
    })

    input_gap.addEventListener("change", (e) => {
	const input = e.target as HTMLInputElement;
	gridUiState.set_gap(Number(input.value));
    })

    /**************************************
     * HANDLING ALGORITHM INPUTS
     * ************************************/

    let dijkstra = null;
    run_button.addEventListener("click", (e) => {
	if (!gridLogicState.is_runnable_state()) return;
	goto_running_state();
	AlgoGrid.create();
	dijkstra = useDijkstra();
    })

    const goto_running_state = () => {
	button_state.hide_buttons([source_button, target_button, obs_button, run_button]);
	button_state.show_buttons([step_one_button, step_all_button]);
	gridLogicState.goto_running_state();
    }


    step_one_button.addEventListener("click", (e) => {
	if (!gridLogicState.is_running_state()) return;
	if (dijkstra.step_one()) {
	    const final_path = dijkstra.get_path();
	    gridUiState.draw_final_path(final_path);
	    console.log(final_path)
	}
    })

    step_all_button.addEventListener("click", (e) => {
	if (!gridLogicState.is_running_state()) return;

	dijkstra!.step_all();
	const final_path = dijkstra.get_path();
	console.log(final_path);
	gridUiState.draw_final_path(final_path);
    })

    return {
	goto_obs_is_set,
	goto_target_is_set,
	goto_source_is_set,
    }
}

export const toolbar = useToolsUI();
