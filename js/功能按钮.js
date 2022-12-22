
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
    localStorage.setItem(String(uid), content)
}

function delete_data() {
    var uid = $("input")[0].value
    localStorage.removeItem(String(uid))
}


function onload_data() {
    
    var uid = $("input")[0].value
    try {
        old_data = JSON.parse(localStorage.getItem(String(uid)))
    }
    catch {}
    try {
        setTimeout(function() {
            console.log(old_data)
            onload_role()
            onload_player_card()
        }, 100)
    }
    catch(e) {}

}