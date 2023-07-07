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
            <input type = "text">
        </div>
        <div>
            <input type = "text" style = "text-align:right;">
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

    // 클릭했을때 disabled 클래스가 없으면 addList 실행
    if(!$(e.target).hasClass('disabled')){
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

function listConfirm(id){
    let listName = $('#'+id).val() == "" ? "새로운 항목" : $('#'+id).val();
    $("#"+id).replaceWith(`<div class = "list saved">${listName}</div>`);
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

function disabledAddBtn(){
    $('.add-btn').removeClass('disabled');
}
//#endregion

//#region 항목추가
function addList(){
    let input = document.createElement('input');
    input.setAttribute('type','text');
    input.setAttribute('class','list writing');
    input.setAttribute('id',getNextId());
    $(input).val(`새로운 항목`);
    $("#list-area").append(input);
    $(input).focus();
    $(input).select();
    showRightSection();
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

//#region 다음 ID 채번
function getNextId(){
    let keyList = Object.keys(localStorage);

    let key = defaultKeyNum;
    
    return keyList == null ?  key : Number(keyList.sort((a,b) => b-a)[0]) + 1;
}
//#endregion

function save(){
    let id = $('.writing')[0].id;
    console.log(id);
    listConfirm(id);

    let listLength = $('.list-memo').length;
    let listName = $('#'+id)
    let obj = {};

    for(let i = 0; i<listLength; i++){
        
        console.log($('.list-memo')[i].val());
        console.log($('.list-number')[i].val());
    }
}