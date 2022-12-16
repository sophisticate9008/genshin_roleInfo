var role_sel = -1
var data_exist
function onload_role() {
    
    if(typeof(new_data) == 'undefined') {
        data_exist = old_data
    }
    else {
        data_exist = new_data
    }
    var fade_in_arg = 1
    var yuansu_color = {"冰": "rgba(56, 239, 252, 0.877)", "火": "rgba(255, 87, 75, 0.877)","岩": "rgba(255, 204, 93, 0.877)",
                "水": 'rgba(93, 136, 255, 0.877)', "风": 'rgba(93, 255, 206, 0.877)', "雷":'rgba(159, 52, 201, 0.877)', "草":'rgba(76, 240, 76, 0.877)'}
    for(let zzz in data_exist['角色信息']) {
        var name_ = zzz
        icon_url = 'https://enka.network/ui/UI_AvatarIcon_' + roles_name['Name'][name_].split('_').slice(-1)[0] + '.png'
        var str_ = "<button value='{0}' class='role_icon' id='button_{1}' style='background-image: url({2});'></button>".format(name_, name_, icon_url)
        var $buttons = (str_)
        if($("#button_{0}".format(name_)).length <= 0) {
            $("#role_select").append($buttons)
            $("#button_{0}".format(name_)).fadeIn(800 + 200 * fade_in_arg++)
            $("#button_{0}".format(name_)).attr('onclick', "role_sel = '{0}'".format(name_))   
            $("#button_{0}".format(name_)).css("border-color",yuansu_color[data_exist['角色信息'][name_]["元素"]])      
        }
    }
    var round2R = $('.role_icon').eq(0).css("width")
    console.log(round2R)
    $(".role_icon").css("height", round2R)
}

