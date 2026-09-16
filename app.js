/* =====================================================
   SMART IRRIGATION ROBOT
   FRONTEND JAVASCRIPT
===================================================== */


/* =====================================================
   BACKEND URL
===================================================== */

let API_URL =
    "http://127.0.0.1:5000/api";


/*
   When you deploy your Flask backend,
   change the line above to:

   let API_URL =
       "https://YOUR-BACKEND-URL/api";
*/


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let audioContext = null;

let selectedRobotNumber = null;

let robotWorking = false;

let workTimer = null;

let farmRobotPosition = 15;


/* =====================================================
   AUDIO
===================================================== */

function getAudioContext() {

    if (!audioContext) {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();

    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }

    return audioContext;
}


/* =====================================================
   NORMAL SOUND
===================================================== */

function playSound(
    frequency = 600,
    duration = 200,
    type = "sine",
    volume = 0.25
) {

    try {

        const context =
            getAudioContext();

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();

        oscillator.connect(gain);

        gain.connect(
            context.destination
        );

        oscillator.type = type;

        oscillator.frequency.setValueAtTime(
            frequency,
            context.currentTime
        );

        gain.gain.setValueAtTime(
            volume,
            context.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime +
            duration / 1000
        );

        oscillator.start();

        oscillator.stop(
            context.currentTime +
            duration / 1000
        );

    }

    catch (error) {

        console.log(
            "Audio error:",
            error
        );

    }

}


/* =====================================================
   WATER FALLING SOUND
===================================================== */

let waterSoundTimer = null;

function startWaterSound() {

    stopWaterSound();

    function makeWaterSound() {

        try {

            const context =
                getAudioContext();

            const bufferSize =
                context.sampleRate * 0.25;

            const buffer =
                context.createBuffer(
                    1,
                    bufferSize,
                    context.sampleRate
                );

            const data =
                buffer.getChannelData(0);

            for (
                let i = 0;
                i < bufferSize;
                i++
            ) {

                data[i] =
                    (
                        Math.random() * 2 - 1
                    ) *
                    Math.exp(
                        -i /
                        (
                            context.sampleRate *
                            0.08
                        )
                    );

            }

            const source =
                context.createBufferSource();

            const filter =
                context.createBiquadFilter();

            const gain =
                context.createGain();

            filter.type =
                "highpass";

            filter.frequency.value =
                500;

            gain.gain.value =
                0.15;

            source.buffer =
                buffer;

            source
                .connect(filter)
                .connect(gain)
                .connect(
                    context.destination
                );

            source.start();

        }

        catch (error) {

            console.log(
                "Water sound error:",
                error
            );

        }

    }


    makeWaterSound();

    waterSoundTimer =
        setInterval(
            makeWaterSound,
            350
        );

}


function stopWaterSound() {

    if (waterSoundTimer) {

        clearInterval(
            waterSoundTimer
        );

        waterSoundTimer =
            null;

    }

}


/* =====================================================
   ALERT SOUND
===================================================== */

function playAlertSound() {

    getAudioContext();

    playSound(
        1000,
        250,
        "square",
        0.3
    );

    setTimeout(
        () => {

            playSound(
                1000,
                250,
                "square",
                0.3
            );

        },
        350
    );

    setTimeout(
        () => {

            playSound(
                700,
                400,
                "square",
                0.25
            );

        },
        700
    );

}


/* =====================================================
   LOGIN
===================================================== */

function login() {

    const username =
        document
            .getElementById("username")
            .value
            .trim();

    const password =
        document
            .getElementById("password")
            .value
            .trim();


    if (
        username === "" ||
        password === ""
    ) {

        document
            .getElementById(
                "loginMessage"
            )
            .textContent =
            "Please enter username and password.";

        playAlertSound();

        return;

    }


    getAudioContext();


    document
        .getElementById(
            "loginPage"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "dashboardPage"
        )
        .classList
        .remove("hidden");


    playSound(
        700,
        120
    );


    setTimeout(
        () => {

            playSound(
                900,
                150
            );

        },
        150
    );


    startSystem();

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    stopRobotWork();

    stopWaterSound();

    selectedRobotNumber =
        null;

    localStorage.removeItem(
        "selectedRobot"
    );


    document
        .getElementById(
            "dashboardPage"
        )
        .classList
        .add("hidden");


    document
        .getElementById(
            "loginPage"
        )
        .style
        .display =
        "flex";


    document
        .getElementById(
            "username"
        )
        .value = "";


    document
        .getElementById(
            "password"
        )
        .value = "";


    playSound(
        300,
        200,
        "square",
        0.2
    );

}


