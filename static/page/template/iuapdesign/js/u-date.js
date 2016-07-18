/** 
 * datetimepicker v3.0.6
 * dateTime
 * author : yonyou FED
 * homepage : https://github.com/iuap-design/datetimepicker#readme
 * bugs : https://github.com/iuap-design/datetimepicker/issues
 **/ 
u.DateTimePicker = u.BaseComponent.extend({


});

u.DateTimePicker.fn = u.DateTimePicker.prototype;


u.DateTimePicker.fn.init = function(){

    var self = this,_fmt,_defaultFmt;
    this.enable = true;
    this._element = this.element;
    //this.type = 'datetime';
    //if (u.hasClass(this.element,'u-datepicker')){
    //    this.type = 'date';
    //}
    //u.addClass(this._element,'u-text')
    //this._element.style.display = "inline-table"; // 存在右侧图标，因此修改display
    //new UText(this._element);
    this._input = this._element.querySelector("input");
    
    if(u.isMobile){
        // setTimeout(function(){
        //     self._input.setAttribute('readonly','readonly');
        // },1000);
    }

    setTimeout(function(){
        self._input.setAttribute('readonly','readonly');
    },1000);
   
    u.on(this._input, 'focus', function(e){
        // 用来关闭键盘
        if(u.isMobile)
            this.blur();
        self._inputFocus = true;
        if (self.isShow !== true){
            self.show(e);
        }
        u.stopEvent(e);
    });
    u.on(this._input, 'blur', function(e){
        self._inputFocus = false;
    })
    this._span = this._element.querySelector("span");
    if (this._span){
        u.on(this._span, 'click', function(e){
            // if (self.isShow !== true){
            //     self.show(e);
            // }
            self._input.focus();
            u.stopEvent(e);
        });
    }

    if (u.hasClass(this._element, 'time')){
        this.type = 'datetime';
        _defaultFmt = 'YYYY-MM-DD hh:mm:ss';
    }else{
        this.type = 'date';
        _defaultFmt = 'YYYY-MM-DD';
    }
    _fmt = this._element.getAttribute("format");
    this.format = _fmt || this.options['format']  ||  _defaultFmt;
    this.isShow = false;
};


/**
 * 轮播动画效果
 * @private
 */
u.DateTimePicker.fn._carousel = function(newPage, direction){
    if (direction == 'left'){
        u.addClass(newPage, 'right-page');
    }else{
        u.addClass(newPage, 'left-page');
    }
    this._dateContent.appendChild(newPage);
    if(u.isIE8 || u.isIE9 || u.isFF){
        // this._dateContent.removeChild(this.contentPage);
        var pages = this._dateContent.querySelectorAll('.u-date-content-page');
        for (i = 0; i < pages.length; i++){
            this._dateContent.removeChild(pages[i])
        }
        this.contentPage = newPage;
        this._dateContent.appendChild(newPage);
        if (direction == 'left'){
            u.removeClass(newPage, 'right-page');
        }else{
            u.removeClass(newPage, 'left-page');
        }
    }else{

        var cleanup = function() {
            newPage.removeEventListener('transitionend', cleanup);
            newPage.removeEventListener('webkitTransitionEnd', cleanup);
            // this._dateContent.removeChild(this.contentPage);
            var pages = this._dateContent.querySelectorAll('.u-date-content-page');
            for (i = 0; i < pages.length; i++){
                this._dateContent.removeChild(pages[i])
            }
            this.contentPage = newPage;
            this._dateContent.appendChild(newPage);
        }.bind(this);

        newPage.addEventListener('transitionend', cleanup);
        newPage.addEventListener('webkitTransitionEnd', cleanup);
        if(window.requestAnimationFrame)
            window.requestAnimationFrame(function() {
                if (direction == 'left'){
                    u.addClass(this.contentPage, 'left-page');
                    u.removeClass(newPage, 'right-page');
                }else{
                    u.addClass(this.contentPage, 'right-page');
                    u.removeClass(newPage, 'left-page');
                }
            }.bind(this));
    }
};

/**
 * 淡入动画效果
 * @private
 */
u.DateTimePicker.fn._zoomIn = function(newPage){
    if (!this.contentPage){
        this._dateContent.appendChild(newPage);
        this.contentPage = newPage;
        return;
    }
    u.addClass(newPage, 'zoom-in');
    this._dateContent.appendChild(newPage);
    if(u.isIE8 || u.isIE9 || u.isFF){
        var pages = this._dateContent.querySelectorAll('.u-date-content-page');
        for (i = 0; i < pages.length; i++){
            this._dateContent.removeChild(pages[i])
        }
        // this._dateContent.removeChild(this.contentPage);
        this.contentPage = newPage;
        this._dateContent.appendChild(newPage);
        u.removeClass(newPage, 'zoom-in');
    }else{
        var cleanup = function() {
            newPage.removeEventListener('transitionend', cleanup);
            newPage.removeEventListener('webkitTransitionEnd', cleanup);
            // this._dateContent.removeChild(this.contentPage);
            var pages = this._dateContent.querySelectorAll('.u-date-content-page');
            for (i = 0; i < pages.length; i++){
                this._dateContent.removeChild(pages[i])
            }
            this.contentPage = newPage;
            this._dateContent.appendChild(newPage);
        }.bind(this);
        if (this.contentPage){
            newPage.addEventListener('transitionend', cleanup);
            newPage.addEventListener('webkitTransitionEnd', cleanup);
        }
        if(window.requestAnimationFrame)
            window.requestAnimationFrame(function() {
                    u.addClass(this.contentPage, 'is-hidden');
                    u.removeClass(newPage, 'zoom-in');
            }.bind(this));
    }
    
};


/**
 *填充年份选择面板
 * @private
 */
u.DateTimePicker.fn._fillYear = function(type){
    var year,template,yearPage,titleDiv,yearDiv,_year, i,cell,language,year,month,date,time,self = this;
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title">',
                        /*'<div class="u-date-content-title-year"></div>-',
                        '<div class="u-date-content-title-month"></div>-',
                        '<div class="u-date-content-title-date"></div>',
                        '<div class="u-date-content-title-time"></div>',*/
                    '</div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    type = type || 'current';
    _year = this.pickerDate.getFullYear()
    if ('current' === type) {
        this.startYear = _year - _year%10 - 1;
    } else if (type === 'preivous') {
        this.startYear = this.startYear - 10;
    } else {
        this.startYear = this.startYear + 10;
    }
    yearPage = u.makeDOM(template);
    // titleDiv = yearPage.querySelector('.u-date-content-title');
    // titleDiv.innerHTML = (this.startYear - 1) + '-' + (this.startYear + 11);
    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](this.pickerDate);
    month = u.date._formats['MM'](this.pickerDate,language);
    date = u.date._formats['DD'](this.pickerDate,language);
    time = u.date._formats['HH'](this.pickerDate,language) + ':' + u.date._formats['mm'](this.pickerDate,language) + ':' + u.date._formats['ss'](this.pickerDate,language);

    this._yearTitle = yearPage.querySelector('.u-date-content-title');
    this._yearTitle.innerHTML = year;
    /*this._headerYear = yearPage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = yearPage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = yearPage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = yearPage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;*/
    if(this.type == 'date'){
        this._headerTime.style.display = 'none';
    }

    /*u.on(this._headerYear, 'click', function(e){
        self._fillYear();
        u.stopEvent(e)
    });

    u.on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        u.stopEvent(e)
    });    

    u.on(this._headerTime, 'click', function(e){
        self._fillTime();
        u.stopEvent(e)
    });*/

    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){

        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == _year){
            u.addClass(cell, 'current');
        }
        if (this.startYear + i < this.beginYear ){
            u.addClass(cell, 'u-disabled');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    u.on(yearDiv, 'click', function(e){
        if (u.hasClass(e.target,'u-disabled')) return;
        var _y = e.target._value;
        this.pickerDate.setYear(_y);
        this._updateDate();
        this._fillMonth();
    }.bind(this));

    if (type === 'current'){
        this._zoomIn(yearPage);
    }else if(type === 'next'){
        this._carousel(yearPage, 'left');
    }else if(type === 'preivous'){
        this._carousel(yearPage, 'right');
    }
    this.currentPanel = 'year';
};

/**
 * 填充月份选择面板
 * @private
 */
u.DateTimePicker.fn._fillMonth = function(){
    var template,monthPage,_month,cells,i,language,year,month,date,time,self = this;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
            /*'<div class="u-date-content-title-year"></div>-',
            '<div class="u-date-content-title-month"></div>-',
            '<div class="u-date-content-title-date"></div>',
            '<div class="u-date-content-title-time"></div>',*/
        '</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](this.pickerDate);
    month = u.date._formats['MM'](this.pickerDate,language);
    date = u.date._formats['DD'](this.pickerDate,language);
    time = u.date._formats['HH'](this.pickerDate,language) + ':' + u.date._formats['mm'](this.pickerDate,language) + ':' + u.date._formats['ss'](this.pickerDate,language);

    this._monthTitle =  monthPage.querySelector('.u-date-content-title');
    this._monthTitle.innerHTML = u.date._formats['MMM'](this.pickerDate,language);
    /*this._headerYear = monthPage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = monthPage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = monthPage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = monthPage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;*/
    if(this.type == 'date'){
        this._headerTime.style.display = 'none';
    }

    /*u.on(this._headerYear, 'click', function(e){
        self._fillYear();
        u.stopEvent(e)
    });

    u.on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        u.stopEvent(e)
    });    

    u.on(this._headerTime, 'click', function(e){
        self._fillTime();
        u.stopEvent(e)
    });*/

    cells = monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month - 1 == i){
            u.addClass(cells[i],'current');
        }
        if(this.pickerDate.getFullYear() == this.beginYear && i < this.beginMonth){
            u.addClass(cells[i],'u-disabled');
        }
        if(this.pickerDate.getFullYear() < this.beginYear){
            u.addClass(cells[i],'u-disabled');
        }
        cells[i]._value = i;
        new URipple(cells[i]);
    }
    u.on(monthPage, 'click', function(e){
        if (u.hasClass(e.target,'u-disabled')) return;
        if (u.hasClass(e.target,'u-date-content-title')) return;
        var _m = e.target._value;
        this.pickerDate.setMonth(_m);
        this._updateDate();
        this._fillDate();
    }.bind(this));
    this._zoomIn(monthPage);
    this.currentPanel = 'month';
};

