(function($) {
	$.fn.gallery = function(opts) {
		$.fn.gallery.defaults = {
			picsPerPage: 7,
			hideCaptions: false,
			consumeTitle: true,
			useTitle: true,
			galleryClass: 'gallery',
			float: "left"
		};
		var opts = $.extend({}, $.fn.gallery.defaults, opts);
		
		return this.each(function(){
			if (this.tagName != "UL") return this;
			var ul = $(this);
			
			var id = ul.attr("id");
			
			var numPics = ul.children("li").length;
			//ul.children(":nth-child(7n)").addClass("last");
			ul.children("li:last").addClass("last");
			ul.removeAttr("id").removeClass("gallery").addClass("index").children("li").children(":not(img.thumbnail)").hide();
			ul.wrap('<div class="' + opts.galleryClass + ' dynamic"></div>').addClass("index");
			var gallery = $(ul).parent("div");
			if (opts.float == "left") gallery.css("float", "left");
			else if (opts.float == "right") gallery.css("float", "right");
			gallery.prepend('<div class="frame"><div class="current"></div><div class="move-prev"></div><div class="move-next"></div><a class="button-left">&lt; Previous</a><a class="button-right">Next &gt;</a><div class="caption"></div></div>');
			var titleElement = $(gallery).prev(":header");
			var title = "";
			if (titleElement.length) {
				title = titleElement.html();
				if (opts.consumeTitle) titleElement.remove();
				if (opts.useTitle) $(gallery).find(".caption").prepend("<h2>" + title + "</h2>");
			}
			gallery.attr("id", id).attr("num-pics", numPics);
			gallery.find("ul.index").insertBefore(gallery.find("div.caption"));
			if (numPics > 1) {
				gallery.find(".move-prev, .move-next").hover(
					function() {
						var idx = parseInt(gallery.attr("idx"));
						var dir = "prev";
						if ($(this).hasClass("move-next")) {
						    idx++;
						    dir = "next";
						} else idx--;
						if (idx < 1) return;
						if (idx > numPics) return;
						$(this).addClass(dir + "-hover");
					},
					function() {
						$(this).removeClass("next-hover").removeClass("prev-hover");
					}
				).click(function() {
					var idx = parseInt(gallery.attr("idx"));
					if ($(this).hasClass("move-next")) idx++;
					else idx--;
					idx = idx < 1 ? 1 : idx > numPics ? numPics : idx;
					Gallery_GoToPicture(gallery, idx);
				});
			}
			var button_previous = gallery.find("a.button-left");
			var button_next = gallery.find("a.button-right");
			var frame = gallery.children(".frame");
			var move_next = gallery.find(".move-next");
			var thumbnail_width = gallery.find("ul.index li:first").outerWidth();
			var frame_width = 674; //opts.picsPerPage * thumbnail_width + button_previous.outerWidth() + button_next.outerWidth();
			frame.css("width", frame_width);
            var frame_outer_width = frame.outerWidth();
            var new_frame_width = frame_width - (frame_outer_width - frame_width);
            frame.css("width", new_frame_width);
			gallery.css("width", frame_width);
			var frame_width = frame.innerWidth();
			var index_width = frame_width; // - button_previous.outerWidth() - button_next.outerWidth();
			var thumbnails_width = 0;
			var li = ul.children("li");
			var has_captions = false;
			li.hover(
				//function() {
					//if (!$(this).hasClass("active")) $(this).children("img.thumbnail").stop(true, false).fadeTo("fast", 0.5); // lower opacity for overlay effect or change to 1 to remove
				//},
				function() {
					if (!$(this).hasClass("active")) $(this).children("img.thumbnail").stop(true, false).fadeTo("fast", 1);
				}
			).each(function(idx) {
				if (!has_captions) has_captions = has_captions || $(this).find(":not(img.thumbnail,img.large)").length > 0;
				$(this).css({
					left: thumbnails_width + "px",
					float: "left" //added for ul li wrapping at 7 images
				});
				thumbnails_width += $(this).outerWidth();
				if (numPics > 1) 
					$(this).click(function() {
						Gallery_GoToPicture(gallery, idx + 1);
					});
			});
			if (opts.hideCaptions || !has_captions) gallery.addClass("no-captions");
			ul.css("width", 693 + "px"); //added 19 for right padding on last li in row
			
			var num_pages = Math.ceil(thumbnails_width / index_width);
			$(gallery).attr({pages: num_pages, current_page: 1, index_width: index_width});
	
			button_previous.addClass("disabled").show().click(function() {
				Gallery_Slide(gallery, 1);
			}).hover(
				function() { $(this).addClass("hover");	}, function() { $(this).removeClass("hover"); }
			);
			button_next.css("right", 0).show().click(function() {
				Gallery_Slide(gallery, -1);
			}).hover(
				function() { $(this).addClass("hover"); }, function() { $(this).removeClass("hover"); }
			);
						
			Gallery_GoToPicture(gallery, 1);
			
			return $(gallery);
		});
		
		function Gallery_Slide(gallery, dir) {
			var current_page = parseInt($(gallery).attr("current_page"));
			var num_pages = parseInt($(gallery).attr("pages"));
			var index_width = parseInt($(gallery).attr("index_width"));
			var ul = $(gallery).find("ul.index");
			var button_previous = $(gallery).find("a.button-left");
			var button_next = $(gallery).find("a.button-right");
			
			if (dir == -1 && current_page >= num_pages || dir == 1 && current_page == 1) return;
			current_page -= dir;
			if (dir == 1) current_page = current_page - 1;
			else current_page = current_page + 1;

			$(gallery).attr("current_page", current_page);
			
			if (dir == 1) {
				if (current_page == 1) $(button_previous).addClass("disabled");
				$(button_next).removeClass("disabled");
			} else {
				if (current_page >= num_pages) $(button_next).addClass("disabled");
				$(button_previous).removeClass("disabled");
			}
		}
		function Gallery_GoToPicture(gallery, idx) {
			if ($(gallery).find("ul.index li[showing]").length) return;

			var current_page = parseInt($(gallery).attr("current_page"));
			var button_previous = $(gallery).find("a.button-left");
			var button_next = $(gallery).find("a.button-right");
			var frame = $(gallery).children(".frame");
			var frame_width = frame.outerWidth();
			var index_width = frame_width; //- button_previous.outerWidth() - button_next.outerWidth();
			var ul = $(gallery).find("ul.index");
			var li = $(gallery).find("ul.index li:nth-child(" + idx + ")");
			var li_left = li.position().left;
			var li_width = li.outerWidth();
			var ul_left = ul.position().left;
			var ul_width = ul.outerWidth();
			var li_offset = li_width * idx;
			var num_pics = ul.children("li").length;
			var num_pics_per_page = Math.floor(index_width / li_width);
			var num_pages = ul_width / index_width;
			var pic_page = Math.ceil(idx / num_pics_per_page);
			
			$(li).attr("showing", 1);
			
			var previous_pic = $(gallery).find("ul.index li.active");
			previous_pic.removeClass("active").children("img.thumbnail").fadeTo("fast", 1).end().children(".current-position-mask, .current-position-caption").fadeOut(0, function() { $(this).remove(); } );
			var current = $(gallery).find(".frame .current");
			var next = current.clone().hide().removeClass("current").addClass("next").show();
			var captionSpace = $(gallery).find(".frame .caption");
			var current_position = $('<div class="current-position-mask"></div><div class="current-position-caption"></div>');
			li.append(current_position);
			var current_position_mask = li.children(".current-position-mask");
			var current_position_caption = li.children(".current-position-caption");

			//current_position_caption.css("top", li.outerHeight() / 2 - current_position_caption.innerHeight() / 2);//current_position_caption.css("top",0);
			li.addClass("active").children("img.thumbnail").fadeIn("fast");
			current_position_mask.css("opacity",0.3).fadeIn("fast"); 
			current_position_mask.removeAttr("style"); // FIX for IE display block rendering
			current_position_caption.fadeIn("fast");
			//current_position_caption.css({"position":"absolute", "top": 0 + "px"});
						
			var img = li.children("img.large").attr("src");
			var caption = li.children(":not(img.thumbnail,img.large)").clone().show();
			next.css({
				backgroundImage: "url(" + img + ")"
			});
			next.insertBefore(current);
			$("*:not(h2)",captionSpace).remove();
			captionSpace.append(caption);
			current.fadeOut("normal", function() {
				$(this).remove();
				next.addClass("current").removeClass("next");
				$(gallery).find("ul.index li[showing]").removeAttr("showing");
			});
			var numPics = parseInt($(gallery).attr("num-pics"));
			if (numPics > 1) {
				$(gallery).find(".move-prev").show();
				$(gallery).find(".move-next").show();
				if (idx == 1) {
					$(gallery).find(".move-prev").hide();
				} else if (idx == numPics) {
					$(gallery).find(".move-next").hide();
				}
			}
			$(gallery).attr("idx", idx);
		}
	};
})(jQuery);

