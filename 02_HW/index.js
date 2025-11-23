document.addEventListener("DOMContentLoaded", ()=>{
    pageLoaded();
});

let txt1;
let txt2;
let btn;
let lblRes;

function pageLoaded()
{
    txt1 = document.getElementById("txt1");
    txt2 = document.getElementById("txt2");
    btn = document.getElementById("btnCalc");
    lblRes = document.getElementById("lblRes");

    btn.addEventListener('click', ()=>{
        calculate();
    });
}

function markValidity(inputElement) {
    let value = inputElement.value.trim();
    let num = parseFloat(value);

    if (value !== "" && !isNaN(num)) {
        inputElement.classList.add("is-valid");
        inputElement.classList.remove("is-invalid");
        return true;
    } else {
        inputElement.classList.add("is-invalid");
        inputElement.classList.remove("is-valid");
        return false;
    }
}


function calculate() {
    let ok1 = markValidity(txt1);
    let ok2 = markValidity(txt2);

    if (!ok1 || !ok2) {
        lblRes.innerText = "";
        print("Error: Invalid input", true);
        return;
    }

    let num1 = parseFloat(txt1.value);
    let num2 = parseFloat(txt2.value);
    let op = document.getElementById("op").value;

    let res;

    switch(op){
        case "+": res = num1 + num2; break;
        case "-": res = num1 - num2; break;
        case "*": res = num1 * num2; break;
        case "/":
            if (num2 === 0) {
                lblRes.innerText = "Error";
                print("Error: Division by zero", true);
                return;
            }
            res = num1 / num2;
            break;
    }

    lblRes.innerText = res;
    print(`${num1} ${op} ${num2} = ${res}`, true);
}

function print(msg, append=false) {

    //--Get the Text Element Reference
    const ta = document.getElementById("output");

    //--Write msg to textArea text
    if (!ta) {
        console.log(msg);
        return;
    }

    if (append)
        ta.value += msg + "\n";
    
    else
        ta.value = msg + "\n";

    ta.scrollTop = ta.scrollHeight;
}
