<?php

class Classified {
	const COLLECTION = "classifieds";
	const CONTROLLER = "classified";
	const MODULE = "eco";
	const ICON = "fa-bullhorn";
	
	
	//From Post/Form name to database field name
	public static $dataBinding = array (
	    "section" => array("name" => "section"),
	    "type" => array("name" => "type"),
	    "category" => array("name" => "category"),
	    "subtype" => array("name" => "subtype"),
	    "name" => array("name" => "name", "rules" => array("required")),
	    "address" => array("name" => "address", "rules" => array("addressValid")),
	    "addresses" => array("name" => "addresses"),
	    "streetAddress" => array("name" => "address.streetAddress"),
	    "postalCode" => array("name" => "address.postalCode"),
	    "city" => array("name" => "address.codeInsee"),
	    "addressLocality" => array("name" => "address.addressLocality"),
	    "addressCountry" => array("name" => "address.addressCountry"),
	    "geo" => array("name" => "geo"),
	    "geoPosition" => array("name" => "geoPosition"),
	    "description" => array("name" => "description"),
	    "addresses" => array("name" => "addresses"),
	    "parentId" => array("name" => "parentId"),
	    "parentType" => array("name" => "parentType"),
	    "media" => array("name" => "media"),
	    "urls" => array("name" => "urls"),
	    "medias" => array("name" => "medias"),
	    "tags" => array("name" => "tags"),
	    "price" => array("name" => "price"),
	    "devise" => array("name" => "devise"),
	    "contactInfo" => array("name" => "contactInfo", "rules" => array("required")),

	    "modified" => array("name" => "modified"),
	    "updated" => array("name" => "updated"),
	    "creator" => array("name" => "creator"),
	    "created" => array("name" => "created"),
	    );

	//used in initJs.php for the modules definition
	public static function getConfig($context=null){
		return array(
			"collection"    => self::COLLECTION,
            "controller"   => self::CONTROLLER,
            "module"   => self::MODULE,
			"init"   => Yii::app()->getModule( self::MODULE )->assetsUrl."/js/init.js" ,
			"form"   => Yii::app()->getModule( self::MODULE )->assetsUrl."/js/".$context."dynForm.js" ,
            "categories" => CO2::getModuleContextList(self::MODULE, "categories", $context),
            "deviseTheme" 	=> array(
            	"all" => "All",
				"€" => "€",
				"Ğ1" => "Ğ1",
				"£" => "£",
				"$" => "$",
	            "CFP" => "CFP"
	        ),
    		"deviseDefault" => "All",
    		"lbhp" => true
		);
	}

	/**
	 * get a Poi By Id
	 * @param String $id : is the mongoId of the poi
	 * @return poi
	 */
	public static function getById($id) { 
	  	$classified = PHDB::findOneById( self::COLLECTION ,$id );
	  	//$classified["parent"] = Element::getElementByTypeAndId()
	  	$classified["typeClassified"] = @$classified[$key]["type"];
		$classified["type"] = "classifieds";
		$classified["gallery"] = Document::listMyDocumentByIdAndType(@$id, $classified["typeClassified"]);
	  	return $classified;
	}


	public static function getClassifiedByCreator($id){
		$allClassified = PHDB::findAndSort( self::COLLECTION , array("creator"=> $id), array("updated"=>-1));
		foreach ($allClassified as $key => $value) {
			if(@$value["creator"]){// && @$value["parentType"])
				$parent = Element::getElementById(@$value["creator"], "citoyens");//@$value["parentType"]);
				$aParent = array("name"=>@$parent["name"],
								 "profilThumbImageUrl"=>@$parent["profilThumbImageUrl"],
								);
			}else{
				$aParent=array();
			}

			$allClassified[$key]["parent"] = $aParent;
			$allClassified[$key]["typeClassified"] = @$allClassified[$key]["type"];
			$allClassified[$key]["type"] = "classifieds";
			//if(@$value["type"])
			//	$allClassified[$key]["typeSig"] = Classified::COLLECTION.".".$value["type"];
			//else
			$allClassified[$key]["typeSig"] = Classified::COLLECTION;
		}
	  	return $allClassified;
	}
	public static function getByTagsAndLimit($limitMin=0, $indexStep=15, $searchByTags=""){
		$where = array("name"=>array('$exists'=>1));
		if(@$searchByTags && !empty($searchByTags)){
			$queryTag = array();
			foreach ($searchByTags as $key => $tag) {
				if($tag != "")
					$queryTag[] = new MongoRegex("/".$tag."/i");
			}
			if(!empty($queryTag))
				$where["tags"] = array('$in' => $queryTag); 			
		}
		
		$elems = PHDB::findAndSort( self::COLLECTION, $where, array("updated" => -1));
	   	return $elems;
	}

	/**
	 * get a Ressource By Id
	 * @param String $id : is the mongoId of the Ressource
	 * @return Ressource
	 */
	/*public static function getById($id) { 
	  	$elem = PHDB::findOneById( self::COLLECTION ,$id );
	  	// Use case notragora
	  	if(@$elem["type"])
		  	$elem["typeSig"] = self::COLLECTION.".".$elem["type"];
	  	else
		  	$elem["typeSig"] = self::COLLECTION;
		if(@$elem["type"])
	  		$elem = array_merge($elem, Document::retrieveAllImagesUrl($id, self::COLLECTION, $elem["type"], $elem));

	  	$elem["gallery"] = Document::listMyDocumentByIdAndType(@$id, "ressources");
		return $elem;
	}*/

