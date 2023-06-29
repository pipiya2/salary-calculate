// 고정 선언
String.prototype.isEmpty = function() {
    return this.replace(/ /gi, "").length == 0 || this.replace(/ /gi, "") == null;
}

autosize($("textArea"));

$("#salary").focus();

let salary = "";
let totalCost = 0;
let itemId = 0;
let orgSalary;


//#region 저장된거 불러오기
const keys = Object.keys(window.localStorage);

keys.forEach(e=>{
    let ul = document.getElementsByClassName('saved-list-wrap')[0];
    let li = document.createElement('li');
    li.setAttribute("class",e);
    let delSpan = document.createElement('span');
    delSpan.setAttribute('class','cancelBtn');
    delSpan.innerHTML = "X";
    delSpan.setAttribute("data-btnType","savedList");
    delSpan.setAttribute("data-targetId",e);
    li.appendChild(delSpan);

    let span = document.createElement("span");
    span.setAttribute('class',"cursor saved-list");
    span.setAttribute('id',e);
    span.innerHTML = e;

    li.appendChild(span);
    ul.appendChild(li);
})

$(".saved-list").click(e=>{
    allReset();
    let savedListId = e.target.id;
    let savedListData = JSON.parse(localStorage.getItem(savedListId));

    salary = savedListData.salary;

    $("#salary").val(salary);
    console.log(salary);
    console.log($("#salary").val());
    var e = jQuery.Event( "keyup", { keyCode: 13 } );

    $("#salary").trigger(e);

    for(let i = 0 ; i<savedListData.itemList.length; i+=2){
        let cost = savedListData.itemList[i];
        let detail = savedListData.itemList[i+1];
        // cost = cost * 1;
        cost = cost.replaceAll(",","");
        cost = Number(cost);
        
        addList(cost,detail);
    }
})
//#endregion

//#region 항목에 입력할 때
$("#itemInput").on("keypress",event =>{
    // 원본
    const originItem = $("#itemInput").val();
    const keyName = event.key;

    if(salary.isEmpty()){
        resetSetting(event)
        return;
    }

    if(event.keyCode == 32 && originItem.isEmpty()){
        resetSetting(event)
        return;
    }

    if(keyName == "Enter"){
        // 아무것도 입력안하고 엔터 눌렀을 때 return
        if(originItem.isEmpty()){
            resetSetting(event)
            return;
        }
        
        // 공백으로 구분지어져 있나 확인
        const costSplitIndex = originItem.indexOf(" ");
        if(costSplitIndex == -1){
            event.preventDefault();
            return;
        }
        

        // 공백이 있으면 일단 금액부분은 작성된거임
        // 금액
        let cost = originItem.substr(0,costSplitIndex);
        cost = cost.replaceAll(",","");
        // is number?
        if(isNaN(cost)){
            event.preventDefault();
            return;
        }

        // 내역 부분 나누기
        let detailSplitIndex = costSplitIndex + 1;
        let detail = originItem.substring(detailSplitIndex);
        detailSplitIndex = -1;

        // 내역부분에 글자 있는지 없는지 체크
        for(var i = 0; i<detail.length; i++){
            var c = detail[i];
            if(c != " "){
                detailSplitIndex = i;
                break;
            }
        }

        // 공백뒤에 글자가 없을때 엔터 무시
        if(detailSplitIndex == -1){
            event.preventDefault();
            return;
        }

        // 글자있음.

        // real detail
        detail = detail.substring(detailSplitIndex);
        cost = Number(cost);

        addList(cost,detail,event);
    }
})
//#endregion

// #region 항목 삭제버튼 클릭 시
$(document).on('click', '.cancelBtn', event => {
    if(event.target.dataset.btntype == "savedList"){
        deleteSavedList(event.target.dataset.targetid);
        return;
    }
    let target = $(event.target).parents();
    
    // target = $(target).parents();
    const targetId = target[0].id;
    let price = Number($('.'+targetId)[0].innerHTML.replaceAll(",",""));
    $("#"+targetId).remove();
    totalCost -= price;
    $("#total").html(totalCost.toLocaleString('ko-KR'));
    $("#leftMoney").html((salary - totalCost).toLocaleString('ko-KR'));
});
//#endregion

//#region 저장된 리스트 삭제
function deleteSavedList(key){
    localStorage.removeItem(key);
    $('.'+key)[0].remove();
}
//#endregion

