
String.prototype.format = function() {
    if(arguments.length == 0) return this;
    var param = arguments[0];
    var s = this;
    if(typeof(param) == 'object') {
        for(var key in param)
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
    } else {
        for(var i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    }
}
function checkTime(i) {
    if(i < 10) {
        i = '0' + i
    }
    return i
}
String.prototype.multiplyTimes = function(n) {
    return Array.prototype.join.call({length:n+1}, this);
};


function get_time_now() {
    var nowdate = new Date();
    var year = nowdate.getFullYear(),
        month = nowdate.getMonth() + 1,
        date = nowdate.getDate(),
        day = nowdate.getDay(),
        // week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        h = nowdate.getHours(),
        m = nowdate.getMinutes(),
        s = nowdate.getSeconds(),
        h = checkTime(h),
        m = checkTime(m),
        s = checkTime(s);
    return year + "." + month + "." + date + "." + " " + h +":" + m + ":" + s;
}

function get_destinyIcon_byId(_id) {
    _id = _id + ''
    return roles_talent["Icon"][_id]
}

function get_destinyIconList_byName(_name) {
    var destiny_list = []
    var destinyIcon_list = []
    var destiny_data = roles_data[_name]["destiny"]
    for (let bbb in destiny_data) {
        destiny_list.push(bbb)
    }
    for(let mmm in roles_talent["Name"]) {
        if(roles_talent["Name"][mmm] == destiny_list[0]) {
            for(let lll = 0; lll < 6; lll++) {
                var _id = Number(mmm) + lll;
                destinyIcon_list.push(get_destinyIcon_byId(_id))
            }
            return destinyIcon_list
        }
    }
}