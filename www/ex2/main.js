var myString = function(){/*
 <DIV id="login">
 <br>
 <FORM name="frm1" method="post"">
 <table align="center">
 <tr><td>Username:</td>
 <td><input type="text" id="username"></td></tr>
 <tr><td>Password:</td>
 <td><input type="password" id="password"></td></tr>
 <tr><td colspan="2" align="center"><button type="button" onclick="login();">Login</button></td></tr>
 </table>
 </FORM>
 </DIV>
 <DIV id="profile">
 <table align="center">
 <tr><td colspan="2" align="center"><h3>Ilia Lev</h3></td></tr>
 <tr><td rowspan="2"><img src="ilialikeasir.jpg" style="width:200px;height:232px"
 onmouseover="hover(this);" onmouseout="unhover(this);"></td>
 <td>Hobbies: Eating, drinking, smoking, JavaScript.<br>
 Quote: "If Internet Explorer is brave enough to ask you to be your default browser,<br>
 You're brave enough to ask that girl out."<br></td></tr>
 <tr><td align="center"><img src="trollie.jpg" style="width:60px;height:60px"
 onmouseover="hoverbrowser(this);" onmouseout="unhoverbrowser(this);"></td></tr>
 <tr><td colspan="2" align="center"><button type="button" onclick="showCalc();">Calculator</button>
 <button type="button" onclick="logout();">Logout</button></td></tr>
 </table>
 </DIV>
 <DIV id="calc">
 <table align="center">
 <tr><td>
 <table align="center" background="whitelego.png">
 <tr><td align="center"><h3><u>Calculator</u></h3><br></td></tr>
 <tr><td><input type="text" id="screen" style="text-align: center;" disabled></td></tr>
 <tr><td align="center"><button onclick="calc.multiply();" type="button">X</button>
 <button type="button" onclick="calc.add();">+</button>
 <button type="button" onclick="calc.clear();">Clear</button></td></tr>
 <tr><td><input type="text" id="inp" onkeypress="calc.checkInt(event);" style="text-align: center;"></td></tr>
 </table>
 </td></tr>
 <tr><td align="center"><br><br><button type="button" onclick="showProfile();">Profile</button>
 <button type="button" onclick="logout();">Logout</button></td></tr>
 </table>
 </DIV>
 */}.toString().slice(14,-3);

var calc;
window.onload = init();

function init() {
    document.body.innerHTML = myString;
    document.getElementById("login").style.visibility = "";
    document.getElementById("profile").style.visibility = "hidden";
    document.getElementById("calc").style.visibility = "hidden";
    calc = new Calculator();
}

function login() {
    var user = document.getElementById("username").value;
    var pass = document.getElementById("password").value;
    if (user === pass && user === 'admin') {
        document.getElementById("login").style.visibility = "hidden";
        document.getElementById("profile").style.visibility = "";
    }
    else {
        alert("Wrong credentials!");
    }
}

function logout() {
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    document.getElementById("login").style.visibility = "";
    document.getElementById("profile").style.visibility = "hidden";
    document.getElementById("calc").style.visibility = "hidden";
    alert("You logged out successfully!");
}

function hover(element) {
    element.setAttribute('src', 'iliatrolldad.jpg');
}

function unhover(element) {
    element.setAttribute('src', 'ilialikeasir.jpg');
}

function hoverbrowser(element) {
    element.setAttribute('src', 'firefoxie.jpeg');
}

function unhoverbrowser(element) {
    element.setAttribute('src', 'trollie.jpg');
}

function showCalc() {
    document.getElementById("profile").style.visibility = "hidden";
    document.getElementById("calc").style.visibility = "";
    calc.clear();
}

function showProfile() {
    document.getElementById("profile").style.visibility = "";
    document.getElementById("calc").style.visibility = "hidden";
}

function Calculator() {
    Calculator.prototype.add = function() {
        var screen = document.getElementById('screen');
        var input = document.getElementById('inp');
        if (input.value !== "") {
            screen.value = parseInt(screen.value) + parseInt(input.value);
        }
    };
    Calculator.prototype.multiply = function() {
        var screen = document.getElementById('screen');
        var input = document.getElementById('inp');
        if (input.value !== "") {
            screen.value = parseInt(screen.value) * parseInt(input.value);
        }
    };
    Calculator.prototype.clear = function() {
        document.getElementById('screen').value = "0";
        document.getElementById('inp').value = "";
    };
    Calculator.prototype.checkInt = function(event) {
        var value = document.getElementById('inp').value;
        if ((event.charCode < 48 || event.charCode > 57) && event.charCode !== 0) {
            event.preventDefault();
        }
    }
}