/**
 * Created by David on 4/6/2017.
 */
/**
 * gallary
 * 插件
 */
;(function () {
    function hasClass(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    }
    function addClass(ele, cls) {
        if (!hasClass(ele, cls)) {
            ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
        }
    }
    function removeClass(ele, cls) {
        if (hasClass(ele, cls)) {
            var newClass = ' ' + ele.className.replace(/[\t\r\n]/g, '') + ' ';
            while (newClass.indexOf(' ' + cls + ' ') >= 0) {
                newClass = newClass.replace(' ' + cls + ' ', ' ');
            }
            ele.className = newClass.replace(/^\s+|\s+$/g, '');
        }
    }
    function getprev(element) {
        var e = element.previousSibling;
        if(e == null){//测试同胞节点是否存在，否则返回空
            return null;
        }
        if(e.nodeType==3){//如果同胞元素为文本节点
            var two = getprev(e);
            if(!two) return null;
            if(two.nodeType == 1) return two;
        }else{
            if(e.nodeType == 1){//确认节点为元素节点才返回
                return e;
            }else{
                return false;
            }
        }
    }
    function getnext(element) {
        var e = element.nextSibling;
        console.log(e)
        if(!e){//测试同胞节点是否存在，否则返回空
            return null;
        }
        if(e.nodeType==3){//如果同胞元素为文本节点
            var two = getnext(e);
            if(!two) return null;
            if(two.nodeType == 1) return two;
        }else{
            if(e.nodeType == 1){//确认节点为元素节点才返回
                return e;
            }else{
                return false;
            }
        }
    }
    function Gallary(option) {
        this.el             = document.querySelectorAll(option.el) || document.querySelectorAll("[data-compnent='gallary']");
        this.selected       = option.selected || 1;
        this.init();
    }
    //上一张图片
    Gallary.prototype.upItem        = function (item,parent,view) {
        var self = this;
        item.addEventListener('click',function () {
            var cur = parent.querySelector('a.active');
            var prev = getprev(cur);
            prev && self.setItem(prev,view);
        })
    }
    //下一张图片
    Gallary.prototype.nextItem      = function (item,parent,view) {
        var self = this;
        item.addEventListener('click',function () {
            var cur = parent.querySelector('a.active');
            var next = getnext(cur);
            next && self.setItem(next,view);
        })
    }
    //设置显示图片
    Gallary.prototype.setItem       = function (item,view) {
        this.setScrollleft(item,item.parentNode)

        var imgurl = item.getAttribute('data-img');
        view.setAttribute('src',imgurl);
        removeClass(item.parentNode.querySelector("a.active"),'active');
        addClass(item,'active');

    }
    //与初始化显示ID图片
    Gallary.prototype.initView      = function (it,view) {
        if(it.getAttribute('data-id') == this.selected){
            addClass(it,'active');
            view.setAttribute('src',it.getAttribute('data-img'))
        }
    }

    //点击缩略图图片切换
    Gallary.prototype.toggleImg     = function (it,view) {
        var self = this;
        it.addEventListener('click',function () {
            self.setItem(this,view);
        })
    }

    //设置缩略图的位置
    Gallary.prototype.setScrollleft = function (item,item_box) {
        var box_width           = item_box.clientWidth;
        var item_clientWidth    = item.clientWidth;
        var item_offsetLeft     = item.offsetLeft;
        item_box.scrollLeft = item_offsetLeft - (box_width - item_clientWidth) / 2;
    }


    //初始化控件
    Gallary.prototype.initControl   = function () {
        var self = this;
        Array.prototype.forEach.call(self.el,function (item) {

            var thumb       = item.querySelector('.gallary-thumb__img'),           //缩略图盒子
                thumb_a     = item.querySelectorAll('.gallary-thumb__img a'),      //缩略图项
                view        = item.querySelector('.gallary-view__show img'),       //大图盒子
                bigleft     = item.querySelector('.gallary-view__show--left'),     //大图左侧
                bigright    = item.querySelector('.gallary-view__show--right'),    //大图右侧
                thumbleft   = item.querySelector('.gallary-thumb__left'),          //缩略图左
                thumbright  = item.querySelector('.gallary-thumb__right');         //缩略图右

            Array.prototype.forEach.call(thumb_a,function (it) {
                self.initView(it,view);                                            //初始化显示一张大图
                self.toggleImg(it,view);                                           //监听点击缩略图切换
            })
            self.upItem(bigleft,thumb,view);                                       //监听大图区域左切换
            self.upItem(thumbleft,thumb,view);                                     //监听略略图左切换
            self.nextItem(bigright,thumb,view);                                    //监听大图区域右边切换
            self.nextItem(thumbright,thumb,view);                                  //监听略略图右边切换

        })
    }
    Gallary.prototype.init = function () {
        this.initControl();
    }

    window.Gallary = Gallary;
})();