// alert("Hello baby");
// console.log("this is script");


// $("#title").text("Hello Boy");

$('.checkbox').click((e)=>{
    const curr = e.currentTarget.classList[1].split("_")[1];
    console.log("curr: " + curr);
    if($('.check_' + curr).is(':checked')){
        $(".item_" + curr).addClass("cross");
        //   console.log("yes checked");
    }else{
        $(".item_" + curr).removeClass("cross");
        // console.log("not checked");
    }
})

$(document).on('click','.img',function(){
    
    const txt_id = $(this).data("ind");
    const list_id = $(this).data("txt");
    // console.log((list_id))
    // console.log(txt_id);
    $("#li_" + txt_id).remove();
    // console.log
    $.post('/update', { data:  [list_id, txt_id] });
});
