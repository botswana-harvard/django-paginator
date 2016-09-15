import json

from django.core import serializers
from django.core.paginator import Paginator, EmptyPage
from django.template.loader import render_to_string


class PaginatorMixin:

    paginate_by = 10
    paginator_template = 'django_paginator/paginator_row.html'

    def paginate_queryset(self, qs, page_number):
        """Returns a Paginator page object given a queryset and page number."""
        paginator = Paginator(qs, self.paginate_by)
        try:
            page = paginator.page(page_number)
        except EmptyPage:
            page = paginator.page(paginator.num_pages)
        return page

    def paginate_as_dict(self, qs, page_number):
        page = self.paginate_queryset(qs, page_number)
        data = {}
        page_data = {k: v for k, v in page.paginator.__dict__.items() if k != 'object_list'}
        page_data.update({'number': page.number})
        paginator_row = render_to_string(self.paginator_template, context=page_data)
        data.update({'paginator_row': paginator_row})
        data.update({'paginator': json.dumps(page_data)})
        data.update({'object_list': serializers.serialize('json', page.object_list)})
        return data

    def paginate_to_json(self, qs, page_number):
        """Returns a json object containing two serialized objects, the paginator and object_list.

        Note: In the .js, use JSON.parse for each object, for example:

            var object_list = JSON.parse( data.object_list );
            var paginator = JSON.parse( data.paginator );

        """
        return json.dumps(self.paginate_as_dict(qs, page_number))
