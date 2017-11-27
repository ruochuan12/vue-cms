/**
 * @desc 后台运营系统CMS界面
 * @version 0.1.0
 * @author 轩辕Rowboat lxchuan12@163.com
 * @date 2016-09-27
 * @update 2017-11-25
 * @copyright 2017
 */
Vue.config.debug = true;// 开启vue 调试功能
new Vue({
    el: '.component-wrap',
    data: {
        // 是否在拖拽中
        dragging: false,
        // 导航索引值
        navIndex:'',
        /* json数据结构 */
        compData:[],
        //正在编辑的数据
        isEdit:{
            // 编辑时显示隐藏
            isEditing:false,
            // 第几行
            index:0,
            // 第几行的第几个
            key:0,
            // 图片链接
            link:'',
            // 图片说明文字
            captions:''
        }
    },
    created:function(){
        // 左侧默认不展开
        this.navIndex = -1;
    },
    methods: {
        //点击添加组件
        addItem:function (compType) {
            // 添加一条数据，单张图片
            // 单张图片
            if (compType === 'PICTURE1') {
                this.compData.push(
                    {
                        moduleId:1,//图片组件标识
                        sort:1,
                        compType:compType,
                        contents:[
                            {
                                image: '',	//图片
                                link:'http://',	//图片链接
                                captions:'' //说明文字
                            }
                        ]
                    }
                );
            }
            //一行两张图片
            if (compType === 'PICTUREMIX2') {
                this.compData.push(
                    {
                        moduleId:1,
                        sort:1,
                        compType:compType,
                        contents:[
                            {
                                image: '',	//图片
                                link:'http://',	//图片链接
                                captions:'' //说明文字
                            },
                            {
                                image: '',
                                link:'http://',
                                captions:'' 
                            }
                        ]
                    }
                );
            }
            if (compType === 'PICTUREMIX3'||compType === 'PICTUREMIXL1R2'||compType === 'PICTUREMIXL2R1') {
                this.compData.push(
                    {
                        moduleId:1,
                        sort:1,
                        compType:compType,
                        contents:[
                            {
                                image: '',	//图片
                                link:'http://',	//图片链接
                                captions:'' //说明文字
                            },
                            {
                                image: '',
                                link:'http://',
                                captions:''
                            },
                            {
                                image: '',  //图片
                                link:'http://',    //图片链接
                                captions:'' //说明文字
                            }
                        ]
                    }
                );
            }
        },
        // 切换组件
        switchTab:function(_index){
            if(this.navIndex === _index){
                this.navIndex = -1;
            }else{
                this.navIndex = _index;
            };
        },
        /**
         * desc 上传图片
         * author lxchuan12@163.com
         * date 2017-11-18
         * @param {Object} 事件
         * @param {index} 竖向索引值
         * @param {key} 行索引值
         */
        onFileChange(e,index,key) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)return; 
            this.createImage(files,index,key);
        },
        createImage(files,index,key) {
            if(typeof FileReader==='undefined'){
                alert('您的浏览器不支持图片上传，请升级您的浏览器');
                return false;
            }
            var vm = this;
            var image = new Image();
            var leng = files.length;
            for(var i=0;i<leng;i++){
                var reader = new FileReader();
                reader.readAsDataURL(files[i]);
                reader.onload =function(e){
                    // vm.images.push(e.target.result);
                    vm.compData[index].contents[key].image = e.target.result;
                };
            }
        },
        // 删除当前的图片
        delImage:function(index,key){
            this.compData[index].contents[key].image='';
        },
        // 删除当前的这个节点
        removeNode:function(index){
            if(window.confirm("您确定要删除这条数据吗？")){
                // 如果删除当前在编辑的，编辑栏隐藏。
                if(this.isEdit.index===index){
                    // 默认第一个是编辑状态
                    this.isEdit.isEditing = false;
                    this.isEdit.index = 0;
                    this.isEdit.key = 0;
                }
                this.compData.splice(index,1);
            }
        },
        // 升序
        sortNodeUp:function(index){
            if(index === 0){
                window.alert('已经到顶了');
                return;
            }
            var dummy = this.compData[index];
            // vue1.0
            // this.compData.$set(index, this.compData[index-1]);
            // this.compData.$set(index-1, dummy);
            this.$set(this.compData, index, this.compData[index-1]);
            this.$set(this.compData, index-1, dummy);
            // 正在编辑的
            if(this.isEdit.index === index){
                this.isEdit.index = index-1;
            }else if(this.isEdit.index === index-1){
                this.isEdit.index = index;
            }
        },
        // 降序
        sortNodeDown:function(index){
            if(index === this.compData.length-1){
                window.alert('已经到底了');
                return;
            }
            var dummy = this.compData[index];
            // vue1.0
            // this.compData.$set(index, this.compData[index+1]);
            // this.compData.$set(index+1, dummy);
            this.$set(this.compData, index, this.compData[index+1]);
            this.$set(this.compData, index+1, dummy);
            // 正在编辑的
            //  console.log('正在编辑的', index);
            //  console.log(this.isEdit.index);
            if(this.isEdit.index === index){
                this.isEdit.index = index+1;
            }else if(this.isEdit.index === index+1){
                this.isEdit.index = index;
            }
        },
        // 编辑链接和标题
        editLinkTitle:function(index,key){
            this.isEdit.index = index;
            this.isEdit.key = key;
            // 正在编辑显示
            this.isEdit.isEditing = true;
            // 把数据中链接和标题赋值到input
            this.isEdit.link = this.compData[index].contents[key].link;
            this.isEdit.captions = this.compData[index].contents[key].captions;
        },
        //保存链接和标题
        saveLinkTitle:function(){
            // 把在input输入的链接和标题赋值到数据
            this.compData[this.isEdit.index].contents[this.isEdit.key].link = this.isEdit.link.trim();
            this.compData[this.isEdit.index].contents[this.isEdit.key].captions = this.isEdit.captions.trim();
            // 编辑完成隐藏
            this.isEdit.isEditing = false;
        },
        // 拖拽配置
        handleDrop: function(evt) {
            console.log('拖动前的索引：'+evt.oldIndex);
            console.log('拖动后的索引：'+evt.newIndex);
        //    // 找到最近的父节点li
        //     function closest(expr) {
        //         // 如果字符串包含位置伪类或者是个元素节点,则封装为一个dom对象,否则为0(即false的简写,用于快速跳过分支)
        //         var node = expr.nodeType ? expr: 0,
        //         nodes = dom.slice(this); //将它转换为纯数组
        //         //遍历原dom对象的节点
        //         for (var i = 0,
        //         ret = [], cur; cur = this[i++];) { //由于肯定里面都是节点,因此可以使用这种循环
        //             while (cur && cur.nodeType === 1) {
        //                 //如果是dom对象,则判定其是否包含当前节点,否则使用matchesSelector方法判定这个节点是否匹配给定的表达式expr
        //                 if (node ? nodes.indexOf(node) > -1 : matchElement(cur, expr)) {
        //                     //indexOf方法在某些浏览器需要自行实现
        //                     //是则放入选择器中
        //                     ret.push(cur);
        //                     break;
        //                 } else {
        //                     // 否则把当前节点变为其父节点
        //                     cur = cur.parentNode;
        //                 }
        //             }
        //         }
        //         //如果大于1,进行唯一化操作
        //         ret = ret.length > 1 ? dom.unique(ret) : ret;
        //         //将节点集合重新包装成一个新dom对象返回
        //         return this.labor(ret);
        //     }
        //     var liOne = itemOne.closest('li');
        //     var liTwo = itemTwo.closest('li');
        //     var dummy = this.compData[liOne.id];
        //     this.compData.$set(liOne.id, this.compData[liTwo.id]);
        //     this.compData.$set(liTwo.id, dummy);
        //     // 正在编辑时拖拽
        //     if(this.isEdit.index === liOne.id*1){
        //         this.isEdit.index = liTwo.id*1;//字符串转数字。
        //     }else if(this.isEdit.index === liTwo.id*1){
        //         this.isEdit.index = liOne.id*1;//字符串转数字。
        //     }
            /*console.log('liOne.id',liOne.id);
            console.log(liTwo.id);
            console.log('this.isEdit.index',this.isEdit.index);
            console.log('this.isEdit.key',this.isEdit.key);*/
        },
        /*　删除所有数据,暂时未使用　*/ 
        removeAll: function() {
            if(window.confirm("您确定要删除全部数据吗？")){
                this.compData = [];
            }
        },
        // 全部保存
        saveAll:function(){
            console.log('全部保存的数据', this.compData);
        }
        // uploadImage: function() {
        //     console.log(this.images);
        //     return false;
        //     var obj = {};
        //     obj.images=this.images
        //     $.ajax({
        //         type: 'post',
        //         url: "upload.php",
        //         data: obj,
        //         dataType: "json",
        //         success: function(data) {
        //             if(data.status){
        //                 alert(data.msg);
        //                 return false;
        //             }else{
        //                 alert(data.msg);
        //                 return false;
        //             }
        //         }
        //     });
        // }
    }
});