/* =====================================================
   NAVIGATION
===================================================== */

function goToSection(
    sectionId
) {

    const section =
        document.getElementById(
            sectionId
        );

    if (!section) {
        return;
    }


    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    playSound(
        650,
        100
    );

}


/* =====================================================
   OPEN PUMP DASHBOARD
===================================================== */

function openPumpDashboard() {

    const pump =
        document.getElementById(
            "pumpSection"
        );

    if (!pump) {
        return;
    }


    pump.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    playSound(
        500,
        120
    );

}


/* =====================================================
   PUMP TABS
===================================================== */

function showPumpTab(
    tabName,
    button
) {

    document
        .querySelectorAll(
            ".pump-tab-content"
        )
        .forEach(
            tab => {

                tab.classList
                    .remove("active");

            }
        );


    document
        .querySelectorAll(
            ".pump-tab"
        )
        .forEach(
            tab => {

                tab.classList
                    .remove("active");

            }
        );


    const selectedTab =
        document.getElementById(
            tabName + "Tab"
        );


    if (selectedTab) {

        selectedTab.classList
            .add("active");

    }


    if (button) {

        button.classList
            .add("active");

    }


    playSound(
        600,
        100
    );

}


/* =====================================================
   SOIL
===================================================== */

function selectMoisture(
    condition,
    percentage
) {

    document
        .getElementById(
            "soilMoisture"
        )
        .textContent =
        percentage + "%";


    document
        .getElementById(
            "soilCondition"
        )
        .textContent =
        condition;


    document
        .getElementById(
            "soilMoistureDisplay"
        )
        .textContent =
        percentage + "%";


    document
        .getElementById(
            "soilConditionDisplay"
        )
        .textContent =
        condition;


    document
        .getElementById(
            "moistureFill"
        )
        .style
        .width =
        percentage + "%";


    playSound(
        500,
        200
    );


    fetch(
        `${API_URL}/soil`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                moisture:
                    percentage,

                condition:
                    condition

            })

        }
    )
    .catch(
        error =>
            console.log(
                "Soil error:",
                error
            )
    );

}


/* =====================================================
   WATER
===================================================== */

function selectWaterLevel(
    percentage
) {

    document
        .getElementById(
            "waterLevel"
        )
        .textContent =
        percentage + "%";


    document
        .getElementById(
            "waterLevelDisplay"
        )
        .textContent =
        percentage + "%";


    document
        .getElementById(
            "tankWater"
        )
        .style
        .height =
        percentage + "%";


    document
        .getElementById(
            "waterMiniFill"
        )
        .style
        .width =
        percentage + "%";


    playSound(
        350,
        200
    );


    setTimeout(
        () => {

            playSound(
                450,
                180
            );

        },
        150
    );


    fetch(
        `${API_URL}/water`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                water_level:
                    percentage

            })

        }
    )
    .catch(
        error =>
            console.log(
                "Water error:",
                error
            )
    );

}


/* =====================================================
   TEMPERATURE
===================================================== */

function selectTemperature(
    temperature
) {

    document
        .getElementById(
            "temperature"
        )
        .textContent =
        temperature + "°C";


    document
        .getElementById(
            "temperatureDisplay"
        )
        .textContent =
        temperature + "°C";


    playSound(
        650,
        150
    );


    fetch(
        `${API_URL}/temperature`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                temperature:
                    temperature

            })

        }
    )
    .catch(
        error =>
            console.log(
                "Temperature error:",
                error
            )
    );

}


/* =====================================================
   PUMP
===================================================== */

function controlPump(
    status
) {

    getAudioContext();


    if (status === "on") {

        startWaterSound();

        playSound(
            300,
            250,
            "square",
            0.18
        );

    }

    else {

        stopWaterSound();

        playSound(
            250,
            180,
            "square",
            0.2
        );

    }


    updatePumpDisplay(
        status === "on"
    );


    fetch(
        `${API_URL}/pump`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                status:
                    status

            })

        }
    )
    .then(
        response =>
            response.json()
    )
    .then(
        data => {

            updatePumpDisplay(
                data.pump
            );


            if (data.robot_task) {

                document
                    .getElementById(
                        "robotTask"
                    )
                    .textContent =
                    data.robot_task;

            }

        }
    )
    .catch(
        error =>
            console.log(
                "Pump error:",
                error
            )
    );

}


