const pomoObj = (
    () => {
        const pomoState = "POMODORO";
        const shortState = "SHORT-BREAK";
        const longState = "LONG-BREAK";
        let pomoLength, shortLength, longLength, timeLeft, pomInterval, pomos, state, running;
        let autoPomo, autoShort, autoLong, pomKiller;

        pomoLength = 25 * 60;
        shortLength = 5 * 60;
        longLength = 15 * 60;
        timeLeft = pomoLength;
        pomInterval = 4;
        pomos = 0;
        state = pomoState;
        running = false;

        autoPomo = false;
        autoShort = false;
        autoLong = false;

        let interface;

        function set_interface(interfaceObj) {
            interface = interfaceObj;
        }

        function run_timer() {
            timeLeft--;
            if (timeLeft >= 0) {
                interface.update({ timeLeft, update: false });
                pomKiller = setTimeout(run_timer, 1000);
                running = true;
            }
            else {
                let currentState;

                running = false;
                if (state == pomoState) {
                    if ((pomos + 1) % pomInterval) {
                        timeLeft = shortLength;
                        currentState = shortState;
                        if (autoShort) {
                            running = true;
                            run_timer();
                        }
                    }
                    else {
                        timeLeft = longLength;
                        currentState = longState;
                        if (autoLong) {
                            running = true;
                            run_timer();
                        }
                    }
                }
                else {
                    timeLeft = pomoLength;
                    currentState = pomoState;
                    if (autoPomo) {
                        pomos++;
                        running = true;
                        run_timer();
                    }
                }
                state = currentState;
                interface.update({ timeLeft, update: true, state: currentState });
            }
        }

        function stop_timer() {
            clearTimeout(pomKiller);
            running = false;
        }

        function set_state(newState) {
            if (newState != state) {
                stop_timer();
                state = newState;
                if (newState == "SHORT-BREAK")
                    timeLeft = shortLength;
                else if (newState == "LONG-BREAK")
                    timeLeft = longLength;
                else
                    timeLeft = pomoLength;
            }
        }

        function get_state() {
            return state;
        }

        function get_pomo_length() {
            return pomoLength;
        }

        function get_short_length() {
            return shortLength;
        }

        function get_long_length() {
            return longLength;
        }

        function get_time_left() {
            return timeLeft;
        }

        function get_pomo_interval() {
            return pomInterval;
        }

        function get_running() {
            return running;
        }

        function get_auto_pomo() {
            return autoPomo;
        }

        function get_auto_short() {
            return autoShort;
        }

        function get_auto_long() {
            return autoLong;
        }

        function get_pomos() {
            return pomos;
        }

        function set_time_left(seconds) {
            timeLeft = seconds;
        }

        function set_pomo_length(seconds) {
            pomoLength = seconds;
        }

        function set_short_length(seconds) {
            shortLength = seconds;
        }

        function set_long_length(seconds) {
            longLength = seconds;
        }

        function set_pomo_interval(length) {
            pomInterval = length;
        }

        function set_auto_pomo(value) {
            autoPomo = value;
        }

        function set_auto_short(value) {
            autoShort = value;
        }

        function set_auto_long(value) {
            autoLong = value;
        }

        return {
            getters: { get_state, get_pomo_interval, get_pomo_length, get_short_length, get_long_length, get_time_left, get_running, get_auto_pomo, get_auto_short, get_auto_long, get_pomos },
            setters: { set_time_left, set_pomo_length, set_short_length, set_long_length, set_pomo_interval, set_auto_pomo, set_auto_short, set_auto_long, set_interface, set_state },
            run_timer, stop_timer
        };
    }
)();

const stateButtons = document.querySelectorAll(".timers button");

const interfaceObj = (
    () => {
        const audio = new Audio("alarm.mp3");

        function update(state) {
            if (!state.update) {
                change_time(state.timeLeft, time);
            }
            else {
                change_css(root, pomoObj);
                audio.play();
                pomo.innerText = `Pomo# ${pomoObj.getters.get_pomos() + 1}`;
                change_time(pomoObj.getters.get_time_left(), time);
                if (!pomoObj.getters.get_running()) {
                    pop.classList.remove("active");
                    pop.innerText = "START";
                }
                stateButtons.forEach(button => {
                    button.classList.remove("active");
                    if (button.classList.contains(pomoObj.getters.get_state().toLowerCase())) {
                        button.classList.add("active");
                    }
                });

            }
        }

        return { update }
    }
)();

