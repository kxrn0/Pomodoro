const root = document.documentElement;
const toggle = document.getElementById("theme-box");

root.className = "light";
toggle.addEventListener("click", () => { 
    if (toggle.checked) {
        root.className = "dark";
    }
    else {
        root.className = "light";
    }
});

const autostartButtons = document.querySelectorAll(".autostart input[type='checkbox']");

autostartButtons.forEach(box => box.addEventListener("click", () => {
    const parent = box.parentElement;
    const sibling = parent.querySelector("span");
    if (box.checked) {
        parent.style.background = "rgb(172, 217, 80)";
        sibling.style.background = "azure";
    }
    else {
        parent.style.background = "rgb(201, 213, 213)";
        sibling.style.background = "rgb(122, 115, 115)";
    }
}));