function mobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if(mobile()){
    location.href = "../html/m_calculate_new.html";
}


//#region 높이 조정 
let topMarginHeight = 50;
let bottopMarginHeight = 50;
let mainWrapHeight = $(document).height() - topMarginHeight - bottopMarginHeight;
$('.wrapper').css('height',mainWrapHeight);
//#endregion

// 전역변수
let lastFocus = "";


// 첫번째 키 번호
const defaultKeyNum = 0;

// 항목 생성중인지 확인하는 플래그 변수
let isWritingNewList = false;

let total = 0; // 금액
let showTotal = "";

let prevId = -1; // 항목 클릭하기 직전 아이디
let prevName = "";

//#region 우측 생성할 때
let dafaultFrame = 
`<div class = "right-write-content">
    <div class = "right-write-header">
        <div>
            MEMO
        </div>
        <div>
            NUMBER
        </div>
    </div>
    <div class = "write-list-area">
        <div class = "border-right">
            <input type = "text" class = "change-flag list-memo">
        </div>
        <div>
            <input type = "text" class = "change-flag list-number" style = "text-align:right;">
        </div>
    </div>
</div>`;
//#endregion

//#region  우측 불러올 때
let header = 
`<div class = "right-write-content">
    <div class = "right-write-header">
        <div>
            MEMO
        </div>
        <div>
            NUMBER
        </div>
    </div>
</div>`

function getListFrame(memo,number){
    return `
    <div class = "write-list-area">
        <div class = "border-right">
            <input type = "text" class = "change-flag list-memo" value = "${memo}">
        </div>
        <div>
            <input type = "text" class = "change-flag list-number" value = "${number}" style = "text-align:right;">
        </div>
    </div>`
}

let list = `
<div class = "write-list-area">
    <div class = "border-right">
        <input type = "text">
    </div>
    <div>
        <input type = "text" style = "text-align:right;">
    </div>
</div>`
//#endregion


function addComma(val){
    val = val.toString();
    let returnData;
    val = Number(val.replaceAll(',', ''));
    if(isNaN(val)) {         //NaN인지 판별
        returnData = 0;
    }else {                   //NaN이 아닌 경우
        const formatValue = val.toLocaleString('ko-KR');
        returnData = formatValue;
    }

    return returnData;
}

// $(document).on('blur','.list-number',e=>{
//     console.log("블러 넘버");
//     let lists = $('.list-number');
//     for(let i = 0; i<lists.length - 1; i++){
//         let val = $(lists[i]).val();

//         val = Number(val.replaceAll(',', ''));

//         total += val;
//     }
//     showTotal = total.toLocaleString('ko-KR');
// })

$(document).on('keyup',e=>{
    let focusingTagName = document.activeElement.tagName;
    let keyName = e.key;

    // 수정
    if(keyName == "F2" && focusingTagName == "BODY"){
        edit();
    }

    if(lastFocus != "text" && (keyName == "ArrowUp" || keyName == "ArrowDown")){
        if($(".selected")){
            let id = $(".selected")[0].id;
            let keys = Object.keys(localStorage);
            keys = keys.sort((a,b)=>a-b);

            let index = keys.indexOf(id);

            if(index < 0 || index > keys.length -1){
                return;
            }

            switch(keyName){
                case "ArrowUp" : listClick(keys[index+1]);break;
                case "ArrowDown" : listClick(keys[index-1]);break;
            }
        }
    }
})

$(document).on('keyup','.change-flag',(e)=>{
    // 현재 입력하고 있는 란이 금액 적는 란이면
    if($(e.target).hasClass('list-number') /*&& e.target.value != ""*/){

        if(e.target.value != ""){
            e.target.value = addComma(e.target.value);
        }

        let total = 0;
        for(let i = 0; i<$('.list-number').length; i++){
            let num = Number(unComma($('.list-number')[i].value));
            total += num;
        }
        // console.log(total);
        $('#total').html(addComma(total));
    }
    
    // 키 입력할 때마다 저장 혹은 삭제
    saveOrDel();
    //입력시 다음줄 추가
    addNextRow(e);
})

function unComma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}

//#region 저장,삭제
function saveOrDel(){
    let writtenStr = "";
    let id = $('.selected')[0].id;

    for(let i = 0 ; i< $('.change-flag').length; i++){
        writtenStr += $('.change-flag')[i].value + "";
    }

    if(writtenStr == ""){
        disabledAddBtn();
        localStorage.removeItem(id);
        return;
    }
    
    activeAddBtn();
    save(id);
}