const pop = document.querySelector(".pop");
const time = document.querySelector(".time");
const pomo = document.querySelector(".pomo-info");
const warningModal = document.querySelector(".warning-modal");
const yes = document.querySelector(".yes");
const no = document.querySelector(".no");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".close-modal");
const settingsButton = document.querySelector(".settings-button");
const settings = document.querySelector(".settings");
const save = document.querySelector(".save-preferences");
const autostartButtons = document.querySelectorAll(".autostart input[type='checkbox']");
const root = document.documentElement;
const toggle = document.getElementById("theme-box");
let newState;

newState = "POMODORO";

root.className = "light";
toggle.addEventListener("click", () => {
    if (toggle.checked)
        root.className = "dark";
    else
        root.className = "light";
    change_css(root, pomoObj);
});

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

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    autostartButtons.forEach(box => {
        if (box.name == "auto-pomos") {
            if (box.checked != pomoObj.getters.get_auto_pomo())
                box.click();
        }
        else if (box.name == "auto-shorts") {
            if (box.checked != pomoObj.getters.get_auto_short())
                box.click();
        }
        else if (box.name == "auto-longs") {
            if (box.checked != pomoObj.getters.get_auto_long())
                box.click();
        }
    });
});

settingsButton.addEventListener("click", () => {
    modal.style.display = "block";
    settings["pominutes"].value = pomoObj.getters.get_pomo_length() / 60;
    settings["short-duration"].value = pomoObj.getters.get_short_length() / 60;
    settings["long-duration"].value = pomoObj.getters.get_long_length() / 60;
    settings["auto-pomos"].checked = pomoObj.getters.get_auto_pomo();
    settings["auto-shorts"].checked = pomoObj.getters.get_auto_short();
    settings["auto-longs"].checked = pomoObj.getters.get_auto_long();
    settings["interval-length"].value = pomoObj.getters.get_pomo_interval();
});

save.addEventListener("click", event => {
    event.preventDefault();
    pomoObj.setters.set_pomo_length(settings["pominutes"].value * 60);
    pomoObj.setters.set_short_length(settings["short-duration"].value * 60);
    pomoObj.setters.set_long_length(settings["long-duration"].value * 60);
    pomoObj.setters.set_auto_pomo(settings["auto-pomos"].checked);
    pomoObj.setters.set_auto_short(settings["auto-shorts"].checked);
    pomoObj.setters.set_auto_long(settings["auto-longs"].checked);
    pomoObj.setters.set_pomo_interval(settings["interval-length"].value);

    switch (pomoObj.getters.get_state()) {
        case "POMODORO":
            change_time(pomoObj.getters.get_pomo_length(), time);
            pomoObj.setters.set_time_left(pomoObj.getters.get_pomo_length());
            break;
        case "SHORT-BREAK":
            change_time(pomoObj.getters.get_short_length(), time);
            pomoObj.setters.set_time_left(pomoObj.getters.get_short_length());
            break;
        case "LONG-BREAK":
            change_time(pomoObj.getters.get_long_length(), time);
            pomoObj.setters.set_time_left(pomoObj.getters.get_long_length());
            break;
    }
    modal.style.display = "none";
});

stateButtons.forEach(button => {
    button.addEventListener("click", event => {
        if (!button.classList.contains(pomoObj.getters.get_state().toLowerCase())) {
            if (pomoObj.getters.get_running()) {

                warningModal.style.display = "block";
                pomoObj.stop_timer();
                newState = button.classList[0].toUpperCase();
            }
            else {
                button.classList.add("active");
                stateButtons.forEach(butt => {
                    if (button != butt)
                        butt.classList.remove("active");
                });

                pomoObj.setters.set_state(button.classList[0].toUpperCase());
                change_time(pomoObj.getters.get_time_left(), time);
                change_css(root, pomoObj);
            }
        }
    });
});

