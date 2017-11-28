Ext.define('Ext.picker.DateTime', {
    extend: 'Ext.Component',
    requires: [
        'Ext.XTemplate',
        'Ext.button.Button',
        'Ext.button.Split',
        'Ext.util.ClickRepeater',
        'Ext.util.KeyNav',
        'Ext.EventObject',
        'Ext.fx.Manager',
        'Ext.picker.Month'
    ],
    alias: 'widget.datetimepicker',
    alternateClassName: 'Ext.DateTimePicker',

    childEls: [
        'innerEl', 'eventEl', 'prevEl', 'nextEl', 'middleBtnEl', 'footerEl'
    ],
    
    border: true,

    renderTpl: [
        '<div id="{id}-innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>',
            '</div>',
            '<table id="{id}-eventEl" class="{baseCls}-inner" cellspacing="0" role="presentation">',
                '<thead role="presentation"><tr role="presentation">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="presentation">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            '<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">',
                                '<em role="presentation"><span role="presentation"></span></em>',
                            '</a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<tpl if="showTimer">',
            '<table cellspacing="0" class="x-datepicker-footer" width="100%">' ,
				'<tr>' , 
				'<td class="y-hour-left">',
        			'<a href="#" title="', this.prevHourText, '">&#160;</a>',
    			'</td>',
    			'<td class="y-hour-middle" align="center">',
    			'</td>',
    			'<td class="y-hour-right">',
                	'<a href="#" title="', this.nextHourText, '">&#160;</a>',
               	'</td>',
               	'<td>&nbsp;:</td>',
                '<td class="y-minute-left">',
                    '<a href="#" title="', this.prevMinuteText, '">&#160;</a>',
                '</td>',
                '<td class="y-minute-middle" align="center">',
                '</td>',
                '<td class="y-minute-right">',
                    '<a href="#" title="', this.nextMinuteText, '">&#160;</a>',
                '</td>',
                '<td>&nbsp;:</td>',
                '<td class="y-second-left">',
                    '<a href="#" title="', this.prevMinuteText, '">&#160;</a>',
                '</td>',
                '<td class="y-second-middle" align="center">',
                '</td>',
                '<td class="y-second-right">',
                    '<a href="#" title="', this.nextMinuteText, '">&#160;</a>',
                '</td>',
                '</tr>',
        	'</table>',
        	'<div id="hour-mp" class="x-monthpicker"></div><div id="minute-mp" class="x-monthpicker"></div><div id="second-mp" class="x-monthpicker"></div>',
        	'</tpl>',
            '<tpl if="showToday">',
//                '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">' ,
//	            	'{%this.renderTodayBtn(values, out)%}' ,
//                '</div>',
            
             '<div id="{id}-footerEl" class="{baseCls}-footer">{%',
                'var me=values.$comp, todayBtn=me.todayBtn, sureBtn=me.sureBtn;',
                'todayBtn.ownerLayout = sureBtn.ownerLayout = me.componentLayout;',
                'todayBtn.ownerCt = sureBtn.ownerCt = me;',
                'Ext.DomHelper.generateMarkup(todayBtn.getRenderTree(), out);',
                'Ext.DomHelper.generateMarkup(sureBtn.getRenderTree(), out);',
            '%}</div>',
            
            
            '</tpl>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.picker.DateTime.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],

    
    
    todayText : '现在',
    
    sureText:'确定',
    
    stringDate : true,
    
    showTimer : true,
    
    hourText : '选择小时',
    
    ariaTitle: 'Date Picker: {0}',
    
    ariaTitleDateFormat: 'F d, Y',
    
    todayTip : '{0} (Spacebar)',
    
    sureTip : '{0} (Spacebar)',
    
    minText : 'This date is before the minimum date',
    
    maxText : 'This date is after the maximum date',
    
    disabledDaysText : 'Disabled',
    
    disabledDatesText : 'Disabled',
    
    nextText : 'Next Month (Control+Right)',
    
    prevText : 'Previous Month (Control+Left)',
    
    monthYearText : 'Choose a month (Control+Up/Down to move years)',
    
    monthYearFormat: 'F Y',
    
    startDay : 0,
    
    showToday : true,
    
    disableAnim: false,

    baseCls: Ext.baseCSSPrefix + 'datepicker',

    longDayFormat: 'F d, Y',
    
    focusOnShow: false,

    focusOnSelect: true,

    width: 178,

    initHour: 12, 

    numDays: 42,
    
    field:null,

    initComponent : function() {
        var me = this,
            clearTime = Ext.Date.clearTime;
		
        me.selectedCls = me.baseCls + '-selected';
        me.disabledCellCls = me.baseCls + '-disabled';
        me.prevCls = me.baseCls + '-prevday';
        me.activeCls = me.baseCls + '-active';
        me.nextCls = me.baseCls + '-prevday';
        me.todayCls = me.baseCls + '-today';
        me.dayNames = me.dayNames.slice(me.startDay).concat(me.dayNames.slice(0, me.startDay));
        me.listeners = Ext.apply(me.listeners||{}, {
            mousewheel: {
                element: 'eventEl',
                fn: me.handleMouseWheel,
                scope: me
            },
            click: {
                element: 'eventEl',
                fn: me.handleDateClick, 
                scope: me,
                delegate: 'a.' + me.baseCls + '-date'
            }
        });
        this.callParent();
		if (this.showTimer){
			me.value = new Date();
		}else{
	        me.value = me.value ?
	                 clearTime(me.value, true) : clearTime(new Date());
		}

        me.addEvents(
            
            'select'
        );

        me.initDisabledDays();
    },

    beforeRender: function () {
        
        var me = this,
            days = new Array(me.numDays),
            today = Ext.Date.format(new Date(), me.format);

        me.monthBtn = new Ext.button.Split({
            ownerCt: me,
            ownerLayout: me.getComponentLayout(),
            text: '',
            tooltip: me.monthYearText,
            listeners: {
                click: me.showMonthPicker,
                arrowclick: me.showMonthPicker,
                scope: me
            }
        });

        if (this.showToday) {
            me.todayBtn = new Ext.button.Button({
                ownerCt: me,
                ownerLayout: me.getComponentLayout(),
                text: Ext.String.format(me.todayText, today),
                tooltip: Ext.String.format(me.todayTip, today),
                handler: me.selectToday,
                scope: me
            });
            
            me.sureBtn = new Ext.button.Button({
                ownerCt: me,
                ownerLayout: me.getComponentLayout(),
                text: Ext.String.format(me.sureText, today),
                tooltip: Ext.String.format(me.sureTip, today),
                handler: function(){
            		 me.fireEvent('select', me, me.value);
                },
                scope: me
            });
            
        }

        me.callParent();

        Ext.applyIf(me, {
            renderData: {}
        });

        Ext.apply(me.renderData, {
            dayNames: me.dayNames,
            showToday: me.showToday,
            prevText: me.prevText,
            nextText: me.nextText,
            days: days,
            showTimer:me.showTimer
        });
    },

    
    
    finishRenderChildren: function () {
        var me = this;
        
        me.callParent();
        me.monthBtn.finishRender();
        if (me.showToday) {
            me.todayBtn.finishRender();
            me.sureBtn.finishRender();
        }
    },

    
    onRender : function(container, position){
    	var me = this;
        if (this.showTimer){
			this.hourLabel = this.el.child("div td.y-hour-middle");
			this.minuteLabel = this.el.child("div td.y-minute-middle");
			this.secondLabel = this.el.child("div td.y-second-middle");
			
			var c = new Date();
			this.theHours = c.getHours();
			this.theMinutes = c.getMinutes();
			this.theSeconds = c.getSeconds();
			
			if (this.theHours < 10) {
				txt = "0" + this.theHours
			} else {
				txt = this.theHours
			}
			this.hourLabel.update(txt);  // + this.hourName
			
			if (this.theMinutes < 10) {
				txt = "0" + this.theMinutes
			} else {
				txt = this.theMinutes
			}
			this.minuteLabel.update(txt);  // + this.minuteName
			
			if (this.theSeconds < 10) {
				txt = "0" + this.theSeconds
			} else {
				txt = this.theSeconds
			}
			this.secondLabel.update(txt);  // + this.secondName
			
			this.setAllValue();
			
			this.hoursPicker = Ext.get("hour-mp");
			this.hoursPicker.enableDisplayMode("block");
			
			this.minutesPicker = Ext.get("minute-mp");
			this.minutesPicker.enableDisplayMode("block");
			
			this.secondPicker = Ext.get("second-mp");
			this.secondPicker.enableDisplayMode("block");
        }
        me.callParent(arguments);
        me.el.unselectable();
        me.cells = me.eventEl.select('tbody td');
        me.textNodes = me.eventEl.query('tbody td span');
        
        
    },

    
    initEvents: function(){
        var me = this,
            eDate = Ext.Date,
            day = eDate.DAY;

        me.callParent();

        me.prevRepeater = new Ext.util.ClickRepeater(me.prevEl, {
            handler: me.showPrevMonth,
            scope: me,
            preventDefault: true,
            stopDefault: true
        });

        me.nextRepeater = new Ext.util.ClickRepeater(me.nextEl, {
            handler: me.showNextMonth,
            scope: me,
            preventDefault:true,
            stopDefault:true
        });
/*----------------------------------------------------------------------------------------*/
        if (this.showTimer){
	        me.prevHourRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-hour-left a"), {
				handler: function() {
					if (this.theHours > 0) {
						this.theHours--;
						this.theHours = this.theHours % 24;
						var d = "";
						if (this.theHours < 10) {
							d = "0" + this.theHours
						} else {
							d = this.theHours
						}
						this.hourLabel.update(d);
						this.setAllValue();				
					}
				},
				scope: this
			});
			me.nextHourRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-hour-right a"), {
				handler: function() {
					this.theHours++;
					this.theHours = this.theHours % 24;
					var d = "";
					if (this.theHours < 10) {
						d = "0" + this.theHours
					} else {
						d = this.theHours
					}
					this.hourLabel.update(d)
					this.setAllValue();
				},
				scope: this
			});
			me.prevMinuteRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-minute-left a"), {
				handler: function() {
					if (this.theMinutes > 0) {
						this.theMinutes--;
						this.theMinutes = this.theMinutes % 60;
						var d = "";
						if (this.theMinutes < 10) {
							d = "0" + this.theMinutes
						} else {
							d = this.theMinutes
						}
						this.minuteLabel.update(d)
						this.setAllValue();
					}
				},
				scope: this
			});
			me.nextMinuteRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-minute-right a"), {
				handler: function() {
					this.theMinutes++;
					this.theMinutes = this.theMinutes % 60;
					var d = "";
					if (this.theMinutes < 10) {
						d = "0" + this.theMinutes
					} else {
						d = this.theMinutes
					}
					this.minuteLabel.update(d)
					this.setAllValue();
				},
				scope: this
			});
			
			me.prevSecondRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-second-left a"), {
				handler: function() {
					if (this.theSeconds > 0) {
						this.theSeconds--;
						this.theSeconds = this.theSeconds % 60;
						var d = "";
						if (this.theSeconds < 10) {
							d = "0" + this.theSeconds
						} else {
							d = this.theSeconds
						}
						this.secondLabel.update(d)
						this.setAllValue();
					}
				},
				scope: this
			});
			me.nextSecondRepeater = new Ext.util.ClickRepeater(this.el.child("div td.y-second-right a"), {
				handler: function() {
					this.theSeconds++;
					this.theSeconds = this.theSeconds % 60;
					var d = "";
					if (this.theSeconds < 10) {
						d = "0" + this.theSeconds
					} else {
						d = this.theSeconds
					}
					this.secondLabel.update(d)
					this.setAllValue();
				},
				scope: this
			});
			this.hourLabel.on("click", this.showHoursPicker, this);
			
			this.minuteLabel.on("click", this.showMinutesPicker, this);
			
			this.secondLabel.on("click", this.showSecondsPicker, this);
		}
