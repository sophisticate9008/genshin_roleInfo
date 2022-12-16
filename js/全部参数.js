
class PlayInfo {
    constructor(uid, data) {
        this.origin_data = data
        this.uid = uid
        this.player_info = {}    
    }
    set_player() {
        var data = this.origin_data["playerInfo"]
        this.player_info['昵称'] = data["nickname"]
        this.player_info['等级'] = data["level"]
        this.player_info['世界等级'] = data["worldLevel"]
        this.player_info['签名'] = data['signature']
        this.player_info['成就'] = data['finishAchievementNum']
        this.player_info['角色列表'] = dictlist_to_list(
            data['showAvatarInfoList'])
        this.player_info['名片列表'] = data['showNameCardIdList']
        this.player_info['头像'] = data['profilePicture']['avatarId']
        this.player_info['更新时间'] = get_time_now()
    }
    set_role(qqq) {
        var data = this.origin_data["avatarInfoList"][qqq]
        var role_info = {}
        var role_name = get_name_by_id(data['avatarId'])
        role_info["role_name"] = role_name
        if (role_name in {'unknown':'', 'undefine':''}) {
            return 
        }
        if (role_name) {
            role_info['名称'] = role_name
            role_info['角色ID'] = data['avatarId']
            role_info['等级'] = data['propMap']['4001']['val']
            role_info['好感度'] = data['fetterInfo']['expLevel']
            if (role_name in {'荧':'', '空':''}) {
                var traveler_skill = roles_skill['Name'][Object.keys(data['skillLevelMap']).slice(-1)[0]]
                var myre = /[风雷岩草水火冰]/
                var find_element = myre.exec(traveler_skill)[0]
                role_info['元素'] = find_element
                role_name = find_element + '主'
            }
            else {
                role_info['元素'] = roles_data[role_name]["element"]
            }
            if ('talentIdList' in data) {
                if (data['talentIdList'].length >= 3) {
                    data['skillLevelMap'][Object.keys(data['skillLevelMap'])[
                        roles_skill['Talent'][role_name][0]]] += 3 
                }
                if (data['talentIdList'].length >= 5) {
                    data['skillLevelMap'][Object.keys(data['skillLevelMap'])[
                        roles_skill['Talent'][role_name][1]]] += 3
                }
            }
            role_info['天赋'] = []
            for (let skill in data['skillLevelMap']) {
                var skill_detail = {
                    '名称': roles_skill['Name'][skill],
                    '等级': data['skillLevelMap'][skill],
                    '图标': roles_skill['Icon'][skill]
                }
                role_info['天赋'].push(skill_detail)
            }
            if (role_info['名称'] == '神里绫华') {
                role_info['天赋'][0] = role_info['天赋'].slice(-1)[0]
                role_info['天赋'].slice(-1)[0] = role_info['天赋'][0]
                role_info['天赋'][2] = role_info['天赋'].slice(-1)[0] 
                role_info['天赋'].slice(-1)[0] = role_info['天赋'][2]
            }
            if (role_info['名称'] == '安柏') {
                role_info['天赋'][0] = role_info['天赋'].slice(-1)[0]
                role_info['天赋'].slice(-1)[0] = role_info['天赋'][0]
            }
            if (role_info['名称'] in {'荧':'', '空':''}) {
                role_info['天赋'][0] = role_info['天赋'].slice(-1)[0]
                role_info['天赋'].slice(-1)[0] = role_info['天赋'][0]
                role_info['天赋'][1] = role_info['天赋'].slice(-1)[0]
                role_info['天赋'].slice(-1)[0] = role_info['天赋'][1]
            }                                                      
            if (role_info['名称'] == '达达利亚') {
                role_info['天赋'][0]['等级'] += 1
            }
            role_info['命座'] = []
            if ('talentIdList' in data) {
                for (let vvv in data['talentIdList']) {
                    var talent = data['talentIdList'][vvv]
                    var talent_detail = {
                        '名称': roles_talent['Name'][talent],
                        '图标': roles_talent['Icon'][talent]
                    }
                    role_info['命座'].push(talent_detail)
                }
            }
            var prop = {}
            prop['基础生命'] = Math.floor (data['fightPropMap']['1'])
            prop['额外生命'] = Math.floor (data['fightPropMap']['2000'] - prop['基础生命'])
            prop['基础攻击'] = Math.floor (data['fightPropMap']['4'])
            prop['额外攻击'] = Math.floor (data['fightPropMap']['2001'] - prop['基础攻击'])
            prop['基础防御'] = Math.floor (data['fightPropMap']['7'])
            prop['额外防御'] = Math.floor (data['fightPropMap']['2002'] - prop['基础防御'])
            prop['暴击率'] = data['fightPropMap']['20'].toFixed(3)
            prop['暴击伤害'] = data['fightPropMap']['22'].toFixed(3)
            prop['元素精通'] = Math.floor (data['fightPropMap']['28'])
            prop['元素充能效率'] = data['fightPropMap']['23'].toFixed(3)
            prop['治疗加成'] = data['fightPropMap']['26'].toFixed(3)
            prop['受治疗加成'] = data['fightPropMap']['27'].toFixed(3)
            prop['伤害加成'] = [data['fightPropMap']['30'].toFixed(3)]
            for (let range = 40; range < 47; range++) {
                prop['伤害加成'].push(data['fightPropMap'][range].toFixed(2)) 
            }
            role_info['属性'] = prop

            var weapon_info = {}
            var weapon_data = data['equipList'].slice(-1)[0]
            weapon_info['名称'] = weapon['Name'][weapon_data['flat']
            ['nameTextMapHash']]
            weapon_info['图标'] = weapon_data['flat']['icon']
            weapon_info['类型'] = weapon['Type'][weapon_info['名称']]
            weapon_info['等级'] = weapon_data['weapon']['level']
            weapon_info['星级'] = weapon_data['flat']['rankLevel']
            if ('promoteLevel' in weapon_data['weapon']) {
                weapon_info['突破等级'] = weapon_data['weapon']['promoteLevel']
            }
            else {
                weapon_info['突破等级'] = 0
            }
            if ('affixMap' in weapon_data['weapon']) {
                for (let zzz in weapon_data['weapon']['affixMap']) {
                    weapon_info['精炼等级'] = 
                        weapon_data['weapon']['affixMap'][zzz] + 1
                }
                
            }
            else {
                weapon_info['精炼等级'] = 1
            }
            weapon_info['基础攻击'] = weapon_data['flat']['weaponStats'][0][
                'statValue']
            try {
                weapon_info['副属性'] = {
                    '属性名':
                        prop_[weapon_data['flat']['weaponStats'][1]
                        ['pushPropId']],
                    '属性值':
                        weapon_data['flat']['weaponStats'][1]['statValue']
                }
            }
            catch(err) {
                weapon_info['副属性'] = {'属性名': '无属性', '属性值': 0}
            }
            weapon_info['特效'] = '待补充'
            role_info['武器'] = weapon_info

            var artifacts = []
            for (var nnn in data['equipList'].slice(0, -1)) {
                
                var arti = data['equipList'][nnn]
                var artifact_info = {}
                artifact_info['名称'] = artifact['Name'][arti['flat']['icon']]
                artifact_info['图标'] = arti['flat']['icon']
                artifact_info['部位'] = artifact['Piece'][
                    arti['flat']['icon'].split('_').slice(-1)[0]][1]
                artifact_info['所属套装'] = artifact['Mapping'][
                    artifact_info['名称']]
                artifact_info['等级'] = arti['reliquary']['level'] - 1
                artifact_info['星级'] = arti['flat']['rankLevel']
                artifact_info['主属性'] = {
                    '属性名':
                        prop_[arti['flat']['reliquaryMainstat']
                        ['mainPropId']],
                    '属性值':
                        arti['flat']['reliquaryMainstat']['statValue']
                }
                artifact_info['词条'] = []
                for (var sss in arti['flat']['reliquarySubstats']) {
                    var reliquary = arti['flat']['reliquarySubstats'][sss]
                    artifact_info['词条'].push({
                        '属性名':
                            prop_[reliquary['appendPropId']],
                        '属性值':
                            reliquary['statValue']
                    })
                }
                artifacts.push(artifact_info)
            }
            role_info['圣遗物'] = artifacts
            role_info['更新时间'] = get_time_now()

        }
        return role_info
    }
    get_player_info() {
        return this.player_info
    }
    get_update_roles_list() {
        return this.player_info['角色列表']
    }
    get_roles_list() {
        return keys(this.roles)
    }
    get_roles_info(role_name){
        if (role_name in this.roles) {
            return this.roles[role_name]
        }
        else {
            return None
        }
    }
    export(old_data) {
        var return_json = {}
        this.set_player()
        return_json['玩家信息'] = this.player_info
        return_json['角色信息'] = {}
        var role_datas = this.origin_data["avatarInfoList"]
        for(let qqq in role_datas) {
            var role_info = this.set_role(qqq)
            return_json['角色信息'][role_info['名称']] = role_info
        }
        var backup = JSON.parse(JSON.stringify(return_json['角色信息']))

        var backup1 = Object.assign(backup, old_data['角色信息'])

        backup = JSON.parse(JSON.stringify(return_json['角色信息']))
        
        return_json['角色信息'] = Object.assign(backup1, backup)
        return return_json
    }

}


function get_name_by_id(role_id) {
    
    name_list = alias["roles"]
    if (role_id in name_list) {
        return name_list[role_id][0]
    }
    else {
        return undefined
    }
}

function dictlist_to_list(data) {
    var new_data = []
    for(let d in data) {
        namea = get_name_by_id(data[d]['avatarId'])
        new_data.push(namea)
    }
    return new_data
}
