var num = 0
var start_time = null
var end_time = null
var run_time = 30000
var is_run = 'false'
var res = {}
var msg = {}
var base_url = "http://139.155.227.160:8082/"


setInterval(function(){
	$.ajax({
		url: base_url + 'provider.php?act=init',
		type: 'get',
		data: {},
		dataType: 'json',
		async: true,
		success: function(data) {
			console.log(is_run)
			console.log(data)
			run_time = data.run_time
			
			if(is_run != data.is_run) {
				if(data.is_run == 'true') {
					is_run = 'true'
					competitor(data.domain)
				} else {
					is_run = 'false'
				}
			}
		} 
	});
}, 1000)

async function competitor(domain) {
	
	start_time = (new Date()).getTime()
	
	msg = await getCrawlerList(base_url, domain)
	
	console.log(msg)
	for (let domain in msg) {	
		for (let i in msg[domain]) {
			chrome.tabs.create({url: msg[domain][i]}, function(tab) {
				res[tab.id] = {domain: domain, url: msg[domain][i]}
			})
			num = num + 1
			sleep(1000)
		}
	}
	
	let interval = setInterval(async function() {
		end_time = (new Date()).getTime()
		if((end_time - start_time) >= run_time && num > 0) {
			for (let tab_id in res) {
				if(typeof res[tab_id]['html'] == 'undefined') {
					res[tab_id]['html'] = 'empty content'
					chrome.tabs.remove(parseInt(tab_id))
				}
			}
			num = 0
		}
		
		console.log('pachong setInterval ---> ' + num)
		if(num == 0) {
			console.log(res)
			await postCrawlerRes(res)
			res = {}
			if(is_run == 'true') {
				setTimeout(function(){
					competitor(domain)
				}, 2000)	
			}
			clearInterval(interval)
		}
	}, 1000)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if(num > 0 && request.hasOwnProperty('html') && typeof res[sender.tab.id] != 'undefined') {
		console.log('pachong')
		res[sender.tab.id]['html'] = request.html
		console.log(sender.tab.id)
		chrome.tabs.remove(sender.tab.id)
		num = num - 1
		sendResponse('收到html信息！')	
		sleep(1000)
	}
})

function getCrawlerList(base_url, domain) {
	let res_ = null
	$.ajax({
		url: base_url + 'provider.php',
		type: 'get',
		data: 'domain=' + domain + '&act=' + 'crawler_list',
		dataType: 'json',
		async: false,
		success: function(data) {
			res_ = data;
		} 
	});
	return res_;
}

function postCrawlerRes(list) {
	console.log(list)
	let res_ = null
	$.ajax({
		url: base_url + 'provider.php?act=crawler_res',
		type: 'post',
		data: {data: list},
		dataType: 'json',
		async: true,
		success: function(data) {
			console.log(data)
		} 
	});
	return;
}

//第一种，使用while循环
function sleep(delay) {
    var start = (new Date()).getTime();
    while((new Date()).getTime() - start < delay) {
        continue;
    }
}