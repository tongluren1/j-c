$(function(){
	if (location.host == 'account.shareasale.com') {
		setTimeout(function() {
			if (localStorage.getItem('shareasale-login') == null) {
				localStorage.setItem('shareasale-login', 'nologin')
			}
			if (localStorage.getItem('shareasale-msg') == null) {
				localStorage.setItem('shareasale-msg', '')
			}

			let login_flag = document.body.querySelectorAll('header.shell-top-1')
			if (login_flag.length > 0) {
				if (localStorage.getItem('shareasale-login') == 'nologin') {
					localStorage.setItem('shareasale-login', 'login')
				}
				
				let local_urls = localStorage.getItem('url-list')
				let node_list = document.body.querySelectorAll('div.fullResult a.joinProgramLink')
				if (local_urls == null) {
					if (node_list.length > 0) {
						let url_list = []
						for (let i=0; i<node_list.length; i++) {
							url_list.push(node_list[i].href)
						}
						console.log(url_list)
						let url_tmp = url_list.pop()
						localStorage.setItem('url-list', JSON.stringify(url_list))
						location.href = url_tmp
						return;
					} else {
						localStorage.setItem('shareasale-msg', '没有需要申请的')
						let shareasale_login = localStorage.getItem('shareasale-login')
						let shareasale_msg = localStorage.getItem('shareasale-msg')
						localStorage.removeItem('url-list')
						localStorage.removeItem('shareasale-login')
						localStorage.removeItem('shareasale-msg')
						chrome.runtime.sendMessage({
							shareasale: {
								login: shareasale_login,
								msg: shareasale_msg
							}
						}, res => {
							console.log('shareasale 收到: ' + res)
						})
					}
				} else {
					let submit = document.getElementById('confirmbutton')
					let checkbox = document.getElementById('readagreement')
					
					if(submit && checkbox) {
						checkbox.checked = true
						submit.click()
					} else {
						let url_list_tmp = JSON.parse(local_urls)
						if (url_list_tmp.length > 0) {
							let url = url_list_tmp.pop()
							localStorage.setItem('url-list', JSON.stringify(url_list_tmp))
							setTimeout(function() {
								location.href = url
							}, 2000)
						} else {
							localStorage.setItem('shareasale-msg', '完成')
							let shareasale_login = localStorage.getItem('shareasale-login')
							let shareasale_msg = localStorage.getItem('shareasale-msg')
							localStorage.removeItem('url-list')
							localStorage.removeItem('shareasale-login')
							localStorage.removeItem('shareasale-msg')
							chrome.runtime.sendMessage({
								shareasale: {
									login: shareasale_login,
									msg: shareasale_msg
								}
							}, res => {
								console.log('shareasale 收到: ' + res)
							})
						}
					}
				}
			}
		}, 2000)
	} else {
		chrome.runtime.sendMessage({
		    html: document.documentElement.outerHTML
		}, res => {
		    console.log('收到: ' + res)
		})
	}
})