u.DateTimePicker.fn._getPickerStartDate = function(date){
    var d = new Date(date);
    d.setDate(1);
    var day = d.getDay();
    d = u.date.sub(d, 'd', day);
    return d;
}

u.DateTimePicker.fn._getPickerEndDate= function(date){
    var d = new Date(date);
    d.setDate(1);
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    var day = d.getDay();
    d = u.date.add(d,'d',6 - day);
    return d;
}

/**
 * 渲染日历
 * @param type : previous  current  next
 * @private
 */
u.DateTimePicker.fn._fillDate = function(type){
    // if (u.isMobile){
    //     this._dateMobileScroll()
    //     return
    // }
    var year,month,day,time,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell,self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](tempDate);
    month = u.date._formats['MM'](tempDate,language);
    date = u.date._formats['DD'](tempDate,language);
    time = u.date._formats['HH'](tempDate,language) + ':' + u.date._formats['mm'](tempDate,language) + ':' + u.date._formats['ss'](tempDate,language);
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
            '<div class="u-date-content-title-year"></div>-',
            '<div class="u-date-content-title-month"></div>-',
            '<div class="u-date-content-title-date"></div>',
            '<div class="u-date-content-title-time"></div>',
        '</div>',
        '<div class="u-date-week"><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'].join("");
    datePage = u.makeDOM(template);
    this._headerYear = datePage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = datePage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = datePage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = datePage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;
    if(this.type == 'date'){
        this._headerTime.style.display = 'none';
    }

    u.on(this._headerYear, 'click', function(e){
        self._fillYear();
        u.stopEvent(e)
    });

    u.on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        u.stopEvent(e)
    });    

    u.on(this._headerTime, 'click', function(e){
        self._fillTime();
        u.stopEvent(e)
    });

    weekSpans = datePage.querySelectorAll('.u-date-week span');

    for(i=0; i< 7; i++){
        weekSpans[i].innerHTML = u.date._dateLocale[language].weekdaysMin[i];
    }
    dateDiv = datePage.querySelector('.u-date-content-panel');
    tempDate = this.startDate;
    while(tempDate <= this.endDate){
        cell = u.makeDOM('<div class="u-date-cell" unselectable="on" onselectstart="return false;">'+ tempDate.getDate() +'</div>');
        if (tempDate.getFullYear() == this.pickerDate.getFullYear() && tempDate.getMonth() == this.pickerDate.getMonth()
            && tempDate.getDate() == this.pickerDate.getDate()){
            u.addClass(cell, 'current');
        }

        
        if(tempDate.getFullYear() < this.beginYear || (tempDate.getFullYear() == this.beginYear && tempDate.getMonth() < this.beginMonth)){
            u.addClass(cell,'u-disabled');
            u.removeClass(cell,'current');
        }

        if(tempDate.getFullYear() == this.beginYear && tempDate.getMonth() == this.beginMonth
            && tempDate.getDate() < this.beginDate){
            u.addClass(cell,'u-disabled');
            u.removeClass(cell,'current');
        }
        cell._value = tempDate.getDate();
        cell._month = (tempDate.getMonth());
        cell._year = tempDate.getFullYear();
        new URipple(cell);
        dateDiv.appendChild(cell);
        tempDate = u.date.add(tempDate, 'd', 1);
    }
    u.on(dateDiv, 'click', function(e){
        if (u.hasClass(e.target,'u-disabled')) return;
        var _d = e.target._value;
        if (!_d) return;
        this.pickerDate.setFullYear(e.target._year);
        this.pickerDate.setMonth(e.target._month);
        this.pickerDate.setDate(_d);
        var _cell = e.target.parentNode.querySelector('.u-date-cell.current');
        if (_cell) {
            u.removeClass(_cell, 'current');
            if(u.isIE8 || u.isIE9)
                _cell.style.backgroundColor = "#fff";
        }
        u.addClass(e.target, 'current');
        if(u.isIE8 || u.isIE9)
            e.target.style.backgroundColor = '#3f51b5';
        this._updateDate();
        if (this.type === 'date'){
            this.onOk();
        }
    }.bind(this));
    if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'date';
};


/**
 * 填充时间选择面板
 * @private
 */
u.DateTimePicker.fn._fillTime = function(type){
    // if (u.isMobile) {
    //     this._timeMobileScroll()
    //     return;
    // }
    var year,month,day,date,time,template,timePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](tempDate);
    month = u.date._formats['MM'](tempDate,language);
    date = u.date._formats['DD'](tempDate,language);
    time = u.date._formats['HH'](tempDate,language) + ':' + u.date._formats['mm'](tempDate,language) + ':' + u.date._formats['ss'](tempDate,language);

    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">',
            '<div class="u-date-content-title-year"></div>-',
            '<div class="u-date-content-title-month"></div>-',
            '<div class="u-date-content-title-date"></div>',
            '<div class="u-date-content-title-time"></div>',
        '</div>',
        '<div class="u-date-content-panel"></div>',
        '</div>'].join("");
    timePage = u.makeDOM(template);