/*----------------------------------------------------------------------------------------*/
        me.keyNav = new Ext.util.KeyNav(me.eventEl, Ext.apply({
            scope: me,
            left : function(e){
                if(e.ctrlKey){
                    me.showPrevMonth();
                }else{
                    me.update(eDate.add(me.activeDate, day, -1));
                }
            },

            right : function(e){
                if(e.ctrlKey){
                    me.showNextMonth();
                }else{
                    me.update(eDate.add(me.activeDate, day, 1));
                }
            },

            up : function(e){
                if(e.ctrlKey){
                    me.showNextYear();
                }else{
                    me.update(eDate.add(me.activeDate, day, -7));
                }
            },

            down : function(e){
                if(e.ctrlKey){
                    me.showPrevYear();
                }else{
                    me.update(eDate.add(me.activeDate, day, 7));
                }
            },
            pageUp : me.showNextMonth,
            pageDown : me.showPrevMonth,
            enter : function(e){
                e.stopPropagation();
                return true;
            }
        }, me.keyNavConfig));

        if (me.showToday) {
            me.todayKeyListener = me.eventEl.addKeyListener(Ext.EventObject.SPACE, me.selectToday,  me);
        }
        me.update(me.value);
    },
/*------------------------------时间部分的事件-------------------------------------------------*/
    createHoursPicker: function() {
		if (!this.hoursPicker.dom.firstChild) {
			var hoursEl = ['<table  border="0" cellspacing="0" cellpadding="0">'];
			hoursEl.push('<tr ><td class="x-datepicker-header" align="center" style="text-align:center;"  colspan="4">', '<span style = "color:white!important;">',this.hourText, '</span>',"</td></tr>");
			for (var i = 0; i < 24; i += 4) {
				hoursEl.push('<tr>' ,
								'<td role = "gridcell" id = "'+Ext.id()+'" class="x-datepicker-active" style="text-align:center;">',
									'<a role="presentation" hidefocus="on" href="#" class="x-datepicker-date" tabindex="1">', 
										'<em role="presentation"><span role="presentation">',
											i, 
										'</span></em>',
									"</a>" ,
								"</td>", 
								'<td role = "gridcell" id = "'+Ext.id()+'" class="x-datepicker-active" style="text-align:center;">',
									'<a role="presentation" hidefocus="on" href="#" class="x-datepicker-date" tabindex="1">', 
										'<em role="presentation"><span role="presentation">',
											i + 1, 
										'</span></em>',
									"</a>" ,
								"</td>", 
								'<td role = "gridcell" id = "'+Ext.id()+'" class="x-datepicker-active" style="text-align:center;">',
									'<a role="presentation" hidefocus="on" href="#" class="x-datepicker-date" tabindex="1">', 
										'<em role="presentation"><span role="presentation">',
											i + 2, 
										'</span></em>',
									"</a>" ,
								"</td>", 
								'<td role = "gridcell" id = "'+Ext.id()+'" class="x-datepicker-active" style="text-align:center;">',
									'<a role="presentation" hidefocus="on" href="#" class="x-datepicker-date" tabindex="1">', 
										'<em role="presentation"><span role="presentation">',
											i + 3,
										'</span></em>',
									"</a>" ,
								"</td>" ,
							"</tr>")
			}
			this.hoursPicker.update(hoursEl.join(""));
			this.hoursPicker.on("click", this.onHourClick, this);
			
			this.mpHours = this.hoursPicker.select("td.x-datepicker-active");

			this.mpHours.each(function(c, d, e) {
				c.dom.xhour = e
			})
		}
	},
    
    showHoursPicker: function() {
		this.createHoursPicker();
		var a = {
			height:184,
			width:176
		}
		this.hoursPicker.setSize(a);
		this.hoursPicker.child("table").setSize(a);
		this.updateMPHour(this.theHours);
		
		this.hoursPicker.slideIn('t',{ 
		    duration: .2 
		});
	},
    updateMPHour: function(a) {
    	//改变选择模式
		this.mpHours.each(function(b, c, d) {
			if (b.dom.xhour==a){
				b.addCls("x-datepicker-selected")
				b.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute('style',"border: 1px solid #8DB2E3; font-weight: bold; background-color: #DAE5F3; ");
			}else{
				b.removeCls("x-datepicker-selected");
				b.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute('style','');
			}
		})
	},
	onHourClick: function(d, b) {
		d.stopEvent();
		var c = new Ext.Element(b),
		a;
		
		if (a = c.up("td.x-datepicker-active", 3)) {
			this.theHours = a.dom.xhour;
			if (this.theHours < 10) {
				txt = "0" + this.theHours
			} else {
				txt = this.theHours
			}
			this.hourLabel.update(txt);
			this.setAllValue();
			this.hideHourPicker()
		}
	},
	hideHourPicker: function(a) {
		if (this.hoursPicker) {
			if (a === true) {
				this.hoursPicker.hide()
			} else {
				this.hoursPicker.slideOut("t", {
					duration: 0.2
				})
			}
		}
	},
	createMinutesPicker: function() {
		if (!this.minutesPicker.dom.firstChild) {
			var a = ['<table border="0" cellspacing="0"'];
			for (var b = 0; b < 60; b += 6) {
				a.push('<tr><td class="x-datepicker-active"><a href="#">', 
					'<em role="presentation"><span role="presentation">',
						b, 
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">', 
					'<em role="presentation"><span role="presentation">',
						b + 1, 
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">',
					'<em role="presentation"><span role="presentation">',
						b + 2,
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">', 
					'<em role="presentation"><span role="presentation">',
						b + 3, 
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">', 
					'<em role="presentation"><span role="presentation">',
						b + 4, 
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">',
					'<em role="presentation"><span role="presentation">',
						b + 5, 
					'</span></em>',
					"</a></td>", "</tr>")
			}
			this.minutesPicker.update(a.join(""));
			this.minutesPicker.on("click", this.onMinuteClick, this);
			this.mpMinutes = this.minutesPicker.select("td.x-datepicker-active");
			this.mpMinutes.each(function(c, d, e) {
				c.dom.xminute = e
			})
		}
	},
	showMinutesPicker: function() {
		this.createMinutesPicker();
		var a = {
			height:184,
			width:176
		}
		this.minutesPicker.setSize(a);
		this.minutesPicker.child("table").setSize(a);
		this.mpSelMinute = (this.activeDate || this.value).getHours();
		this.updateMPMinute(this.theMinutes);
		this.minutesPicker.slideIn("t", {
			duration: 0.2
		});
	},
	updateMPMinute: function(a) {
		this.mpMinutes.each(function(b, c, d) {
			if (b.dom.xminute==a){
				b.addCls("x-datepicker-selected")
				b.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute('style',"border: 1px solid #8DB2E3; font-weight: bold; background-color: #DAE5F3; ");
			}else{
				b.removeCls("x-datepicker-selected");
				b.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute('style','');
			}
		})
	},
	onMinuteClick: function(d, b) {
		d.stopEvent();
		var c = new Ext.Element(b),
		a;
		if (a = c.up("td.x-datepicker-active", 3)) {
			this.theMinutes = a.dom.xminute;
			if (this.theMinutes < 10) {
				txt = "0" + this.theMinutes
			} else {
				txt = this.theMinutes
			}
			this.minuteLabel.update(txt);
			this.setAllValue();
			this.hideMinutePicker()
		}
	},
	hideMinutePicker: function(a) {
		if (this.hoursPicker) {
			if (a === true) {
				this.minutesPicker.hide()
			} else {
				this.minutesPicker.slideOut("t", {
					duration: 0.2
				})
			}
		}
	},
	createSecondsPicker: function() {
		if (!this.secondPicker.dom.firstChild) {
			var a = ['<table border="0" cellspacing="0"'];
			for (var b = 0; b < 60; b += 6) {
				a.push('<tr><td class="x-datepicker-active"><a href="#">', 
					'<em role="presentation"><span role="presentation">',
						b, 
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">', 
					'<em role="presentation"><span role="presentation">',
						b + 1, 
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">',
					'<em role="presentation"><span role="presentation">',
						b + 2,
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">', 
					'<em role="presentation"><span role="presentation">',
						b + 3, 
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">', 
					'<em role="presentation"><span role="presentation">',
						b + 4, 
					'</span></em>',
					"</a></td>", '<td class="x-datepicker-active"><a href="#">',
					'<em role="presentation"><span role="presentation">',
						b + 5, 
					'</span></em>',
					"</a></td>", "</tr>")
			}
			this.secondPicker.update(a.join(""));
			this.secondPicker.on("click", this.onSecondClick, this);
			this.mpSeconds = this.secondPicker.select("td.x-datepicker-active");
			this.mpSeconds.each(function(c, d, e) {
				c.dom.xSecond = e
			})
		}
	},
	showSecondsPicker: function() {
		this.createSecondsPicker();
		var a = {
			height:184,
			width:176
		}
		this.secondPicker.setSize(a);
		this.secondPicker.child("table").setSize(a);
		this.mpSelSecond = (this.activeDate || this.value).getHours();
		this.updateMPSecond(this.theSeconds);
		this.secondPicker.slideIn("t", {
			duration: 0.2
		});
	},
	updateMPSecond: function(a) {
		this.mpSeconds.each(function(b, c, d) {
			if (b.dom.xSecond==a){
				b.addCls("x-datepicker-selected")
				b.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute('style',"border: 1px solid #8DB2E3; font-weight: bold; background-color: #DAE5F3; ");
			}else{
				b.removeCls("x-datepicker-selected");
				b.dom.childNodes[0].childNodes[0].childNodes[0].setAttribute('style','');
			}
		})
	},
	onSecondClick: function(d, b) {
		d.stopEvent();
		var c = new Ext.Element(b),
		a;
		if (a = c.up("td.x-datepicker-active", 3)) {
			this.theSeconds = a.dom.xSecond;
			if (this.theSeconds < 10) {
				txt = "0" + this.theSeconds
			} else {
				txt = this.theSeconds
			}
			this.secondLabel.update(txt);
			this.setAllValue();
			this.hideSecondPicker()
		}
	},
	setAllValue:function(){
		this.value = new Date(Date.parse(Ext.Date.format(this.value,'Y/m/d')+" "+this.theHours+":"+this.theMinutes+":"+this.theSeconds));
		if (this.field!=null){
			this.field.setValue(this.getValue());
		}
	},
	hideSecondPicker: function(a) {
		if (this.hoursPicker) {
			if (a === true) {
				this.secondPicker.hide()
			} else {
				this.secondPicker.slideOut("t", {
					duration: 0.2
				})
			}
		}
	},
