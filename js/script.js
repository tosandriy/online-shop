$(".item_pics").slick({ //Top Slider
	arrows: true,
	dots: false,
	infinite: true,
	vertical: false,
	speed: 1000,
	autoplay:true,
	autoplaySpeed: 400000,
	swipe: true,
	pauseOnDotsHover: true
});
$(".select_list").mCustomScrollbar({
		scrollInertia:300
	});
function countChange(el) {
	if($(el).is($(".count_plus"))){
			if(+$(".cur_selected_count").val()<30){
				$(".cur_selected_count")[0].stepUp()
			}
		}
		else{
			if(+$(".cur_selected_count").val()>1){
				$(".cur_selected_count")[0].stepDown()
			}
		}
}
function count() {
	console.log("el")
	
}
$(document).ready(function(){

	$(".filter_title").click(function(){
		$(this).parent().children(".filter_container").toggleClass("filter_opacity");
		$(this).parent().children(".filter_container").slideToggle(300);
		$(this).children(".arrow_filter").toggleClass("rotate_arrow");
    });
    $(".radio_select").click(function(e){
    	console.log($(e.target).html())
		$(".radio_select").each(function() {
	        if (!$(this).is(e.target)){
				$(this).removeClass("radio_select_open")
				$(this).parent().children(".select_list").removeClass("list-open")
		}});
		$(this).toggleClass("radio_select_open")
		$(this).parent().children(".select_list").toggleClass("list-open")
	});
	$(document).mouseup(function (e){ 
	var div = $(".radio_select"); 
	var div2 = $(".select_list_item");
	if (!div.is(e.target) && div.has(e.target).length === 0 && !div2.is(e.target) && div2.has(e.target).length === 0) {
		$(".radio_select").removeClass("radio_select_open")
		$(".select_list").removeClass("list-open")
	}
	});
	$(".size_label").click(function(){
		$(".cur_selected_size").html($('input[name=size]:checked').val());
		$(".radio_select").removeClass("radio_select_open")
		$(".select_list").removeClass("list-open")
	})
})

