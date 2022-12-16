var front_sel = ''
function onload_role_card() {
    role_sel_info = data_exist['角色信息'][role_sel]
    if (front_sel != role_sel) {
        $("#role_card").fadeOut(1)
        $("#role_card").fadeIn(800)
    }
    onload_background_pic()
    onload_role_destiny()
    onload_role_talent()
    onload_overall_data()
    onload_weapon()
    onload_artifact()
    $("#role_updata_time").html('最后更新于' + role_sel_info['更新时间'])
    front_sel = role_sel
}
function onload_player_card() {
    $("#player_info").fadeOut(1)
    $("#player_info").fadeIn(800)
    var name_icon = get_name_by_id(data_exist['玩家信息']['头像'])
    var icon_player = 'https://enka.network/ui/UI_AvatarIcon_' + roles_name['Name'][name_icon].split('_').slice(-1)[0] + '.png'
    $('#player_info').css("background-image", 'url({0})'.format(icon_player))
    $('#player_name').html(data_exist['玩家信息']['昵称'])
    $('#player_sign').html(data_exist['玩家信息']['签名'])
    $('#player_achieve_num').html("成就数" + "   " + data_exist['玩家信息']['成就'])
    $('#player_level').html("等级" + "   " + data_exist['玩家信息']['等级'])
    $('#player_updata_time').html("更新时间" + "   " + data_exist['玩家信息']['更新时间'])
}

$('#role_select').click(
    function() {
        onload_role_card()
    }
)

function onload_background_pic() {
    if (front_sel == role_sel) {
        return
    }
    $("#role_pic").css("background-image", 'none')
    var yuansu = role_sel_info['元素']
    name_en = roles_name["Name"][role_sel]
    $("#role_card").css("background-image", 'url(res/background/背景_{0}.png)'.format(yuansu))
    $("#role_pic").css("background-image", 'url(https://enka.network/ui/{0}.png)'.format(name_en))
    if(role_sel == '空' || role_sel == '荧') {
        $("#role_pic").css("background-size", '45em')
        $("#role_pic").css("background-position", '-10em')
    }
    else {
        $("#role_pic").css("background-size", '100em')
        $("#role_pic").css("background-position", '-30em')
    }
    
        
}

function onload_role_destiny() {
    if (front_sel == role_sel) {
        return
    }
    $("#destiny").children().remove()
    
    if(role_sel != '空' && role_sel != '荧') {
        var all_destinyIcon = get_destinyIconList_byName(role_sel)  
    }
    else {
        var all_destinyIcon = []
        for(let vvv in role_sel_info['命座']) {
            all_destinyIcon.push(role_sel_info['命座'][vvv]['图标'])
        }
    }
    destiny_unlock_list = role_sel_info['命座']
    for (let xxx in all_destinyIcon) {
        if (xxx < destiny_unlock_list.length) {
            var yuansu = role_sel_info['元素']
            var $destinyIcon = "<div class='destinyIcon' id='destinyIcon_{0}' style='background-image:url({1}),url(res/outline/图标_{2}.png)'></div>".format(String(xxx), 'https://enka.network/ui/' + all_destinyIcon[xxx] + '.png', yuansu)           
        }
        else {
            var $destinyIcon = "<div class='destinyIcon' id='destinyIcon_{0}' style='background-image:url({1}),url(res/outline/图标_灰.png)'></div>".format(String(xxx), 'https://enka.network/ui/' + all_destinyIcon[xxx] + '.png')
        }
        if($("#destinyIcon_" + xxx).length <= 0) {
            $("#destiny").append($destinyIcon)
        }
        
    }
    
}

function onload_role_talent() {
    if (front_sel == role_sel) {
        return
    }

    $("#talent").children().eq(3).remove()
    $("#talent").children().eq(3).remove()
    $("#talent").children().eq(3).remove()
    var talent_IconList = role_sel_info["天赋"]
    for (let nnn in talent_IconList) {
        var yuansu = role_sel_info['元素']
        var $talentIcon = "<div class='talentIcon' id='talentIcon_{0}' style='background-image:url({1}),url(res/outline/图标_{2}.png)'></div>".format(String(nnn), 'https://enka.network/ui/' + talent_IconList[nnn]["图标"] + '.png', yuansu) 
        if($("#talentIcon_" + nnn).length <= 0) {
            $("#talent").append($talentIcon)
        }
        $("#talent_level_" + nnn).html(talent_IconList[nnn]["等级"])       
    }
}

