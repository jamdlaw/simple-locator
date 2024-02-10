<?php
/**
* @see SimpleLocator\Listeners\LocationSearch
* @todo Page Jump, namespace filters
*/
$has_results = ( count($this->search_data['results']) < 1 ) ? false : true;
$output = '<!-- test 55 --><div data-simple-locator-results-wrapper class="wpsl-results non-ajax';
if ( !$has_results ) $output .= ' wpsl-results-no-results';
$output .= '" style="display:block;">';

// No Results
if ( !$has_results ) $output .= $this->results_info->noResultsFoundError();

// Results
if ( $has_results ) :
	$output .= $this->results_info->resultsHeader();
	$output .= '<p>' . $this->results_info->newSearchLink() . '</p>';
	$output .= $this->results_info->currentResultCounts();
	$output .= '<div id="gc-map-and-results" >'; 
	$results_output = '<div class="wpsl-results-wrapper">';
	foreach($this->search_data['results'] as $result) :
		//$result['output'] is a html <p> tag
		$results_output .= $result['output'];
		$results_output .= '<div>' . get_the_post_thumbnail($result['id']) . '</div>';
		$results_output .= '<div>' .  do_shortcode( '[site_review post_id="658"]' ) . '</div>';  
	endforeach;
	$results_output .= '</div>';
	$output .= apply_filters('simple_locator_non_ajax_results_output', $results_output, $this->request, $this->search_data);

	$output .= '<div class="simple-locator-non-ajax-pagination">';
	$output .= $this->results_info->pagination('back');
	$output .= $this->results_info->pagination('next');
	$output .= $this->results_info->goToPage();
	$output .= $this->results_info->pagePosition();
	$output .= '</div>';

	$output .= '<div data-simple-locator-map-non-ajax class="wpsl-map loading"';
	if ( isset($this->request['mapheight']) && $this->request['mapheight'] !== "" )  $output .= 'style="height:' . $this->request['mapheight'] . 'px;"';
	$output .= ' data-latitude="' . $this->request['latitude'] . '"';
	$output .= ' data-longitude="' . $this->request['longitude'] . '"';
	$output .= '></div><!-- .wpsl-map -->';
	$output .= '</div>';

endif;

$output .= '</div><!-- .wpsl-results -->';