dynForm = {
    jsonSchema : {
	    title : trad.addjobs,
	    icon : "briefcase",
	    type : "object",
	    onLoads : {
	    	//pour creer un subevnt depuis un event existant
	    	sub : function(){
	    		dyFInputs.setSub("bg-azure");
	    	}, 
	    	onload : function(data){
	    		$("#ajax-modal .modal-header").removeClass("bg-dark bg-purple bg-red bg-azure bg-green bg-green-poi bg-orange bg-yellow bg-blue bg-turq bg-url")
							  					  .addClass("bg-azure");

	    		if(data && data.section){
	    			$("#ajaxFormModal #id").val(data.id);
	    			$(".breadcrumbcustom").html( "<h4><a href='javascript:;'' class='btn btn-xs btn-danger'  onclick='dyFObj.elementObj.dynForm.jsonSchema.actions.clear()'><i class='fa fa-times'></i></a> "+tradCategory[data.section]+" > "+tradCategory[data.type]+" > "+tradCategory[data.subtype]+"</h4>" );
					$(".sectionBtntagList").hide();
					$(".categoryBtntagList").hide();
	    		} else
	    			$(".categoryBtntagList, .nametext, .descriptiontextarea, .pricetext, .contactInfotext, .locationlocation, .imageuploader, .formshowerscustom, .tagstags, #btn-submit-form").hide();

	    		contextDataId = userId;
	    		contextDataType = "citoyens";
	    		if(contextData != null && contextData.type && contextData.id )
	    		{
    				contextDataId = contextData.id;
	    			contextDataType = contextData.type;
	    		} 
	    		$('#ajaxFormModal #parentId').val(contextDataId);
	    		$("#ajaxFormModal #parentType").val( contextDataType ); 
	    		$("#ajaxFormModal #category").val( "jobs" );
	    	},
	    },

	    beforeSave : function(){
	    	
	    	var tagAndTypes = ( $("#ajaxFormModal #tags").val() != "" ) ? $("#ajaxFormModal #tags").val()+"," : "" ;

	    	if( $("#ajaxFormModal #section").val() )
	    		tagAndTypes += $("#ajaxFormModal #section").val();//+","+tradCategory[$("#ajaxFormModal #section").val()];
	    	if( $("#ajaxFormModal #type").val() )
	    		tagAndTypes += ","+$("#ajaxFormModal #type").val();//+","+tradCategory[$("#ajaxFormModal #type").val()];
	    	if( $("#ajaxFormModal #subtype").val() )
	    		tagAndTypes += ","+$("#ajaxFormModal #subtype").val();//+","+tradCategory[$("#ajaxFormModal #subtype").val()];
	    	$("#ajaxFormModal #tags").val( tagAndTypes );

	    	if( typeof $("#ajaxFormModal #description").code === 'function' )  
	    		$("#ajaxFormModal #description").val( $("#ajaxFormModal #description").code() );
	    	if($('#ajaxFormModal #parentId').val() == "" && $('#ajaxFormModal #parentType').val() ){
		    	$('#ajaxFormModal #parentId').val( userId );
		    	$("#ajaxFormModal #parentType").val( "citoyens" ); 
		    }
	    },
	    beforeBuild : function(){
	    	dyFObj.setMongoId('classifieds', function(){
	    		uploadObj.gotoUrl = (contextData != null && contextData.type && contextData.id ) ? "#page.type."+contextData.type+".id."+contextData.id+".view.directory.dir.jobs" : location.hash;
	    	});
	    },
		afterSave : function(){
			if( $('.fine-uploader-manual-trigger').fineUploader('getUploads').length > 0 )
		    	$('.fine-uploader-manual-trigger').fineUploader('uploadStoredFiles');
		    else { 
	          dyFObj.closeForm(); 
	          urlCtrl.loadByHash( uploadObj.gotoUrl );
	        }
	    },
	    actions : {
	    	clear : function() {
	    		
	    		$("#ajaxFormModal #section, #ajaxFormModal #type, #ajaxFormModal #subtype").val("");

	    		$(".breadcrumbcustom").html( "");
	    		$(".sectionBtntagList").show(); 
	    		$(".categoryBtntagList").hide(); 
	    		$(".subtypeSection").html("");
	    		$(".subtypeSectioncustom").show();
	    		$(".categoryBtntagList, .nametext, .descriptiontextarea, .pricetext, .contactInfotext, .locationlocation, .imageuploader, .formshowerscustom, .tagstags").hide();
	    	}
	    },
	    properties : {
	    	info : {
                inputType : "custom",
                html:"<p><i class='fa fa-info-circle'></i> Jobs i need or tell your offers.</p>",
            },
            breadcrumb : {
                inputType : "custom",
                html:"",
            },
            sectionBtn :{
                label : tradDynForm.whichRessourceType ,
	            inputType : "tagList",
                placeholder : "Choisir un type",
                list : modules.classifieds.jobs.categories.sections,
                trad : trad,
                init : function(){
                	$(".sectionBtn").off().on("click",function()
	            	{
	            		$(".categoryBtntagList").show();
	            		$(".sectionBtn").removeClass("active btn-dark-blue text-white");
	            		$( "."+$(this).data('key')+"Btn" ).toggleClass("active btn-dark-blue text-white");
	            		$("#ajaxFormModal #section").val( ( $(this).hasClass('active') ) ? $(this).data('key') : "" );
						//$(".sectionBtn:not(.active)").hide();
						var sectionKey = $(this).data('key');
						//alert(sectionKey);
						var what = { title : tradDynForm.inwhichcategoryforclassified+" ?", 
				                         icon : modules.classifieds.jobs.categories.sections[sectionKey].icon }
						if( jsonHelper.notNull( "modules.jobs.categories.sections."+sectionKey+".filters" ) ){
				            //alert('build btns menu'+classified.sections[sectionKey].filters);
				            modules.classifieds.jobs.categories.currentLeftFilters = modules.classifieds.jobs.categories.sections[sectionKey].filters;
				            var filters = ressource[modules.classifieds.jobs.categories.currentLeftFilters]; 
				            directory.sectionFilter( filters, ".categoryBtntagList",what,'btn');
				            dyFObj.elementObj.dynForm.jsonSchema.actions.initTypeBtn();
				        }
				        else if( modules.classifieds.jobs.categories.currentLeftFilters != null ) {
				            //alert('rebuild common list'); 
				            directory.sectionFilter( modules.classifieds.jobs.categories.filters, ".categoryBtntagList",what,'btn');
				            dyFObj.elementObj.dynForm.jsonSchema.actions.initTypeBtn()
				            modules.classifieds.jobs.categories.currentLeftFilters = null;
				        }
						$(".breadcrumbcustom").html( "<h4><a href='javascript:;'' class='btn btn-xs btn-danger'  onclick='dyFObj.elementObj.dynForm.jsonSchema.actions.clear()'><i class='fa fa-times'></i></a> "+$(this).data('tag')+"</h4>");
						$(".sectionBtntagList").hide();
	            	});
	            }
            },
            section : dyFInputs.inputHidden(),
	        categoryBtn :{
                label : tradCategory["Type of ressource"],
	            inputType : "tagList",
                placeholder : tradCategory["Choose a category"],
                list : modules.classifieds.jobs.categories.filters,
                init : function(){
	            	$(".typeBtn").off().on("click",function()
	            	{
	            		
	            		$(".typeBtn").removeClass("active btn-dark-blue text-white");
	            		$( "."+$(this).data('key')+"Btn" ).toggleClass("active btn-dark-blue text-white");
	            		$("#ajaxFormModal #type").val( ( $(this).hasClass('active') ) ? $(this).data('tag') : "" );
	            		
	            		$(".breadcrumbcustom").html( 
	            			"<h4><a href='javascript:;'' class='btn btn-xs btn-danger' "+
	            					"onclick='dyFObj.elementObj.dynForm.jsonSchema.actions.clear()'>"+
	            					"<i class='fa fa-times'></i></a> "+
	            					$(".sectionBtn.active").data('tag')+" > "+
	            					$(".typeBtn.active").data('tag')+
	            			"</h4>" );
	            		$(".categoryBtntagList").hide();

	            		//$(".typeBtn:not(.active)").hide();
	            		$("#ajaxFormModal #subtype").val("");
	            		fieldHTML = "";
	            		$.each(modules.classifieds.jobs.categories.subcat, function(k,v) { 
	            			fieldHTML += '<div class="col-md-6 padding-5">'+
        									'<a class="btn tagListEl subtypeBtn '+k+'Btn " data-tag="'+v.key+'" data-lbl="'+tradCategory[v.key]+'" href="javascript:;">'+tradCategory[v.key]+'</a>' +
	            						"</div>";
	            		});
	            		$(".subtypeSection").html('<hr class="col-md-12 no-padding">'+
	            								  '<label class="col-md-12 text-left control-label no-padding" for="typeBtn">'+
	            								  	'<i class="fa fa-chevron-down"></i> ' + tradCategory["Sub category"] +
	            								  '</label>' +
	            								  fieldHTML );

	            		$(".subtypeBtn").off().on("click",function(){
		            		$( ".subtypeBtn" ).removeClass("active");
		            		$(this).addClass("active");
		            		var subtype = ( $(this).hasClass('active') ) ? $(this).data('tag') : "";
		            		subtype = subtype != "" ? subtype : "";
		            		$("#ajaxFormModal #subtype").val( subtype );
		            		$(".nametext, .descriptiontextarea, .pricetext, .contactInfotext, .locationlocation, .imageuploader, .formshowerscustom, .tagstags").show();
		            		//$(".subtypeBtn:not(.active)").hide();

		            		$(".breadcrumbcustom").html( "<h4><a href='javascript:;'' class='btn btn-xs btn-danger' "+
		            											"onclick='dyFObj.elementObj.dynForm.jsonSchema.actions.clear()'>"+
		            											"<i class='fa fa-times'></i>"+
		            										  "</a> "+
		            										  $(".sectionBtn.active").data('tag')+" > "+
		            										  $(".typeBtn.active").data('tag')	 +" > "+
		            										  $(".subtypeBtn.active").data('lbl')+
		            									 "</h4>");
		            		$(".subtypeSectioncustom").hide();
						});
	            	});
	            }
            },
            category : dyFInputs.inputHidden(),
            subtypeSection : {
                inputType : "custom",
                html:"<div class='subtypeSection'></div>"
            },
            subtype : dyFInputs.inputHidden(),
            name : dyFInputs.name("job"),
	        image : dyFInputs.image(),
	        price : dyFInputs.price(),
            devise : dyFInputs.inputSelect(tradDynForm.currency, tradDynForm.indicatethemoneyused, deviseTheme),
            description : dyFInputs.textarea("Description", "..."),
            location : dyFInputs.location,
            tags :dyFInputs.tags(),
            formshowers : {
            	label : "En détails",
                inputType : "custom",
                html: "<a class='btn btn-default text-dark w100p' href='javascript:;' onclick='$(\".urlsarray\").slideToggle()'><i class='fa fa-plus'></i> options (urls)</a>",
            },
            urls : dyFInputs.urlsOptionnel,
            parentId : dyFInputs.inputHidden(),
            parentType : dyFInputs.inputHidden(),
            type : dyFInputs.inputHidden(),
	    }
	}
};