	public static function getDataBinding() {
	  	return self::$dataBinding;
	}


/*class Ressource {
	const COLLECTION = "ressources";
	const CONTROLLER = "ressources";
	const MODULE = "ressources";
	const TYPE_NEED = "needs";
	const TYPE_OFFER = "offers";
	const ICON = "fa-cubes";
	
	//TODO Translate
	public static $category = array (
		//"need"			=> "Besoin",
		//"offer"			=> "Offre",
		"service"		=> "Service",
		"competence"		=> "Competence",
		"material"		=> "Material",
		//"link" 			=> "Lien, Url",
		//"tool"			=> "Outil",
		//"machine"		=> "Machine",
		//"software"		=> "Software",
		//"rh"			=> "Ressource Humaine",
		//"RessourceMaterielle" => "Ressource Materielle",
		//"RessourceFinanciere" => "Ressource Financiere",
		//"ficheBlanche" => "Fiche Blanche",
		//"geoJson" 		=> "Url au format geojson ou vers une umap",
		//"video" 		=> "video"
	);
	
	public static $subCategory = array(

	);*/

	//From Post/Form name to database field name
	/*public static $dataBinding = array (
	    "section" => array("name" => "section"),
	    "type" => array("name" => "type"),
	    "category" => array("name" => "category"),
	    "subtype" => array("name" => "placeType"),
	    "name" => array("name" => "name", "rules" => array("required")),
	    "address" => array("name" => "address", "rules" => array("addressValid")),
	    "addresses" => array("name" => "addresses"),
	    "streetAddress" => array("name" => "address.streetAddress"),
	    "postalCode" => array("name" => "address.postalCode"),
	    "city" => array("name" => "address.codeInsee"),
	    "addressLocality" => array("name" => "address.addressLocality"),
	    "addressCountry" => array("name" => "address.addressCountry"),
	    "geo" => array("name" => "geo"),
	    "geoPosition" => array("name" => "geoPosition"),
	    "description" => array("name" => "description"),
	    "addresses" => array("name" => "addresses"),
	    "parent" => array("name" => "parent"),
	    "parentId" => array("name" => "parentId"),
	    "parentType" => array("name" => "parentType"),
	    "media" => array("name" => "media"),
	    "urls" => array("name" => "urls"),
	    "medias" => array("name" => "medias"),
	    "tags" => array("name" => "tags"),

	    "modified" => array("name" => "modified"),
	    "updated" => array("name" => "updated"),
	    "creator" => array("name" => "creator"),
	    "created" => array("name" => "created"),
	);

	//used in initJs.php for the modules definition
	public static function getConfig(){
		return array(
			"collection"    => self::COLLECTION,
            "controller"   	=> self::CONTROLLER,
            "module"   		=> self::MODULE,
			"init"   		=> Yii::app()->getModule( self::MODULE )->assetsUrl."/js/init.js" ,
			"form"   		=> Yii::app()->getModule( self::MODULE )->assetsUrl."/js/dynForm.js" ,
            "categories" 	=> CO2::getModuleContextList(self::MODULE,"categories"),
            "lbhp"			=> true
		);
	}*/

	/**
	 * get all Ressource details of an element
	 * @param type $id : is the mongoId (String) of the parent
	 * @param type $type : is the type of the parent
	 * @return list of Ressources
	 */
	/*public static function getByIdAndTypeOfParent($id, $type){
		$elems = PHDB::find(self::COLLECTION,array("parentId"=>$id,"parentType"=>$type));
	   	return $elems;
	}*/
	/**
	 * get Ressource with limit $limMin and $limMax
	 * @return list of Ressources
	 */
	/*public static function getByTagsAndLimit($limitMin=0, $indexStep=15, $searchByTags=""){
		$where = array("name"=>array('$exists'=>1));
		if(@$searchByTags && !empty($searchByTags)){
			$queryTag = array();
			foreach ($searchByTags as $key => $tag) {
				if($tag != "")
					$queryTag[] = new MongoRegex("/".$tag."/i");
			}
			if(!empty($queryTag))
				$where["tags"] = array('$in' => $queryTag); 			
		}
		
		$elems = PHDB::findAndSort( self::COLLECTION, $where, array("updated" => -1));
	   	return $elems;
	}*/

	/**
	 * get a Ressource By Id
	 * @param String $id : is the mongoId of the Ressource
	 * @return Ressource
	 */
	/*public static function getById($id) { 
	  	$elem = PHDB::findOneById( self::COLLECTION ,$id );
	  	// Use case notragora
	  	if(@$elem["type"])
		  	$elem["typeSig"] = self::COLLECTION.".".$elem["type"];
	  	else
		  	$elem["typeSig"] = self::COLLECTION;
		if(@$elem["type"])
	  		$elem = array_merge($elem, Document::retrieveAllImagesUrl($id, self::COLLECTION, $elem["type"], $elem));

	  	$elem["gallery"] = Document::listMyDocumentByIdAndType(@$id, "ressources");
		return $elem;
	}

	public static function getDataBinding() {
	  	return self::$dataBinding;
	}*/
}
?>