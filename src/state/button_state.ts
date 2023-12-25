export const useButtonUI = () => {
    const goto_is_set_state = (btn: HTMLButtonElement, textContent: string) => {
	btn.classList.remove("teal");
	btn.classList.add("red");
	btn.textContent = textContent;
    }

    const goto_setting_state = (btn: HTMLButtonElement, textContent: string) => {
	btn.classList.remove("red", "btn-flat");
	btn.classList.add("btn", "teal")
	btn.textContent = textContent;
    }

    const goto_initial_state = (btn: HTMLButtonElement, textContent: string) => {
	btn.classList.remove("btn", "red", "teal");
	btn.classList.add("btn-flat");
	btn.textContent = textContent;
    }

    const hide_button = (btn: HTMLButtonElement) => {
	btn.classList.add("hide");
    }
    
    const hide_buttons = (btns: HTMLButtonElement[]) => {
	for (let btn of btns) {
	    btn.classList.add("hide");
	}
    }
    
    const show_buttons = (btns: HTMLButtonElement[]) => {
	for (let btn of btns) {
	    btn.classList.remove("hide");
	}
    }

    const show_button = (btn: HTMLButtonElement) => {
	btn.classList.remove("hide");
    }

    return {
	goto_is_set_state,
	goto_setting_state,
	goto_initial_state,

	hide_button,
	show_button,

	show_buttons,
	hide_buttons,
    }
}