/*-------------------------------------------------------------------------------*/
    initDisabledDays : function(){
        var me = this,
            dd = me.disabledDates,
            re = '(?:',
            len,
            d, dLen, dI;

        if(!me.disabledDatesRE && dd){
                len = dd.length - 1;

            dLen = dd.length;

            for (d = 0; d < dLen; d++) {
                dI = dd[d];

                re += Ext.isDate(dI) ? '^' + Ext.String.escapeRegex(Ext.Date.dateFormat(dI, me.format)) + '$' : dI;
                if (d != len) {
                    re += '|';
                }
            }

            me.disabledDatesRE = new RegExp(re + ')');
        }
    },

    
    setDisabledDates : function(dd){
        var me = this;

        if(Ext.isArray(dd)){
            me.disabledDates = dd;
            me.disabledDatesRE = null;
        }else{
            me.disabledDatesRE = dd;
        }
        me.initDisabledDays();
        me.update(me.value, true);
        return me;
    },

    
    setDisabledDays : function(dd){
        this.disabledDays = dd;
        return this.update(this.value, true);
    },

    
    setMinDate : function(dt){
        this.minDate = dt;
        return this.update(this.value, true);
    },

    
    setMaxDate : function(dt){
        this.maxDate = dt;
        return this.update(this.value, true);
    },

    
    setValue : function(value){
    	if (!Ext.isDate(value)){
    		if (this.showTimer){
    			if (value.length!=14){
    				this.value = new Date();
    			}else{
    				this.value = new Date(Date.parse(value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6,8)+" "+value.substring(8,10)+":"+value.substring(10,12)+":"+value.substring(12,14)));
    			}
    		}else{
    			if (value.length!=8){
    				this.value = Ext.Date.clearTime(new Date());
    			}else{
    				this.value = new Date(Date.parse(value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6,8)));
    			}
    		}
    	}else{
    		if (this.showTimer){
        		this.value = value;
    		}else{
    			this.value = Ext.Date.clearTime(value,true);
    		}
    	}
    	return this.update(this.value);
    },

    
    getValue : function(){
    	if (this.stringDate){
    		if (this.showTimer){
    			return Ext.Date.format(this.value,"YmdHis")
    		}else{
    			return Ext.Date.format(this.value,"Ymd");
    		}
    	}else{
        	return this.value;
    	}
    },

    
    
    getDayInitial: function(value){
        return value.substr(0,1);
    },
    

    
    focus : function(){
        this.update(this.activeDate);
    },

    
    onEnable: function(){
        this.callParent();
        this.setDisabledStatus(false);
        this.update(this.activeDate);

    },

    
    onDisable : function(){
        this.callParent();
        this.setDisabledStatus(true);
    },

    
    setDisabledStatus : function(disabled){
        var me = this;

        me.keyNav.setDisabled(disabled);
        me.prevRepeater.setDisabled(disabled);
        me.nextRepeater.setDisabled(disabled);
        if (me.showToday) {
            me.todayKeyListener.setDisabled(disabled);
            me.todayBtn.setDisabled(disabled);
            me.sureBtn.setDisabled(disabled);
        }
    },

    
    getActive: function(){
        return this.activeDate || this.value;
    },

    
    runAnimation: function(isHide){
        var picker = this.monthPicker,
            options = {
                duration: 200,
                callback: function(){
                    if (isHide) {
                        picker.hide();
                    } else {
                        picker.show();
                    }
                }
            };

        if (isHide) {
            picker.el.slideOut('t', options);
        } else {
            picker.el.slideIn('t', options);
        }
    },

    
    hideMonthPicker : function(animate){
        var me = this,
            picker = me.monthPicker;

        if (picker) {
            if (me.shouldAnimate(animate)) {
                me.runAnimation(true);
            } else {
                picker.hide();
            }
        }
        return me;
    },

    
    showMonthPicker : function(animate){
        var me = this,
            picker;
        
        if (me.rendered && !me.disabled) {
            picker = me.createMonthPicker();
            picker.setValue(me.getActive());
            picker.setSize(me.getSize());
            picker.setPosition(-1, -1);
            if (me.shouldAnimate(animate)) {
                me.runAnimation(false);
            } else {
                picker.show();
            }
        }
        return me;
    },
    
    
    shouldAnimate: function(animate){
        return Ext.isDefined(animate) ? animate : !this.disableAnim;
    },

    
    createMonthPicker: function(){
        var me = this,
            picker = me.monthPicker;

        if (!picker) {
            me.monthPicker = picker = new Ext.picker.Month({
                renderTo: me.el,
                floating: true,
                shadow: false,
                small: me.showToday === false,
                listeners: {
                    scope: me,
                    cancelclick: me.onCancelClick,
                    okclick: me.onOkClick,
                    yeardblclick: me.onOkClick,
                    monthdblclick: me.onOkClick
                }
            });
            if (!me.disableAnim) {
                
                picker.el.setStyle('display', 'none');
            }
            me.on('beforehide', Ext.Function.bind(me.hideMonthPicker, me, [false]));
        }
        return picker;
    },

    
    onOkClick: function(picker, value){
        var me = this,
            month = value[0],
            year = value[1],
            date = new Date(year, month, me.getActive().getDate());

        if (date.getMonth() !== month) {
            
            date = Ext.Date.getLastDateOfMonth(new Date(year, month, 1));
        }
        me.update(date);
        me.hideMonthPicker();
    },

    
    onCancelClick: function(){
        
        this.selectedUpdate(this.activeDate);
        this.hideMonthPicker();
    },

    
    showPrevMonth : function(e){
        return this.update(Ext.Date.add(this.activeDate, Ext.Date.MONTH, -1));
    },

    
    showNextMonth : function(e){
        return this.update(Ext.Date.add(this.activeDate, Ext.Date.MONTH, 1));
    },

    
    showPrevYear : function(){
        this.update(Ext.Date.add(this.activeDate, Ext.Date.YEAR, -1));
    },

    
    showNextYear : function(){
        this.update(Ext.Date.add(this.activeDate, Ext.Date.YEAR, 1));
    },

    
    handleMouseWheel : function(e){
        e.stopEvent();
        if(!this.disabled){
            var delta = e.getWheelDelta();
            if(delta > 0){
                this.showPrevMonth();
            } else if(delta < 0){
                this.showNextMonth();
            }
        }
    },

    
    handleDateClick : function(e, t){
        var me = this,
            handler = me.handler;

        e.stopEvent();
        if(!me.disabled && t.dateValue && !Ext.fly(t.parentNode).hasCls(me.disabledCellCls)){
            me.doCancelFocus = me.focusOnSelect === false;
            var d = Ext.Date.clearTime(new Date((t.dateValue)));
            if (this.showTimer){
            	d.setSeconds(this.theSeconds);
	            d.setMinutes(this.theMinutes);
	            d.setHours(this.theHours);
            }
            me.setValue(d);
            delete me.doCancelFocus;
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            
            
            
            
            me.onSelect();
        }
    },

    
    onSelect: function() {
        if (this.hideOnSelect) {
             this.hide();
         }
    },

    
    selectToday : function(){
        var me = this,
            btn = me.todayBtn,
            handler = me.handler;

        if(btn && !btn.disabled){
//        	var d = Ext.Date.clearTime(new Date());
        	if (this.showTimer){
//	            d.setSeconds(this.theSeconds);
//	            d.setMinutes(this.theMinutes);
//	            d.setHours(this.theHours);
	            me.setValue(new Date());
        	}else{
            	me.setValue(Ext.Date.clearTime(new Date()));
        	}
            me.fireEvent('select', me, me.value);
            if (handler) {
                handler.call(me.scope || me, me, me.value);
            }
            me.onSelect();
        }
        return me;
    },

    
    selectedUpdate: function(date){
        var me        = this,
            t         = Ext.Date.clearTime(date,true).getTime(),
            cells     = me.cells,
            cls       = me.selectedCls,
            cellItems = cells.elements,
            c,
            cLen      = cellItems.length,
            cell;

        cells.removeCls(cls);

        for (c = 0; c < cLen; c++) {
            cell = Ext.fly(cellItems[c]);

            if (cell.dom.firstChild.dateValue == t) {
                me.fireEvent('highlightitem', me, cell);
                cell.addCls(cls);

                if(me.isVisible() && !me.doCancelFocus){
                    Ext.fly(cell.dom.firstChild).focus(50);
                }

                break;
            }
        }
    },

    
    fullUpdate: function(date){
        var me = this,
            cells = me.cells.elements,
            textNodes = me.textNodes,
            disabledCls = me.disabledCellCls,
            eDate = Ext.Date,
            i = 0,
            extraDays = 0,
            visible = me.isVisible(),
            sel = +eDate.clearTime(date, true),
            today = +eDate.clearTime(new Date()),
            min = me.minDate ? eDate.clearTime(me.minDate, true) : Number.NEGATIVE_INFINITY,
            max = me.maxDate ? eDate.clearTime(me.maxDate, true) : Number.POSITIVE_INFINITY,
            ddMatch = me.disabledDatesRE,
            ddText = me.disabledDatesText,
            ddays = me.disabledDays ? me.disabledDays.join('') : false,
            ddaysText = me.disabledDaysText,
            format = me.format,
            days = eDate.getDaysInMonth(date),
            firstOfMonth = eDate.getFirstDateOfMonth(date),
            startingPos = firstOfMonth.getDay() - me.startDay,
            previousMonth = eDate.add(date, eDate.MONTH, -1),
            longDayFormat = me.longDayFormat,
            prevStart,
            current,
            disableToday,
            tempDate,
            setCellClass,
            html,
            cls,
            formatValue,
            value;

        if (startingPos < 0) {
            startingPos += 7;
        }

        days += startingPos;
        prevStart = eDate.getDaysInMonth(previousMonth) - startingPos;
        current = new Date(previousMonth.getFullYear(), previousMonth.getMonth(), prevStart, me.initHour);

        if (me.showToday) {
            tempDate = eDate.clearTime(new Date());
            disableToday = (tempDate < min || tempDate > max ||
                (ddMatch && format && ddMatch.test(eDate.dateFormat(tempDate, format))) ||
                (ddays && ddays.indexOf(tempDate.getDay()) != -1));

            if (!me.disabled) {
                me.todayBtn.setDisabled(disableToday);
                me.sureBtn.setDisabled(disableToday);
                me.todayKeyListener.setDisabled(disableToday);
            }
        }

        setCellClass = function(cell){
            value = +eDate.clearTime(current, true);
            cell.title = eDate.format(current, longDayFormat);
            
            cell.firstChild.dateValue = value;
            if(value == today){
                cell.className += ' ' + me.todayCls;
                cell.title = me.todayText;
            }
            if(value == sel){
                cell.className += ' ' + me.selectedCls;
                me.fireEvent('highlightitem', me, cell);
                if (visible && me.floating) {
                    Ext.fly(cell.firstChild).focus(50);
                }
            }
            
            if(value < min) {
                cell.className = disabledCls;
                cell.title = me.minText;
                return;
            }
            if(value > max) {
                cell.className = disabledCls;
                cell.title = me.maxText;
                return;
            }
            if(ddays){
                if(ddays.indexOf(current.getDay()) != -1){
                    cell.title = ddaysText;
                    cell.className = disabledCls;
                }
            }
            if(ddMatch && format){
                formatValue = eDate.dateFormat(current, format);
                if(ddMatch.test(formatValue)){
                    cell.title = ddText.replace('%0', formatValue);
                    cell.className = disabledCls;
                }
            }
        };

        for(; i < me.numDays; ++i) {
            if (i < startingPos) {
                html = (++prevStart);
                cls = me.prevCls;
            } else if (i >= days) {
                html = (++extraDays);
                cls = me.nextCls;
            } else {
                html = i - startingPos + 1;
                cls = me.activeCls;
            }
            textNodes[i].innerHTML = html;
            cells[i].className = cls;
            current.setDate(current.getDate() + 1);
            setCellClass(cells[i]);
        }

        me.monthBtn.setText(Ext.Date.format(date, me.monthYearFormat));
    },
    
    update : function(date, forceRefresh){
        var me = this,
            active = me.activeDate;

        if (me.rendered) {
            me.activeDate = date;
            if(!forceRefresh && active && me.el && active.getMonth() == date.getMonth() && active.getFullYear() == date.getFullYear()){
                me.selectedUpdate(date, active);
            } else {
                me.fullUpdate(date, active);
            }
            me.innerEl.dom.title = Ext.String.format(me.ariaTitle, Ext.Date.format(me.activeDate, me.ariaTitleDateFormat));
        }
        if (this.showTimer){
        	var txt = "";
        	if (date.getHours()<10){
        		txt = '0'+date.getHours();
        	}else{
        		txt = date.getHours();
        	}
        	
	        this.hourLabel.update(txt);
	        this.theHours = date.getHours();
	        if (date.getMinutes()<10){
        		txt = '0'+date.getMinutes();
        	}else{
        		txt = date.getMinutes();
        	}
	        this.minuteLabel.update(txt);
	        this.theMinutes = date.getMinutes();
	        if (date.getSeconds()<10){
        		txt = '0'+date.getSeconds();
        	}else{
        		txt = date.getSeconds();
        	}
	        this.secondLabel.update(txt);
	        this.theSeconds = date.getSeconds();
        }
        return me;
    },

    
    beforeDestroy : function() {
        var me = this;

        if (me.rendered) {
            Ext.destroy(
                me.todayKeyListener,
                me.keyNav,
                me.monthPicker,
                me.monthBtn,
                me.nextRepeater,
                me.prevRepeater,
                me.todayBtn,
                me.sureBtn
            );
            delete me.textNodes;
            delete me.cells.elements;
        }
        me.callParent();
    },

    
    onShow: function() {
        this.callParent(arguments);
        if (this.focusOnShow) {
            this.focus();
        }
    }
},


