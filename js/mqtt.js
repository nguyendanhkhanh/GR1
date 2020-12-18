const host = "tailor.cloudmqtt.com";
const port = 38291;
const part = '';
const clientId = "Web_client";
const qos = 0;
const userMQTT = "csdtdmmz";
const passMQTT = "n03RfiNelNhW";
var flag = true;

const reconnectTimeout = 1;
var subSoil = "-1",
    subTemperature = "-1",
    subHumidity = "-1",
    subRelay1 = "-1",
    subRelay2 = "-1",
    subRelay3 = "-1",
    subRelay4 = "-1";
var relayStatus1, relayStatus2, relayStatus3, relayStatus4;

var client = new Paho.MQTT.Client(host, Number(port), part, clientId);

function doConnect() {
    document.getElementById("sensor").style.display = "none";
    document.getElementById("controler").style.display = "none";

    document.getElementById("device").style.display = "block";
    feedBackControl();

    // Connect the client, providing an onConnect callback
    client.connect({
        timeout: 20,
        onSuccess: onConnect,
        useSSL: true,
        userName: userMQTT,
        password: passMQTT,
        onFailure: doFail

    });

    // Called when the connection is made
    function onConnect() {
        console.log("Connected!");

        document.getElementById("connectStatus").style.display = "block";
        document.getElementById("connectStatus").innerText = "Server connected!!";
        document.getElementById("connectStatus").style.color = "green";

        doClick();
        client.subscribe("ESP/percent_soil")
        client.subscribe("ESP/temperature");
        client.subscribe("ESP/humidity");
        client.subscribe("ESPg/RL1");
        client.subscribe("ESPg/RL2");
        client.subscribe("ESPg/RL3");
        client.subscribe("ESPg/RL4");
    }

    function doFail(e) {
        console.log(e);
        document.getElementById("connectStatus").style.display = "block";
        document.getElementById("connectStatus").innerText = "not connect, check your Internet!";
        document.getElementById("connectStatus").style.color = "red";
        setTimeout(doConnect, Number(reconnectTimeout));
    }

}

function disconnectMqtt() {
    client.disconnect();
}

// set callback handlers
client.onConnectionLost = function (responseObject) {
    console.log("Connection Lost: " + responseObject.errorMessage);
    document.getElementById("connectStatus").style.display = "block";
    document.getElementById("connectStatus").innerText = "Disconnected! Wait to connect.....";
    document.getElementById("connectStatus").style.color = "red";
    setTimeout(doConnect, Number(reconnectTimeout));
}

function feedBackControl(){
    client.onMessageArrived = function (message) {
        if (flag) {
            document.getElementById("sensor").style.display = "block";
            document.getElementById("controler").style.display = "block";

            document.getElementById("device").style.display = "none";
            flag = false;
        }
    
    
        let flagSoil, flagHum, flagTem, flagRL1, flagRL2, flagRL3, flagRL4;
    
        switch (message.destinationName) {
    
        case "ESP/percent_soil": {
            if (message.payloadString === subSoil) {
                flagSoil = false;
            } else {
                subSoil = message.payloadString;
                flagSoil = true;
            }
        }
            break;

        case "ESP/temperature": {
            if (message.payloadString === subTemperature) {
                flagTem = false;
            } else {
                subTemperature = message.payloadString;
                flagTem = true;
            }
        }
            break;
        case "ESP/humidity": {
    
            if (message.payloadString === subHumidity) {
                flagHum = false;
            } else {
                subHumidity = message.payloadString;
                flagHum = true;
            }
        }
        break;
    
        case "ESPg/RL1": {
    
            if (message.payloadString === subRelay1) {
                flagRL1 = false;
            } else {
                subRelay1 = message.payloadString;
                flagRL1 = true;
            }
        }
        break;
        case "ESPg/RL2": {
    
            if (message.payloadString === subRelay2) {
                flagRL2 = false;
            } else {
                subRelay2 = message.payloadString;
                flagRL2 = true;
            }
        }
        break;
        case "ESPg/RL3": {
    
            if (message.payloadString === subRelay3) {
                flagRL3 = false;
            } else {
                subRelay3 = message.payloadString;
                flagRL3 = true;
            }
        }
        break;
        case "ESPg/RL4": {
    
            if (message.payloadString === subRelay4) {
                flagRL4 = false;
            } else {
                subRelay4 = message.payloadString;
                flagRL4 = true;
            }
        }
        break;
        }
        if (flagSoil) {
            document.getElementById("progressSoil").className = "c100 p" + (message.payloadString) + " green";
            document.getElementById("soilNumber").innerText = "S  " + (message.payloadString) + "%";
            flagSoil = false;
        }

        if (flagTem) {
            document.getElementById("progressTem").className = "c100 p" + (message.payloadString - 5) + " orange";
            document.getElementById("temNumber").innerText = message.payloadString + "°C";
            flagTem = false;
        }
    
        if (flagHum) {
            document.getElementById("progressHum").className = "c100 p" + message.payloadString + " green";
            document.getElementById("humNumber").innerText = message.payloadString + "%";
            flagHum = false;
        }

        if (flagRL1) {
    
            if (subRelay1 === "1") {
                document.getElementById("relay1img").src = "img/water-on.png";
                document.getElementById("rl1status").innerText = "ON";
                relayStatus1 = true;
                flagRL1 = false;
            } else {
                document.getElementById("relay1img").src = "img/water-off.png";
                document.getElementById("rl1status").innerText = "OFF";
                relayStatus1 = false;
                flagRL1 = false;
            }
        }
    
        if (flagRL2) {
            if (subRelay2 === "1") {
                document.getElementById("relay2img").src = "img/light_on.png";
                document.getElementById("rl2status").innerText = "ON";
                relayStatus2 = true;
                flagRL2 = false;
            } else {
                document.getElementById("relay2img").src = "img/light_off.png";
                document.getElementById("rl2status").innerText = "OFF";
                relayStatus2 = false;
                flagRL2 = false;
            }
        }
    
        if (flagRL3) {
            if (subRelay3 === "1") {
                document.getElementById("relay3img").src = "img/light_on.png";
                document.getElementById("rl3status").innerText = "ON";
                relayStatus3 = true;
                flagRL3 = false;
            } else {
                document.getElementById("relay3img").src = "img/light_off.png";
                document.getElementById("rl3status").innerText = "OFF";
                relayStatus3 = false;
                flagRL3 = false;
            }
        }
    
        if (flagRL4) {
            if (subRelay4 === "1") {
                document.getElementById("relay4img").src = "img/light_on.png";
                document.getElementById("rl4status").innerText = "ON";
                relayStatus4 = true;
                flagRL4 = false;
            } else {
                document.getElementById("relay4img").src = "img/light_off.png";
                document.getElementById("rl4status").innerText = "OFF";
                relayStatus4 = false;
                flagRL4 = false;
            }
        }
    
    
    }
}

