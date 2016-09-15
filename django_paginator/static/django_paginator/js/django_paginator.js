
function updatePaginatorRow( paginator, paginator_row ) {

	/* 
	 * Note: below calls YOUR function `getPaginatorPage` which do a call
	 *       back to the view to get the firs, previous, next or last page of the queryset
	 *        based on the page number.
	 */
	
	// insert paginator row html
	$( '#paginator-row').html( paginator_row );

	// center the paginator
	$( '#paginator-row').addClass( 'text-center' ); 

	// insert the Page x or x text
	$( '#spn-pager-pages' ).text( 'Page ' + paginator.number + '/' + paginator.num_pages );

	// determine which controls should be enabled based on the 
	// page number and number of pages, etc
	if (paginator.num_pages === 1 ) {
		$( '#btn-pager-next').prop( 'disabled', true); 
		$( '#btn-pager-last').prop( 'disabled', true );
		$( '#btn-pager-first').prop( 'disabled', true); 
		$( '#btn-pager-previous').prop( 'disabled', true ); 
	} else {
		if (paginator.num_pages === paginator.number) {
			$( '#btn-pager-next').prop( 'disabled', true); 
			$( '#btn-pager-last').prop( 'disabled', true ); 
		} else {
			$( '#btn-pager-next').prop( 'disabled', false ); 
			$( '#btn-pager-last').prop( 'disabled', false );
			$( '#btn-pager-next').click( function ( e ) {
				e.preventDefault();
				getPaginatorPage( paginator.number + 1 );
			});
			$( '#btn-pager-last').click( function ( e ) {
				e.preventDefault();
				getPaginatorPage( paginator.count );
			});
		};
		if (paginator.number === 1 ) {
			$( '#btn-pager-first').prop( 'disabled', true); 
			$( '#btn-pager-previous').prop( 'disabled', true ); 
		} else {
			$( '#btn-pager-first').prop( 'disabled', false ); 
			$( '#btn-pager-previous').prop( 'disabled', false ); 
			$( '#btn-pager-previous').click( function ( e ) {
				e.preventDefault();
				getPaginatorPage( paginator.number - 1 );
			});
			$( '#btn-pager-first').click( function ( e ) {
				e.preventDefault();
				getPaginatorPage( 1 );
			});
		};
	};
}

