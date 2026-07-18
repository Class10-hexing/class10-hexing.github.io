// 班级登录核心配置：管理员账号 + 60名学生【姓名+独立密码】
let SITE_CONFIG = {
  "admin": {
    "account": "付煜晨",
    "password": "fu120422"
  },
  "studentList": [
    {"name": "陈俊汐", "pwd": "20241001"},
    {"name": "董浩然", "pwd": "20241002"},
    {"name": "电鳗", "pwd": "20241003"},
    {"name": "高吉豪", "pwd": "20241004"},
    {"name": "高禹森", "pwd": "20241005"},
    {"name": "郭济鸣", "pwd": "20241006"},
    {"name": "韩祖勋", "pwd": "20241007"},
    {"name": "李星熠", "pwd": "20241008"},
    {"name": "李禹昭", "pwd": "20241009"},
    {"name": "李兆宸", "pwd": "20241010"},
    {"name": "刘勃辰", "pwd": "20241011"},
    {"name": "刘航岐", "pwd": "20241012"},
    {"name": "刘贤泽", "pwd": "20241013"},
    {"name": "刘子洛", "pwd": "20241014"},
    {"name": "栾昌浩", "pwd": "20241015"},
    {"name": "孟祥润", "pwd": "20241016"},
    {"name": "盛胤翔", "pwd": "20241017"},
    {"name": "施弼腾", "pwd": "20241018"},
    {"name": "石尚", "pwd": "20241019"},
    {"name": "田家宇", "pwd": "20241020"},
    {"name": "王铎珺", "pwd": "20241021"},
    {"name": "王相舒", "pwd": "20241022"},
    {"name": "王一蓬", "pwd": "20241023"},
    {"name": "王振澳", "pwd": "20241024"},
    {"name": "温元赫", "pwd": "20241025"},
    {"name": "武鑫泓", "pwd": "20241026"},
    {"name": "许在希", "pwd": "20241027"},
    {"name": "于浩博", "pwd": "20241028"},
    {"name": "张恒睿", "pwd": "20241029"},
    {"name": "张钧瀚", "pwd": "20241030"},
    {"name": "赵浩宇", "pwd": "20241031"},
    {"name": "赵文硕", "pwd": "20241032"},
    {"name": "陈烁", "pwd": "20241033"},
    {"name": "陈一凡", "pwd": "20241034"},
    {"name": "程译册", "pwd": "20241035"},
    {"name": "关美嘉", "pwd": "20241036"},
    {"name": "郭轩伊", "pwd": "20241037"},
    {"name": "何雨芯", "pwd": "20241038"},
    {"name": "李若曦", "pwd": "20241039"},
    {"name": "林笑如", "pwd": "20241040"},
    {"name": "刘禹杉", "pwd": "20241041"},
    {"name": "刘卓欣", "pwd": "20241042"},
    {"name": "任俊熹", "pwd": "20241043"},
    {"name": "任思媛", "pwd": "20241044"},
    {"name": "苏琬淇", "pwd": "20241045"},
    {"name": "孙佳妮", "pwd": "20241046"},
    {"name": "孙钰涵", "pwd": "20241047"},
    {"name": "王蕾涵", "pwd": "20241048"},
    {"name": "王美淇", "pwd": "20241049"},
    {"name": "王睿", "pwd": "20241050"},
    {"name": "王雯熙", "pwd": "20241051"},
    {"name": "吴佳轩", "pwd": "20241052"},
    {"name": "武禹西", "pwd": "20241053"},
    {"name": "杨善淇", "pwd": "20241054"},
    {"name": "尹睿宁", "pwd": "20241055"},
    {"name": "张嘉格", "pwd": "20241056"},
    {"name": "张思齐", "pwd": "20241057"},
    {"name": "赵悦", "pwd": "20241058"},
    {"name": "赵梓羽", "pwd": "20241059"},
    {"name": "陈烁辕", "pwd": "20241060"}
  ]
};

// 读取浏览器本地缓存配置
const localSave = localStorage.getItem("classGlobalConfig");
if(localSave){
  try{
    const parseCfg = JSON.parse(localSave);
    SITE_CONFIG = parseCfg;
  }catch(e){}
}

// 登录页面逻辑
if(document.getElementById("loginBtn")){
  const loginBtn = document.getElementById("loginBtn");
  loginBtn.onclick = function(){
    const inputName = document.getElementById("username").value.trim();
    const inputPwd = document.getElementById("pwd").value.trim();

    // 管理员登录
    if(inputName === SITE_CONFIG.admin.account && inputPwd === SITE_CONFIG.admin.password){
      localStorage.setItem("loginInfo", JSON.stringify({
        role: "admin",
        userName: "超级管理员",
        loginTime: Date.now()
      }));
      alert("管理员登录成功，跳转首页");
      location.href = "./index.html";
      return;
    }

    // 遍历匹配学生姓名+对应个人密码
    const targetUser = SITE_CONFIG.studentList.find(item => item.name === inputName);
    if(targetUser && targetUser.pwd === inputPwd){
      localStorage.setItem("loginInfo", JSON.stringify({
        role: "student",
        userName: inputName,
        loginTime: Date.now()
      }));
      alert(`${inputName} 登录成功`);
      location.href = "./index.html";
      return;
    }

    alert("姓名不存在或密码错误，请核对");
  }
}