//#region 입력시 다음줄 추가
function addNextRow(e){
    if(e.target.value != ""){
        let curRow = $(e.target).parent().parent()[0];

        if($(curRow.nextElementSibling).hasClass("total")){

            let targetElement = $(e.target).parent().parent();
            $(targetElement).after(getListFrame('',''));
        }
    }
}
//#endregion


function listConfirm(id){
    let listName = $('#'+id).val() == "" ? "새로운 항목" : $('#'+id).val();
    $("#"+id).replaceWith(`<div class = "list saved" id = ${id}>${listName}</div>`);
}

//#region 항목추가
function addList(copyObj){
    if(!copyObj){
        $('.saved').removeClass('selected'); // 클릭되어있는 항목을 블러처리함.
    }

    let div = document.createElement('div');
    // input.setAttribute('type','text');
    div.setAttribute('class','list saved');
    let id = getNextId();
    
    if(copyObj != undefined){
        id = copyObj.id;
    }

    div.setAttribute('id',id);

    let listName = copyObj != undefined  ? copyObj.newName : "새로운항목";

    $(div).html(listName);
    $("#list-area").append(div);
    
    if(!(copyObj != undefined)){
        listClick(id);
    }
}
//#endregion

function listClick(id){
    $('#'+id).click();
}

//#region 내역 금액 적는란 활성화
function showRightSection(id){
    let obj = JSON.parse(localStorage.getItem(id));
    let isNew = false;
    if(obj){
        //있으면 저장된 거 불러오기
        loadList(obj);
    }else{
        //없으면 새로 추가하는 것으로 판단
        hideRightSection();
        createNewFrame();
        isNew = true;
    }

    // 저장된 거 불러오든 새로 추가하든간에 맨 아래에 총합 행은 추가 해줘야함.
    addLastRow(obj,isNew);
}
//#endregion

function addLastRow(obj,isNew){
    let total = 0;
    if(!isNew){
        for(let i = 0 ; i < obj.data.length; i+=2){
            total += Number(unComma(obj.data[i+1]));
        }
    }

    let a = `
    <div class = "write-list-area total">
        <div class = "total">
            TOTAL :&nbsp;<span id = "total">${addComma(total)}<span>
        </div>
    </div>`;
    $('.right-write-content').append(a);
}

//#region 클릭 시 저장 된 항목 불러오기.
function loadList(obj){
    hideRightSection();
    
    $('.right-write-wrap').append(header);

    for(let i = 0; i<obj.data.length; i+=2){
        let memo = obj.data[i];
        let number = obj.data[i+1];
        if(memo == "" && number == ""){
            continue;
        }
        let listFrame = getListFrame(obj.data[i],obj.data[i+1]);
        $('.right-write-content').append(listFrame);
    }

    $('.right-write-content').append(getListFrame('','')); // 불러올 때 마지막에 입력행 추가시켜 놓기
}
//#endregion

function hideRightSection(){
    $('.right-write-content').remove();
}

//#region 화면 로드시
$(document).ready(()=>{
    loadAllList();

    // 맨위에 있는 항목 클릭
    clickTop();
})
//#endregion

function clickTop(){
    // 맨위에 있는 항목 클릭
    let arrList = document.getElementsByClassName('saved');
    if(arrList.length != 0){
        $(arrList[0]).click();
    }
}

//#region 저장된 항목 전부 load
function loadAllList(){
    let keys = Object.keys(localStorage);
    keys = keys.sort((a,b)=> b - a);
    keys.forEach(e=>{
        if(!(e.length > 3)){
            let obj = JSON.parse(localStorage.getItem(e));
            $('#list-area').append(`<div class = "list saved" id = ${e}>${obj.name}</div>`);
        }
    })
}
//#endregion

//#region 새로운 항목 생성될 때
function createNewFrame(){
    $('.right-write-wrap').append(header);
    $('.right-write-content').append(getListFrame('',''));
}
//#endregion

function deleteList(id){
    $('#'+id).remove();
}

$(document).on('click','body',e=>{
    lastFocus = e.target.type;
})

//#region 항목 클릭시
$(document).on('click','.saved',e=>{
    if($(e.target).hasClass('edit') || $(e.target).hasClass('editing')){
        return;
    }

    let curId = e.target.id;

    // 이전에 클릭되어 있는 항목 있는지 체크
    if(prevId != -1 && prevId != curId){
        if(localStorage.getItem(prevId) == undefined || localStorage.getItem(prevId) == null){
            deleteList(prevId);
            activeAddBtn();
        }
    }

    if($(e.target).hasClass('selected')){
        return;
    }

    focusNewList(e);
    showRightSection(e.target.id);
    prevId = curId;
})
//#endregion