/* =====================================================
   PUMP DISPLAY
===================================================== */

function updatePumpDisplay(
    isOn
) {

    const status =
        document.getElementById(
            "pumpStatus"
        );


    const indicator =
        document.getElementById(
            "pumpIndicator"
        );


    const dashboardStatus =
        document.getElementById(
            "pumpDashboardStatus"
        );


    const waterFlowText =
        document.getElementById(
            "waterFlowText"
        );


    const flowMeter =
        document.getElementById(
            "flowMeterFill"
        );


    const flowStatus =
        document.getElementById(
            "flowStatus"
        );


    if (status) {

        status.textContent =
            isOn ? "ON" : "OFF";

    }


    if (indicator) {

        indicator.textContent =
            isOn ? "ON" : "OFF";

        indicator.classList
            .remove(
                "on",
                "off"
            );

        indicator.classList
            .add(
                isOn
                    ? "on"
                    : "off"
            );

    }


    if (dashboardStatus) {

        dashboardStatus.textContent =
            isOn ? "ON" : "OFF";

        dashboardStatus.classList
            .remove(
                "on",
                "off"
            );

        dashboardStatus.classList
            .add(
                isOn
                    ? "on"
                    : "off"
            );

    }


    if (waterFlowText) {

        waterFlowText.textContent =
            isOn
                ? "💧 Water is flowing..."
                : "Water flow stopped";

    }


    if (flowMeter) {

        flowMeter.style.width =
            isOn ? "85%" : "0%";

    }


    if (flowStatus) {

        flowStatus.textContent =
            isOn
                ? "Flow: 85%"
                : "Flow: 0%";

    }

}


/* =====================================================
   AUTOMATIC IRRIGATION
===================================================== */

function setAutomaticMode(
    enabled
) {

    fetch(
        `${API_URL}/automatic`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                enabled:
                    enabled

            })

        }
    )
    .then(
        response =>
            response.json()
    )
    .then(
        data => {

            updateAutomaticDisplay(
                data.automatic_irrigation
            );


            updatePumpDisplay(
                data.pump
            );


            if (data.pump) {

                startWaterSound();

            }

            else {

                stopWaterSound();

            }


            if (data.robot_task) {

                document
                    .getElementById(
                        "robotTask"
                    )
                    .textContent =
                    data.robot_task;

            }

        }
    )
    .catch(
        error =>
            console.log(
                "Automatic error:",
                error
            )
    );

}


/* =====================================================
   AUTOMATIC DISPLAY
===================================================== */

function updateAutomaticDisplay(
    isOn
) {

    const status =
        document.getElementById(
            "automaticStatus"
        );


    const indicator =
        document.getElementById(
            "automaticIndicator"
        );


    if (status) {

        status.textContent =
            isOn
                ? "ON"
                : "OFF";

    }


    if (indicator) {

        indicator.textContent =
            isOn
                ? "ON"
                : "OFF";

        indicator.classList
            .remove(
                "on",
                "off"
            );

        indicator.classList
            .add(
                isOn
                    ? "on"
                    : "off"
            );

    }

}


/* =====================================================
   ROBOT SELECTION
===================================================== */

function selectFarmRobot(
    robotNumber
) {

    selectedRobotNumber =
        robotNumber;


    localStorage.setItem(
        "selectedRobot",
        robotNumber
    );


    const names = {

        1:
            "Soil Monitoring Robot",

        2:
            "Irrigation Robot",

        3:
            "Crop Monitoring Robot",

        4:
            "Fertilizer Robot",

        5:
            "Farm Transport Robot"

    };


    const robotName =
        names[robotNumber];


    document
        .getElementById(
            "selectedRobotName"
        )
        .textContent =
        robotName;


    document
        .getElementById(
            "robotWorkStatus"
        )
        .textContent =
        "READY";


    document
        .getElementById(
            "farmRobotStatus"
        )
        .textContent =
        "READY";


    document
        .getElementById(
            "robotTask"
        )
        .textContent =
        robotName +
        " is ready to work.";


    playSound(
        750,
        100
    );


    fetch(
        `${API_URL}/robot/select`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                robot:
                    robotNumber

            })

        }
    )
    .then(
        response =>
            response.json()
    )
    .then(
        data => {

            if (
                data.success === true
            ) {

                document
                    .getElementById(
                        "selectedRobotName"
                    )
                    .textContent =
                    data.robot;

                document
                    .getElementById(
                        "robotTask"
                    )
                    .textContent =
                    data.robot_task;

            }

        }
    )
    .catch(
        error =>
            console.log(
                "Robot selection error:",
                error
            )
    );

}


