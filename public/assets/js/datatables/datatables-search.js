$(function () {
  $('#dataTable').dataTable()
  $('#reportsTable tfoot th').each(function () {
    var title = $(this).text();
    $(this).html('<input type="text" placeholder="Search ' + title + '" style="width:100%"/>');
  });
  $('#reportsTable').dataTable({
    destroy: true,
    dom: 'lBfrtip',
    buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
    initComplete: function () {
      this.api().columns().every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change clear', function () {
          if (that.search() !== this.value) {
            that
              .search(this.value)
              .draw();
          }
        });
      });
    }
  });

})