function doClick() {
    /*document.getElementById("pubRelay1").onclick = function () {

        if (relayStatus1) {

            client.send("ESPn/RL1", "0", qos, false);
        } else {

            client.send("ESPn/RL1", "1", qos, false);
        }

    }
    */
    

    document.getElementById("pubRelay2").onclick = function () {

        if (relayStatus2) {

            client.send("ESPn/RL2", "0", qos, false);
        } else {

            client.send("ESPn/RL2", "1", qos, false);
        }

    }

    document.getElementById("pubRelay3").onclick = function () {

        if (relayStatus3) {

            client.send("ESPn/RL3", "0", qos, false);
        } else {

            client.send("ESPn/RL3", "1", qos, false);
        }

    }

    document.getElementById("pubRelay4").onclick = function () {

        if (relayStatus4) {

            client.send("ESPn/RL4", "0", qos, false);
        } else {

            client.send("ESPn/RL4", "1", qos, false);
        }

    }


}


var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("controler");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    if (relayStatus1) {
        client.send("ESPn/RL1", "0", qos, false);
        stop();
        alert("Tắt máy bơm sớm hơn dự kiến");
    } else {
    modal.style.display = "block";
    };
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

var timeoutRL = null ;
function stop(){
    clearTimeout(timeoutRL);
        }
function setTimeOff()
{
    let hourOff = document.getElementById("hourTurnOff").value
    let minuteOff = document.getElementById("minuteTurnOff").value

    var now = new Date();
    var timeOff = new Date();
    timeOff.setHours(hourOff);
    timeOff.setMinutes(minuteOff);
    console.log(timeOff);
    if(Date.parse(timeOff) <= Date.parse(now)){
        // Lỗi sai thời gian
        console.log('sai thời gian');
        alert("Nhập sai thời gian, vui lòng kiểm tra lại");
    }
    else{
        document.getElementById("modal-content").innerText = "Đã đặt thời gian tắt máy bơm";
        client.send("ESPn/RL1", "1", qos, false);
        //bat dong ho dem nguoc
        //timerRelay();
        //timer
        let h = null;
        let m = null;
        let s = null;
        var timeoutRL = null ; 
        function timerRelay()
            {
                /*BƯỚC 1: LẤY GIÁ TRỊ BAN ĐẦU*/
                if (h === null)
                {
            h = timeOff.getHours() - now.getHours();
            m = timeOff.getMinutes() - now.getMinutes();
            s = 5;
                }

                /*BƯỚC 1: CHUYỂN ĐỔI DỮ LIỆU*/
                // Nếu số giây = -1 tức là đã chạy ngược hết số giây, lúc này:
                //  - giảm số phút xuống 1 đơn vị
                //  - thiết lập số giây lại 59
                if (s === -1){
                    m -= 1;
                    s = 59;
                }

                // Nếu số phút = -1 tức là đã chạy ngược hết số phút, lúc này:
                //  - giảm số giờ xuống 1 đơn vị
                //  - thiết lập số phút lại 59
                if (m === -1){
                    h -= 1;
                    m = 59;
                }

                // Nếu số giờ = -1 tức là đã hết giờ, lúc này:
                //  - Dừng chương trình
                if (h == -1){
                    clearTimeout(timeoutRL);
                    
                    return false;
                }

                /*BƯỚC 1: HIỂN THỊ ĐỒNG HỒ*/
                document.getElementById("h").innerText = h.toString() + " :";
                document.getElementById("m").innerText = m.toString() + " :";
                document.getElementById("s").innerText = s.toString();

                /*BƯỚC 1: GIẢM PHÚT XUỐNG 1 GIÂY VÀ GỌI LẠI SAU 1 GIÂY */
                timeoutRL = setTimeout(function(){
                    s--;
                    timerRelay();
                }, 1000);
            }    
        function stop(){
            clearTimeout(timeoutRL);
        }
        timerRelay();
        //cai dat time tat
        setInterval(function () {
        var now = new Date();
        console.log(timeOff);
        if(Date.parse(now) >= Date.parse(timeOff)){
            // Tắt đèn
            if(relayStatus1)
            {
            client.send("ESPn/RL1", "0", qos, false);
            console.log("Đã tắt RL1");
            alert('Máy bơm đã tắt');
            }
            else{}
        }
        }, 60000); // 60000 milisecond

    }
}
