!(function($) {
    var iconHtml = '<span class="icon icon-filter-arrow"></span>';
    var wrapHtml = `<div class="filter-box">` +
                        `<div class="filter-text">` +
                        `</div>` +
                    `</div>`;
    var ulHtml = `<ul class="filter-list"></ul>`;
    $.widget('ui.combobox', {
        options: {
            /**
             * @cfg {String} placeholder 為空時的提示信息
             */
            placeholder: '-- Please Select --',
            /**
             * @cfg {Boolean} editable 是否手動輸入，默認為 true
             */
            editable: true,
            /**
             * @cfg {String} [dataTextField='name'] 數據源顯示字段
             */
            dataTextField: "name",
            /**
             * @cfg {String} [dataValueField='value'] 數據源取值字段
             */
            dataValueField: "value",
            /**
             * @cfg {Array} [dataSource='name'] 數據源
             */
            dataSource: [],
            /**
             * @cfg {Number} [delay=500] 延遲搜索，避免過多無效搜索，單位毫秒ms，默認是500ms
             */
            delay: 500,
            /**
             * @cfg {Function} [change=null] 定義改變下拉框值事件函數，事件名稱combobox:change
             */
             change: null
        },
        /**
            jQueryUI Widget生命週期方法，生成HTML，事件綁定
        */
        _create: function() {
            console.log('--- create ---');
            // 包裝節點
            this.element.addClass('filter-title').attr('placeholder', this.options.placeholder);
            this.element.wrap(wrapHtml);
            this.element.after(iconHtml);
            this.element.parent().after(ulHtml);
            this.$filterText = this.element.parent();
            this.$ul = this.element.parent().siblings('ul');
            this.$icon = this.element.siblings('span');
            // 存放輸入框搜索的定時器
            this.timeoutArr = [];
            // 設置是否可編輯
            this.setEditable(this.options.editable);
            // 讀取 dataSource，處理數據
            this._initDataSource();
            // 綁定事件
            this._delegateEvent();
        },
        /**
            jQueryUI Widget生命週期方法
        */
        _init: function() {
            console.log('--- init ---');
        },
        _setOptions: function(options) {
            for (var key in options) {
                this._setOption(key, options[key]);
            }
            return this;
        },
        _setOption: function (key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
            if (key === 'editable') {
                this.setEditable(value);
            }
            if (key === 'disabled') {
                this.$filterText.attr('disabled', value);
                this.element.attr('disabled', value);
                this.$icon.attr('disabled', value);
            }
            return this;
        },
        setEditable: function (editable) {
            editable = !!editable;
            this.options.editable = editable;
            if (editable) {
                this.element.removeAttr('readonly');
                this._on(this.element, {
                    'keydown': '_onKeyDown'
                });
            } else {
                this.element.attr("readonly", true);
                this._off(this.element);
            }
            return this;
        },
        _destroy: function() {
            // 移除屬性
            this.element.removeClass('input-combobox filter-title').removeAttr('data-value')
            .attr('readonly', false).val('');
            // 移除 dom
            this.$filterText.parent().after(this.element);
            this.$filterText.parent().remove();
        },
        _onKeyDown: function(e) {
            console.log('--- keydown ---');
            var timeout = setTimeout(function(context) {
                return function() {
                    context.timeoutArr.shift();
                    var inputVal = context.element.val();
                    if (inputVal) {
                        context.$ul.find('li').addClass('hide').not('.filter-disabled')
                        .filter(function(index, item) {
                            return item.firstChild.text.indexOf(inputVal) > -1;
                        }).removeClass('hide');
                    } else {
                        context.$ul.find('li').removeClass('hide');
                    }
                    console.log('--- delay ' + context.options.delay + 'ms search ---');
                };
            }(this), this.options.delay);
            if (this.timeoutArr.length > 0) {
                var preTimeout = this.timeoutArr.shift();
                clearTimeout(preTimeout);
            }
            this.timeoutArr.push(timeout);
        },
        _initDataSource: function() {
            // dataSource沒有數據，不處理
            if (!this.options.dataSource || this.options.dataSource.length <= 0) {
                this.options.dataSource = [];
                return;
            }
            // 過濾掉 dataSource中鍵值對與 dataTextField、dataValueField不符合的記錄
            this.options.dataSource = this.options.dataSource.filter(function(currentValue, index, arr) {
                return currentValue[this.options.dataTextField] != null 
                    && currentValue[this.options.dataValueField] != null;
            }, this);
            // 清空掉 item選項
            this.$ul.empty();
            if (this.options.dataSource && this.options.dataSource.length) {
                $.each(this.options.dataSource, function (i, item) {
                    this._appendToUl(item);
                }.bind(this));
            }
        },
        _appendToUl: function(item) {
            // 處理dataTextField的值為非字符串的問題
            item[this.options.dataTextField] += "";
            // 組建 item
            var liHtml = 
                `<li data-value="#{value}" class="#{class}"><a title="#{title}">#{text}</a></li>`;
            liHtml = $.fn.format(liHtml, {
                value: item[this.options.dataValueField],
                text: item[this.options.dataTextField],
                title: item[this.options.dataTextField],
                class: ((item.selected ? 'filter-selected' : '') 
                    + ' ' + (item.disabled ? 'filter-disabled' : '')).trim()
            });
            this.$ul.append(liHtml);
            if (item.selected) {
                // 設置 item選中
                this._select(item);
            }
        },
        _delegateEvent: function() {
            // 展示/隱藏 組件內容
            this.$filterText.on('click.combobox', 'input, span', function() {
                if (!this.options.disabled) {
                    this.$ul.slideToggle(100);
                    this.$ul.toggleClass('filter-open');
                    this.$icon.toggleClass('filter-show');
                }
            }.bind(this));
            $(this.document).on('mousedown.combobox', function(e) {
                var target = e.target ? e.target : e.srcElement;
                // 過濾某些元素，點擊後不觸發
                if (target.parentNode !== this.$filterText.get(0) && target !== this.$filterText.get(0)
                    && target.parentNode.parentNode !== this.$ul.get(0)) {
                    this.$ul.slideUp(100);
                    this.$ul.removeClass('filter-open');
                    this.$icon.removeClass('filter-show');
                }
            }.bind(this));
            // 選擇某一項內容，回顯
            $(this.$ul).on('click.combobox', 'li:not(.filter-disabled)', function(e) {
                var currentTarget = e.currentTarget;
                // 設置其選中樣式
                this._select({
                    value: $(currentTarget).attr('data-value'),
                    name: currentTarget.firstChild.text
                });
                // 隱藏選項組
                this.$ul.slideToggle(100);
                this.$ul.toggleClass('filter-open');
                this.$icon.toggleClass('filter-show');
                this.$ul.find('li').removeClass('hide');
            }.bind(this));
        },
        /**
         * @method value 取值或者賦值
         * @param  {String} [value] 設置值選中,為空則取控件值
         * @return {String} 控件值,賦值操作則沒有返回值
         */
        value: function(value) {
            if (arguments.length === 0) { // 取值操作
                console.log('--- get value ---');
                return this.$ul.find('li[class="filter-selected"]').attr('data-value');
            }
            // 賦值操作
            console.log('--- set value ---');
            var selectedItem = null;
            for(var i = 0, len = this.options.dataSource.length; i < len; i++) {
                var item = this.options.dataSource[i], isSelected = item.selected;
                if (item[this.options.dataValueField] === value && !item.disabled) {
                    selectedItem = item;
                    break;
                }
            }
            this._select(selectedItem);
        },
        _select: function(item) {
            if (item) {
                var value = item[this.options.dataValueField],
                    text = item[this.options.dataTextField];
                this.element.val(text);
                // 判斷選擇的節點是否和上一個選擇的節點相同
                if (this.element.attr('data-value') !== value) {
                    this.$ul.find('li').removeClass('filter-selected').filter(function(index, element) {
                        return $(element).attr('data-value') === value;
                    }.bind(this)).addClass('filter-selected');
                    this.element.attr('data-value', value);
                    this._trigger('change', null, {
                        value: value,
                        text: text
                    });
                }
            } else {
                this.$ul.find('li').removeClass('filter-selected');
                this.element.val('');
                this.element.removeAttr('data-value');
                this._trigger('change');
            }
        },
        /**
         * @method clear 清空選擇內容
         */
        clear: function() {
            this._select(null);
        },
        /**
         * @method getSelectedItem 獲取被選中的項鍵值對
         * @return 鍵值對
         */
        getSelectedItem: function() {
            console.log('--- getSelectedItem ---');
            return {
                value: this.element.attr('data-value'),
                text: this.element.val()
            }
        },
        /**
         * @method append 向 dataSource裡追加數據，顯示在頁面上
         * @param  {Array} [items] 追加的內容
         * @return this
         */
        append: function(items) {
            // 傳入參數不是數組，直接返回控件對象 this
            if (!(items instanceof Array)) {
                return this;
            }
            // 過濾掉鍵值對與 options參數不一致的內容
            items = items.filter(function(item, index) {
                return item.hasOwnProperty(this.options.dataValueField) 
                    && item.hasOwnProperty(this.options.dataTextField);
            }.bind(this));
            if (items.length === 0) {
                return this;
            }
            // 將追加的數據放入到 options裡，並追加到 ul元素裡面
            Array.prototype.push.apply(this.options.dataSource, items);
            $.each(items, function(index, item) {
                this._appendToUl(item);
            }.bind(this));
            return this;
        },
        /**
         * @method remove 從 dataSource中移除某些項
         * @param  {Array} [items] 移除的內容
         * @return this
         */
        remove: function(items) {
            // 傳入參數不是數組，直接返回控件對象 this
            if (!(items instanceof Array)) {
                return this;
            }
            // 過濾掉鍵值對與 options參數不一致的內容
            items = items.filter(function(item, index) {
                return item.hasOwnProperty(this.options.dataValueField) 
                    && item.hasOwnProperty(this.options.dataTextField);
            }.bind(this));
            if (items.length === 0) {
                return this;
            }
            // 從 options裡移除，並從 ul元素裡面移除
            $.each(items, function(index, item) {
                var $target = this.$ul.find('li[data-value=' + item[this.options.dataValueField] + ']')
                .find('a[title='+ item[this.options.dataTextField] +']').end().addClass('hide');
                var pos = $target.prevAll().length;
                this.options.dataSource.splice(pos, 1);
                // 若移除的元素被選中，則需要清空選中
                if ($target.hasClass('filter-selected')) {
                    this._select(null);
                }
            }.bind(this));
            return this;
        }
    });
    /**
        在 jQuery的原型鏈上新增一個格式化函數
    */
    jQuery.fn.format = function(str) {
        var args = Array.prototype.slice.call(arguments, 1);
        var reg = /\#{([^{}]+)}/gm; 
        return str.replace(reg, function(match, name, index, str) {
            // 判斷括號匹配的內容是否是數字
            var content = Number(name);
            if (content >= 0) {
                return args[content];
            }
            // 不是數字的話，應該就是對象
            var object = args[0];
            if (object && object !== void(0)) {
                return object[name];
            }
            // 未匹配到，返回空串
            return '';
        });
    }
})(jQuery)