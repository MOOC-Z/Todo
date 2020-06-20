(function (Vue) {

	const STORAGE_KEY = 'item';

	const localstorage ={

		fetch:function(){

			return JSON.parse(
				localStorage.getItem(STORAGE_KEY)||'[]'
			)
		},

		save:function(items){

			localStorage.setItem(STORAGE_KEY,JSON.stringify(items))
		}
	}
	const items = [

		{
			id:1,
			content:'1',
			completed:false
		},
		{
			id:2,
			content:'2',
			completed:false
		},
		{
			id:3,
			content:'3',
			completed:false
		}

	]

	Vue.directive('focus',{
		inserted(el,binding){
			el.focus();
		},
		update(el,binding) {
			if(binding.value)
			el.focus();
		},
	})

	var vm = new Vue({
		el:'#todoapp',
		data:{
			title:'Todo',
			items:localstorage.fetch(),
			currentItem:null,
			filterStatus:'all'
		},
		computed: {
			filter(){
				switch (this.filterStatus) {
					case 'active':
						return this.items.filter(function(i){
							return	!i.completed;
						})
						break;
					case 'completed':
						return this.items.filter(i=>i.completed);
						break;
					default:
						return this.items;
						break;
				}
			},
			toggleAll:{
				get(){
					return this.remain === 0;
				},
				set(newStatus){
					this.items.forEach(function(i){
						i.completed = newStatus;
					})
				}
			},
			remain(){
				const unitems = this.items.filter(function(i){
					return i.completed === false;
				});
				return unitems.length;
			}
		},
		methods: {
			//完成编辑，保存数据
			enter(item,index,e){
				// 获取当前输入框的值
				const content = e.target.value.trim();
				// 判断输入框的值是否为空，如果为空，删除事件项
				if(!content){
					this.removeItem(index);
					return;
				}
				// 否则，更新事件项
				else{
					item.content = content;
				}
				// 取消editing的作用，退出编辑状态
				this.currentItem = null;
			},
			//取消编辑状态
			esc(){
				this.currentItem = null;
			},
			//进入双击编辑状态
			dblc(item){
				this.currentItem = item;
			},
			clearItems(){
				this.items = this.items(i => !i.completed );
			},
			removeItem(index){

				this.items.splice(index,1);
			},
			addItem(){
				const content = e.target.value.trim();
				if (!content.length){
					return;
				}
				else{
					const id = this.items.length + 1;
					this.items.push(
						{
							id,
							content,
							completed:false			//完成状态默认false
						}
					)
				}
				e.target.value = "";
			}
		},
		watch: {
			items:{
				deep:true,
				handler:function(newItems,oldItems){
					//将数据保存到本地
					localstorage.save(newItems)
				}
			}
		},
	})

	window.onhashchange = function(){

		const hash = window.location.hash.substr(2)||'all';

		vm.filterStatus = hash;
	}

	window.onhashchange();

})(Vue);
