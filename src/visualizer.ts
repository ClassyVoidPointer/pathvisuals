import { toolbar } from "./tools"
import { AlgoGrid } from "./useGrid"
import { gridLogicState } from "./state/logic_state"
import { gridUiState, GridSettings } from "./state/graphics_state"


const INITIAL_ROWS = 20;
const INITIAL_COLS = 20;

export const createVisualizer = () => {
    const setup = () => {
	gridUiState.create(INITIAL_ROWS, INITIAL_COLS)
    }

    return {
	setup
    }
}