// #region 급여란 입력할 때  
$("#salary").on("keyup",(key) =>{
    if(key.keyCode == 13){
        moveToItemInput();
    }
})
//#endregion

//#region 급여란 입력하고 설정 눌렀을 때 밸리데이션
function moveToItemInput(){
    // 급여 란에 값이 있나?
    let isSalaryInputCheck = $("#salary").val() != ""  && $("#salary").val() > 0;

    if(!isSalaryInputCheck){
        return;
    }

    let btnType = $("#btn-confirm")[0].dataset.btntype;

    // 새 값을 할당 하는건가 아니면 기존값을 변경하는 건가?
    switch(btnType){
        case "set" : 
            salary = $("#salary").val();
            
            $("#leftMoney").html((salary - totalCost).toLocaleString('ko-KR'));
            // $("#salary").attr("readonly",true);
        
            $("#btn-confirm").attr('data-btnType','reset');
            $("#salary").attr("disabled",true);
            $("#itemInput").attr("disabled",false);
            $("#btn-confirm").html("재설정");
            $("#itemInput").focus();
        break;

        case "reset" :

            $("#btn-confirm").attr('data-btnType','set');
            $("#btn-confirm").html("설정");
            $("#salary").attr("disabled",false);
            $("#itemInput").attr("disabled",true);

            $("#salary").focus();
        break;
    }
}
//#endregion

//#region 저장버튼 클릭 시
$('.save-btn').click(()=>{

    let btnType = $("#btn-confirm")[0].dataset.btntype;
    let itemCount = $("#items").children().length;

    if(btnType == "set") {
        alert("급여를 확정지어주세요.");
        return;
    }

    if(itemCount == 0) {
        alert("항목을 입력해주세요.");
        return;
    }

    let savedName = prompt("저장본 이름");
    
    if(savedName == null){
        return;
    }

    if(savedName == ""){
        alert('저장본 이름은 공백일 수 없습니다.');
        return;
    }

    if(localStorage.getItem(savedName) != null){
        alert('저장본 이름이 중복됩니다.');
        return;
    }

    // 저장
    save(savedName);
})
//#endregion

// #region 저장
function save(savedName){
    let salary = $("#salary").val();
    let itemList = $("#items").children();

    let obj = {
        itemList : new Array(),
        salary : salary
    };

    for(let e of itemList){
        let targetId = $(e)[0].id;
        let cost = $("."+targetId)[0].innerHTML;
        let detail = $("."+targetId)[1].innerHTML;

        // 1. cost   2. detail
        obj.itemList.push(cost);
        obj.itemList.push(detail);
    }

    localStorage.setItem(savedName,JSON.stringify(obj));
    alert("저장완료");
    location.reload();
}
//#endregion

// #region 항목 추가
function addList(cost,detail,event){
    totalCost += cost;

    let itemWrap = document.createElement('div');
    itemWrap.setAttribute("class","itemWrap");
    itemWrap.setAttribute("id","item_"+itemId);

    // 삭제 버튼
    let cancelbtn = document.createElement('span');
    cancelbtn.setAttribute("class","cancelBtn");
    cancelbtn.innerHTML = "X";
    itemWrap.appendChild(cancelbtn);

    // 항목
    let item = document.createElement('div');
    item.innerHTML = `금액 : <span class = 'item_${itemId}'>${cost.toLocaleString('ko-KR')}</span>원  내역 : <span class = 'item_${itemId++}'>${detail}</span>`;
    itemWrap.appendChild(item);


    document.getElementById("items").appendChild(itemWrap);

    $("#total").html(totalCost.toLocaleString('ko-KR'));
    $("#leftMoney").html((salary - totalCost).toLocaleString('ko-KR'));
    
    if(event) resetSetting(event);
}
//#endregion

//#region 전부 초기화
function allReset(){
    itemId = 0;
    totalCost = 0;
    salary = "";
    $("#salary").val("");
    $("#total").html("");
    $("#leftMoney").html("");
    $(".itemWrap").remove();
    $("#btn-confirm").attr("data-btnType","reset");
    $("#btn-confirm").html("다시설정");
    $("#salary").attr("disabled","disabled");
    $("#itemInput").removeAttr('disabled');
}
//#endregion


function resetSetting(e){
    $("#itemInput").val("");
    e.preventDefault();
}
