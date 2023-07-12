// 첫번째 키 번호
const defaultKeyNum = 0;

// 항목 생성중인지 확인하는 플래그 변수
let isWritingNewList = false;

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

let savedListFrame = `<div class = "list saved"></div>`;

//#region 생성버튼 클릭 시
$(".add-btn").click((e)=>{
    let tagName = e.target.tagName;
    let target = tagName == "path" ? $(e.target).parent() : e.target;

    // 클릭했을때 disabled 클래스가 없으면 addList 실행
    if(!$(target).hasClass('disabled')){
        disabledAddBtn(); // 추가버튼을 바로 비활성화 시켜줌.
        addList();
        activeSaveBtn(); // 저장버튼을 활성화 시켜줌.
    }
})
//#endregion

$(document).on('blur','.writing',(e)=>{
    // let id = $(e.target)[0].id;
    // listConfirm(id);
    // save(id);
})

$(document).on('click','.save-btn',(e)=>{
    // 저장버튼이 비활성화가 아니면
    if(!$('.save-btn').hasClass('disabled')){
        save();
    }
    // let id = $(e.target)[0].id;
    // listConfirm(id);
    // save(id);
})

// $(document).on('keyup','.writing',(e)=>{
//     if(e.keyCode == '13'){
//         let id = $(e.target)[0].id;
//         listConfirmAndSave(id);
//     }
// })

$(document).on('keyup','.change-flag',(e)=>{
    saveOrDel();
    //입력시 다음줄 추가
    addNextRow(e);
})

// function inputNumberFormat(obj) {
//     obj.value = comma(uncomma(obj.value));
// }

// function uncomma(str) {
//     str = String(str);
//     return str.replace(/[^\d]+/g, '');
// }

// function comma(str) {
//     str = String(str);
//     return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
// }

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
    }else{
        activeAddBtn();
        save(id);
    }
}


//#region 입력시 다음줄 추가
function addNextRow(e){
    if(e.target.value != ""){
        let curRow = $(e.target).parent().parent()[0];

        if(curRow.nextElementSibling == null){
            $('.right-write-content').append(getListFrame('',''));
        }
    }
}
//#endregion


function listConfirm(id){
    let listName = $('#'+id).val() == "" ? "새로운 항목" : $('#'+id).val();
    $("#"+id).replaceWith(`<div class = "list saved" id = ${id}>${listName}</div>`);
}

//#region 항목추가
function addList(){
    $('.saved').removeClass('selected');

    let div = document.createElement('div');
    // input.setAttribute('type','text');
    div.setAttribute('class','list saved');
    let id = getNextId(); // 새로운 아이디 채번
    div.setAttribute('id',id);
    $(div).html('새로운 항목');
    $("#list-area").append(div);
    // $(input).focus();
    // $(input).select();
    showRightSection(id);
    $('#'+id).click();
}
//#endregion

//#region 내역 금액 적는란 활성화
function showRightSection(id){
    let obj = JSON.parse(localStorage.getItem(id));

    if(obj){
        //있으면 저장된 거 불러오기
        loadList(obj);
    }else{
        //없으면 새로 추가하는 것으로 판단
        hideRightSection();
        createNewFrame();
    }
}
//#endregion

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
    let arrList = document.getElementsByClassName('saved');
    if(arrList.length != 0){
        $(arrList[0]).click();
    }
})
//#endregion

//#region 저장된 항목 전부 load
function loadAllList(){
    let keys = Object.keys(localStorage);
    keys.forEach(e=>{
        let obj = JSON.parse(localStorage.getItem(e));
        $('#list-area').append(`<div class = "list saved" id = ${e}>${obj.name}</div>`);
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

let prevId = -1;

//#region 항목 클릭시
$(document).on('click','.saved',e=>{
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

//#region 저장버튼 활성화, 비활성화
function activeSaveBtn(){
    $('.save-btn').removeClass('disabled');
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