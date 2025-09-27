// ====== ตัวสมการทั้งหมด ======
const equations = {
  "v = u + at": ["v", "u", "a", "t"],
  "s = ut + 1/2at^2": ["s", "u", "a", "t"],
  "F = m*a": ["F", "m", "a"],
  "E = mc^2": ["E", "m", "c"]
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
    div.innerHTML = `<label>${v}</label><input type="number" placeholder="?" />`;
    variableContainer.appendChild(div);
  });
}

// ====== คำนวณ ======
const calculateBtn = document.getElementById("calculate");
const resultDiv = document.getElementById("result");

calculateBtn.addEventListener("click", ()=>{
  const eq = selected.textContent;
  if(!equations[eq]) return alert("กรุณาเลือกสมการ");
  
  // เก็บค่า input
  let vals = {};
  const inputs = variableContainer.querySelectorAll("input");
  equations[eq].forEach((v,i)=>{
    const val = inputs[i].value.trim();
    vals[v] = val === "" ? null : parseFloat(val);
  });

  // ====== ตัวอย่าง logic คำนวณแบบง่าย (แก้สมการ 1 ตัวแปร) ======
  let unknown = Object.keys(vals).find(k=>vals[k]===null);
  if(!unknown){resultDiv.textContent = "กรอกช่องที่ต้องการหาด้วย"; return;}
  
  let answer;
  switch(eq){
    case "v = u + at":
      if(unknown==="v") answer = vals.u + vals.a*vals.t;
      if(unknown==="u") answer = vals.v - vals.a*vals.t;
      if(unknown==="a") answer = (vals.v - vals.u)/vals.t;
      if(unknown==="t") answer = (vals.v - vals.u)/vals.a;
      break;
    case "s = ut + 1/2at^2":
      if(unknown==="s") answer = vals.u*vals.t + 0.5*vals.a*vals.t**2;
      if(unknown==="u") answer = (vals.s - 0.5*vals.a*vals.t**2)/vals.t;
      if(unknown==="a") answer = 2*(vals.s - vals.u*vals.t)/(vals.t**2);
      if(unknown==="t"){
        // สมการกำลังสอง t^2 + ... = 0
        let A=0.5*vals.a;
        let B=vals.u;
        let C=-vals.s;
        let D=B*B-4*A*C;
        if(D<0){resultDiv.textContent="ไม่มีคำตอบจริง"; return;}
        answer = (-B + Math.sqrt(D))/(2*A);
      }
      break;
    case "F = m*a":
      if(unknown==="F") answer = vals.m*vals.a;
      if(unknown==="m") answer = vals.F/vals.a;
      if(unknown==="a") answer = vals.F/vals.m;
      break;
    case "E = mc^2":
      const c = 3e8;
      if(unknown==="E") answer = vals.m*c*c;
      if(unknown==="m") answer = vals.E/(c*c);
      break;
    default: resultDiv.textContent="สมการยังไม่รองรับ"; return;
  }

  resultDiv.textContent = `${unknown} = ${answer}`;
});

