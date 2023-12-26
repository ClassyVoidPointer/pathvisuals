const useLogicState = () => {
    let algo_is_setting_source = false;
    let algo_is_setting_target = false;
    let algo_is_setting_obs = false;

    let algo_is_runnable = false;
    let algo_is_running = false;
    let algo_is_finished = false;

    let algo_is_source_set = false;
    let algo_is_target_set = false;
    let algo_is_obs_set = false;


    const is_setting_source = () => algo_is_setting_source;
    const is_setting_target = () => algo_is_setting_target;
    const is_setting_obs = () => algo_is_setting_obs;

    const goto_initial_source_state = () => {
	algo_is_setting_source = false;	
	algo_is_source_set = false;
	algo_is_runnable = false
    }

    const goto_initial_target_state = () => {
	algo_is_setting_target = false;	
	algo_is_target_set = false;
	algo_is_runnable = false
    }

    const goto_initial_obs_state = () => {
	algo_is_setting_obs = false;	
	algo_is_obs_set = false;
    }

    const goto_setting_source_state = () => {
	algo_is_setting_source = true;
	algo_is_setting_obs = false;
	algo_is_setting_target = false;
    }

    const goto_source_is_set = () => {
	if (algo_is_target_set) {
	    return goto_runnable_state();
	}
	algo_is_setting_source = false;
	algo_is_source_set = true
    }

    const goto_target_is_set = () => {
	if (algo_is_source_set) {
	    return goto_runnable_state();
	}

	algo_is_setting_target = false;
	algo_is_target_set = true;
    }

    const goto_obs_is_set = () => {
	algo_is_obs_set = true;
    }

    const goto_setting_target_state = () => {
	algo_is_setting_source = false;
	algo_is_setting_obs = false;
	algo_is_setting_target = true;
    }

    const goto_setting_obs_state = () => {
	algo_is_setting_source = false;
	algo_is_setting_obs = true;
	algo_is_setting_target = false;
    }

    const goto_runnable_state = () => {
	algo_is_runnable = true;
	algo_is_finished = false;
	algo_is_setting_source = false;
	algo_is_setting_target = false;
	algo_is_source_set = true;
	algo_is_target_set = true;
    }

    const goto_running_state = () => {
	algo_is_runnable = false;
	algo_is_setting_obs = false;
	algo_is_running = true;
    }

    const goto_finished_state = () => {
	algo_is_runnable = false;
	algo_is_finished = true;
	algo_is_running = false;
    }

    const goto_initial_state = () => {
	algo_is_runnable = false;
	algo_is_finished = false;
	algo_is_running = false;

	algo_is_setting_source = false;
	algo_is_setting_target = false;
	algo_is_setting_obs = false;

	algo_is_source_set = false;
	algo_is_target_set = false;
	algo_is_obs_set = false;

    }

    const is_initial_source_state = () => {
	return !algo_is_setting_source && !algo_is_source_set;
    }

    const is_initial_target_state = () => {
	return !algo_is_setting_target && !algo_is_target_set;
    }

    const is_initial_obs_state = () => {
	return !algo_is_setting_obs && !algo_is_obs_set;
    }

    const is_source_set_state = () => {
	return algo_is_source_set;
    }

    const is_target_set_state = () => {
	return algo_is_target_set;
    }

    const is_obs_set_state = () => {
	return algo_is_obs_set;
    }

    const is_finished_state = () => {
	return !algo_is_runnable && algo_is_finished;
    }

    const is_runnable_state = () => {
	return algo_is_runnable;
    }

    const is_running_state = () => {
	return algo_is_running;
    }

    const state_repr = () => {
	console.log({
	    is_setting_source: algo_is_setting_source,
	    is_setting_target: algo_is_setting_target,
	    is_setting_obs: algo_is_setting_obs,
	    is_source_set: algo_is_source_set,
	    is_target_set: algo_is_target_set,
	    is_obs_set: algo_is_obs_set,
	    is_runnable: algo_is_runnable,
	    is_running: algo_is_running,
	})
    }

    return {
	is_runnable_state,
	is_finished_state,
	is_running_state,

	is_setting_obs,
	is_setting_source,
	is_setting_target,
	
	is_initial_obs_state,
	is_initial_source_state,
	is_initial_target_state,

	is_source_set_state,
	is_target_set_state,
	is_obs_set_state,
	state_repr,
    // ========================
	goto_initial_state,
	goto_setting_obs_state,
	goto_setting_source_state,
	goto_setting_target_state,
	goto_running_state,

	goto_source_is_set,
	goto_target_is_set,
	goto_obs_is_set,

	goto_initial_source_state,
	goto_initial_target_state,
	goto_initial_obs_state,

	goto_finished_state,
	goto_runnable_state,
    }

}

export const gridLogicState = useLogicState() 
