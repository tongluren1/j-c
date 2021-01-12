// var bg = chrome.extension.getBackgroundPage();

// $(function() {
// 	$.get(bg.base_url + 'provider.php?act=competitors', {}, function(res) {
// 		let obj = JSON.parse(res)
// 		$('.c-len').text(obj.competitors.length + ' 个同行')
// 		console.log(obj.competitors)
// 		for (let key in obj.competitors) {
// 			$('.competitor').append(
// 				`<a href="#" class="list-group-item s_">` + obj.competitors[key] + ` <button type="button" class="pull-right btn btn-primary btn-sm start" data-domain="` + obj.competitors[key] + `">Start</button></a>`
// 			)
// 		}
// 		$('#project .s_').css('display', 'none')
// 	})
// 	$('.competitor .active').click(function() {
// 		let display = $('#project .s_').css('display')
// 		if(display == 'none') {
// 			$('#project .s_').css('display', 'block')
// 		} else {
// 			$('#project .s_').css('display', 'none')
// 		}
		
// 	})
// })

// $(".start").click(function() {
// 	let domain = $(this).data('domain')
// 	bg.competitor(domain)
// })

// $('.allstart').click(function(e) {
// 	e.stopPropagation()
// 	bg.competitor('')
// })