/* =====================================================
   START ROBOT
===================================================== */

function startRobotWork() {

    if (!selectedRobotNumber) {

        const savedRobot =
            localStorage.getItem(
                "selectedRobot"
            );

        if (savedRobot) {

            selectedRobotNumber =
                Number(savedRobot);

        }

    }


    if (!selectedRobotNumber) {

        alert(
            "Please select a robot first."
        );

        return;

    }


    /*
       IMPORTANT:
       Select the robot AGAIN before
       sending the work command.
       This prevents the old
       "Please select a robot first"
       problem.
    */

    fetch(
        `${API_URL}/robot/select`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                robot:
                    selectedRobotNumber

            })

        }
    )
    .then(
        response =>
            response.json()
    )
    .then(
        () => {

            return fetch(
                `${API_URL}/robot/work`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        working:
                            true

                    })

                }
            );

        }
    )
    .then(
        response =>
            response.json()
    )
    .then(
        data => {

            if (
                data.success !== true
            ) {

                alert(
                    data.message ||
                    "Robot could not start."
                );

                return;

            }


            robotWorking =
                true;


            document
                .getElementById(
                    "robotWorkStatus"
                )
                .textContent =
                "WORKING";


            document
                .getElementById(
                    "farmRobotStatus"
                )
                .textContent =
                "WORKING";


            document
                .getElementById(
                    "robotTask"
                )
                .textContent =
                data.robot_task ||
                "Robot is working.";


            document
                .getElementById(
                    "workingRobot"
                )
                .classList
                .add("working");


            updatePumpDisplay(
                data.pump
            );


            startFarmWork();


            playSound(
                700,
                150
            );

        }
    )
    .catch(
        error => {

            console.log(
                "Start robot error:",
                error
            );

            alert(
                "Unable to connect to backend."
            );

        }
    );

}


/* =====================================================
   FARM WORK
===================================================== */

function startFarmWork() {

    clearInterval(
        workTimer
    );


    workTimer =
        setInterval(
            () => {

                if (
                    !robotWorking
                ) {

                    return;

                }


                moveWorkingRobot();

            },
            2500
        );

}


function moveWorkingRobot() {

    const robot =
        document.getElementById(
            "workingRobot"
        );


    if (!robot) {
        return;
    }


    farmRobotPosition += 8;


    if (
        farmRobotPosition >= 80
    ) {

        farmRobotPosition =
            15;

    }


    robot.style.left =
        farmRobotPosition +
        "%";


    document
        .getElementById(
            "farmRobotStatus"
        )
        .textContent =
        "WORKING • CHECKING CROPS";


    setTimeout(
        () => {

            if (
                !robotWorking
            ) {
                return;
            }


            document
                .getElementById(
                    "farmRobotStatus"
                )
                .textContent =
                "WORKING • IRRIGATING";

        },
        1000
    );

}


/* =====================================================
   PAUSE
===================================================== */

function pauseRobotWork() {

    robotWorking =
        false;


    clearInterval(
        workTimer
    );


    document
        .getElementById(
            "workingRobot"
        )
        .classList
        .remove("working");


    fetch(
        `${API_URL}/robot/work`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({

                working:
                    false

            })

        }
    )
    .then(
        response =>
            response.json()
    )
    .then(
        data => {

            document
                .getElementById(
                    "robotWorkStatus"
                )
                .textContent =
                "PAUSED";


            document
                .getElementById(
                    "farmRobotStatus"
                )
                .textContent =
                "PAUSED";


            document
                .getElementById(
                    "robotTask"
                )
                .textContent =
                data.robot_task ||
                "Robot work paused.";

        }
    );


    playSound(
        400,
        150
    );

}


/* =====================================================
   STOP ROBOT
   IMMEDIATE ALERT SOUND
===================================================== */

