$(function(){
passCheck()
});

function passCheck(){
    if($('#confirm_pass').val() != $('#pass').val()){
        $('#passBtn').attr('disabled', true);
        $('#passMatch').removeAttr('style');
        $('#passErr').attr('style', 'display:none')
    }
    else{
        $('#passBtn').removeAttr('disabled');
        $('#passMatch').attr('style', 'display:none')
        $('#passErr').removeAttr('style');
    }
}