//    titleDiv = timePage.querySelector('.u-date-content-title');
//    titleDiv.innerHTML = year + ' ' + month + ' ' +day ;
    this._headerYear = timePage.querySelector('.u-date-content-title-year');
    this._headerYear.innerHTML = year;
    this._headerMonth = timePage.querySelector('.u-date-content-title-month');
    this._headerMonth.innerHTML = month;
    this._headerDate = timePage.querySelector('.u-date-content-title-date');
    this._headerDate.innerHTML = date;
    this._headerTime = timePage.querySelector('.u-date-content-title-time');
    this._headerTime.innerHTML = time;
    if(this.type == 'date'){
        this._headerTime.style.display = 'none';
    }

    u.on(this._headerYear, 'click', function(e){
        self._fillYear();
        u.stopEvent(e)
    });

    u.on(this._headerMonth, 'click', function(e){
        self._fillMonth();
        u.stopEvent(e)
    });    

    u.on(this._headerTime, 'click', function(e){
        self._fillTime();
        u.stopEvent(e)
    });

    dateDiv = timePage.querySelector('.u-date-content-panel');
   // tempDate = this.startDate;
    // while(tempDate <= this.endDate){
        // cell = u.makeDOM('<div class="u-date-cell">'+ u.date._formats['HH'](tempDate,language) +'</div>');
        // if (tempDate.getFullYear() == this.pickerDate.getFullYear() && tempDate.getMonth() == this.pickerDate.getMonth()
            // && tempDate.getDate() == this.pickerDate.getDate()){
            // u.addClass(cell, 'current');
        // }
        // cell._value = tempDate.getDate();
        // new URipple(cell);
        // dateDiv.appendChild(cell);
        // tempDate = u.date.add(tempDate, 'd', 1);
    // }
    if(u.isIE8){ // IE8/IE9保持原来，非IE8/IE9使用clockpicker
        timetemplate = ['<div class="u_time_box">',
                            '<div class="u_time_cell">',
                                //'<div class="add_hour_cell"><i class="add_hour_cell icon-angle-up"></i></div>',
                                '<div class="show_hour_cell">'+ u.date._formats['HH'](tempDate) +'</div>' ,
                                //'<div class="subtract_hour_cell"><i class="subtract_hour_cell icon-angle-down"></i></div>',
                            '</div>',
                            '<div class="u_time_cell">',
                                //'<div class="add_min_cell"><i class="add_min_cell icon-angle-up"></i></div>',
                                '<div class="show_min_cell">'+ u.date._formats['mm'](tempDate) +'</div>',
                                //'<div class="subtract_min_cell"><i class="subtract_min_cell icon-angle-down"></i></div>',
                            '</div>',
                            '<div class="u_time_cell">',
                                //'<div class="add_sec_cell"><i class="add_sec_cell icon-angle-up"></i></div>',
                                '<div class="show_sec_cell">'+ u.date._formats['ss'](tempDate) +'</div>',
                                //'<div class="subtract_sec_cell"><i class="subtract_sec_cell icon-angle-down"></i></div>',
                            '</div>',
                        '</div>'].join("");
        cell = u.makeDOM(timetemplate);
        dateDiv.appendChild(cell);
        u.on(dateDiv, 'click', function(e){
            var _arrary = e.target.getAttribute("class").split("_");
            if(_arrary[0] == "add"){
                if(_arrary[1] == "hour"){
                    var tmph = Number(u.date._formats['HH'](this.pickerDate))
                    if(tmph < 23){
                        tmph++
                    }else{
                        tmph = 0
                    }

                    this.pickerDate.setHours(tmph)
                    dateDiv.querySelector(".show_hour_cell").innerHTML = tmph
                }else if(_arrary[1] == "min"){
                    var tmpm = Number(u.date._formats['mm'](this.pickerDate))
                    if(tmpm < 59){
                         tmpm++
                    }else{
                         tmpm = 0
                    }
                    this.pickerDate.setMinutes(tmpm)
                }else if(_arrary[1] == "sec"){
                    var tmps = Number(u.date._formats['ss'](this.pickerDate))
                    if(tmps < 59){
                        tmps++
                    }else{
                        tmps = 0
                    }
                    this.pickerDate.setSeconds(tmps)
                }
            }else if(_arrary[0] == "subtract"){
                if(_arrary[1] == "hour"){
                    var tmph = Number(u.date._formats['HH'](this.pickerDate))
                    if(tmph > 0 ){
                        tmph--
                    }else{
                        tmph = 23
                    }
                    this.pickerDate.setHours(tmph)

                }else if(_arrary[1] == "min"){
                    var tmpm = Number(u.date._formats['mm'](this.pickerDate))
                    if(tmpm > 0){
                         tmpm--
                    }else{
                         tmpm = 59
                    }
                    this.pickerDate.setMinutes(tmpm)
                }else if(_arrary[1] == "sec"){
                    var tmps = Number(u.date._formats['ss'](this.pickerDate))
                    if(tmps > 0){
                        tmps--
                    }else{
                        tmps = 59
                    }
                    this.pickerDate.setSeconds(tmps)
                }
            }else if(_arrary[0] == "show"){
                var tmptarget = e.target
                var tmpinput = u.makeDOM("<input type='text' class='u-input'>");
                if(tmptarget.querySelector('.u-input'))return;
                this._updateDate();
                tmpinput.value = tmptarget.innerHTML;
                tmptarget.innerHTML = ""
                tmptarget.appendChild(tmpinput)
                if(_arrary[1] == "hour"){
                     var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:23})
                     u.on(tmpinput,'blur',function(){
                        if(vali.passed){
                            self.pickerDate.setHours(tmpinput.value)
                            self._updateDate();
                        }
                     })
                }else if(_arrary[1] == "min"){
                     var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:59})
                       u.on(tmpinput,'blur',function(){
                        if(vali.passed){
                            self.pickerDate.setMinutes(tmpinput.value)
                            self._updateDate();
                        }
                     })
                }else if(_arrary[1] == "sec"){
                     var vali = new u.Validate(tmpinput,{validType:"integer",minLength:0,maxLength:2,min:0,max:59})
                       u.on(tmpinput,'blur',function(){
                        if(vali.passed){
                            self.pickerDate.setSeconds(tmpinput.value)
                            self._updateDate();
                        }
                     })
                }

                tmpinput.focus()
                return;

            }else{
                return false;
            }

            this._updateDate();
        }.bind(this));
    }else{
        timetemplate = '<div class="u-combo-ul clockpicker-popover is-visible" style="width:100%;padding:0px;">';
//        timetemplate += '<div class="popover-title"><span class="clockpicker-span-hours">02</span> : <span class="clockpicker-span-minutes text-primary">01</span><span class="clockpicker-span-am-pm"></span></div>';
        timetemplate += '<div class="popover-content">';
        timetemplate += '  <div class="clockpicker-plate data-clockpicker-plate">';
        timetemplate += '      <div class="clockpicker-canvas">';
        timetemplate += '          <svg class="clockpicker-svg">';
        timetemplate += '              <g transform="translate(100,100)">';
        timetemplate += '                  <circle class="clockpicker-canvas-bg clockpicker-canvas-bg-trans" r="13" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
        timetemplate += '                  <circle class="clockpicker-canvas-fg" r="3.5" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
        timetemplate += '                  <line x1="0" y1="0" x2="8.362277061412277" y2="-79.56175162946187"></line>';
        timetemplate += '                  <circle class="clockpicker-canvas-bearing" cx="0" cy="0" r="2"></circle>';
        timetemplate += '              </g>';
        timetemplate += '          </svg>';
        timetemplate += '      </div>';
        timetemplate += '      <div class="clockpicker-dial clockpicker-hours" style="visibility: visible;">';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-1" >00</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-2" >1</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-3" >2</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-4" >3</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-5" >4</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-6" >5</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-7" >6</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-8" >7</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-9" >8</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-10" >9</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-11" >10</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-12" >11</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-13" >12</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-14" >13</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-15" >14</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-16" >15</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-17" >16</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-18" >17</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-19" >18</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-20" >19</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-21" >20</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-22" >21</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-23" >22</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-24" >23</div>';
        timetemplate += '      </div>';
        timetemplate += '      <div class="clockpicker-dial clockpicker-minutes" style="visibility: hidden;">';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-25" >00</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-26" >05</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-27" >10</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-28" >15</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-29" >20</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-30" >25</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-31" >30</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-32" >35</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-33" >40</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-34" >45</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-35" >50</div>';
        timetemplate += '          <div class="clockpicker-tick clockpicker-tick-36" >55</div>';
        timetemplate += '      </div>';
        timetemplate += '  </div><span class="clockpicker-am-pm-block"></span></div>';
        timetemplate += '  </div>';
        cell = u.makeDOM(timetemplate);
        this.cell = cell;
        dateDiv.appendChild(cell);

        this.hand = cell.querySelector('line');
        this.bg = cell.querySelector('.clockpicker-canvas-bg');
        this.fg = cell.querySelector('.clockpicker-canvas-fg');
        this.titleHourSpan = cell.querySelector('.clockpicker-span-hours');
        this.titleMinSpan = cell.querySelector('.clockpicker-span-minutes');
        this.hourDiv = cell.querySelector('.clockpicker-hours');
        this.minDiv = cell.querySelector('.clockpicker-minutes');
        this.currentView = 'hours';
        this.hours = u.date._formats['HH'](tempDate);
        this.min = u.date._formats['mm'](tempDate);
        this.sec = u.date._formats['ss'](tempDate);
        //this.titleHourSpan.innerHTML = this.hours;
        //this.titleMinSpan.innerHTML = this.min;
        


        u.on(this.hourDiv,'click',function(e){
            var target = e.target;
            if(u.hasClass(target,'clockpicker-tick')){
                this.hours = target.innerHTML;
                this.hours = this.hours > 9 || this.hours  == 0? '' + this.hours:'0' + this.hours;
                // this.titleHourSpan.innerHTML = this.hours;
                self.pickerDate.setHours(this.hours);
                var language = u.core.getLanguages();
                var time = u.date._formats['HH'](this.pickerDate,language) + ':' + u.date._formats['mm'](this.pickerDate,language) + ':' + u.date._formats['ss'](this.pickerDate,language);
                this._headerTime.innerHTML = time;
                this.hourDiv.style.visibility = 'hidden';
                this.minDiv.style.visibility = 'visible';
                this.currentView = 'min';
                this.setHand();
            }
        }.bind(this));
        
        u.on(this.minDiv,'click',function(e){
            var target = e.target;
            if(u.hasClass(target,'clockpicker-tick')){
                this.min = target.innerHTML;
                // this.min = this.min > 9 || this.min  == 00? '' + this.min:'0' + this.min;
                // this.titleMinSpan.innerHTML = this.min;
                self.pickerDate.setMinutes(this.min);
                var language = u.core.getLanguages();
                var time = u.date._formats['HH'](this.pickerDate,language) + ':' + u.date._formats['mm'](this.pickerDate,language) + ':' + u.date._formats['ss'](this.pickerDate,language);
                this._headerTime.innerHTML = time;
                this.minDiv.style.visibility = 'hidden';
                this.hourDiv.style.visibility = 'visible';
                this.currentView = 'hours';
                this.setHand();
            }
        }.bind(this));
        
    }
    
    this._zoomIn(timePage);
    if(!u.isIE8)
        this.setHand();
    this.currentPanel = 'time';
    dateDiv.onselectstart=new Function("return false");

};

u.DateTimePicker.fn.setHand = function(){
    var dialRadius = 100,
    innerRadius = 54,
    outerRadius = 80;
    var view = this.currentView,
        value = this[view],
        isHours = view === 'hours',
        unit = Math.PI / (isHours ? 6 : 30),
        radian = value * unit,
        radius = isHours && value > 0 && value < 13 ? innerRadius : outerRadius,
        x = Math.sin(radian) * radius,
        y = - Math.cos(radian) * radius;
        this.setHandFun(x,y);
}

u.DateTimePicker.fn.setHandFun = function(x,y,roundBy5,dragging){
    var dialRadius = 100,
    innerRadius = 54,
    outerRadius = 80;
    
    var radian = Math.atan2(x, - y),
        isHours = this.currentView === 'hours',
        unit = Math.PI / (isHours ? 6 : 30),
        z = Math.sqrt(x * x + y * y),
        options = this.options,
        inner = isHours && z < (outerRadius + innerRadius) / 2,
        radius = inner ? innerRadius : outerRadius,
        value;
        
        if (this.twelvehour) {
            radius = outerRadius;
        }

    // Radian should in range [0, 2PI]
    if (radian < 0) {
        radian = Math.PI * 2 + radian;
    }

    // Get the round value
    value = Math.round(radian / unit);

    // Get the round radian
    radian = value * unit;

    // Correct the hours or minutes
    if (options.twelvehour) {
        if (isHours) {
            if (value === 0) {
                value = 12;
            }
        } else {
            if (roundBy5) {
                value *= 5;
            }
            if (value === 60) {
                value = 0;
            }
        }
   } else {
        if (isHours) {
            if (value === 12) {
                value = 0;
            }
            value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
        } else {
            if (roundBy5) {
                value *= 5;
            }
            if (value === 60) {
                value = 0;
            }
        }
    }
    
    // Set clock hand and others' position
    var w = this._panel.offsetWidth;
        var u = w / 294;
        var cx = Math.sin(radian) * radius * u,
            cy = - Math.cos(radian) * radius * u;
        var iu = 100 * u;
        this.cell.querySelector('g').setAttribute('transform','translate(' + iu + ',' + iu + ')');
    this.hand.setAttribute('x2', cx);
    this.hand.setAttribute('y2', cy);
    this.bg.setAttribute('cx', cx);
    this.bg.setAttribute('cy', cy);
    this.fg.setAttribute('cx', cx);
    this.fg.setAttribute('cy', cy);
}

/**
 * 重新渲染面板
 * @private
 */
