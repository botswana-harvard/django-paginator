# django-paginator
Paginator mixin for normal and AJAX views


###Usage

Install:

    pip install git+https://github.com/botswana-harvard/django-paginator@develop#egg=django-paginator

Add to settings.INSTALLED_APPS:

    'django_paginator.apps.AppConfig'

Import the javascript file into your template:

    <script type="text/javascript" charset="utf8" src="{% static "django_paginator/js/django_paginator.js" %}"></script>

In your template, at the base of your table, add:

    <div id="paginator-row"></div>

#### In the `view`:

If using AJAX, you can paginate a queryset like this:

    json_data = self.paginate_to_json(qs, self.kwargs.get('page', 1))

And return the json_data to your AJAX call:

    return HttpResponse(json_data, content_type='application/json')
    
For example, if you are displaying a table of most recent records from model `Subject`:

    class MostRecentView(PaginatorMixin, View):
    
        paginate_by = 5
    
        def head(self, request, *args, **kwargs):
            return self.get(request, *args, **kwargs)
    
        def post(self, request, *args, **kwargs):
            return self.get(request, *args, **kwargs)
    
        def get(self, request, *args, **kwargs):
            if request.is_ajax():
                qs = Subject.objects.all().order_by('-created')
                json_data = self.paginate_to_json(qs, self.kwargs.get('page', 1))
                return HttpResponse(json_data, content_type='application/json')
            return None
    
#### In the `js` file:

To update the `paginator_row`, call `updatePaginatorRow` in the AJAX.done:

    updatePaginatorRow( paginator, paginator_row );
 
For example, your AJAX call might look like this (Note both `object_list` and `paginator` are parsed, `paginator_row` is not). Still keeping to the example above: 

    function getSubjects( page_number ) {
    
        // Gets a paginated queryset of model "Subject" and adds each row to the table.
        var ajCall = $.ajax({
            url: Urls['my-namespace:most-recent-view']( page_number ),  // see urls below, use a namepace if you can
            type: 'GET',
        });
    
        ajCall.done(function ( data ) {

            // the "page" of the queryset
            var object_list = JSON.parse( data.object_list );
            // the values that the django paginator added, number, num_pages, etc
            var paginator = JSON.parse( data.paginator );
            // rendered html of the paginator row
            var paginator_row = data.paginator_row;
    
            // your function that handles the queryset
            // and the table you are displaying
            updateMyTable( object_list );
    
            // django_paginator function to update paginator_row
            updatePaginatorRow( paginator, paginator_row );
    
        });
    
        ajCall.fail( function( jqXHR, textStatus, errorThrown ) {
            console.log( errorThrown );
        });
        
    }

We are reversing urls with `django_js_reverse`.

Lastly, `updatePaginatorRow` needs a function that will return the previous/next page of the queryset for the row buttons `click` events. The click event function is expected to be named `getPaginatorPage`. If you don't want to use that name just wrap your function:

    function getPaginatorPage( page_number ) {
        // wrapper for django_paginator row button click events
        return getSubjects( page_number );
    }

#### urls.py

To complete the example, add some urls

    url(r'^recent/(?P<model>[\w]+)/(?P<page>[\d]+)/', MostRecentView.as_view(), name='most-recent'),
    url(r'^recent/(?P<model>[\w]+)/', MostRecentView.as_view(), name='most-recent'),

### Troubleshooting

* `TemplateDoesNotExist: django_paginator/pager.html.` Check you added `django_paginator` to INSTALLED_APPS.
