var num = 0
var start_time = null
var end_time = null
var run_time = 20000
var tab_interval_time = 1500
var urls_interval_time = 2000
var is_run = '2'
var res = {}
var msg = {}
var base_url = "http://c-bcg.bwe.io/plug_in/"
var task_url = "http://c-bcg.bwe.io/sc_pro/api/index.php/"
var task_id = null

// shareasale
var shareasale_run = false
var shareasale_is_login = false

// extension id
var extension_id = chrome.runtime.id

setInterval(function(){
	$.ajax({
		url: base_url + 'provider.php?act=init&type=competitor',
		type: 'get',
		data: {},
		dataType: 'json',
		async: true,
		success: function(data) {
			let competitor_ = data.competitor
			competitor_ = JSON.parse(competitor_)
			competitor_ = competitor_[extension_id]
						
			run_time = competitor_.run_time
			tab_interval_time = competitor_.tab_interval_time
			urls_interval_time = competitor_.urls_interval_time
			
			if(is_run != competitor_.is_run) {
				if(competitor_.is_run == '1') {
					is_run = '1'
					competitor()
				} else {
					is_run = '2'
				}
			}
		} 
	});
}, 60000)

// ------------------------------------------ 爬虫 ------------------------------------------
async function competitor() {
	start_time = (new Date()).getTime()
	
	$.ajax({
		url: task_url + 'GetTask?client_id=plug_in&task_type=get_page_content',
		// url: base_url + 'provider.php?act=aaaaaaaaaaaaaaa',
		type: 'get',
		data: {},
		dataType: 'json',
		async: true,
		success: function(data) {
			if(data.results.hasOwnProperty('task_id')) {
				task_id = data.results.task_id
				msg = data.results.urls.url	
			}
		}
	}).then(function() {
		for (let k in msg) {
			chrome.tabs.create({url: msg[k]}, function(tab) {
				res[tab.id] = {url: msg[k]}
			})
			num = num + 1
			sleep(tab_interval_time)
		}
		
		let interval = setInterval(async function() {
			end_time = (new Date()).getTime()
			if((end_time - start_time) >= run_time && num > 0) {
				for (let tab_id in res) {
					if(typeof res[tab_id]['html'] == 'undefined') {
						res[tab_id]['html'] = 'empty content'
						res[tab_id]['code'] = '404'
						chrome.tabs.remove(parseInt(tab_id))
					}
				}
				num = 0
			}
			
			if(num == 0) {
				await postCrawlerRes(res)
				res = {}
				if(is_run == '1') {
					setTimeout(function(){
						competitor()
					}, urls_interval_time)
				}
				clearInterval(interval)
			}
		}, 1000)
	})
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if(num > 0 && request.hasOwnProperty('html') && typeof res[sender.tab.id] != 'undefined') {
		res[sender.tab.id]['html'] = request.html
		res[sender.tab.id]['code'] = request.code
		sendResponse('收到html信息！')
		chrome.tabs.remove(sender.tab.id)
		num = num - 1
		// sleep(1000)
	} else if(request.hasOwnProperty('shareasale')) {
		shareasale_is_login = request.shareasale.login.is
		sendResponse('background 收到')
	}
})

function postCrawlerRes(list) {
	$.ajax({
		url: base_url + 'provider.php?act=crawler_res&task_id=' + task_id,
		type: 'post',
		data: {data: list, extension_id: extension_id},
		dataType: 'json',
		async: true,
		success: function(data) {
			console.log(data)
		} 
	});
	return;
}

// ------------------------------------------ 爬虫 end ------------------------------------------


// ------------------------------------------ shareasale ------------------------------------------
function event_(key) {
	let obj = null
	$.ajax({
		url: base_url + 'provider.php?act=init',
		type: 'get',
		data: {key: key},
		dataType: 'json',
		async: false,
		success: function(data) {
			obj = JSON.parse(data.shareasale)
			console.log(obj)
		}
	}).then(function() {
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			console.log(tabs)
			chrome.tabs.update(tabs[0].id, {url: obj.url}, function() {})
		})
	})
}

// ------------------------------------------ shareasale end ------------------------------------------


//第一种，使用while循环
function sleep(delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
        continue;
    }
}