// $(document).ready(()=>{
//     $(document).on(si)
// })




let count = 0;
$(".add-btn-area").click(()=>{
    let input = document.createElement('input');
    input.setAttribute('type','text');
    input.setAttribute('class','list');
    $(input).val(`새로운 항목${count}`);
    $("#list-area").append(input);
    $(input).focus();
    $(input).select();

    // $(".list:last-child").focus(); -> 마지막요소 가져오는거
})