function onload_overall_data() {
    $("#attr_value").children().remove()
    var attr = role_sel_info['属性']
    var bleed = attr['基础生命'] + attr['额外生命'] + '(+' + attr['额外生命'] + ')'
    var attack = attr['基础攻击'] + attr['额外攻击'] + '(+' + attr['额外攻击'] + ')'
    var defense = attr['基础防御'] + attr['额外防御'] + '(+' + attr['额外防御'] + ')'
    var mastery = attr['元素精通']
    var baoji = (attr['暴击率'] * 100).toFixed(1) + "%"
    var baoshang = (attr['暴击伤害'] * 100).toFixed(1) + '%'
    var power_charge = (attr['元素充能效率'] * 100).toFixed(1) + '%'
    var addition = ''
    for (let mmm in attr['伤害加成']) {
        if (Number(attr['伤害加成'][mmm]) > 0) {
            addition = (Number(attr['伤害加成'][mmm]) * 100).toFixed(1) + '%'
            break
        }
        else {
            addition = '0.0%'
        }
    }
    $('#attr_value').append('<th>{0}</th>'.format(role_sel))
    $('#attr_value').append('<th>{0}</th>'.format(role_sel_info['等级']))
    $('#attr_value').append('<th>{0}</th>'.format(bleed))
    $('#attr_value').append('<th>{0}</th>'.format(attack))
    $('#attr_value').append('<th>{0}</th>'.format(defense))
    $('#attr_value').append('<th>{0}</th>'.format(mastery))
    $('#attr_value').append('<th>{0}</th>'.format(baoji))
    $('#attr_value').append('<th>{0}</th>'.format(baoshang))
    $('#attr_value').append('<th>{0}</th>'.format(power_charge))
    $('#attr_value').append('<th>{0}</th>'.format(addition))
}

function onload_weapon() {
    $("#weapon_pic").children().remove()
    var role_weapon = role_sel_info['武器']
    $('#weapon_name').html(role_weapon['名称'])
    $('#weapon_refine').html('精' + role_weapon['精炼等级'])
    $("#weapon_level").html('lv' + role_weapon['等级'])
    $("#weapon_star").html('★'.multiplyTimes( role_weapon['星级']))
    $("#weapon_pic").append('<img src="https://enka.network/ui/{0}.png" style="width: 100%;"></img>'.format(role_weapon['图标']))
}   

function onload_artifact() {
    $("#artifact").children().remove()
    var reg1 = /百分比/
    var reg2 = /[暴率]/
    var artifact_html = '<div class="artifacts"><img src="https://enka.network/ui/{0}.png">    <span style="display:block; position:absolute; left:1%; top:55.5%;width:6em; height:1em; text-align:center;">{1}<br><span style="font-size: 0.5em;">{2}<br>{3}</span></span>    <div class="artifact_table">        <table>            <tbody>                <thead id="artifact_attr_name">                    <th>{4}</th>                    <th>{5}</th>                    <th>{6}</th>                    <th>{7}</th>                        </thead>                       <thead id="artifact_attr_value">                    <th>{8}</th>                    <th>{9}</th>                    <th>{10}</th>                    <th>{11}</th>                        </thead>                                       </tbody>        </table>    </div></div>'
    var artifacts = role_sel_info['圣遗物']
    for (let i in artifacts) {
        var artifact_info = artifacts[i],
            arg1 = artifact_info['图标'],
            arg2 = artifact_info['名称'],
            arg3 = artifact_info['主属性']['属性名'].replace('元素伤害加成', '伤加成'),
            arg4 = String(artifact_info['主属性']['属性值']),
            attr_info = artifact_info['词条'];
        console.log(arg3 + '         ')
        if (arg3.search("百分比") != -1 || arg3.search('暴') != -1) {
            arg3 = arg3.replace('百分比', '')
            arg4 = arg4 + '%'
        }
        var args_list = []
        for (let j in attr_info) {
            if (reg1.exec(attr_info[j]['属性名'])) {
                args_list.push(attr_info[j]['属性名'].substring(3))
                args_list.push(attr_info[j]['属性值'] + '%')
            }
            else if(reg2.exec(attr_info[j]['属性名'])) {
                args_list.push(attr_info[j]['属性名'])
                args_list.push(String(attr_info[j]['属性值']) + '%')  
            }
            else {
                args_list.push(attr_info[j]['属性名'])
                args_list.push(String(attr_info[j]['属性值']))                   
            }
         
        }
        var remains = 8 - args_list.length
        for (let j = 0; j < remains; j++) {
            args_list.push('')
        }
        var $artifact_intactInfo = artifact_html.format(arg1,arg2,arg3,arg4,args_list[0],args_list[2],args_list[4],args_list[6],args_list[1],args_list[3],args_list[5],args_list[7])
        $("#artifact").append($artifact_intactInfo)
    }
}