yes.addEventListener("click", () => {
    pomoObj.setters.set_state(newState);
    change_css(root, pomoObj);
    change_time(pomoObj.getters.get_time_left(), time);
    warningModal.style.display = "none";
    pop.classList.remove("active");
    pop.innerText = "START";

    stateButtons.forEach(button => {
        button.classList.remove("active");

        if (button.classList.contains(newState.toLowerCase()))
            button.classList.add("active");
    });
});

no.addEventListener("click", () => {
    warningModal.style.display = "none";
    pomoObj.run_timer();
});

pomoObj.setters.set_interface(interfaceObj);

pop.addEventListener("click", () => {
    if (!pomoObj.getters.get_running()) {
        pop.classList.add("active");
        pop.innerText = "STOP";
        pomoObj.run_timer();
    }
    else {
        pop.classList.remove("active");
        pop.innerText = "START";
        pomoObj.stop_timer();
    }
});

function change_time(seconds, time) {
    let duration;

    duration = format_time(seconds);
    time.innerText = `${String(Math.round(duration.minutes)).padStart(2, '0')}:${String(Math.round(duration.seconds)).padStart(2, '0')}`;
}

function format_time(seconds) {
    const secsInMin = 60;
    let minutes;

    minutes = Math.floor(seconds / secsInMin);
    seconds %= secsInMin;

    return { minutes, seconds };
}

function change_css(root, pomf) {
    switch (pomf.getters.get_state()) {
        case "POMODORO":
            root.style.setProperty("--button-bg", "rgb(242, 114, 105)");
            root.style.setProperty("--active-top", "rgb(221, 181, 176)");
            root.style.setProperty("--active-bottom", "rgb(214, 170, 161)");
            root.style.setProperty("--border-color", "rgb(242, 114, 105)");
            root.style.setProperty("--border-color-active-top", "rgb(222, 65, 65)");
            root.style.setProperty("--border-color-active-bottom", "rgb(128, 0, 21)");
            break;
        case "SHORT-BREAK":
            root.style.setProperty("--button-bg", "rgb(12, 154, 135)");
            root.style.setProperty("--active-top", "rgb(144, 195, 184)");
            root.style.setProperty("--active-bottom", "rgb(121, 174, 142)");
            root.style.setProperty("--border-color", "rgb(12, 154, 135)");
            root.style.setProperty("--border-color-active-top", "rgb(53, 189, 96)");
            root.style.setProperty("--border-color-active-bottom", "rgb(0, 128, 23)");
            break;
        case "LONG-BREAK":
            root.style.setProperty("--button-bg", "rgb(214, 161, 214)");
            root.style.setProperty("--active-top", "rgb(202, 142, 202)");
            root.style.setProperty("--active-bottom", "rgb(214, 161, 214)");
            root.style.setProperty("--border-color", "rgb(214, 161, 214)");
            root.style.setProperty("--border-color-active-top", "rgb(187, 94, 187)");
            root.style.setProperty("--border-color-active-bottom", "purple");
            break;
    }
    
    if (root.classList.contains("light")) {
        switch (pomf.getters.get_state()) {
            case "POMODORO":
                root.style.setProperty("--nav-bg", "rgb(223, 105, 115)");
                root.style.setProperty("--body-bg", "rgb(246, 228, 228)");
                break;
            case "SHORT-BREAK":
                root.style.setProperty("--nav-bg", "rgb(115, 205, 187)");
                root.style.setProperty("--body-bg", "rgb(232, 248, 245)");
                break;
            case "LONG-BREAK":
                root.style.setProperty("--nav-bg", "rgb(150, 115, 205)");
                root.style.setProperty("--body-bg", "rgb(200, 232, 248)");
                break;
        }
    }
    else {
        switch (pomf.getters.get_state()) {
            case "POMODORO":
                root.style.setProperty("--nav-bg", "rgb(149, 10, 65)");
                root.style.setProperty("--body-bg", "rgb(75, 5, 25)");
                break;
            case "SHORT-BREAK":
                root.style.setProperty("--nav-bg", "rgb(4, 131, 116)");
                root.style.setProperty("--body-bg", "rgb(4, 39, 35)");
                break;
            case "LONG-BREAK":
                root.style.setProperty("--nav-bg", "rgb(51, 14, 111)");
                root.style.setProperty("--body-bg", "rgb(2, 22, 32)");
                break;
        }
    }
}