u.DateTimePicker.fn._updateDate = function(){
    var year,month,week,date,time, hour,minute,seconds,language;

    language = u.core.getLanguages();
    year = u.date._formats['YYYY'](this.pickerDate);
    // week = u.date._formats['ddd'](this.pickerDate, language);
    month = u.date._formats['MM'](this.pickerDate, language);
    time = u.date._formats['HH'](this.pickerDate, language)+':'+u.date._formats['mm'](this.pickerDate, language)+':'+u.date._formats['ss'](this.pickerDate, language);

    //TODO 多语
    // date = u.date._formats['D'](this.pickerDate) + '日';
    date = u.date._formats['DD'](this.pickerDate,language);
    if(this._headerYear){
        this._headerYear.innerHTML = '';
        this._headerYear.innerHTML = year;
    }
        // this._headerWeak.innerHTML = '';
        // this._headerWeak.innerHTML = week;
    if(this._headerMonth){
        this._headerMonth.innerHTML = '';
        this._headerMonth.innerHTML = month ;
    }
    if(this._headerDate){
        this._headerDate.innerHTML = '';
        this._headerDate.innerHTML = date;
    }
    if(this._headerTime){
        this._headerTime.innerHTML = '';
        this._headerTime.innerHTML = time;
    }
    if(this.currentPanel == 'time'){
        if(u.isIE8){
            this._panel.querySelector(".show_hour_cell").innerHTML =  u.date._formats['HH'](this.pickerDate, language)
            this._panel.querySelector(".show_min_cell").innerHTML =  u.date._formats['mm'](this.pickerDate, language)
            this._panel.querySelector(".show_sec_cell").innerHTML =  u.date._formats['ss'](this.pickerDate, language)
        }
    }

};


u.DateTimePicker.fn._response = function() {
    return;
    var bodyHeight = document.body.offsetHeight;  //395
    var _height = 430;
    if (this.type === 'date' && !(u.isMobile))
        _height = 395;
    if (bodyHeight > _height){
        this._panel.style.height =  _height;
    }
    //if (bodyHeight > 500){
    //    this._panel.style.height =  '500px';
    //}
    //this._dateContent.style.height =panelHeight - 158 + 'px';   // 106 52
};

u.dateTimePickerTemplateArr = ['<div class="u-date-panel">',
                            '<div class="u-date-body">',
                                /*'<div class="u-date-header">',
                                    '<span class="u-date-header-year"></span>',
                                     '<div class="u-date-header-h3">',
                                        '<span class="u-date-header-week"></span>',
                                        '<span>,</span>',
                                        '<span class="u-date-header-month"></span>',
                                        '<span> </span>',
                                        '<span class="u-date-header-date"></span>',
                                        '<span> </span>',
                                        '<span class="u-date-header-time"></span>',
                                     '</div>',
                                '</div>',*/
                                '<div class="u-date-content"></div>',
                            '</div>',
                            '<div class="u-date-nav">',
                                '<button class="u-button u-date-ok right primary">确定</button>',
                                '<button class="u-button u-date-cancel right">取消</button>',
                                '<button class="u-button u-date-clean">清空</button>',
                            '</div>',
                           '</div>'];


/******************************
 *  Public method
 ******************************/

u.DateTimePicker.fn.show = function(evt){
    if(!this.enable){
        return;
    }
    var inputValue = this._input.value;
    this.setDate(inputValue);

    var self = this;
    if (!this._panel){
        this._panel = u.makeDOM(u.dateTimePickerTemplateArr.join(""));
        if(u.isMobile){
            u.removeClass(this._panel,'u-date-panel')
            u.addClass(this._panel,'u-date-panel-mobile');
        }
        this._dateNav = this._panel.querySelector('.u-date-nav');
        if (this.type === 'date' && !u.isMobile){
           this._dateNav.style.display = 'none';
        }
        this._dateContent = this._panel.querySelector('.u-date-content');
        if(this.type == 'datetime'){
            /*if(u.isMobile){
                this._dateContent.style.height = '226/16*2rem';
            }
            else{
                this._dateContent.style.height = '226px';
            }*/
        }
        this.btnOk = this._panel.querySelector('.u-date-ok');
        this.btnCancel = this._panel.querySelector('.u-date-cancel');
        this.btnClean = this._panel.querySelector('.u-date-clean');
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer,'u-ripple');
        this.btnOk.appendChild(rippleContainer);
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer,'u-ripple');
        this.btnCancel.appendChild(rippleContainer);
        var rippleContainer = document.createElement('span');
        u.addClass(rippleContainer,'u-ripple');
        this.btnClean.appendChild(rippleContainer);
        new URipple(this.btnOk);
        new URipple(this.btnCancel);
        new URipple(this.btnClean);
        u.on(this.btnOk, 'click', function(e){
            this.onOk();
            u.stopEvent(e);
        }.bind(this));
        u.on(this.btnCancel, 'click', function(e){
            self.onCancel();
            u.stopEvent(e)
        });
        u.on(this.btnClean, 'click', function(e){
            self.pickerDate = null;
            self.onOk();
            u.stopEvent(e)
        });
            

        // this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini">&lt;</button>');
        // this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini">&gt;</button>');
        this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button mini">&lt;</button>');
        this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button mini">&gt;</button>');
        // new u.Button(this.nextBtn);

        u.on(this.preBtn, 'click', function(e){
            if (self.currentPanel == 'date'){
                self._fillDate('preivous');
            }else if (self.currentPanel == 'year'){
                self._fillYear('preivous');
            }
            u.stopEvent(e)
        });
        u.on(this.nextBtn, 'click', function(e){
            if (self.currentPanel == 'date'){
                self._fillDate('next');
            }else if (self.currentPanel == 'year'){
                self._fillYear('next');
            }
            u.stopEvent(e)
        });
        // if(!u.isMobile){
            this._dateContent.appendChild(this.preBtn);
            this._dateContent.appendChild(this.nextBtn);    
        // }
        

        //this._element.parentNode.appendChild(this._panel);
        document.body.appendChild(this._panel);

    }
    this.pickerDate = this.date || new Date();
    this._updateDate();
    this._fillDate();
    this._response();
    u.on(window, 'resize', function(){
        self._response();
    });
    if(u.isMobile){
        this.overlayDiv = u.makeModal(this._panel);
        u.on(this.overlayDiv, 'click', function(){
            self.onCancel();
        })
    }
    u.addClass(this._panel, 'is-visible');
    if(!u.isMobile){
        //调整left和top
        u.showPanelByEle({
            ele:this._input,
            panel:this._panel,
            position:"bottomLeft"
        });
        this._panel.style.marginLeft = '0px';
        var callback = function (e) {
            if (e !== evt && e.target !== self._input && !u.hasClass(e.target,'u-date-content-year-cell')  && !u.hasClass(e.target,'u-date-content-year-cell') &&u.closest(e.target,'u-date-panel') !== self._panel && self._inputFocus != true) {
                u.off(document,'click', callback);
                self.onCancel();
            }
        };
        u.on(document,'click', callback);

        document.body.onscroll = function(){
            u.showPanelByEle({
                ele:self._input,
                panel:self._panel,
                position:"bottomLeft"
            });
        }
    }
    
    this.isShow = true;
};


/**
 * 确定事件
 */
u.DateTimePicker.fn.onOk = function(){
    this.setDate(this.pickerDate);
    this.isShow = false;
    u.removeClass(this._panel, 'is-visible');
    try{
        document.body.removeChild(this.overlayDiv);    
    }catch(e){

    }
    this.trigger('select', {value:this.pickerDate})
}

/**
 * 确定事件
 */
u.DateTimePicker.fn.onCancel = function(){
    this.isShow = false;
    u.removeClass(this._panel, 'is-visible');
    try{
        document.body.removeChild(this.overlayDiv);
    }catch(e){

    }
}


u.DateTimePicker.fn.setDate = function(value){
    if (!value){
        this.date = null;
        this._input.value = '';
        return;
    }

    var _date = u.date.getDateObj(value);
    if(_date){
        if(this.beginDateObj){
            if(_date < this.beginDateObj)
                return;
        }
        this.date = _date;
        this._input.value = u.date.format(this.date,this.format);
    }
    
};
/**
 *设置format
 * @param format
 */
u.DateTimePicker.fn.setFormat = function(format){
    this.format = format;
    this._input.value = u.date.format(this.date,this.format);
};

u.DateTimePicker.fn.setStartDate = function(startDate){
    if(startDate){
        this.beginDateObj = u.date.getDateObj(startDate);
        this.beginYear = this.beginDateObj.getFullYear();
        this.beginMonth = this.beginDateObj.getMonth();
        this.beginDate = this.beginDateObj.getDate();
    }
    
}
u.DateTimePicker.fn.setEnable = function(enable){
    if (enable === true || enable === 'true') {
        this.enable = true;
    }else{
        this.enable = false;
    }
}

if (u.compMgr)
    u.compMgr.regComp({
        comp: u.DateTimePicker,
        compAsString: 'u.DateTimePicker',
        css: 'u-datepicker'
    })




