
var old_data
function get_update() {
    var uid = $("input")[0].value
    if (uid.length < 9) {
        alert("请检查输入的uid")
        return
    }
    var url = "https://enka.shinshin.moe/u/{uid}/__data.json"
    url = url.replace('{uid}',uid)
    console.log(url)
    var origin_json
    $.ajaxSettings.async = false;
    $.ajax({
        type: "get",
        url: "https://service-8scvzy8e-1302156348.gz.apigw.tencentcs.com/release/?url=" + url,
        dataType: "jsonp",
        success: function (response) {
            origin_json = response
            console.log(origin_json)
            setTimeout(function() {
                if(typeof(old_data) == 'undefined') {
                    old_data = {}
                    old_data['角色信息'] = {}
                }
                var playerinfo = new PlayInfo(uid, origin_json)
                new_data = playerinfo.export(old_data)
                old_data = new_data
                onload_data()
            }, 500)
            
        }
    });
}

function save_data() {
    var uid = $("input")[0].value
    var content = JSON.stringify(new_data);
    content = 'old_data_callback(' + content + ')'
    var a = document.createElement('a');
    a.download = uid + '.txt';
    var blob = new Blob([content]);
    a.href = URL.createObjectURL(blob);
    a.text = '下载'
    $("#downloads").html('')
    $("#downloads").append(a);
}

function old_data_callback(data) {
    
    old_data = data
}


function onload_data() {
    
    var uid = $("input")[0].value
    src_ = "user_data/" + uid + '.txt'
    $('#local_data').attr('src', src_)
    try {
        setTimeout(function() {
            console.log(old_data)
            onload_role()
            onload_player_card()
        }, 100)
    }
    catch(e) {

    }

}