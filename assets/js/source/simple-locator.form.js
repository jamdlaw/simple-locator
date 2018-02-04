/**
* The Primary Form Object
* @package simple-locator
*/
var SimpleLocator = SimpleLocator || {};
SimpleLocator.Form = function()
{
	var self = this;
	var $ = jQuery;

	self.activeForm;
	self.activeFormContainer;
	self.isWidget = false;
	self.mapContainer;
	self.resultsContainer;
	self.formData;

	self.bindEvents = function()
	{
		$(document).on('click', '[' + SimpleLocator.selectors.submitButton + ']', function(e){
			e.preventDefault();
			self.activeForm = $(this).parents('[' + SimpleLocator.selectors.form + ']');
			self.activeFormContainer = $(this).parents('[' + SimpleLocator.selectors.formContainer + ']');
			self.processForm();
		});
		$(document).on('simple-locator-geolocation-success', function(e, form){
			self.activeForm = $(form);
			self.activeFormContainer = $(form).parents('[' + SimpleLocator.selectors.formContainer + ']');
			self.setResultsContainers();
			self.setFormData();
			self.submitForm();
		});
		$(document).on('simple-locator-address-geocoded', function(e, results, form){
			$(self.activeForm).find('[' + SimpleLocator.selectors.inputLatitude + ']').val(results.latitude);
			$(self.activeForm).find('[' + SimpleLocator.selectors.inputLongitude + ']').val(results.longitude);
			$(self.activeForm).find('[' + SimpleLocator.selectors.inputFormattedLocation + ']').val(results.formatted_address);
			self.setFormData();
			self.submitForm();
		});
	}

	/**
	* Process the form submission
	*/
	self.processForm = function(geocode)
	{
		self.toggleLoading(true);
		self.setResultsContainers();
		var geocoder = new SimpleLocator.Geocoder();
		geocoder.getCoordinates(self.activeForm);
	}

	/**
	* Set the appropriate containers for results
	*/
	self.setResultsContainers = function()
	{
		if ( $(self.activeForm).siblings('#widget').length > 0 ) self.isWidget = true;	
		self.mapContainer = ( wpsl_locator_options.mapcont === '' || self.isWidget )
			? $(self.activeFormContainer).find('[' + SimpleLocator.selectors.map + ']')
			: $(wpsl_locator_options.mapcont);
		
		self.resultsContainer = ( wpsl_locator_options.resultscontainer === '' || self.isWidget )
			? (self.activeFormContainer).find('[' + SimpleLocator.selectors.results + ']')
			: $(wpsl_locator_options.resultscontainer);
		return;
	}

	/**
	* Set the form data for processing
	*/
	self.setFormData = function(geocode_results)
	{
		var allow_empty_address = $(self.activeForm).attr('data-simple-locator-form-allow-empty');
		allow_empty_address = ( typeof allow_empty_address === 'undefined' || allow_empty_address === '' ) ? false : true;

		var address = $(self.activeForm).find('[' + SimpleLocator.selectors.inputAddress + ']');
		address = ( typeof address === 'undefined' ) ? false : $(address).val();

		var distance = $(self.activeForm).find('[' + SimpleLocator.selectors.inputDistance + ']');
		distance = ( typeof distance === 'undefined' ) ? false : $(distance).val();

		var geolocation = $(self.activeForm).find('[' + SimpleLocator.selectors.inputGeocode + ']').val();
		geolocation = ( geolocation === '' || geolocation === 'false' ) ? false : true;
		console.log(geolocation);

		self.formData = {
			address : address,
			formatted_address : $(self.activeForm).find('[' + SimpleLocator.selectors.inputFormattedLocation + ']').val(),
			distance : distance,
			latitude : $(self.activeForm).find('[' + SimpleLocator.selectors.inputLatitude + ']').val(),
			longitude :  $(self.activeForm).find('[' + SimpleLocator.selectors.inputLongitude + ']').val(),
			unit : $(self.activeForm).find('[' + SimpleLocator.selectors.inputUnit + ']').val(),
			geolocation : geolocation,
			allow_empty_address : allow_empty_address
		}

		self.setTaxonomies();

		// Custom Input Data (for SQL filter availability)
		if ( wpsl_locator.postfields.length == 0 ) return
		for ( var i = 0; i < wpsl_locator.postfields.length; i++ ){
			var field = wpsl_locator.postfields[i];
			formdata[field] = $('input[name=' + field + ']').val();
		}
	}

	/**
	* Set taxonomies in the form data if applicable
	*/
	self.setTaxonomies = function()
	{
		var taxonomyCheckboxes = $(self.activeForm).find('input[name^="taxonomy"]:checked');
		var taxonomySelect = $(self.activeForm).find('select[name^="taxonomy"]')

		var taxonomies = ( taxonomyCheckboxes.length > 0 ) ? $(taxonomyCheckboxes).serializeArray() : [];
	
		// Select Menus
		$.each(taxonomySelect, function(i, v){
			if ( $(this).val() === "" ) return;
			var selected = {};
			selected.name = $(this).attr('name');
			selected.value = $(this).val();
			taxonomies.push(selected);
		});
		
		// // Create an array from the selected taxonomies
		var taxonomy_array = {};
		$.each(taxonomies, function(i, v){
			var tax_name = this.name.replace( /(^.*\[|\].*$)/g, '' );
			if ( (typeof taxonomy_array[tax_name] == undefined) 
				|| !(taxonomy_array[tax_name] instanceof Array) ) 
				taxonomy_array[tax_name] = [];
			if ( tax_name) taxonomy_array[tax_name].push(this.value);
		});

		self.formData.taxonomies = taxonomy_array;
	}

	/**
	* Submit the form
	*/
	self.submitForm = function()
	{
		$.ajax({
			url : SimpleLocator.endpoints.search,
			type: 'GET',
			datatype: 'jsonp',
			data: self.formData,
			success: function(data){
				if ( wpsl_locator.jsdebug === '1' ){
					console.log('Form Response');
					console.log(data);
				}
				if (data.status === 'error'){
					$(document).trigger('simple-locator-error', ['form-error', self.activeForm, data.message]);
					return;
				}
				if ( data.result_count === 0 ){
					var message = wpsl_locator.nolocationserror + ' ' + data.formatted_address;
					$(document).trigger('simple-locator-error', ['form-error', self.activeForm, message]);
					return;
				}
				$(document).trigger('simple-locator-form-success', [data, self.activeForm]);
			},
			error: function(data){
				if ( wpsl_locator.jsdebug === '1' ){
					console.log('Form Response Error');
					console.log(data.responseText);
				}
			}
		});
	}

	/**
	* Toggle Loading
	*/
	self.toggleLoading = function(loading)
	{
		if ( loading ){
			$('[' + SimpleLocator.selectors.inputLatitude + ']').val('');
			$('[' + SimpleLocator.selectors.inputLongitude + ']').val('');
			$('[' + SimpleLocator.selectors.inputGeocode + ']').val('');
			$('[' + SimpleLocator.selectors.inputFormattedLocation + ']').val('');
			$(self.activeFormContainer).find('[' + SimpleLocator.selectors.formError + ']').hide();
			$(self.activeFormContainer).find('[' + SimpleLocator.selectors.results + ']').empty().addClass('loading').show();
			return;
		}
	}

	return self.bindEvents();
}