/*
移动端渲染暂时和pc保持一致 begin
u.DateTimePicker.fn._dateMobileScroll = function(type){
   var year,month,day,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell,ddheight;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();

    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title"></div>',
        '<div class="u-date-content-panel"><div class="scroll-box"><div class="scroll-shadow"></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setYear" class="u-date-year  u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setMonth" class="u-date-month u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setDate" class="u-date-day u-scroll"></dl></div>',
        '</div></div>'].join("");
    datePage = u.makeDOM(template);
    var srcollyear = datePage.querySelector('.u-date-year');
    var srcollmonth = datePage.querySelector('.u-date-month');
    var srcollday = datePage.querySelector('.u-date-day');
    this.startYear =  this.pickerDate.getFullYear() -10;
    for(i = 0; i < 20; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (this.startYear + i) +'</dd>');

        if (this.startYear + i == this.pickerDate.getFullYear()){
            u.addClass(cell, 'current');
            current_postion(srcollyear,i)
        }
        cell._value = this.startYear + i;
        srcollyear.appendChild(cell);
    }
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (1 + i) + '月' +'</dd>');

        if (this.pickerDate.getMonth()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollmonth,i)
        }
        cell._value = i;
        srcollmonth.appendChild(cell);
    }
    var pickerdayend = (new Date(this.pickerDate.getFullYear(),this.pickerDate.getMonth()+1, 0)).getDate();
    for(i = 1; i < (pickerdayend + 1); i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ i +'日</dd>');
        if (i == this.pickerDate.getDate()) {
            u.addClass(cell, 'current');
            current_postion(srcollday,i-1)
        }
        cell._value = i;
        srcollday.appendChild(cell);

    }
    //current_postion(datePage)
    ddheight = 60
    u.on(datePage.querySelector(".scroll-shadow"),"touchstart",function(e){
         var tmpwidth = this.clientWidth
        var scrolltype,startp,offsetX ;
        console.dir()
        startp = e.touches[0].pageY;
        offsetX = e.touches[0].pageX - this.getClientRects()[0].left
        if(offsetX < tmpwidth * 0.33){
            scrolltype = datePage.querySelector(".u-date-year")
        }else if(tmpwidth * 0.33 < offsetX  && offsetX < tmpwidth * 0.66){
            scrolltype = datePage.querySelector(".u-date-month")
        }else if(tmpwidth * 0.66 < offsetX){
            scrolltype = datePage.querySelector(".u-date-day")
        }
        u.on(document.body,"touchmove",function(e){
            var scrollrange = e.touches[0].pageY - startp
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])
            scrolltype.style.transform = "translateY("+(oldtrans + scrollrange)+"px)";
            startp = e.touches[0].pageY
        })
        var maxscroll = (scrolltype.querySelectorAll('dd').length - 3) * -ddheight
        u.on(document.body,"touchend",function(e){
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])

            var remain = oldtrans-oldtrans%60

            if(remain > ddheight*2){
                remain = ddheight*2
            }else if(remain < maxscroll){
                remain = maxscroll
            }
            tmpdd = scrolltype.querySelectorAll("dd"),
            u.removeClass(scrolltype.querySelector(".current"),'current')
            u.addClass(tmpdd[2 - (remain/ddheight)],'current')
            scrolltype.style.transform = "translateY("+remain+"px)";
            scrollend_update(scrolltype,self)

            u.off(document.body,"touchmove")
            u.off(document.body,"touched")

        })
    })

   if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'mobile_date';

}
u.DateTimePicker.fn._timeMobileScroll = function(type){
   var year,month,day,template,datePage,titleDiv,dateDiv,weekSpans,language,tempDate, i,cell,ddheight;
    var self = this;
    type = type || 'current';
    if ('current' === type) {
        tempDate = this.pickerDate;
    } else if (type === 'preivous') {
        tempDate = u.date.sub(this.startDate,'d', 1);
    } else {
        tempDate = u.date.add(this.endDate,'d', 1);
    }
    this.startDate = this._getPickerStartDate(tempDate);
    this.endDate = this._getPickerEndDate(tempDate);

    language = u.core.getLanguages();

    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title"></div>',
        '<div class="u-date-content-panel"><div class="scroll-box"><div class="scroll-shadow"></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setHours" class="u-date-hour  u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setMinutes" class="u-date-minute u-scroll"></dl></div>',
        '<div class="scroll-touch"><div></div><dl time-change="setSeconds" class="u-date-second u-scroll"></dl></div>',
        '</div></div>'].join("");
    datePage = u.makeDOM(template);
    var srcollhour = datePage.querySelector('.u-date-hour');
    var srcollminute = datePage.querySelector('.u-date-minute');
    var srcollsecond = datePage.querySelector('.u-date-second');
    for(i = 0; i < 24; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+  (i<10? "0"+i:i) +'</dd>');

        if ( this.pickerDate.getHours() == i){
            u.addClass(cell, 'current');
            current_postion(srcollhour,i)
        }
        cell._value = i;
        srcollhour.appendChild(cell);
    }
    for(i = 0; i < 60; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (i<10? "0"+i:i) + '</dd>');

        if (this.pickerDate.getMinutes()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollminute,i)
        }
        cell._value = i;
        srcollminute.appendChild(cell);
    }
    for(i = 0; i < 60; i++){
        cell = u.makeDOM('<dd class="u-date-li">'+ (i<10? "0"+i:i) +'</dd>');

        if (this.pickerDate.getSeconds()  == i){
            u.addClass(cell, 'current');
            current_postion(srcollsecond,i)
        }
        cell._value = i;
        srcollsecond.appendChild(cell);
    }

    //current_postion(datePage)
    ddheight = 60
    u.on(datePage.querySelector(".scroll-shadow"),"touchstart",function(e){
         var tmpwidth = this.clientWidth
        var scrolltype,startp,offsetX ;

        startp = e.touches[0].pageY;
        offsetX = e.touches[0].pageX - this.getClientRects()[0].left
        if(offsetX < tmpwidth * 0.33){
            scrolltype = datePage.querySelector(".u-date-hour")
        }else if(tmpwidth * 0.33 < offsetX  && offsetX < tmpwidth * 0.66){
            scrolltype = datePage.querySelector(".u-date-minute")
        }else if(tmpwidth * 0.66 < offsetX){
            scrolltype = datePage.querySelector(".u-date-second")
        }
        u.on(document.body,"touchmove",function(e){
            var scrollrange = e.touches[0].pageY - startp
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])
            scrolltype.style.transform = "translateY("+(oldtrans + scrollrange)+"px)";
            startp = e.touches[0].pageY
        })
        var maxscroll = (scrolltype.querySelectorAll('dd').length - 3) * -ddheight
        u.on(document.body,"touchend",function(e){
            var oldtrans = parseInt(scrolltype.style.transform.match(/\((\S+)px\)/)[1])

            var remain = oldtrans-oldtrans%60

            if(remain > ddheight*2){
                remain = ddheight*2
            }else if(remain < maxscroll){
                remain = maxscroll
            }
            tmpdd = scrolltype.querySelectorAll("dd"),
            u.removeClass(scrolltype.querySelector(".current"),'current')
            u.addClass(tmpdd[2 - (remain/ddheight)],'current')
            scrolltype.style.transform = "translateY("+remain+"px)";
            scrollend_update(scrolltype,self)

            u.off(document.body,"touchmove")
            u.off(document.body,"touched")

        })
    })

   if (type === 'current'){
        this._zoomIn(datePage);
    }else if(type === 'next'){
        this._carousel(datePage, 'left');
    }else if(type === 'preivous'){
        this._carousel(datePage, 'right');
    }
    this.currentPanel = 'mobile_time';

}
function scrollend_update(scrolltype,self){
    var tmpmod =  scrolltype.getAttribute("time-change"),
        tmpcurrent = scrolltype.querySelector(".current");
    self.pickerDate[tmpmod](tmpcurrent._value)
    self._updateDate();

}
function current_postion(dom,i){
   dom.style.transform = "translateY("+(120-i*60)+"px)";
}
移动端渲染暂时和pc保持一致 end
*/
u.Time = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			u.addClass(this.element,'u-text');
			
			
	        u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
			
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

	u.Time.fn = u.Time.prototype;

	u.Time.fn.createPanel = function(){
		if(this.panelDiv)
			return;
		var oThis = this;
		this.panelDiv = u.makeDOM('<div class="u-combo-ul" style="padding:0px;"></div>');
		this.panelContentDiv = u.makeDOM('<div class="u-time-content"></div>');
		this.panelDiv.appendChild(this.panelContentDiv);
		this.panelHourDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelHourDiv);
		this.panelHourInput = u.makeDOM('<input class="u-time-input">');
		this.panelHourDiv.appendChild(this.panelHourInput);
		this.panelMinDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelMinDiv);
		this.panelMinInput = u.makeDOM('<input class="u-time-input">');
		this.panelMinDiv.appendChild(this.panelMinInput);
		this.panelSecDiv = u.makeDOM('<div class="u-time-cell"></div>');
		this.panelContentDiv.appendChild(this.panelSecDiv);
		this.panelSecInput = u.makeDOM('<input class="u-time-input">');
		this.panelSecDiv.appendChild(this.panelSecInput);
		this.panelNavDiv = u.makeDOM('<div class="u-time-nav"></div>');
		this.panelDiv.appendChild(this.panelNavDiv);
		this.panelOKButton = u.makeDOM('<button class="u-button" style="float:right;">OK</button>');
		this.panelNavDiv.appendChild(this.panelOKButton);
		u.on(this.panelOKButton,'click',function(){
			var v = oThis.panelHourInput.value + ':' + oThis.panelMinInput.value + ':' + oThis.panelSecInput.value;
			oThis.setValue(v);
			oThis.hide();
		})
		this.panelCancelButton = u.makeDOM('<button class="u-button" style="float:right;">Cancel</button>');
		this.panelNavDiv.appendChild(this.panelCancelButton);
		u.on(this.panelCancelButton,'click',function(){
			oThis.hide();
		})
		
		var d = new Date();
		this.panelHourInput.value = d.getHours() > 9? '' + d.getHours():'0' + d.getHours();
		this.panelMinInput.value = d.getMinutes() > 9? '' + d.getMinutes():'0' + d.getMinutes();	
		this.panelSecInput.value = d.getSeconds() > 9? '' + d.getSeconds():'0' + d.getSeconds();
		this.element.parentNode.appendChild(this.panelDiv);
	}
	
	u.Time.fn.setValue = function(value) {
		var hour = '',min = '', sec = '';
		value = value? value: '';
		if (value == this.input.value) return;
		if(value && value.indexOf(':') > -1){
			var vA = value.split(":");
			var hour = vA[0];
			hour = hour % 24;
			hour = hour > 9 ?'' + hour : '0' + hour;
			var min = vA[1];
			min = min % 60;
			min = min > 9 ?'' + min : '0' + min;
			var sec = vA[2];
			sec = sec % 60;
			sec = sec > 9 ?'' + sec : '0' + sec;
			
			value = hour + ':' + min + ':' + sec;
		}
		this.input.value = value;
		this.createPanel();
		
		this.panelHourInput.value = hour;
		this.panelMinInput.value = min;	
		this.panelSecInput.value = sec;
		this.trigger('valueChange', {value:value})
	}
	
	u.Time.fn.focusEvent = function() {
		var self = this;
		u.on(this.element,'click', function(e) {
			self.show(e);

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		});
	}
	
	//下拉图标的点击事件
	u.Time.fn.clickEvent = function() {
		var self = this;		
		var caret = this.element.nextSibling
		u.on(caret,'click',function(e) {
			self.show(e);
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		})
	}


	u.Time.fn.show = function(evt) {

		var inputValue = this.input.value;
		this.setValue(inputValue);
		
		var oThis = this;
		this.createPanel();
		
		/*因为元素可能变化位置，所以显示的时候需要重新计算*/
		this.width = this.element.offsetWidth;
		if(this.width < 300)
			this.width = 300;
		
		this.panelDiv.style.width = this.width + 'px';
		u.showPanelByEle({
            ele:this.input,
            panel:this.panelDiv,
            position:"bottomLeft"
        });
		this.panelDiv.style.zIndex = u.getZIndex();
        u.addClass(this.panelDiv, 'is-visible');

        document.body.onscroll = function(){
            u.showPanelByEle({
                ele:oThis.input,
                panel:oThis.panelDiv,
                position:"bottomLeft"
            });
        }
        
        var callback = function (e) {
            if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
            	u.off(document,'click',callback);
                // document.removeEventListener('click', callback);
                this.hide();
            }
        }.bind(this);
        u.on(document,'click',callback);
        // document.addEventListener('click', callback);
	}
	
	u.Time.fn.clickPanel = function(dom){
		while(dom){
			if(dom == this.panelDiv){
				return true
			}else{
				dom = dom.parentNode;
			}
		}
		return false;
	}

	u.Time.fn.hide = function() {
		u.removeClass(this.panelDiv, 'is-visible');
        this.panelDiv.style.zIndex = -1;
	}

	if (u.compMgr){
		u.compMgr.regComp({
			comp: u.Time,
			compAsString: 'u.Time',
			css: 'u-time'
		})
		if(u.isIE8){
			u.compMgr.regComp({
				comp: u.Time,
				compAsString: 'u.ClockPicker',
				css: 'u-clockpicker'
			})
		}
	}
	
	




