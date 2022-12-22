//立即执行函数
//!的作用是告诉javascript引擎这是一个函数表达式，不是函数声明，()、！、+、-等运算符都能实现这个作用，不过()是最安全的
//在!function(){}后面加上()会立即调用这个函数
//这样做可以模仿一个私有作用域，这样html文件引用多个js文件时便不会造成变量冲突
!function() {
//canvas元素相关
    //创建canvas元素，并设置canvas元素的id
    var canvas    = document.createElement("canvas"),
        divM = document.getElementsByTagName("div"),
        context   = canvas.getContext("2d"), 
        colors = [],
        stopDraw = 1,
        stopDrag = 1,
        stopBoom = 1,
        boomDecay = 1,
        boomspeed = 2,
        blockDivInnerClickEvent = 0,
        blockNum = 140,
        rand = 0,
        isup = 0,
        ing = 0,
        isdrag = 0,
        maxR = 15000,//束缚直径
        maxL = 6000,//连接长度
        attr = getAttr(),
        blue_rgb = {
            rmin : 80,
            gmin : 40,
            bmin : 250,
            rmax : 100,
            gmax : 60,
            bmax : 255               
        },
        sky_bule_rgb = {
            rmin : 120,
            gmin : 120,
            bmin : 250,
            rmax : 170,
            gmax : 170,
            bmax : 255
        },
        slight_blue_rgb = {
            rmin : 125,
            gmin : 175,
            bmin : 250,
            rmax : 130,
            gmax : 200,
            bmax : 255            
        },
        purple_rgb = {
            rmin : 110,
            gmin : 60,
            bmin : 250,
            rmax : 170,
            gmax : 90,
            bmax : 255            
        },
        slight_purple_rgb = {
            rmin : 215,
            gmin : 155,
            bmin : 250,
            rmax : 225,
            gmax : 180,
            bmax : 255                
        },

        pink_rgb = {
            rmin : 220,
            gmin : 90,
            bmin : 250,
            rmax : 250,
            gmax : 130,
            bmax : 255               
        },
        white_rgb = {
            rmin : 250,
            gmin : 230,
            bmin : 250,
            rmax : 255,
            gmax : 250,
            bmax : 255            
        }
    colors.push(blue_rgb)
    colors.push(sky_bule_rgb)
    colors.push(slight_blue_rgb)
    colors.push(purple_rgb)
    colors.push(slight_purple_rgb)
    colors.push(pink_rgb)
    colors.push(white_rgb)
    //设置创建的canvas的相关属性
    canvas.id = "c_n" + attr.length;
    canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + attr.z + ";opacity:" + attr.opacity;
    //将canvas元素添加到body元素中
    document.getElementsByTagName("body")[0].appendChild(canvas);
    //该函数设置了canvas元素的width属性和height属性
    getWindowWH(); 
    //onresize 事件会在窗口或框架被调整大小时发生
    //此处即为当窗口大小改变时，重新获取窗口的宽高和设置canvas元素的宽高
    window.onresize = getWindowWH;

    
    //该函数会得到引用了本文件的script元素，
    //因为本文件中在赋值时执行了一次getScript函数，html文件引用本文件时，本文件之后的script标签还没有被浏览器解释，
    //所以得到的script数组中，引用了本文的script元素在该数组的末尾
    //该函数的用意为使开发者能直接修改在html中引入该文件的script元素的属性来修改画布的一些属性，画布的z-index，透明度和小方块数量，颜色
    //与前面往body元素添加canvas元素的代码配合，当开发者想要使用该特效作为背景时，只需在html文件中添加script元素并引用本文件即可
    

    function getAttr() {
        let scripts = document.getElementsByTagName("script"),
            len = scripts.length,
            script = scripts[len - 1];//v为最后一个script元素，即引用了本文件的script元素
        return {
            length: len,
            z: script.getAttribute("zIndex") || -1,
            opacity: script.getAttribute("opacity") || 0.5,
            count: script.getAttribute("count") || blockNum
        }
    }
    //获得窗口宽高，并设置canvas元素宽高
    function getWindowWH() {
        W = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, 
        H = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }

    var random = Math.random,
    squares = [];//存放小方块

    //往squares[]数组放小方块
    for(let p = 0; p < attr.count; p ++){    
        var square_x = random() * W,//横坐标
            square_y = random() * H,//纵坐标
            square_xa = 2 * random() - 1,//x轴位移 -1,1
            square_ya = 2 * random() - 1,//y轴位移
            color_kind = (p + 1) % 7;


        squares.push({
            x: square_x,
            y: square_y,
            xa: square_xa,
            ya: square_ya,
            xb: null,//往点击处移动
            yb: null,//往点击处移动
            color_kind,//颜色种类
            max: maxL,
            rmin : colors[color_kind].rmin,
            gmin : colors[color_kind].gmin,
            bmin : colors[color_kind].bmin,
            rmax : colors[color_kind].rmax,
            gmax : colors[color_kind].gmax,
            bmax : colors[color_kind].bmax,
            r : getRndInteger(colors[color_kind].rmin, colors[color_kind].rmax),
            g : getRndInteger(colors[color_kind].gmin, colors[color_kind].gmax),
            b : getRndInteger(colors[color_kind].bmin, colors[color_kind].bmax),
            dir_r: 1,
            dir_g: 1,
            dir_b: 1
        })
    } 
    //生成鼠标小方块
    var mouse = {
            x: null,
            y: null,
            max: maxR
        };
    //获取鼠标所在坐标
    window.onmousemove = function (i) {
        //i为W3C DOM，window.event 为 IE DOM，以实现兼容IE
        //不过目前似乎IE已经支持W3C DOM，我用的是IE11，我注释掉下一句代码也能实现鼠标交互效果，
        //网上说7/8/9是不支持的，本人没有试验，
        //当然加上是没有错的
        i = i || window.event; 
        mouse.x = i.clientX; 
        mouse.y = i.clientY;
    }
    //鼠标移出窗口后，消除鼠标小方块
    window.onmouseout = function () {
        mouse.x = null;
        mouse.y = null;
    } 
    //绘制小方块，小方块移动(碰到边界反向移动)，小方块受鼠标束缚
    var animation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (i) {
        window.setTimeout(i, 1000 / 45)
    };//各个浏览器支持的requestAnimationFrame有所不同，兼容各个浏览器

    //以下函数返回 min（包含）～ max（包含）之间的数字：
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }   
    //画线 小方块移动
    function draw_assist(i , sel, w) {
        var w
        var A
        var color
        var change = 1
        var rand = 0
        
        
        //实现小方块定向移动
        if (sel == 1) {
            i.x += i.xa;
            i.y += i.ya;            
        }
        if (sel == 2) {
            i.x += i.xb;
            i.y += i.yb;            
        }
        if (sel == 3) {
            i.x -= boomspeed * i.xb * boomDecay;
            i.y -= boomspeed * i.yb * boomDecay;
        }
        rand = getRndInteger(1, 6) 
        if(rand == 1) {
            if (i.r >= i.rmax || i.r <= i.rmin) {
                i.dir_r *= -1
            }
            i.r += i.dir_r * change
        } else if (rand == 2){
            if (i.g >= i.gmax || i.g <= i.gmin) {
                i.dir_g *= -1
            }
            i.g += i.dir_g * change            
        } else if (rand == 3){
            if (i.b >= i.bmax || i.b <= i.bmin) {
                i.dir_b *= -1
            }
            i.b += i.dir_b * change               
        } else {}
        color = '' + i.r + ',' + i.g + ',' + i.b

        // 控制小方块移动方向
        // 当小方块达到窗口边界时，反向移动
        if (sel == 1) {
            i.xa = i.xa * (i.x > W || i.x < 0 ? -1 : 1);
            i.ya = i.ya * (i.y > H || i.y < 0 ? -1 : 1);            
        }
        if (sel == 2 || sel == 3) {
            i.xb = i.xb * (i.x > W || i.x < 0 ? -1 : 1);
            i.yb = i.yb * (i.y > H || i.y < 0 ? -1 : 1);            
        }
        //fillRect前两个参数为矩形左上角的x，y坐标，后两个分别为宽度和高度
        //绘制小方块
        context.fillRect(i.x - 0.5, i.y - 0.5, 2, 2);
        context.fillStyle = 'rgb(' + color + ')';
        if (sel == 2 || sel == 3) {
            return
        }
        //遍历w中所有元素
        for (let n = 0; n < w.length; n++) {
            x = w[n];
            //如果x与i不是同一个对象实例且x的xy坐标存在
            if (i !== x && null !== x.x && null !== x.y && i.color_kind == x.color_kind || x === mouse && mouse.x != null && isdrag == 0) {
                x_diff = i.x - x.x;//i和x的x坐标差
                y_diff = i.y - x.y;//i和x的y坐标差
                distance = x_diff * x_diff + y_diff * y_diff;//斜边平方
                if(distance < x.max){
                    //使i小方块受鼠标小方块束缚，即如果i小方块与鼠标小方块距离过大，i小方块会被鼠标小方块束缚,
                    //造成 多个小方块以鼠标为圆心，mouse.max/2为半径绕成一圈
                    if(x === mouse && distance > x.max / 2){
                        i.x = i.x - x_diff * (x.max / i.max / 150) - i.xa / 3;
                        i.y = i.y - y_diff * (x.max / i.max / 150) - i.ya / 3;
                    }
                    A = (x.max - distance) / x.max;
                    context.beginPath();
                    //设置画笔的画线的粗细与两个小方块的距离相关，范围0-0.5，两个小方块距离越远画线越细，达到max时画线消失
                    context.lineWidth = A / 2 + 1;
                    //设置画笔的画线颜色为s.c即画布颜色，透明度为(A+0.2)即两个小方块距离越远画线越淡
                    context.strokeStyle = "rgba(" + color + "," + (A + 0.2) + ")"; 
                    //设置画笔的笔触为i小方块
                    context.moveTo(i.x, i.y);
                    //使画笔的笔触移动到x小方块
                    context.lineTo(x.x, x.y);
                    //完成画线的绘制，即绘制连接小方块的线 
                    context.stroke();
                }
            }
        }
        //把i小方块从w数组中去掉
        //防止两个小方块重复连线
        w.splice(w.indexOf(i), 1);
    } 

    function draw() {


        //清除画布
        context.clearRect(0, 0, W, H);
        var w = [mouse].concat(squares);//连接(合并)鼠标小方块数组和其他小方块数组
        //square属性表：x，y，xa，ya，max
        for(var i = 0; i < squares.length; i++) {
            draw_assist(squares[i], 1, w)
        }
        
        //window.requestAnimationFrame与setTimeout相似，形成递归调用，
        //不过window.requestAnimationFrame采用系统时间间隔，保持最佳绘制效率,提供了更好地优化，使动画更流畅
        //经过浏览器优化，动画更流畅；
        //窗口没激活时，动画将停止，省计算资源;
        stopDraw = animation(draw);
    }
    //.........................................................................................................
    var mouseclick = {
        x : null,
        y : null,
        max : maxR
    }
    window.onclick = function(i) {
        blockClickEvent()
        if (blockDivInnerClickEvent == 1) {
            
            blockDivInnerClickEvent = 0
            return true
        }
        if(isup == 1) {
            return
        }
        rand = getRndInteger(0, Math.floor(blockNum / 4))
        console.log("onclick")
        i = i || window.event; 
        mouseclick.x = i.clientX; 
        mouseclick.y = i.clientY;
        if(ing == 1) {
            return
        }
        ing = 1
        calculate();
        //中断回调，也就是暂停
        window.cancelAnimationFrame(stopDrag)
        window.cancelAnimationFrame(stopBoom)
        drag()
        setTimeout(function () {
            window.cancelAnimationFrame(stopDrag)
            boom()
            setTimeout(function() {
                window.cancelAnimationFrame(stopBoom)
                window.cancelAnimationFrame(stopDrag)
                boomDecay = 1
                ing = 0
            }, 1500)
            
        }, 1500) //暂停一秒后重新启动，为其他函数腾出1s时间
        
    }
    window.onmousedown = function(i) {
        blockClickEvent()
        if (blockDivInnerClickEvent == 1) {
            blockDivInnerClickEvent = 0
            return true
        }
        if(ing == 1) {
            return
        }
        console.log("mousedown")
        isup = 0
        i = i || window.event; 
        mouseclick.x = i.clientX; 
        mouseclick.y = i.clientY;
        calculate();
        window.cancelAnimationFrame(stopDrag)
        window.cancelAnimationFrame(stopBoom)
        rand = getRndInteger(0, Math.floor(blockNum / 4))
        drag()
        setTimeout(function() {
            isup = 1
        }, 1500)
        setTimeout(function () {
            window.cancelAnimationFrame(stopDrag)
            setTimeout(function() {
                
            }, 1000)
            
        }, 1000)        
    }
    window.onmouseup = function(i) {
        
        blockClickEvent()
        if (blockDivInnerClickEvent == 1) {
            blockDivInnerClickEvent = 0
            return true
        }
        if(isup == 1) {
            console.log("mouseup")
            boom()
        }
        
        setTimeout(function() {
            window.cancelAnimationFrame(stopBoom)
            boomDecay = 1
            isup = 0
        }, 1500)
    }
    function calculate() { //计算距离除以渲染时间得到每次渲染移动的距离
        squares.forEach(function (i) {
            i.xb = (mouseclick.x - i.x) * 45 / 2675;
            i.yb = (mouseclick.y - i.y) * 45 / 2675;
        })
    }
    function drag() {
        var w = [mouse].concat(squares);
        w.splice(w.indexOf(mouse), 1);
        
        var z = w.splice(0 + rand, Math.floor(blockNum / 4 * 3 +rand))
        for(var i = 0; i < z.length; i++) {
            draw_assist(z[i], 2, w)
        } 
        stopDrag = animation(drag);    
    }
    function boom() {
        // console.log(boomDecay)
        if (boomDecay >= 0) {
            boomDecay -= 45 / 4500
        }
        var w = [mouse].concat(squares);
        w.splice(w.indexOf(mouse), 1);
        var z = w.splice(0 + rand, Math.floor(blockNum / 4 * 3 + rand))
        for(var i = 0; i < z.length; i++) {
            draw_assist(z[i], 3, w)
        } 
        stopBoom = animation(boom);                
    }
    function blockClickEvent() {
        list = document.getElementsByTagName("div");
        
        for(var i = 0; i < list.length; i++) {
            list[i].onmousedown = function() {
                
                
                blockDivInnerClickEvent = 1
            }
            list[i].onclick = function() {
                
                blockDivInnerClickEvent = 1
            }  
            list[i].onmouseup = function() {
                
                blockDivInnerClickEvent = 1
            }                           
            
        }
        
    }
    //此处是等待0.1秒后，执行一次draw()，真正的动画效果是用window.requestAnimationFrame实现的
    setTimeout(function () {
        draw();
    }, 100)  
    
}()