// 全局挂载登录工具
window.ClassLogin = {
  // 获取当前登录信息
  getLogin(){
    const data = localStorage.getItem("loginInfo");
    return data ? JSON.parse(data) : null;
  },
  // 退出登录
  logout(){
    localStorage.removeItem("loginInfo");
    location.href = "./login.html";
  },
  // 打开图形化后台配置面板【核心：表格改姓名+密码】
  openConfigPanel(){
    const loginState = this.getLogin();
    if(!loginState || loginState.role !== "admin"){
      alert("仅限管理员进入后台编辑");
      return;
    }

    // 生成表格HTML
    let tableHtml = `
    <div id="configMask" style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;padding:20px;">
      <div style="background:#fff;width:920px;max-height:90vh;overflow-y:auto;border-radius:10px;padding:24px;">
        <h3 style="margin:0 0 16px;">班级账号密码后台管理（共60人）</h3>
        <div style="margin-bottom:14px;">
          <label>管理员账号：</label>
          <input id="admAcc" value="${SITE_CONFIG.admin.account}" style="padding:6px 8px;width:180px;margin-right:10px;">
          <label>管理员密码：</label>
          <input id="admPwd" value="${SITE_CONFIG.admin.password}" style="padding:6px 8px;width:180px;">
        </div>
        <table border="1" cellpadding="6" cellspacing="0" width="100%" style="border-collapse:collapse;margin:15px 0;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th>序号</th>
              <th>姓名（直接修改框内文字）</th>
              <th>个人登录密码</th>
            </tr>
          </thead>
          <tbody id="stuTableBody">
    `;

    // 循环渲染60行可编辑输入框
    SITE_CONFIG.studentList.forEach((item,idx)=>{
      tableHtml += `
        <tr>
          <td align="center">${idx+1}</td>
          <td><input class="editName" value="${item.name}" style="width:100%;border:none;outline:none;padding:4px 6px;"></td>
          <td><input class="editPwd" value="${item.pwd}" style="width:100%;border:none;outline:none;padding:4px 6px;"></td>
        </tr>
      `;
    })

    tableHtml += `
          </tbody>
        </table>
        <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;">
          <button id="saveLocal" style="padding:8px 14px;background:#2563eb;color:#fff;border:0;border-radius:4px;">仅保存本机浏览器（临时生效）</button>
          <button id="genCode" style="padding:8px 14px;background:#16a34a;color:#fff;border:0;border-radius:4px;">生成源码配置（复制替换js永久全网生效）</button>
          <button id="closePanel" style="padding:8px 14px;background:#6b7280;color:#fff;border:0;border-radius:4px;">关闭面板</button>
        </div>
        <p style="font-size:13px;color:#666;margin-top:12px;">提示：必须严格保留60行数据，不要删除行列，直接在输入框修改姓名和密码即可</p>
      </div>
    </div>
    `;

    document.body.insertAdjacentHTML("beforeend", tableHtml);

    // 关闭弹窗
    document.getElementById("closePanel").onclick = ()=>{
      document.getElementById("configMask").remove();
    }

    // 读取表格所有修改后数据
    function getNewList(){
      const nameInputs = document.querySelectorAll(".editName");
      const pwdInputs = document.querySelectorAll(".editPwd");
      const newArr = [];
      for(let i=0;i<60;i++){
        newArr.push({
          name: nameInputs[i].value.trim(),
          pwd: pwdInputs[i].value.trim()
        })
      }
      return newArr;
    }

    // 保存到本地浏览器
    document.getElementById("saveLocal").onclick = ()=>{
      const newAdmin = {
        account: document.getElementById("admAcc").value.trim(),
        password: document.getElementById("admPwd").value.trim()
      }
      const newStudentList = getNewList();
      SITE_CONFIG.admin = newAdmin;
      SITE_CONFIG.studentList = newStudentList;
      localStorage.setItem("classGlobalConfig", JSON.stringify(SITE_CONFIG));
      alert("已保存至当前浏览器，换设备会重置");
      document.getElementById("configMask").remove();
    }

    // 生成可直接替换的完整配置代码
    document.getElementById("genCode").onclick = ()=>{
      const newAdmin = {
        account: document.getElementById("admAcc").value.trim(),
        password: document.getElementById("admPwd").value.trim()
      }
      const newStudentList = getNewList();
      const finalCode = `let SITE_CONFIG = ${JSON.stringify({admin:newAdmin,studentList:newStudentList},null,2)};`;
      navigator.clipboard.writeText(finalCode);
      alert("配置代码已复制！打开login.js，删除最开头旧的SITE_CONFIG整段，粘贴粘贴内容，push到GitHub即可全站生效");
      document.getElementById("configMask").remove();
    }
  }
}