u.YearMonth = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			//u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.year = d.getFullYear();
			this.startYear = this.year - this.year % 10 - 1;
			this.month = d.getMonth() + 1;
			
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.YearMonth.fn = u.YearMonth.prototype;

u.YearMonth.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillYear();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-date-panel" style="padding:0px;margin:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	// this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
    // this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
	this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button mini">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button mini">&gt;</button>');
    
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillYear();
	this.element.parentNode.appendChild(this.panelDiv);
}

/**
 *填充年份选择面板
 * @private
 */
u.YearMonth.fn._fillYear = function(type){
    var oldPanel,year,template,yearPage,titleDiv,yearDiv, i,cell;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
        this.panelContentDiv.removeChild(oldPanel);
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title"></div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    yearPage = u.makeDOM(template);
    titleDiv = yearPage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = (this.startYear) + '-' + (this.startYear + 11);
    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == this.year){
            u.addClass(cell, 'current');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    var oThis = this;
    u.on(yearDiv, 'click', function(e){
        var _y = e.target._value;
        oThis.year = _y;
        oThis._fillMonth();
        u.stopEvent(e);
    });
	
	this.preBtn.style.display = 'block';
	this.nextBtn.style.display = 'block';
	// this._zoomIn(yearPage);
	this.panelContentDiv.appendChild(yearPage);
	this.contentPage = yearPage;
    this.currentPanel = 'year';
};

/**
 * 填充月份选择面板
 * @private
 */
u.YearMonth.fn._fillMonth = function(){
    var oldPanel,template,monthPage,_month,cells,i;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	this.panelContentDiv.removeChild(oldPanel);
    _month = this.month;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">'+_month+'月</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    cells =monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month == i + 1){
            u.addClass(cells[i],'current');
        }
        cells[i]._value = i + 1;
        new URipple(cells[i]);
    }
    var oThis = this;
    u.on(monthPage, 'click', function(e){
        var _m = e.target._value;
        oThis.month = _m;
        monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
        oThis.setValue(oThis.year + '-' + oThis.month);
        oThis.hide();
    });
    
    this.preBtn.style.display = 'none';
	this.nextBtn.style.display = 'none';
	this._zoomIn(monthPage);
    this.currentPanel = 'month';
};


/**
 * 淡入动画效果
 * @private
 */
u.YearMonth.fn._zoomIn = function(newPage){
    if (!this.contentPage){
        this.panelContentDiv.appendChild(newPage);
        this.contentPage = newPage;
        return;
    }
    u.addClass(newPage, 'zoom-in');
    this.panelContentDiv.appendChild(newPage);
    if(u.isIE8){
        this.contentPage = newPage;
    }else{
        var cleanup = function() {
            newPage.removeEventListener('transitionend', cleanup);
            newPage.removeEventListener('webkitTransitionEnd', cleanup);
            // this.panelContentDiv.removeChild(this.contentPage);
            this.contentPage = newPage;
        }.bind(this);
        if (this.contentPage){
            newPage.addEventListener('transitionend', cleanup);
            newPage.addEventListener('webkitTransitionEnd', cleanup);
        }
        window.requestAnimationFrame(function() {
                u.addClass(this.contentPage, 'is-hidden');
                u.removeClass(newPage, 'zoom-in');
        }.bind(this));
    }
    
};


u.YearMonth.fn.setValue = function(value) {
	value = value? value: '';
	if(value && value.indexOf('-') > -1){
		var vA = value.split("-");
		this.year = vA[0];
		var month = vA[1];
		this.month = month % 12;
		if(this.month == 0)
			this.month = 12;
	
		value = this.year + '-' + this.month;
	}
	this.value = value;
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.YearMonth.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.YearMonth.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.YearMonth.fn.show = function(evt) {
	var oThis = this;
	if(this.value && this.value.indexOf('-') > -1){
		var vA = this.value.split("-");
		this.year = vA[0];
		var month = vA[1];
		this.month = month % 12;
		if(this.month == 0)
			this.month = 12;
	}
	this.createPanel();
	/*因为元素可能变化位置，所以显示的时候需要重新计算*/
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    
	this.panelDiv.style.width = this.width + 'px';
	u.showPanelByEle({
            ele:this.input,
            panel:this.panelDiv,
            position:"bottomLeft"
        });

     document.body.onscroll = function(){
        u.showPanelByEle({
            ele:oThis.input,
            panel:oThis.panelDiv,
            position:"bottomLeft"
        });
    }
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
    var oThis = this;
    var callback = function (e) {
        if (e !== evt && e.target !== oThis.input && !oThis.clickPanel(e.target)) {
            // document.removeEventListener('click', callback);
            u.off(document,'click',callback);
        	oThis.hide();
    	}
    };
    u.on(document,'click',callback);
    // document.addEventListener('click', callback);
}

u.YearMonth.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.YearMonth.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.YearMonth,
	compAsString: 'u.YearMonth',
	css: 'u-yearmonth'
})


u.Year = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			//u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.year = d.getFullYear();
			this.defaultYear = this.year;
			this.startYear = this.year - this.year % 10 - 1;
		
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.Year.fn = u.Year.prototype;

u.Year.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillYear();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-date-panel" style="padding:0px;margin:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	// this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
 //    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
    this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button mini">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button mini">&gt;</button>');
	
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillYear();
	this.element.parentNode.appendChild(this.panelDiv);
}

/**
 *填充年份选择面板
 * @private
 */
u.Year.fn._fillYear = function(type){
    var oldPanel,year,template,yearPage,titleDiv,yearDiv, i,cell;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	this.panelContentDiv.removeChild(oldPanel);
    template = ['<div class="u-date-content-page">',
                    '<div class="u-date-content-title"></div>',
                    '<div class="u-date-content-panel"></div>',
                '</div>'].join("");
    yearPage = u.makeDOM(template);
    titleDiv = yearPage.querySelector('.u-date-content-title');
    titleDiv.innerHTML = (this.startYear) + '-' + (this.startYear + 11);
    yearDiv = yearPage.querySelector('.u-date-content-panel');
    for(i = 0; i < 12; i++){
        cell = u.makeDOM('<div class="u-date-content-year-cell">'+ (this.startYear + i) +'</div>');
        new URipple(cell);
        if (this.startYear + i == this.year){
            u.addClass(cell, 'current');
        }
        cell._value = this.startYear + i;
        yearDiv.appendChild(cell);
    }
    u.on(yearDiv, 'click', function(e){
        var _y = e.target._value;
        this.year = _y;
        this.setValue(_y);
        this.hide();
        u.stopEvent(e);
    }.bind(this));
	
	this.preBtn.style.display = 'block';
	this.nextBtn.style.display = 'block';
	this.panelContentDiv.appendChild(yearPage);
	
    this.currentPanel = 'year';
};

