export const focusButton = (btn: HTMLButtonElement) => {
   btn.classList.remove("btn-flat"); 
   btn.classList.add("btn"); 
}

export const defocusButton = (btn: HTMLButtonElement) => {
   btn.classList.remove("btn"); 
   btn.classList.add("btn-flat"); 
}

export const focusDangerButton = (btn: HTMLButtonElement) => {
    btn.classList.remove("btn-teal");
    btn.classList.add("red");
}

export const defocusDangerButton = (btn: HTMLButtonElement) => {
    btn.classList.remove("red");
    btn.classList.add("btn-teal", "btn-flat");
}


