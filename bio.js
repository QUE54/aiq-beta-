// ====== ตัวสมการ/สูตรชีวะ ======
const equations = {
  "BMI = W / H^2": ["BMI","W","H"],
  "HRmax = 220 - Age": ["HRmax","Age"],
  "Q = SV * HR": ["Q","SV","HR"],
  "Photosynthesis Rate = (CO2 Uptake) / Time": ["Rate","CO2","Time"]
};

// ====== สร้าง dropdown ======
const equationSelect = document.querySelector(".equation-select");
const selected = equationSelect.querySelector(".selected");
const optionsContainer = equationSelect.querySelector(".options");

for(let eq in equations){
  const div = document.createElement("div");
  div.textContent = eq;
  div.addEventListener("click", ()=>{
    selected.textContent = eq;
    equationSelect.classList.remove("active");
    generateInputs(eq);
  });
  optionsContainer.appendChild(div);
}

selected.addEventListener("click", ()=>{
  equationSelect.classList.toggle("active");
});

// ====== สร้าง input ตัวแปร ======
const variableContainer = document.querySelector(".variables");

function generateInputs(eq){
  variableContainer.innerHTML = "";
  equations[eq].forEach(v=>{
    const div = document.createElement("div");
    div.innerHTML = `<label>${v} = </label><input type="number" step="any" placeholder="?" />`;
    variableContainer.appendChild(div);
  });
}

// ====== คำนวณ ======
const calculateBtn = document.getElementById("calculate");
const resultDiv = document.getElementById("result");

calculateBtn.addEventListener("click", ()=>{
  const eq = selected.textContent;
  if(!equations[eq]) return alert("กรุณาเลือกสมการ");

  let vals = {};
  const inputs = variableContainer.querySelectorAll("input");
  equations[eq].forEach((v,i)=>{
    const val = inputs[i].value.trim();
    vals[v] = val === "" ? null : parseFloat(val);
  });

  let unknown = Object.keys(vals).find(k=>vals[k]===null);
  if(!unknown){resultDiv.textContent = "กรอกช่องที่ต้องการหาด้วย"; return;}

  let answer;
  switch(eq){
    case "BMI = W / H^2":
      if(unknown==="BMI") answer = vals.W / (vals.H**2);
      if(unknown==="W") answer = vals.BMI * (vals.H**2);
      if(unknown==="H") answer = Math.sqrt(vals.W / vals.BMI);
      break;
    case "HRmax = 220 - Age":
      if(unknown==="HRmax") answer = 220 - vals.Age;
      if(unknown==="Age") answer = 220 - vals.HRmax;
      break;
    case "Q = SV * HR":
      if(unknown==="Q") answer = vals.SV * vals.HR;
      if(unknown==="SV") answer = vals.Q / vals.HR;
      if(unknown==="HR") answer = vals.Q / vals.SV;
      break;
    case "Photosynthesis Rate = (CO2 Uptake) / Time":
      if(unknown==="Rate") answer = vals.CO2 / vals.Time;
      if(unknown==="CO2") answer = vals.Rate * vals.Time;
      if(unknown==="Time") answer = vals.CO2 / vals.Rate;
      break;
    default: resultDiv.textContent="สมการยังไม่รองรับ"; return;
  }

  resultDiv.textContent = `${unknown} = ${answer}`;
});
