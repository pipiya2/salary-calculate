// 첫번째 키 번호
const defaultKeyNum = 0;

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
    let test = "";
    let id = $('.selected')[0].id;

    for(let i = 0 ; i< $('.change-flag').length; i++){
        test += $('.change-flag')[i].value + "";
    }

    if(test == ""){
        disabledAddBtn();
        localStorage.removeItem(id);
    }else{
        activeAddBtn();
        save(id);
    }
})

function listConfirm(id){
    let listName = $('#'+id).val() == "" ? "새로운 항목" : $('#'+id).val();
    $("#"+id).replaceWith(`<div class = "list saved" id = ${id}>${listName}</div>`);
}

//#region 항목추가
function addList(){
    $('.saved').removeClass('selected');
    let div = document.createElement('div');
    // input.setAttribute('type','text');
    div.setAttribute('class','list saved selected');
    let id = getNextId();
    div.setAttribute('id',id);
    $(div).html('새로운 항목');
    $("#list-area").append(div);
    // $(input).focus();
    // $(input).select();
    showRightSection(id);
}
//#endregion

//#region 내역 금액 적는란 활성화
function showRightSection(id){
    let obj = localStorage.getItem(id);

    if(obj){
        //있으면
        $('.right-wrapper').append(header);
    }else{
        //id가 없으면 새로 추가하는 것으로 판단
        $('.right-wrapper').append(dafaultFrame);
    }
}
//#endregion

$(document).on('click','.saved',e=>{
    if($(e.target).hasClass('selected')){
        return;
    }
    $('.saved').removeClass('selected');
    $(e.target).addClass('selected');
})

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