//#region 새로운 항목 포커스
function focusNewList(e){
    $('.saved').removeClass('selected');
    $(e.target).addClass('selected');
}
//#endregion

//#region 다음 ID 채번
function getNextId(){
    let keyList = Object.keys(localStorage);
    let key = defaultKeyNum;

    return keyList.length == 0 ?  key : Number(keyList.sort((a,b) => b-a)[0]) + 1;
}
//#endregion

function save(id){
    let listName = $('#'+id)[0].innerHTML;
    // listConfirm(id);

    let listLength = $('.list-memo').length;

    let obj = {
        name : listName,
        data : []
    };


    for(let i = 0; i<listLength; i++){
        obj.data.push($('.list-memo')[i].value);
        obj.data.push($('.list-number')[i].value);
    }
    
    localStorage.setItem(id,JSON.stringify(obj));
}

function disabledSaveBtn(){
    $('.save-btn').addClass('disabled');
}
//#endregion

//#region 항목추가버튼 비활성화 , 활성화
function disabledAddBtn(){
    $('.add-btn').addClass('disabled');
}

function activeAddBtn(){
    $('.add-btn').removeClass('disabled');
}
//#endregion

$(document).on('blur','.edit',e =>{
    let name = $('.edit').val();
    let id = $('.edit')[0].dataset.tempid;

    if(name == ""){
        $('.edit').remove();
        $("#"+id).html(prevName);
        activeAddBtn();
        $('#'+id).removeClass('editing');
        prevName = "";
        return;
    }

    let obj = JSON.parse(localStorage.getItem(id));
    obj.name = name;
    
    localStorage.removeItem(id);
    localStorage.setItem(id,JSON.stringify(obj));
    $('.edit').remove();
    $("#"+id).html(name);
    activeAddBtn();
    $('#'+id).removeClass('editing');

    $("#"+id).addClass('selected');
})


//#region 추가 , 삭제 , 변경버튼 클릭
$(".button").click(e=>{
    let tagName = e.target.tagName;
    // let target = tagName == "path" ? $(e.target).parent() : e.target;
    let target = tagName == "path" ? e.target.parentNode : e.target;
    let buttonType = target.dataset.btntype;

    switch(buttonType){
        case "add" :  add(e); break;
        case "trash" : trash(e); break;
        case "edit" : edit(e); break;
        case "copy" : copy(); break;
    }
})

// 기존항목 복사
function copy(){
    let newId = getNextId();

    let targetId = $('.selected')[0]?.id;

    let targetInfo = JSON.parse(localStorage.getItem(targetId)); // 로컬 스트리지에는 데이터가 문자열로 되어있음.그래서 json으로 파싱

    targetInfo.name = targetInfo.name + " 복사본";

    let copyObj = {
        id : newId,
        newName : targetInfo.name
    }
    
    addList(copyObj);
    
    localStorage.setItem(newId,JSON.stringify(targetInfo)); // 로컬스트리지에 저장 할 땐 문자열로 저장해야함.

    listClick(newId);
}

function edit(e){
    let id = $('.selected')[0]?.id;
    
    if(id == undefined || $('.selected').length > 1) return;
    
    if(localStorage.getItem(id) == null) return;

    prevName = $('.selected')[0].innerHTML;
    
    $('.saved').removeClass('selected');
    let curRow = $("#"+id)[0];
    curRow.innerHTML = "";

    let input = document.createElement('input');
    input.setAttribute('class','edit');
    input.setAttribute('data-tempId',id);
    $(curRow).addClass('editing');
    $(curRow).append(input);
    $(input).val(prevName);
    $(input).select();

    disabledAddBtn();
}

function add(e){
    let tagName = e.target.tagName;
    let target = tagName == "path" ? $(e.target).parent() : e.target;

    // 클릭했을때 disabled 클래스가 없으면 addList 실행
    if(!$(target).hasClass('disabled')){
        disabledAddBtn(); // 추가버튼을 바로 비활성화 시켜줌.
        addList();
    }
}

function trash(e){
    let id = $('.selected')[0]?.id;

    if(!id){
        return;
    }
    let curRow = $("#"+id)[0];

    if($('.saved').length == 1){
        $('.right-write-content').remove();
    }else{
        let focusingTarget = curRow.nextElementSibling != null ? curRow.nextElementSibling : curRow.previousElementSibling;
        $(focusingTarget).click();
    }
    
    deleteList(id);
    localStorage.removeItem(id);
    activeAddBtn();
}
//#endregion