<?php
/**
 * The Template for displaying Simple Locator's Search Form
 *
 * This template can be overridden by copying it to yourtheme/simple-locator/search-form.php.
 *
 * @package SimpleLocator
 * @version 2.0.1
 *
 * All variables are available in a $template_variables array. var_dump($template_variables) to see the array.
 */

 
if ( $widget ) : 
?>
<div class="simple-locator-widget">
<span id="widget"></span>
<?php endif; ?>

<div class="simple-locator-form" data-simple-locator-form-container <?php if ( !$template_variables['resultscontainer'] ) echo 'data-simple-locator-results-wrapper'; ?>>
	
	<?php do_action('simple_locator_form_opening', $template_variables); ?>
	
	<div class="wpsl-error alert alert-error" style="display:none;" data-simple-locator-form-error></div>
	<!-- distance was a dropdown now it is set to 50 miles all the time -->
	<input type="hidden" data-simple-locator-input-distance name="wpsl_distance" class="distanceselect" value=50 />
	<img class="golf-caddies-logo" src="<?php echo esc_url( get_template_directory_uri() . '/images/golf-caddies-logo.png' ); ?>" alt="logo" >
	<!-- <img src="/wp-content/themes/bricks/assets/images/golf-caddies-logo.png" /> -->
    <h1 class="logo">COURSE CADDIES</h1>
    <p class="tagline">Find Your Perfect Course: Real Reviews, Real Golfers, Real Insights</p>
	<div class="search-box address-input form-field">
		<input type="text" id="wpsl_address" placeholder="Find Your Next Course" data-simple-locator-input-address name="address" class="address wpsl-search-form search-input" placeholder="<?php echo $placeholder; ?>" <?php if ( $autocomplete ) echo ' data-simple-locator-autocomplete'; ?> />
	</div>
		
	<?php do_action('simple_locator_form_taxonomy_fields', $template_variables); ?>
	<div class="submit">
		<?php
		do_action('simple_locator_form_hidden_fields', $template_variables);
		?>
		<button type="submit" data-simple-locator-submit class="wpslsubmit search-button"><?php echo html_entity_decode($buttontext); ?></button>
		<div class="geo_button_cont"></div>
		<div class="wpsl-icon-spinner"><div class="wpsl-icon-spinner-image"><img src="<?php echo apply_filters('simple_locator_results_loading_spinner', \SimpleLocator\Helpers::plugin_url() . '/assets/images/loading-spinner.svg'); ?>" class="wpsl-spinner-image" alt="<?php _e('Loading Indicator', 'simple-locator'); ?>" /></div></div>
	</div>
	</form>

	<div data-simple-locator-results class="wpsl-results"></div>

	<?php 
	if ( !$mapcontainer ) :
		$out = '<div data-simple-locator-map class="wpsl-map"';
		if ( isset($mapheight) && $mapheight !== "" ) $out .= ' style="height:' . $mapheight . 'px;"';
		if ( $show_default_map ) $out .= ' data-simple-locator-default-enabled="true"';
		if ( $perpage !== '' ) $out .= ' data-per-page="' . $perpage . '"';
		if ( $showall ) $out .= ' data-simple-locator-all-locations-map="' . $showall . '" data-include-listing="true"';
		$out .= '></div><!-- .wpsl-map test5 -->';
		echo $out;
	endif;
	?>
</div><!-- .simple-locator-form -->

<?php
if ( $widget ) echo '</div><!-- .simple-locator-widget -->';