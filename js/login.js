// ===================== 基础配置区（图形面板可一键修改）=====================
const SITE_CONFIG = {
  // 管理员账号密码（可网页可视化修改）
  admin: {
    account: "付煜晨",
    password: "fu120422"
  },
  // 60人中文姓名列表，一共60位，可在可视化面板增删改
  studentList: [
    "姓名1","姓名2","姓名3","姓名4","姓名5","姓名6","姓名7","姓名8","姓名9","姓名10",
    "姓名11","姓名12","姓名13","姓名14","姓名15","姓名16","姓名17","姓名18","姓名19","姓名20",
    "姓名21","姓名22","姓名23","姓名24","姓名25","姓名26","姓名27","姓名28","姓名29","姓名30",
    "姓名31","姓名32","姓名33","姓名34","姓名35","姓名36","姓名37","姓名38","姓名39","姓名40",
    "姓名41","姓名42","姓名43","姓名44","姓名45","姓名46","姓名47","姓名48","姓名49","姓名50",
    "姓名51","姓名52","姓名53","姓名54","姓名55","姓名56","姓名57","姓名58","姓名59","姓名60"
  ],
  // 学生统一默认密码
  studentDefaultPwd: "123456"
};

// 读取本地存储覆盖配置（刷新不丢失本地修改）
let localCfg = localStorage.getItem("classConfig");
if(localCfg){
  Object.assign(SITE_CONFIG, JSON.parse(localCfg));
}

// 登录页面逻辑
if(document.getElementById("loginBtn")){
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.onclick = function(){
    let un = document.getElementById("username").value.trim();
    let pw = document.getElementById("pwd").value.trim();

    // 管理员登录判断
    if(un === SITE_CONFIG.admin.account && pw === SITE_CONFIG.admin.password){
      localStorage.setItem("loginInfo", JSON.stringify({
        type: "admin",
        name: "超级管理员",
        time: Date.now()
      }));
      alert("管理员登录成功！即将跳转首页");
      location.href = "./index.html";
      return;
    }

    // 学生登录判断
    if(SITE_CONFIG.studentList.includes(un) && pw === SITE_CONFIG.studentDefaultPwd){
      localStorage.setItem("loginInfo", JSON.stringify({
        type: "student",
        name: un,
        time: Date.now()
      }));
      alert("登录成功！");
      location.href = "./index.html";
      return;
    }

    alert("账号密码错误，或姓名不在班级名单内");
  }
}

// 全局挂载登录校验 + 管理员配置面板（在index.html等页面引入本js即可使用）
window.ClassLogin = {
  // 获取当前登录状态
  getLogin(){
    let str = localStorage.getItem("loginInfo");
    return str ? JSON.parse(str) : null;
  },
  // 退出登录
  logout(){
    localStorage.removeItem("loginInfo");
    location.href = "./login.html";
  },
  // 打开图形化配置弹窗（仅管理员可见可用）
  openConfigPanel(){
    let login = this.getLogin();
    if(!login || login.type !== "admin"){
      alert("无管理员权限");
      return;
    }
    // 弹窗HTML
    let panelHtml = `
    <div id="cfgMask" style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;">
      <div style="background:#fff;width:750px;padding:25px;border-radius:10px;max-height:85vh;overflow-y:auto;">
        <h3>班级人员&管理员配置面板</h3>
        <div style="margin:15px 0;">
          <p>管理员账号</p>
          <input id="adAcc" value="${SITE_CONFIG.admin.account}" style="width:100%;padding:8px;margin:6px 0;">
          <p>管理员密码</p>
          <input id="adPwd" value="${SITE_CONFIG.admin.password}" style="width:100%;padding:8px;margin:6px 0;">
        </div>
        <div style="margin:15px 0;">
          <p>60名学生名单（每行一个姓名，总数必须60条）</p>
          <textarea id="stuText" rows="15" style="width:100%;padding:8px;">${SITE_CONFIG.studentList.join("\n")}</textarea>
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;">
          <button id="saveLocal" style="padding:8px 16px;background:#3182ce;color:#fff;border:none;border-radius:4px;">保存到本机（仅当前浏览器生效）</button>
          <button id="getCode" style="padding:8px 16px;background:#38a169;color:#fff;border:none;border-radius:4px;">生成可替换源码（复制粘贴进js永久生效）</button>
          <button id="closeCfg" style="padding:8px 16px;background:#a0aec0;color:#fff;border:none;border-radius:4px;">关闭</button>
        </div>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML("beforeend", panelHtml);

    // 关闭弹窗
    document.getElementById("closeCfg").onclick = ()=>{
      document.getElementById("cfgMask").remove();
    }

    // 保存本地
    document.getElementById("saveLocal").onclick = ()=>{
      let newAcc = document.getElementById("adAcc").value.trim();
      let newPwd = document.getElementById("adPwd").value.trim();
      let stuArr = document.getElementById("stuText").value.split("\n").map(s=>s.trim()).filter(s=>s);
      if(stuArr.length !== 60){
        alert(`当前人数${stuArr.length}，必须严格为60人！`);
        return;
      }
      SITE_CONFIG.admin.account = newAcc;
      SITE_CONFIG.admin.password = newPwd;
      SITE_CONFIG.studentList = stuArr;
      localStorage.setItem("classConfig", JSON.stringify(SITE_CONFIG));
      alert("已保存至本地浏览器");
      document.getElementById("cfgMask").remove();
    }

    // 生成源码片段
    document.getElementById("getCode").onclick = ()=>{
      let newAcc = document.getElementById("adAcc").value.trim();
      let newPwd = document.getElementById("adPwd").value.trim();
      let stuArr = document.getElementById("stuText").value.split("\n").map(s=>s.trim()).filter(s=>s);
      if(stuArr.length !== 60){
        alert(`当前人数${stuArr.length}，必须严格为60人！`);
        return;
      }
      let code = `
const SITE_CONFIG = {
  admin: {
    account: "${newAcc}",
    password: "${newPwd}"
  },
  studentList: ${JSON.stringify(stuArr)},
  studentDefaultPwd: "123456"
};
      `;
      navigator.clipboard.writeText(code);
      alert("配置代码已复制剪贴板！打开login.js，替换最上方SITE_CONFIG整段内容，提交GitHub即可全站生效");
    }
  }
}