function() {
    var proto = this.prototype,
        date = Ext.Date;
    proto.monthNames = date.monthNames;
    proto.dayNames   = date.dayNames;
    proto.format     = date.defaultFormat;
});

//修改返回信息


Ext.define('Ext.form.field.DateTime', {
    extend:'Ext.form.field.Picker',
    alias: 'widget.datetimefield',
    requires: ['Ext.picker.DateTime'],
    alternateClassName: ['Ext.form.DateTimeField', 'Ext.form.DateTime'],

    /**
     * @cfg {String} format
     * The default date format string which can be overriden for localization support. The format must be valid
     * according to {@link Ext.Date#parse}.
     */
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    trigger2Cls : Ext.baseCSSPrefix + 'form-date-trigger',
    format : "Y/m/d",
    stringDate : true,
    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it does not match the defined
     * format.
     */
    altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d|n-j|n/j",
    /**
     * @cfg {String} disabledDaysText
     * The tooltip to display when the date falls on a disabled day.
     */
    disabledDaysText : "Disabled",
    /**
     * @cfg {String} disabledDatesText
     * The tooltip text to display when the date falls on a disabled date.
     */
    disabledDatesText : "Disabled",
    /**
     * @cfg {String} minText
     * The error text to display when the date in the cell is before {@link #minValue}.
     */
    minText : "The date in this field must be equal to or after {0}",
    /**
     * @cfg {String} maxText
     * The error text to display when the date in the cell is after {@link #maxValue}.
     */
    maxText : "The date in this field must be equal to or before {0}",
    /**
     * @cfg {String} invalidText
     * The error text to display when the date in the field is invalid.
     */
    invalidText : "{0} is not a valid date - it must be in the format {1}",
  
    showToday : true,
    showTimer : true,
    /**
     * @cfg {Date/String} minValue
     * The minimum allowed date. Can be either a Javascript date object or a string date in a valid format.
     */
    /**
     * @cfg {Date/String} maxValue
     * The maximum allowed date. Can be either a Javascript date object or a string date in a valid format.
     */
    /**
     * @cfg {Number[]} disabledDays
     * An array of days to disable, 0 based. Some examples:
     *
     *     // disable Sunday and Saturday:
     *     disabledDays:  [0, 6]
     *     // disable weekdays:
     *     disabledDays: [1,2,3,4,5]
     */
    /**
     * @cfg {String[]} disabledDates
     * An array of "dates" to disable, as strings. These strings will be used to build a dynamic regular expression so
     * they are very powerful. Some examples:
     *
     *     // disable these exact dates:
     *     disabledDates: ["03/08/2003", "09/16/2003"]
     *     // disable these days for every year:
     *     disabledDates: ["03/08", "09/16"]
     *     // only match the beginning (useful if you are using short years):
     *     disabledDates: ["^03/08"]
     *     // disable every day in March 2006:
     *     disabledDates: ["03/../2006"]
     *     // disable every day in every March:
     *     disabledDates: ["^03"]
     *
     * Note that the format of the dates included in the array should exactly match the {@link #format} config. In order
     * to support regular expressions, if you are using a {@link #format date format} that has "." in it, you will have
     * to escape the dot when restricting dates. For example: `["03\\.08\\.03"]`.
     */

    /**
     * @cfg {String} submitFormat
     * The date format string which will be submitted to the server. The format must be valid according to {@link
     * Ext.Date#parse} (defaults to {@link #format}).
     */

    // in the absence of a time value, a default value of 12 noon will be used
    // (note: 12 noon was chosen because it steers well clear of all DST timezone changes)
    initTime: '12', // 24 hour format
    editable:false,

    initTimeFormat: 'H',

    matchFieldWidth: false,
    /**
     * @cfg {Number} startDay
     * Day index at which the week should begin, 0-based (defaults to Sunday)
     */
    startDay: 0,

    initComponent : function(){
        var me = this,
            isString = Ext.isString,
            min, max;
        min = me.minValue;
        max = me.maxValue;
        if (me.showTimer){
        	me.format += " H:i:s"
        }
        if(isString(min)){
            me.minValue = me.parseDate(min);
        }
        if(isString(max)){
            me.maxValue = me.parseDate(max);
        }
        me.disabledDatesRE = null;
        me.initDisabledDays();

        me.callParent();
    },
	
    initValue: function() {
        var me = this,
            value = me.value;

        // If a String value was supplied, try to convert it to a proper Date
        if (Ext.isString(value)) {
            me.value = me.rawToValue(value);
        }

        me.callParent();
    },

    // private
    initDisabledDays : function(){
        if(this.disabledDates){
            var dd = this.disabledDates,
                len = dd.length - 1,
                re = "(?:";

            Ext.each(dd, function(d, i){
                re += Ext.isDate(d) ? '^' + Ext.String.escapeRegex(d.dateFormat(this.format)) + '$' : dd[i];
                if (i !== len) {
                    re += '|';
                }
            }, this);
            this.disabledDatesRE = new RegExp(re + ')');
        }
    },

    /**
     * Replaces any existing disabled dates with new values and refreshes the Date picker.
     * @param {String[]} disabledDates An array of date strings (see the {@link #disabledDates} config for details on
     * supported values) used to disable a pattern of dates.
     */
    setDisabledDates : function(dd){
        var me = this,
            picker = me.picker;

        me.disabledDates = dd;
        me.initDisabledDays();
        if (picker) {
            picker.setDisabledDates(me.disabledDatesRE);
        }
    },
    /**
     * Replaces any existing disabled days (by index, 0-6) with new values and refreshes the Date picker.
     * @param {Number[]} disabledDays An array of disabled day indexes. See the {@link #disabledDays} config for details on
     * supported values.
     */
    setDisabledDays : function(dd){
        var picker = this.picker;

        this.disabledDays = dd;
        if (picker) {
            picker.setDisabledDays(dd);
        }
    },

    /**
     * Replaces any existing {@link #minValue} with the new value and refreshes the Date picker.
     * @param {Date} value The minimum date that can be selected
     */
    setMinValue : function(dt){
        var me = this,
            picker = me.picker,
            minValue = (Ext.isString(dt) ? me.parseDate(dt) : dt);

        me.minValue = minValue;
        if (picker) {
            picker.minText = Ext.String.format(me.minText, me.formatDate(me.minValue));
            picker.setMinDate(minValue);
        }
    },

    /**
     * Replaces any existing {@link #maxValue} with the new value and refreshes the Date picker.
     * @param {Date} value The maximum date that can be selected
     */
    setMaxValue : function(dt){
        var me = this,
            picker = me.picker,
            maxValue = (Ext.isString(dt) ? me.parseDate(dt) : dt);

        me.maxValue = maxValue;
        if (picker) {
            picker.maxText = Ext.String.format(me.maxText, me.formatDate(me.maxValue));
            picker.setMaxDate(maxValue);
        }
    },

    /**
     * Runs all of Date's validations and returns an array of any errors. Note that this first runs Text's validations,
     * so the returned array is an amalgamation of all field errors. The additional validation checks are testing that
     * the date format is valid, that the chosen date is within the min and max date constraints set, that the date
     * chosen is not in the disabledDates regex and that the day chosed is not one of the disabledDays.
     * @param {Object} [value] The value to get errors for (defaults to the current field value)
     * @return {String[]} All validation errors for this field
     */
    getErrors: function(value) {
        var me = this,
            format = Ext.String.format,
            clearTime = Ext.Date.clearTime,
            errors = me.callParent(arguments),
            disabledDays = me.disabledDays,
            disabledDatesRE = me.disabledDatesRE,
            minValue = me.minValue,
            maxValue = me.maxValue,
            len = disabledDays ? disabledDays.length : 0,
            i = 0,
            svalue,
            fvalue,
            day,
            time;

        value = me.formatDate(value || me.processRawValue(me.getRawValue()));

        if (value === null || value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
             return errors;
        }

        svalue = value;
        value = me.parseDate(value);
        if (!value) {
            errors.push(format(me.invalidText, svalue, me.format));
            return errors;
        }

        time = value.getTime();
        if (minValue && time < clearTime(minValue).getTime()) {
            errors.push(format(me.minText, me.formatDate(minValue)));
        }

        if (maxValue && time > clearTime(maxValue).getTime()) {
            errors.push(format(me.maxText, me.formatDate(maxValue)));
        }

        if (disabledDays) {
            day = value.getDay();

            for(; i < len; i++) {
                if (day === disabledDays[i]) {
                    errors.push(me.disabledDaysText);
                    break;
                }
            }
        }

        fvalue = me.formatDate(value);
        if (disabledDatesRE && disabledDatesRE.test(fvalue)) {
            errors.push(format(me.disabledDatesText, fvalue));
        }

        return errors;
    },

    // @private
    getSubmitValue: function() {
        var format = this.submitFormat || this.format,
            value = this.getValue();

        return value ? Ext.Date.format(value, format) : '';
    },

    /**
     * @private
     */
    createPicker: function() {
        var me = this,
            format = Ext.String.format;

        var p = Ext.create('Ext.picker.DateTime', {
            pickerField: me,
            stringDate:false,
            showTimer:me.showTimer,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
		p.field = this;        
        return p;
    },
    
    onSelect: function(m, d) {
        var me = this;
        me.setValue(d);
        me.fireEvent('select', me, d);
        me.collapse();
    },

    /**
     * @private
     * Sets the Date picker's value to match the current field value when expanding.
     */
    onExpand: function() {
        var value = this.value;
        if (typeof(value)!='undefined'){
        	this.picker.setValue(value);
        }else{
        	this.picker.setValue(new Date());
        }
    },

    /**
     * @private
     * Focuses the field when collapsing the Date picker.
     */
    onCollapse: function() {
        this.focus(false, 60);
    },

    // private
    beforeBlur : function(){
        var me = this,
            v = me.parseDate(me.getRawValue()),
            focusTask = me.focusTask;

        if (focusTask) {
            focusTask.cancel();
        }

        if (v) {
            me.setValue(v);
        }
    },
    safeParse : function(value, format) {
        var me = this,
            utilDate = Ext.Date,
            parsedDate,
            result = null;

        if (utilDate.formatContainsHourInfo(format)) {
            // if parse format contains hour information, no DST adjustment is necessary
            result = utilDate.parse(value, format);
        } else {
            // set time to 12 noon, then clear the time
            parsedDate = utilDate.parse(value + ' ' + me.initTime, format + ' ' + me.initTimeFormat);
            if (parsedDate) {
                result = parsedDate;
            }
        }
        return result;
    },
    parseDate : function(value) {
        if(!value || Ext.isDate(value)){
            return value;
        }

        var me = this,
            val = me.safeParse(value, me.format),
            altFormats = me.altFormats,
            altFormatsArray = me.altFormatsArray,
            i = 0,
            len;

        if (!val && altFormats) {
            altFormatsArray = altFormatsArray || altFormats.split('|');
            len = altFormatsArray.length;
            for (; i < len && !val; ++i) {
                val = me.safeParse(value, altFormatsArray[i]);
            }
        }
        return val;
    },

    // private
    formatDate : function(date){
        return Ext.isDate(date) ? Ext.Date.dateFormat(date, this.format) : date;
    },
    rawToValue: function(rawValue) {
    	if (this.stringDate){
	    	if (this.showTimer){
	    		return Ext.Date.format(this.parseDate(rawValue) || rawValue || null,"YmdHis");
	    	}else{
	        	return Ext.Date.format(this.parseDate(rawValue) || rawValue || null,"Ymd");
	    	}
    	}else{
    		return this.parseDate(rawValue) || rawValue || null;
    	}
    },

    valueToRaw: function(value) {
    	if (value == null){
    		return '';
    	}
		if (typeof(value)!='undefined'){
	    	if (Ext.isDate(value)){
	       		return this.formatDate(this.parseDate(value));
	    	}else{
	    		if (this.showTimer){
	    			return this.formatDate(new Date(Date.parse(value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6,8)+" "+value.substring(8,10)+":"+value.substring(10,12)+":"+value.substring(12,14))));
	    		}else{
	    			return this.formatDate(new Date(Date.parse(value.substring(0,4)+"/"+value.substring(4,6)+"/"+value.substring(6,8))));
	    		}
	    	}
		}
    },
    setRawValue: function(value) {
        var me = this;
        value = Ext.value(value, '');
        if (value.length==0){
        	me.rawValue = '';
        }else{
        	me.rawValue = value;
        }

        // Some Field subclasses may not render an inputEl
        if (me.inputEl) {
            me.inputEl.dom.value = value;
        }
        return value;
    },
    onTrigger1Click: function() {
 		this.reset();
 	}
});