u.Year.fn.setValue = function(value) {
	value = value? value: '';
	this.value = value;
	if(value){
		this.year = value;
	}else{
		this.year = this.defaultYear;
	}
	this.startYear = this.year - this.year % 10 - 1;
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.Year.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.Year.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.Year.fn.show = function(evt) {
	var oThis = this;
	this.createPanel();
	
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    
	this.panelDiv.style.width = 152 + 'px';
	u.showPanelByEle({
            ele:this.input,
            panel:this.panelDiv,
            position:"bottomLeft"
        });
    document.body.onscroll = function(){
        u.showPanelByEle({
            ele:oThis.input,
            panel:oThis.panelDiv,
            position:"bottomLeft"
        });
    }
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
        
    var callback = function (e) {
        if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
        	u.off(document,'click',callback);
            // document.removeEventListener('click', callback);
        	this.hide();
    	}
    }.bind(this);
    u.on(document,'click',callback);
    // document.addEventListener('click', callback);
}

u.Year.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.Year.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.Year,
	compAsString: 'u.Year',
	css: 'u-year'
})


u.Month = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			//u.addClass(this.element,'u-text');
			
			var d = new Date();
			this.month = d.getMonth() + 1;
			this.defaultMonth = this.month;
			
			u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
	        
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

u.Month.fn = u.Month.prototype;

u.Month.fn.createPanel = function(){
	if(this.panelDiv){
		this._fillMonth();
		return;
	}
	var oThis = this;
	this.panelDiv = u.makeDOM('<div class="u-date-panel" style="padding:0px;margin:0px;"></div>');
	this.panelContentDiv = u.makeDOM('<div class="u-date-content"></div>');
	this.panelDiv.appendChild(this.panelContentDiv);
	
	this.preBtn = u.makeDOM('<button class="u-date-pre-button u-button flat floating mini" style="display:none;">&lt;</button>');
    this.nextBtn = u.makeDOM('<button class="u-date-next-button u-button flat floating mini" style="display:none;">&gt;</button>');
	
	u.on(this.preBtn, 'click', function(e){
        oThis.startYear -= 10;
        oThis._fillYear();
    });
    u.on(this.nextBtn, 'click', function(e){
        oThis.startYear += 10;
        oThis._fillYear();
    });
    this.panelContentDiv.appendChild(this.preBtn);
    this.panelContentDiv.appendChild(this.nextBtn);
    this._fillMonth();
	this.element.parentNode.appendChild(this.panelDiv);
}


/**
 * 填充月份选择面板
 * @private
 */
u.Month.fn._fillMonth = function(){
    var oldPanel,template,monthPage,_month,cells,i;
    oldPanel = this.panelContentDiv.querySelector('.u-date-content-page');
    if(oldPanel)
    	this.panelContentDiv.removeChild(oldPanel);
    _month = this.month;
    template = ['<div class="u-date-content-page">',
        '<div class="u-date-content-title">'+_month+'月</div>',
        '<div class="u-date-content-panel">',
            '<div class="u-date-content-year-cell">1月</div>',
            '<div class="u-date-content-year-cell">2月</div>',
            '<div class="u-date-content-year-cell">3月</div>',
            '<div class="u-date-content-year-cell">4月</div>',
            '<div class="u-date-content-year-cell">5月</div>',
            '<div class="u-date-content-year-cell">6月</div>',
            '<div class="u-date-content-year-cell">7月</div>',
            '<div class="u-date-content-year-cell">8月</div>',
            '<div class="u-date-content-year-cell">9月</div>',
            '<div class="u-date-content-year-cell">10月</div>',
            '<div class="u-date-content-year-cell">11月</div>',
            '<div class="u-date-content-year-cell">12月</div>',
        '</div>',
        '</div>'].join("");

    monthPage = u.makeDOM(template);
    cells =monthPage.querySelectorAll('.u-date-content-year-cell');
    for (i = 0; i < cells.length; i++){
        if (_month == i + 1){
            u.addClass(cells[i],'current');
        }
        cells[i]._value = i + 1;
        new URipple(cells[i]);
    }
    u.on(monthPage, 'click', function(e){
        var _m = e.target._value;
        this.month = _m;
        monthPage.querySelector('.u-date-content-title').innerHTML = _m + '月';
        this.setValue(_m);
        this.hide();
    }.bind(this));
    
    this.preBtn.style.display = 'none';
	this.nextBtn.style.display = 'none';
    this.panelContentDiv.appendChild(monthPage);
    this.currentPanel = 'month';
};




u.Month.fn.setValue = function(value) {
	value = value? value: '';
	this.value = value;
	if(value){
		this.month = value;
	}else{
		this.month = this.defaultMonth;
	}
	this.input.value = value;
	this.trigger('valueChange', {value:value})
}

u.Month.fn.focusEvent = function() {
	var self = this;
	u.on(this.element,'click', function(e) {
		self.show(e);

		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	});
}

//下拉图标的点击事件
u.Month.fn.clickEvent = function() {
	var self = this;		
	var caret = this.element.nextSibling
	u.on(caret,'click',function(e) {
		self.show(e);
		if (e.stopPropagation) {
			e.stopPropagation();
		} else {
			e.cancelBubble = true;
		}

	})
}


u.Month.fn.show = function(evt) {
	var oThis = this;
	this.createPanel();
	
	this.width = this.element.offsetWidth;
	if(this.width < 300)
		this.width = 300;
    u.showPanelByEle({
            ele:this.input,
            panel:this.panelDiv,
            position:"bottomLeft"
        });
    document.body.onscroll = function(){
        u.showPanelByEle({
            ele:oThis.input,
            panel:oThis.panelDiv,
            position:"bottomLeft"
        });
    }
	this.panelDiv.style.width = 152 + 'px';
	this.panelDiv.style.zIndex = u.getZIndex();
    u.addClass(this.panelDiv, 'is-visible');
        
    var callback = function (e) {
        if (e !== evt && e.target !== this.input && !oThis.clickPanel(e.target)) {
        	u.off(document,'click',callback);
            // document.removeEventListener('click', callback);
        	this.hide();
    	}
    }.bind(this);
    u.on(document,'click',callback);
    // document.addEventListener('click', callback);
}

u.Month.fn.clickPanel = function(dom){
	while(dom){
		if(dom == this.panelDiv){
			return true
		}else{
			dom = dom.parentNode;
		}
	}
	return false;
}

u.Month.fn.hide = function() {
	u.removeClass(this.panelDiv, 'is-visible');
    this.panelDiv.style.zIndex = -1;
}

if (u.compMgr)

u.compMgr.regComp({
	comp: u.Month,
	compAsString: 'u.Month',
	css: 'u-month'
})


u.ClockPicker = u.BaseComponent.extend({
		DEFAULTS : {
		},
		init:function(){
			var self = this;			 
			var element = this.element;
			this.options = u.extend({}, this.DEFAULTS, this.options);
			this.format = this.options['format'] || u.core.getMaskerMeta('time').format;
			this.panelDiv = null;
			this.input = this.element.querySelector("input");
			if(u.isMobile){
				this.input.setAttribute('readonly', 'readonly')
			}
			u.addClass(this.element,'u-text');
			
			this.template = '<div class="u-clock-ul popover clockpicker-popover" style="padding:0px;">';
			this.template += '<div class="popover-title"><button class="u-button u-date-clean u-clock-clean" >清空</button><span class="clockpicker-span-hours">02</span> : <span class="clockpicker-span-minutes text-primary">01</span><span class="clockpicker-span-am-pm"></span></div>';
			this.template += '<div class="popover-content">';
			this.template += '	<div class="clockpicker-plate">';
			this.template += '		<div class="clockpicker-canvas">';
			this.template += '			<svg class="clockpicker-svg">';
			this.template += '				<g transform="translate(100,100)">';
			this.template += '					<circle class="clockpicker-canvas-bg clockpicker-canvas-bg-trans" r="13" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
			this.template += '					<circle class="clockpicker-canvas-fg" r="3.5" cx="8.362277061412277" cy="-79.56175162946187"></circle>';
			this.template += '					<line x1="0" y1="0" x2="8.362277061412277" y2="-79.56175162946187"></line>';
			this.template += '					<circle class="clockpicker-canvas-bearing" cx="0" cy="0" r="2"></circle>';
			this.template += '				</g>';
			this.template += '			</svg>';
			this.template += '		</div>';
			this.template += '		<div class="clockpicker-dial clockpicker-hours" style="visibility: visible;">';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-1" >00</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-2" >1</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-3" >2</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-4" >3</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-5" >4</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-6" >5</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-7" >6</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-8" >7</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-9" >8</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-10" >9</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-11" >10</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-12" >11</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-13" >12</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-14" >13</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-15" >14</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-16" >15</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-17" >16</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-18" >17</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-19" >18</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-20" >19</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-21" >20</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-22" >21</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-23" >22</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-24" >23</div>';
			this.template += '		</div>';
			this.template += '		<div class="clockpicker-dial clockpicker-minutes" style="visibility: hidden;">';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-25" >00</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-26" >05</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-27" >10</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-28" >15</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-29" >20</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-30" >25</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-31" >30</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-32" >35</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-33" >40</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-34" >45</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-35" >50</div>';
			this.template += '			<div class="clockpicker-tick clockpicker-tick-36" >55</div>';
			this.template += '		</div>';
			this.template += '	</div><span class="clockpicker-am-pm-block"></span></div>';
			this.template += '	</div>';
	        u.on(this.input, 'blur',function(e){
	        	this.setValue(this.input.value);
	        }.bind(this));
			
			var d = new Date();
			this.defaultHour = d.getHours() > 9? '' + d.getHours():'0' + d.getHours();
			this.defaultMin = d.getMinutes() > 9? '' + d.getMinutes():'0' + d.getMinutes();	
			this.defaultSec = d.getSeconds() > 9? '' + d.getSeconds():'0' + d.getSeconds();
			
			this.hours = this.defaultHour;
			this.min = this.defaultMin;
			this.sec = this.defaultSec;
			// 添加focus事件
			this.focusEvent();
			// 添加右侧图标click事件
			this.clickEvent();
		}
	})

	

	u.ClockPicker.fn = u.ClockPicker.prototype;

	/**
 * 淡入动画效果
 * @private
 */
