//-------------------------------------------0------------------------------------------------

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

//-------------------------------------------1------------------------------------------------


//-------------------------------------------0------------------------------------------------

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

//-------------------------------------------1------------------------------------------------

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
        pomos = 1;
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
                    pomos++;
                    if (pomos % pomInterval) {
                        timeLeft = shortLength;
                        currentState = shortState;
                        if (autoShort) {
                            running = true;
                            run_timer();
                        }
                    }
                    else {
                        timeLeft = longLength;
                        state = longState;
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
                        running = true;
                        run_timer();
                    }
                }
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
            getters: { get_state, get_pomo_interval, get_pomo_length, get_short_length, get_long_length, get_time_left, get_running, get_auto_pomo, get_auto_short, get_auto_long },
            setters: { set_pomo_length, set_short_length, set_long_length, set_pomo_interval, set_auto_pomo, set_auto_short, set_auto_long, set_interface, set_state },
            run_timer, stop_timer
        };
    }
)();

const interfaceObj = (
    () => {
        function update(state) {
            if (!state.update) {
                change_time(state.timeLeft, time);
            }
        }

        return { update }
    }
)();

const stateButtons = document.querySelectorAll(".timers button");
const pop = document.querySelector(".pop");
const time = document.querySelector(".time");
const pomo = document.querySelector(".pomo-info");
const warningModal = document.querySelector(".warning-modal");
const yes = document.querySelector(".yes");
const no = document.querySelector(".no");
const modal = document.querySelector(".modal");
const settingsButton = document.querySelector(".settings-button");
const settings = document.querySelector(".settings");
const save = document.querySelector(".save-preferences");
let newState;

newState = "POMODORO";

settingsButton.addEventListener("click", () => {
    modal.style.display = "block";
    settings["pominutes"].value = Math.floor(pomoObj.getters.get_pomo_length() / 60);
    settings["short-duration"].value = Math.floor(pomoObj.getters.get_short_length() / 60);
    settings["long-duration"].value = Math.floor(pomoObj.getters.get_long_length() / 60);
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
            break;
        case "SHORT-BREAK":
            change_time(pomoObj.getters.get_short_length(), time);
            break;
        case "LONG-BREAK":
            change_time(pomoObj.getters.get_long_length(), time);
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
            }
        }
    });
});

yes.addEventListener("click", () => {
    pomoObj.setters.set_state(newState);
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
    time.innerText = `${String(duration.minutes).padStart(2, '0')}:${String(duration.seconds).padStart(2, '0')}`;
}

function format_time(seconds) {
    const secsInMin = 60;
    let minutes;

    minutes = Math.floor(seconds / secsInMin);
    seconds %= secsInMin;

    return { minutes, seconds };
}