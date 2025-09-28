// ====== ตัวสมการ/สูตรเคมี ======
const equations = {
  "PV = nRT": ["P","V","n","R","T"],
  "C1V1 = C2V2": ["C1","V1","C2","V2"],
  "m = n*M": ["m","n","M"]
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
    case "PV = nRT":
      if(unknown==="P") answer = (vals.n*vals.R*vals.T)/vals.V;
      if(unknown==="V") answer = (vals.n*vals.R*vals.T)/vals.P;
      if(unknown==="n") answer = (vals.P*vals.V)/(vals.R*vals.T);
      if(unknown==="R") answer = (vals.P*vals.V)/(vals.n*vals.T);
      if(unknown==="T") answer = (vals.P*vals.V)/(vals.n*vals.R);
      break;
    case "C1V1 = C2V2":
      if(unknown==="C1") answer = (vals.C2*vals.V2)/vals.V1;
      if(unknown==="V1") answer = (vals.C2*vals.V2)/vals.C1;
      if(unknown==="C2") answer = (vals.C1*vals.V1)/vals.V2;
      if(unknown==="V2") answer = (vals.C1*vals.V1)/vals.C2;
      break;
    case "m = n*M":
      if(unknown==="m") answer = vals.n*vals.M;
      if(unknown==="n") answer = vals.m/vals.M;
      if(unknown==="M") answer = vals.m/vals.n;
      break;
    default: resultDiv.textContent="สมการยังไม่รองรับ"; return;
  }

  resultDiv.textContent = `${unknown} = ${answer}`;
});

// hamburger toggle
const hamburger = document.getElementById("hamburger");
const slideMenu = document.getElementById("slideMenu");
const menuOverlay = document.getElementById("menuOverlay");

function toggleMenu() {
  slideMenu.classList.toggle("active");
  menuOverlay.classList.toggle("active");
}

hamburger.addEventListener("click", toggleMenu);
menuOverlay.addEventListener("click", toggleMenu);