u.ClockPicker.fn._zoomIn = function(newPage){
	
     u.addClass(newPage, 'zoom-in');
    
    var cleanup = function() {
    	u.off(newPage,'transitionend', cleanup);
    	u.off(newPage,'webkitTransitionEnd', cleanup);
        // this.panelContentDiv.removeChild(this.contentPage);
        this.contentPage = newPage;
    }.bind(this);
    if (this.contentPage){
    	u.on(newPage,'transitionend', cleanup);
    	u.on(newPage,'webkitTransitionEnd', cleanup);
    }
    setTimeout(function(){
    	newPage.style.visibility = 'visible';
    	u.removeClass(newPage, 'zoom-in');
    },150)
};

	u.ClockPicker.fn.createPanel = function(){
		if(this.panelDiv)
			return;
		var oThis = this;
		this.panelDiv = u.makeDOM(this.template);
		
		this.hand = this.panelDiv.querySelector('line');
		this.bg = this.panelDiv.querySelector('.clockpicker-canvas-bg');
		this.fg = this.panelDiv.querySelector('.clockpicker-canvas-fg');
		this.titleHourSpan = this.panelDiv.querySelector('.clockpicker-span-hours');
		this.titleMinSpan = this.panelDiv.querySelector('.clockpicker-span-minutes');
		this.hourDiv = this.panelDiv.querySelector('.clockpicker-hours');
		this.minDiv = this.panelDiv.querySelector('.clockpicker-minutes');
		this.btnClean = this.panelDiv.querySelector('.u-date-clean');
		if(!u.isMobile)
			this.btnClean.style.display = 'none';
		this.currentView = 'hours';
		u.on(this.hourDiv,'click',function(e){
			var target = e.target;
			if(u.hasClass(target,'clockpicker-tick')){
				this.hours = target.innerHTML;
				this.hours = this.hours > 9 || this.hours == 0? '' + this.hours:'0' + this.hours;
				this.titleHourSpan.innerHTML = this.hours;
				this.hourDiv.style.visibility = 'hidden';
				// this.minDiv.style.visibility = 'visible';
				this._zoomIn(this.minDiv)
				this.currentView = 'min';
				this.setHand();
			}
		}.bind(this));
		
		u.on(this.minDiv,'click',function(e){
			var target = e.target;
			if(u.hasClass(target,'clockpicker-tick')){
				this.min = target.innerHTML;
				// this.min = this.min > 9 || this.min == 00? '' + this.min:'0' + this.min;
				this.titleMinSpan.innerHTML = this.min;
				this.minDiv.style.visibility = 'hidden';
				this.hourDiv.style.visibility = 'visible';
				this.currentView = 'hours';
				var v = this.hours + ':' + this.min + ':' + this.sec;
				this.setValue(v);
				this.hide();
			}
		}.bind(this));

		u.on(this.btnClean,'click',function(e){
			this.setValue("");
			this.hide();
		}.bind(this));
		
		document.body.appendChild(this.panelDiv);
	}
	
	u.ClockPicker.fn.setHand = function(){
		var dialRadius = 100,
		innerRadius = 54,
		outerRadius = 80;
		var view = this.currentView,
			value = this[view],
			isHours = view === 'hours',
			unit = Math.PI / (isHours ? 6 : 30),
			radian = value * unit,
			radius = isHours && value > 0 && value < 13 ? innerRadius : outerRadius,
			x = Math.sin(radian) * radius,
			y = - Math.cos(radian) * radius;
			this.setHandFun(x,y);
	}
	
	u.ClockPicker.fn.setHandFun = function(x,y,roundBy5,dragging){
		var dialRadius = 100,
		innerRadius = 54,
		outerRadius = 80;
		
		var radian = Math.atan2(x, - y),
			isHours = this.currentView === 'hours',
			unit = Math.PI / (isHours ? 6 : 30),
			z = Math.sqrt(x * x + y * y),
			options = this.options,
			inner = isHours && z < (outerRadius + innerRadius) / 2,
			radius = inner ? innerRadius : outerRadius,
			value;
			
			if (this.twelvehour) {
				radius = outerRadius;
			}

		// Radian should in range [0, 2PI]
		if (radian < 0) {
			radian = Math.PI * 2 + radian;
		}

		// Get the round value
		value = Math.round(radian / unit);

		// Get the round radian
		radian = value * unit;

		// Correct the hours or minutes
		if (options.twelvehour) {
			if (isHours) {
				if (value === 0) {
					value = 12;
				}
			} else {
				if (roundBy5) {
					value *= 5;
				}
				if (value === 60) {
					value = 0;
				}
			}
	   } else {
			if (isHours) {
				if (value === 12) {
					value = 0;
				}
				value = inner ? (value === 0 ? 12 : value) : value === 0 ? 0 : value + 12;
			} else {
				if (roundBy5) {
					value *= 5;
				}
				if (value === 60) {
					value = 0;
				}
			}
		}
		
		// Set clock hand and others' position
		var w = this.panelDiv.querySelector('.clockpicker-plate').offsetWidth;
		var u = w / 200;
		var cx = Math.sin(radian) * radius * u,
			cy = - Math.cos(radian) * radius * u;
		var iu = 100 * u;
		this.panelDiv.querySelector('g').setAttribute('transform','translate(' + iu + ',' + iu + ')');

		this.hand.setAttribute('x2', cx);
		this.hand.setAttribute('y2', cy);
		this.bg.setAttribute('cx', cx);
		this.bg.setAttribute('cy', cy);
		this.fg.setAttribute('cx', cx);
		this.fg.setAttribute('cy', cy);
	}
	
	u.ClockPicker.fn.setValue = function(value) {
		value = value? value: '';

		if(value == ''){
			this.input.value =  '';
		
			this.trigger('valueChange', {value:''})
			return;
		}


		if(value && value.indexOf(':') > -1){
			var vA = value.split(":");
			var hour = vA[0];
			hour = hour % 24;
			this.hours = hour > 9 ?'' + hour : '0' + hour;
			var min = vA[1];
			min = min % 60;
			this.min = min > 9 ?'' + min : '0' + min;
			var sec = vA[2] || 0;
			sec = sec % 60;
			this.sec = sec > 9 ?'' + sec : '0' + sec;
			
			value = this.hours + ':' + this.min + ':' + this.sec;
		}else{
			this.hours = this.defaultHour;
			this.min = this.defaultMin;
			this.sec = this.defaultSec;
		}
		var _date = new Date();
		_date.setHours(this.hours);
		_date.setMinutes(this.min);
		_date.setSeconds(this.sec);
		var showValue = u.date.format(_date,this.format);
		this.input.value =  showValue;
		
		this.trigger('valueChange', {value:value})
	}
	
	u.ClockPicker.fn.focusEvent = function() {
		var self = this;
		u.on(this.element,'click', function(e) {
			self.show(e);

			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		});
	}
	
	//下拉图标的点击事件
	u.ClockPicker.fn.clickEvent = function() {
		var self = this;		
		var caret = this.element.nextSibling
		u.on(caret,'click',function(e) {
			self.show(e);
			if (e.stopPropagation) {
				e.stopPropagation();
			} else {
				e.cancelBubble = true;
			}

		})
	}


	u.ClockPicker.fn.show = function(evt) {

		var inputValue = this.input.value;
		this.setValue(inputValue);
		
		var self = this;
		this.createPanel();
		this.minDiv.style.visibility = 'hidden';
		this.hourDiv.style.visibility = 'visible';
		this.currentView = 'hours';
		this.titleHourSpan.innerHTML = this.hours;
		this.titleMinSpan.innerHTML = this.min;
		
		/*因为元素可能变化位置，所以显示的时候需要重新计算*/
		if(u.isMobile){
			this.panelDiv.style.position = 'fixed';
			this.panelDiv.style.top = '20%';
			var screenW = document.body.clientWidth;
			var l = (screenW - 226) / 2
			this.panelDiv.style.left = l + 'px';
        	this.overlayDiv = u.makeModal(this.panelDiv);
        	u.on(this.overlayDiv, 'click', function(){
		       self.hide();
		    })
        }else{
	        u.showPanelByEle({
	            ele:this.input,
	            panel:this.panelDiv,
	            position:"bottomLeft"
	        });
		    document.body.onscroll = function(){
		        u.showPanelByEle({
		            ele:self.input,
		            panel:self.panelDiv,
		            position:"bottomLeft"
		        });
		    }  
        }
        
		this.panelDiv.style.zIndex = u.getZIndex();
        u.addClass(this.panelDiv, 'is-visible');
        
   		this.setHand();
        
        var callback = function (e) {
            if (e !== evt && e.target !== this.input && !self.clickPanel(e.target)) {
            	u.off(document,'click', callback);
                this.hide();
            }
        }.bind(this);
        u.on(document,'click', callback);


	}
	
	u.ClockPicker.fn.clickPanel = function(dom){
		while(dom){
			if(dom == this.panelDiv){
				return true
			}else{
				dom = dom.parentNode;
			}
		}
		return false;
	}

	u.ClockPicker.fn.hide = function() {
		u.removeClass(this.panelDiv, 'is-visible');
        this.panelDiv.style.zIndex = -1;
        if(this.overlayDiv){
        	try{
        		document.body.removeChild(this.overlayDiv);	
        	}catch(e){
        		
        	}
        	
        }
	}

	if (u.compMgr)
	
	if(!u.isIE8){
		u.compMgr.regComp({
			comp: u.ClockPicker,
			compAsString: 'u.ClockPicker',
			css: 'u-clockpicker'
		})
	}
	

