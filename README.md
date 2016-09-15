# django-paginator
Paginator mixin for normal and AJAX views


###Usage

Install:

    pip install git+https://github.com/botswana-harvard/django-paginator@develop#egg=django-paginator

Import the javascript file into your template:

    <script type="text/javascript" charset="utf8" src="{% static "django_paginator/js/django_paginator.js" %}"></script>

In your template, at the base of your table, add:

    <div id="paginator-row"></div>

#### In the `view`:

If using AJAX, you can paginate a queryset like this:

    json_data = self.paginate_to_json(qs, self.kwargs.get('page', 1))

And return the json_data to your AJAX call:

    return HttpResponse(json_data, content_type='application/json')
    
For example:

    class MostRecentView(PaginatorMixin, View):
    
        paginate_by = 5
    
        def head(self, request, *args, **kwargs):
            return self.get(request, *args, **kwargs)
    
        def post(self, request, *args, **kwargs):
            return self.get(request, *args, **kwargs)
    
        def get(self, request, *args, **kwargs):
            if request.is_ajax():
                model = django_apps.get_model(*app_config.most_recent_models['subject'].split('.'))
                qs = model.objects.all().order_by('-created')
                json_data = self.paginate_to_json(qs, self.kwargs.get('page', 1))
                return HttpResponse(json_data, content_type='application/json')
            return None
    
#### In the `js` file:

To update the `paginator_row`, call `updatePaginatorRow` in the AJAX.done:

    updatePaginatorRow( paginator, paginator_row );


For example, your AJAX call might look like this (Note both `object_list` and `paginator` are parsed):

    function getSubjects( page_number ) {
    
        // Gets a paginated queryset of "somethings" and adds each row to the table.
        var ajCall = $.ajax({
            url: Urls['some_namespace:some_named_url']( page_number ),
            type: 'GET',
        });
    
        ajCall.done(function ( data ) {

            var object_list = JSON.parse( data.object_list );
            var paginator = JSON.parse( data.paginator );
            var paginator_row = data.paginator_row;
    
            // your function that handles the queryset
            updateMyTable( object_list );
    
            // django_paginator function to update paginator_row
            updatePaginatorRow( paginator, paginator_row );
    
        });
    
        ajCall.fail( function( jqXHR, textStatus, errorThrown ) {
            console.log( errorThrown );
        });
        
    }

We are reversing urls with `django_js_reverse`.

