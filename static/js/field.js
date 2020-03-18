/**
 * 选择header
 * @param headerParams
 */
function selectHeader(headerParams) {
    var selectHeaderBtn = $('#headerParamTable .js_name');
    selectHeaderBtn.typeahead({
        source: headerParams,
        items: 8, //显示8条
        delay: 100, //延迟时间
        autoSelect:false
    });
}

/**
 * 选择字段类型
 * @param object 当前对象
 */
function selectType(object) {
    var type = ["array", "object"];

    var thisObj = $(object);
    var thisTrObj = thisObj.closest('tr');
    var addBtnObj = thisTrObj.find('.js_addField');

    var nextTrObj = thisTrObj.next("tr");

    var thisLevel = thisTrObj.find("input.js_level").val();
    var nextLevel = nextTrObj.find("input.js_level").val();

    if(!thisLevel){
        thisLevel = 0;
    }

    if(!nextLevel){
        nextLevel = 0;
    }

    if($.inArray(thisObj.val(), type) < 0){
        addBtnObj.attr("disabled", true);
    }else{
        addBtnObj.attr("disabled", false);
    }

    if(thisLevel >= nextLevel){
        thisObj.children('option').attr("disabled",false);
    }else{
        thisObj.children('option').not('option[value="array"],option[value="object"]').attr("disabled",true);
    }
}

/**
 * 获取最大id
 * @param tabel 表单对象
 * @returns {number} 最大id
 */
function getMaxId(tabel) {
    var ids = [];
    $(tabel).find(".js_id").each(function() {
        ids.push($(this).val());
    });

    if(ids.length == 0){
        return 0;
    }

    return parseInt(ids.sort().reverse()[0]);
}

/**
 * 新增字段
 * @param object 当前对象
 * @param type 字段类型 header|request|response
 */
function addField(object, type) {

    var thisObj  = $(object);
    var tableObj = thisObj.closest('.row').find('.table');
    var TrObj    = thisObj.closest('tr');

    var parentId = parseInt(thisObj.data('parent_id'));
    var level    = parseInt(TrObj.find('input.js_level').val());
    var width    = (10-(level+1))*10;

    if(type == 'header'){
        var cloneObj = $('.clone-table .js_headerClone').clone(true);
        var id = getMaxId("#headerParamTable");
    }else if(type == 'request'){
        var cloneObj = $('.clone-table .js_requestClone').clone(true);
        var id = getMaxId("#requestParamTable");
    }else if(type == 'response'){
        var cloneObj = $('.clone-table .js_responseClone').clone(true);
        var id = getMaxId("#responseParamTable");
    }

    //console.log(id);

    if(id <= 0){
        id = 1;
    }

    cloneObj.find('input.js_id').attr('value', id+1);
    cloneObj.find('input.js_parent_id').attr('value', parentId);
    cloneObj.find('.js_addField').attr('data-parent_id', id+1);

    if(TrObj.length > 0){
        cloneObj.find("input.js_level").attr('value', level + 1);
        TrObj.after(cloneObj).next('tr').find('input.js_name').css('width', width + '%').focus();
    }else{
        cloneObj.find("input.js_level").attr('value', 0);
        cloneObj.appendTo(tableObj).find('input:eq(0)').focus();
    }

    $('.js_type').trigger("change");

    selectHeader(["Accept","Accept-Charset","Accept-Encoding","Accept-Language","Accept-Datetime","Accept-Ranges","Authorization","Cache-Control","Connection","Cookie","Content-Disposition","Content-Length","Content-Type","Content-MD5","Referer","User-Agent","X-Requested-With","X-Forwarded-For","X-Forwarded-Host","X-Csrf-Token"]);

}

// 删除字段
function deleteField(btn) {
    var thisObj = $(btn).closest('tr');
    var preObj  = thisObj.prev("tr");
    var nextObj = thisObj.next("tr");

    var thisLevel = thisObj.find("input.js_level").val();
    var preLevel  = preObj.find("input.js_level").val();
    var nextLevel = nextObj.find("input.js_level").val();

    if(!thisLevel){
        thisLevel = 0;
    }

    if(!preLevel){
        preLevel = 0;
    }

    if(!nextLevel){
        nextLevel = 0;
    }

    // console.log(thisLevel);
    // console.log(nextLevel);

    if(thisLevel >= nextLevel){
        thisObj.remove();
        // 让非复合选项可选
        $('.js_type').trigger("change");
    }else{
        alert('请先删除子参数');return;
    }
}

function replaceAll(originalStr,oldStr,newStr){
    var regExp = new RegExp(oldStr,"gm");
    return originalStr.replace(regExp,newStr)
}

// 根据表格获取json字符串
function getTableJson(tableId) {

    var trObj = $('#' + tableId).find('tbody').find('tr');

    if(trObj.length <= 0){
        return '';
    }

    var json = "[";
    var i = 0;
    var j = 0;

    trObj.each(function() {
        i = i + 1;
        j = 0;
        if (i != 1){
            json += ",";
        }

        json += "{";
        $(this).find('td').find('input').each(function(i, val) {
            j = j + 1;
            if (j != 1){
                json += ",";
            }
            json += "\"" + val.name + "\":\"" + replaceAll(val.value,'"','\\"') + "\""
        });
        $(this).find('td').find('select').each(function(i, val) {
            j = j + 1;
            if (j != 1){
                json += ",";
            }

            json += "\"" + val.name + "\":\"" + replaceAll(val.value,'"','\\"') + "\""
        });
        json += "}"
    });
    json += "]";
    return json;
}

// 取消保存
function cancelSave() {
    confirm('您编辑的内容还没有保存，确定要退出吗？', function () {
        window.location.reload();
    });
}