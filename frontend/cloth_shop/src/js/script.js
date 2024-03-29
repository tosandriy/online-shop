$(".item_pics").slick({
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
	count = $(".cur_selected_count:not([disabled])");
	console.log(count)
		if($(el).is($(".count_plus"))){
			if(+count.val()<30){
				count[0].stepUp()
			}
		}
		else{
			if(+count.val()>1){
				count[0].stepDown()
			}
		}
	}
$(document).ready(function(){

	$(".filter_title").click(function(){
		$(this).parent().children(".filter_container").toggleClass("filter_opacity");
		$(this).parent().children(".filter_container").slideToggle(300);
		$(this).children(".arrow_filter").toggleClass("rotate_arrow");
    });
    $('.header_click_button').click(function(e){
  		e.preventDefault();
  		var target = $($(this).attr('href'));
  		if(target.length){
    		var scrollTo = target.offset().top;
    		$('body, html').animate({scrollTop: scrollTo+'px'}, 800);
    	}
	});
    $(".radio_select:not(.disabled)").click(function(event){
		//$(".radio_select").each(function() {
	        //if (!$(this).is(e.target)){
				//$(this).removeClass("radio_select_open")
				//$(this).parent().children(".select_list").removeClass("list-open")
		//}});
		event.stopPropagation();//
		$(this).toggleClass("radio_select_open")
		$(this).parent().children(".select_list").toggleClass("list-open")
	});
	$(".sort_select:not(.disabled)").click(function(e){
		e.stopPropagation();//
		$(this).parent().children(".select_list_sort").toggleClass("sort_list-open")
		$(this).children("img").toggleClass("rotate_arrow");
	});
	//$(document).mouseup(function (e){ 
	$(document).click(function (e){ //
		$(".select_list_sort").removeClass("sort_list-open");//
		$(".radio_select:not(.disabled)").removeClass("radio_select_open")//
		$(".select_list").removeClass("list-open")//
		$(".sort_select:not(.disabled)").children("img").removeClass("rotate_arrow");
		//var div = $(".sort_select"); 
		//var div2= $(".select_list_item_sort");
		//if (!div.is(e.target) && div.has(e.target).length === 0 && !div2.is(e.target) && div2.has(e.target).length === 0) {
			//$(".select_list_sort").removeClass("sort_list-open");
		//}
	});
	$(".size_label").click(function(){
		$(".cur_selected_size").html($('input[name=size]:checked').val());
		//$(".radio_select").removeClass("radio_select_open")
		//$(".select_list").removeClass("list-open")
	});
	$(".select_list_item_sort").click(function(){
		//$(".select_list_sort").removeClass("sort_list-open");
		$(".cur_select_sort").html($(this).children("label").html())
	});
	$(".change_btn_personal").click(function(){
		$(".settings_input_personal").removeAttr("disabled")
		$(".settings_save_persanal").show()
	});
	$(".settings_save_persanal").click(function(){
		$(".settings_input_personal").prop( "disabled", true );
		$(".settings_save_persanal").hide()
	});
	$(".change_btn_address").click(function(){
		$(".settings_input_address").removeAttr("disabled")
		$(".settings_save_address").show()
	});
	$(".settings_save_address").click(function(){
		$(".settings_input_address").prop( "disabled", true );
		$(".settings_save_address").hide()
	});
	$(".overlay_form").click(function(event){
		event.stopPropagation();
	});
	$(".overlay_container").click(function(){
		$(".overlay").hide();
		$(".overlay_form").hide();
		$(".login_form").css("display","flex")
	});
	$(".close_overlay").click(function(){
		$(".overlay").hide();
		$(".overlay_form").hide();
		$(".login_form").css("display","flex")
	});
	$(".signin_link").click(function(){
		$(".overlay_form").hide();
		$(".signin_form").css("display","flex")
	});
	$(".remember_link").click(function(){
		$(".overlay_form").hide();
		$(".remember_password_form").css("display","flex")
	});

})

