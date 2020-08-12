var $ = jQuery;

// callback after ready the document
$(document).ready(function(){

	$('.search-form-li').on('click',function(e){
		e.stopPropagation();
		$('.search-form-li').find('#initSearchIcon').addClass('hide');
		$('.search-form-wrap').removeClass('hide').find('input.search').focus();
		$('.side-nav').addClass('hide');
	});

	$(window).on('click',function(){
		$('.search-form-li').find('#initSearchIcon').removeClass('hide');
		$('.search-form-wrap').addClass('hide');
		$('.side-nav').removeClass('hide');
	});



	$(".blog-submenu-init").dropdown({
		inDuration: 300,
		outDuration: 225,
		constrain_width: true,
		hover: false,
		alignment: 'right',
		gutter: 10,
		belowOrigin: true
	});


	$(".primary-nav .button-collapse").sideNav();


	// jwplayer video post
	(function(){
		$('.player').each(function(){
			var $this = $(this),
			defaults = {
				fileSrc : '',
				imageSrc : '',
				id : '',
				width : '100%',
				height : '100%',
				aspectratio : ''
			},
			config = {
				fileSrc : $(this).data('file-sec') || defaults.fileSrc,
				imageSrc : $(this).data('image-src') || defaults.imageSrc,
				id : $(this).attr('id'),
				width : $(this).data('width') || defaults.width,
				height : $(this).data('height') || defaults.height,
				aspectratio : $(this).data('aspectratio') || defaults.aspectratio
			};

			jwplayer(config.id).setup({
				file: config.fileSrc,
				image: config.imageSrc,
				width: config.width,
				height: config.height,
				aspectratio : config.aspectratio
			});
		});
	}());


	$("html").niceScroll({
		cursorwidth: '7px',
		zindex: '9999999'
	});

});


// callback after loading the window
$(window).load(function(){

	// Preloader
    $('.loader').fadeOut();    
    $('#preloader').delay(350).fadeOut('slow');
	$('body').delay(350);



	// blog post slider
	(function(){
		var $blog_post_slider  = $('.thumb-slides-container');
		if ( $blog_post_slider.length > 0 ) {

			$blog_post_slider.each(function(){
				$(this).owlCarousel({
					singleItem : true,
				    autoPlay : true,
				    stopOnHover : true,
					slideSpeed : 800,
					transitionStyle : 'fade'
				});
			});

			$('.thumb-slides-controller a').on('click',function(e){
				e.preventDefault();

				var blog_post_slider_data = $(this).closest('.blog-post-thumb').children('.thumb-slides-container').data('owlCarousel');

				if ( $(this).hasClass('left-arrow') ) {
					blog_post_slider_data.prev();
				} else {
					blog_post_slider_data.next();
				}
			});
		}
	}());


	// favorite maker
	(function(){
		var lovedText = "You already love this", loveText = "Love this", loveClass = "active";
		$('.js-favorite').on('click', function(e){
			e.preventDefault();
			var favoriteNumb = parseInt( $(this).find('.numb').text(), 10 );
			if ( $(this).hasClass(loveClass) ) {
				$(this).removeClass(loveClass).attr('title', loveText);
				--favoriteNumb;
				$(this).find('.numb').text( favoriteNumb );
			} else {
				$(this).addClass(loveClass).attr('title', lovedText);
				++favoriteNumb;
				$(this).find('.numb').text( favoriteNumb );
			}
		});
	}());


	// Blog masonry re layout
	if ( typeof blogMsnry !== "undefined" ) {
		blogMsnry.isotope('layout');
	}
	fetchArticles();

});


// callback after resize the window
$(window).resize(function(){

	// Blog masonry re layout

	var handler = setTimeout(function(){
		if ( typeof blogMsnry !== "undefined" ) {
			blogMsnry.isotope('layout');
		}
		clearTimeout(handler);
	}, 2000);

});

function getImage(str){
	const regex = /<img.*src="(.*?)"[^>]*>/m;
	let m;
	let imgsrc = 'images/article.jpg';
	if ((m = regex.exec(str)) !== null) {
	  // The result can be accessed through the `m`-variable.
	  m.forEach((match, groupIndex) => {
		  imgsrc = match;
	  });
	}
	return imgsrc;
  }

  function shortenText(text,startingPoint ,maxLength) {
	  text = text.replace(/<.+?>/gi, " ");
	return text.length > maxLength?
	   text.slice(startingPoint, maxLength)+"...":
	   text
   }
  
  function setArticles(jsblog){
	let items = jsblog.items;
	let output = '';
	delay = 0.2;
	items.forEach(function(post) {
	  //console.log('Delay is '+delay);
	  let date = new Date(post.published).toDateString();
	  imgsrc = getImage(post.content);
	  summary=shortenText(post.content,0,230);
	  //console.log(summary);
	  like = Math.floor(Math.random() * 100)+1;
	  output+= `<article class="col-sm-6 col-md-4 single-card-box single-post">
                    <div class="card wow fadeInUpSmall" data-wow-delay="${delay}s" data-wow-duration=".7s">
                      <div class="card-image">
                        <div class="card-img-wrap">
                          <div class="blog-post-thumb waves-effect waves-block waves-light">
                            <a href="${post.url}"><img class="activator" style="width:350px;height: 200px;object-fit: cover;" src="${imgsrc}" alt="${post.title}">
                            </a>
                          </div>
                          <div class="post-body">
                            <a href="${post.url}" class="post-title-link brand-text"><h2 class="post-title">${post.title}</h2></a>
                            <p class="post-content">${summary}</p>
                          </div>
                        </div>
                      </div>
                      <div class="clearfix card-content">
                        <a href="#" class="left js-favorite" title="Love this"><i class="mdi-action-favorite"></i><span class="numb">${like}</span></a>
                        <a href="${post.url}" class="brand-text right waves-effect">Read More</a>
                      </div>
                    </div>
                  </article>`;
	  delay+=0.2;
	});
	document.getElementById('blog-posts').innerHTML = output;
  }
  
  function fetchArticles(){
	url = "https://www.googleapis.com/blogger/v3/blogs/2604168963277021035/posts"
	key= atob("QUl6YVN5RGJ5eUk4Q2FxeV9oNDFGMVRFNEZhVGZreTVTOGtSNWhz");
	maxResults=3;
	$.ajax({
	  url: url,
	  type: "get",
	  data: {
		key,
		maxResults
	  },
	  success: function (response) {
		setArticles(response);
	  },
	  error: function (xhr) {
		  let output= `<article class="col-sm-6 col-md-4 single-card-box single-post">
		  <div class="card wow fadeInUpSmall" data-wow-delay="0.2s" data-wow-duration=".7s">
			<div class="card-image">
			  <div class="card-img-wrap">
				<div class="blog-post-thumb waves-effect waves-block waves-light">
				  <a href="#blog"><img class="activator" style="width:350px;height: 200px;object-fit: cover;" src="images/article.jpg" alt="Loading">
				  </a>
				</div>
				<div class="post-body">
				  <a href="#blog" class="post-title-link brand-text"><h2 class="post-title">Could not fetch</h2></a>
				  <p class="post-content">Articles could not be loaded. Please try again</p>
				</div>
			  </div>
			</div>
			<div class="clearfix card-content">
			  <a href="#" class="left js-favorite" title="Love this"><i class="mdi-action-favorite"></i><span class="numb">100</span></a>
			  <a href="#blog" class="brand-text right waves-effect">Error</a>
			</div>
		  </div>
		</article>`;
		$("#blog-posts").html(output);
		//Do Something to handle error
	  }
	});
  }