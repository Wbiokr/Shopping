/**
 * selectFilter  --v1.1            
 * 
 * author： 840399345@qq.com
 * 
 * $(el).selectFilter(options);
 * 
 * options={
 *  callBack : function (res){}  // 返回選中的值 進行事件操作
 * }
 * 
 * 也可以放在表單直接獲取  select標籤的 值
 * 
 **/

;jQuery.fn.selectFilter = function (options){
	var defaults = {
		callBack : function (res){}
	};
	var ops = $.extend({}, defaults, options);
	var selectList = $(this).find('select option');
	var that = this;
	var html = '';
	
	// 讀取select 標籤的值
	html += '<ul class="filter-list">';
	
	$(selectList).each(function (idx, item){
		var val = $(item).val();
		var valText = $(item).html();
		var selected = $(item).attr('selected');
		var disabled = $(item).attr('disabled');
		var isSelected = selected ? 'filter-selected' : '';
		var isDisabled = disabled ? 'filter-disabled' : '';
		if(selected) {
			html += '<li class="'+ isSelected +'" data-value="'+val+'"><a title="'+valText+'">'+valText+'</a></li>';
			$(that).find('.filter-title').val(valText);
		}else if (disabled){
			html += '<li class="'+ isDisabled +'" data-value="'+val+'"><a>'+valText+'</a></li>';
		}else {
			html += '<li data-value="'+val+'"><a title="'+valText+'">'+valText+'</a></li>';
		};
	});
	
	html += '</ul>';
	$(that).append(html);
	$(that).find('select').hide();
	
	//點擊選擇
	$(that).on('click', '.filter-text', function (){
		$(that).find('.filter-list').slideToggle(100);
		$(that).find('.filter-list').toggleClass('filter-open');
		$(that).find('.icon-filter-arrow').toggleClass('filter-show');
	});
	
	//點擊選擇列表
	$(that).find('.filter-list li').not('.filter-disabled').on('click', function (){
		var val = $(this).data('value');
		var valText =  $(this).find('a').html();
		$(that).find('.filter-title').val(valText);
		$(that).find('.icon-filter-arrow').toggleClass('filter-show');
		$(this).addClass('filter-selected').siblings().removeClass('filter-selected');
		$(this).parent().slideToggle(50);
		for(var i=0; i<selectList.length; i++){
			var selectVal = selectList.eq(i).val();
			if(val == selectVal) {
				$(that).find('select').val(val);
			};
		};
		ops.callBack(val); //返回值
	});
	
	//其他元素被點擊則收起選擇
	$(document).on('mousedown', function(e){
		closeSelect(that, e);
	});
	$(document).on('touchstart', function(e){
		closeSelect(that, e);
	});
	
	function closeSelect(that, e) {
		var filter = $(that).find('.filter-list'),
			filterEl = $(that).find('.filter-list')[0];
		var filterBoxEl = $(that)[0];
		var target = e.target;
		if(filterEl !== target && !$.contains(filterEl, target) && !$.contains(filterBoxEl, target)) {
			filter.slideUp(50);
			$(that).find('.filter-list').removeClass('filter-open');
			$(that).find('.icon-filter-arrow').removeClass('filter-show');
		};
	}
};