function stopRobotWork() {

    /*
       STOP EVERYTHING IMMEDIATELY
    */

    robotWorking =
        false;


    clearInterval(
        workTimer
    );


    stopWaterSound();


    const robot =
        document.getElementById(
            "workingRobot"
        );


    if (robot) {

        robot.classList
            .remove("working");

    }


    document
        .getElementById(
            "robotWorkStatus"
        )
        .textContent =
        "STOPPED";


    document
        .getElementById(
            "farmRobotStatus"
        )
        .textContent =
        "STOPPED";


    document
        .getElementById(
            "robotTask"
        )
        .textContent =
        "Robot stopped immediately.";


    document
        .getElementById(
            "systemAlert"
        )
        .textContent =
        "🚨 ALERT: Robot has been stopped immediately.";


    /*
       ALERT SOUND HAPPENS IMMEDIATELY
    */

    getAudioContext();

    playAlertSound();


    /*
       Tell backend
    */

    fetch(
        `${API_URL}/robot/stop`,
        {
            method: "POST"
        }
    )
    .then(
        response =>
            response.json()
    )
    .then(
        data => {

            if (data.robot_task) {

                document
                    .getElementById(
                        "robotTask"
                    )
                    .textContent =
                    data.robot_task;

            }

        }
    )
    .catch(
        error =>
            console.log(
                "Stop error:",
                error
            )
    );

}


/* =====================================================
   ALERT
===================================================== */

function testAlertSound() {

    getAudioContext();

    playAlertSound();


    document
        .getElementById(
            "systemAlert"
        )
        .textContent =
        "🔊 TEST ALERT: Sound is working.";

}


function checkSystemAlert() {

    getAudioContext();

    playAlertSound();


    fetch(
        `${API_URL}/alerts`
    )
    .then(
        response =>
            response.json()
    )
    .then(
        data => {

            document
                .getElementById(
                    "systemAlert"
                )
                .textContent =
                data.alerts.join(
                    " | "
                );

        }
    )
    .catch(
        error =>
            console.log(
                "Alert error:",
                error
            )
    );

}


/* =====================================================
   LOAD SYSTEM STATUS
===================================================== */

function loadSystemStatus() {

    fetch(
        `${API_URL}/status`
    )
    .then(
        response => {

            if (!response.ok) {

                throw new Error(
                    "Backend not responding."
                );

            }

            return response.json();

        }
    )
    .then(
        data => {

            document
                .getElementById(
                    "soilMoisture"
                )
                .textContent =
                data.soil_moisture +
                "%";


            document
                .getElementById(
                    "soilCondition"
                )
                .textContent =
                data.soil_condition;


            document
                .getElementById(
                    "soilMoistureDisplay"
                )
                .textContent =
                data.soil_moisture +
                "%";


            document
                .getElementById(
                    "soilConditionDisplay"
                )
                .textContent =
                data.soil_condition;


            document
                .getElementById(
                    "moistureFill"
                )
                .style
                .width =
                data.soil_moisture +
                "%";


            document
                .getElementById(
                    "waterLevel"
                )
                .textContent =
                data.water_level +
                "%";


            document
                .getElementById(
                    "waterLevelDisplay"
                )
                .textContent =
                data.water_level +
                "%";


            document
                .getElementById(
                    "tankWater"
                )
                .style
                .height =
                data.water_level +
                "%";


            document
                .getElementById(
                    "waterMiniFill"
                )
                .style
                .width =
                data.water_level +
                "%";


            document
                .getElementById(
                    "temperature"
                )
                .textContent =
                data.temperature +
                "°C";


            document
                .getElementById(
                    "temperatureDisplay"
                )
                .textContent =
                data.temperature +
                "°C";


            document
                .getElementById(
                    "battery"
                )
                .textContent =
                data.battery +
                "%";


            document
                .getElementById(
                    "batteryFill"
                )
                .style
                .width =
                data.battery +
                "%";


            updatePumpDisplay(
                data.pump
            );


            updateAutomaticDisplay(
                data.automatic_irrigation
            );


            if (data.pump) {

                startWaterSound();

            }

        }
    )
    .catch(
        error => {

            console.log(
                "Backend error:",
                error
            );


            document
                .getElementById(
                    "systemAlert"
                )
                .textContent =
                "⚠️ Backend is offline.";

        }
    );

}


/* =====================================================
   START SYSTEM
===================================================== */

function startSystem() {

    const savedRobot =
        localStorage.getItem(
            "selectedRobot"
        );


    if (savedRobot) {

        selectedRobotNumber =
            Number(savedRobot);

    }


    loadSystemStatus();

}