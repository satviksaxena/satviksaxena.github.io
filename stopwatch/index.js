const timer = document.getElementById("stopwatch")


let hr = 0;
let min = 0;
let sec = 0;
let ignite

// Start the timer function.
function startTimer() {
    clearInterval(ignite)
    ignite = setInterval(() => {
        sec = parseInt(sec)
        min = parseInt(min)
        hr = parseInt(hr)

        sec = sec + 1;
        if (sec == 60) {
            min = min + 1
            sec = 0
        }

        if (min == 60) {
            hr = hr + 1
            min = 0
            sec = 0
        }

        if (sec < 10) {
            sec = "0" + sec
        }
        if (min < 10) {
            min = "0" + min
        }
        if (hr < 10) {
            hr = "0" + hr
        }

        // displaying the real-time value of the timer
        timer.innerHTML = hr + ":" + min + ":" + sec

    }, 1000)

}

// stops the timer function but does not reset the value to zero
function stopTimer() {
    clearInterval(ignite)
}

// stops the timer function and resets the value to zero
function resetTimer() {
    clearInterval(ignite)
    timer.innerHTML = "00:00:00"
    hr = 0
    min = 0
    sec = 0
}

// Changes CSS file from light.css to dark.css
function toggleThemeColor1() {
    let theme = document.getElementsByTagName('link')[0];
    if (theme.getAttribute('href') == 'light.css') {
        theme.setAttribute('href', 'dark.css')
    }
}

// Changes CSS file from dark.css to light.css
function toggleThemeColor2() {
    let theme = document.getElementsByTagName('link')[0];
    if (theme.getAttribute('href') == 'dark.css') {
        theme.setAttribute('href', 'light.css')
    }
}

// When we click the buttons corresponding to their ids, an event is triggered
document.addEventListener('click', (e) => {
    const el = e.target
    if (el.id === "start") startTimer()
    if (el.id === "stop") stopTimer()
    if (el.id === "reset") resetTimer()
    if (el.id === "toggleTheme1") toggleThemeColor1()
    if (el.id === "toggleTheme2") toggleThemeColor2()
})

