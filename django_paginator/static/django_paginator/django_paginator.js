
function updatePaginatorRow( paginator, paginator_row ) {

	$( 'paginator-row').html( paginator_row );
	$( 'paginator-row').addClass( 'text-center' ); 
	$( '#spn-pager-pages' ).text( 'Page ' + paginator.number + '/' + paginator.num_pages );
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
				getSubjects( paginator.number + 1 );
			});
			$( '#btn-pager-last').click( function ( e ) {
				e.preventDefault();
				getSubjects( paginator.count );
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
				getSubjects( paginator.number - 1 );
			});
			$( '#btn-pager-first').click( function ( e ) {
				e.preventDefault();
				getSubjects( 1 );
			});
		};
	};
}

