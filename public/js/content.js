$(function(){
	chrome.runtime.sendMessage({
	    html: document.documentElement.outerHTML
	}, res => {
	    console.log('收到: ' + res)
	})
})