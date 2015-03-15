function WSpace($workspace, factory) {

    if ($workspace == null) throw 'no workspace defined';
    if (factory == null) throw 'no factory defined';

    var self = this;

    function clone(object) {
        return JSON.parse(JSON.stringify(object));
    }

    this.addPlacement = function(model) {
        model = model || clone(factory.Defaults.placement);
        function onTableAddClick($placement) {
            self.addTable($placement);
        }
        function onPlacementRemoveClick($placement) {
            self.removePlacement($placement);
        }
        var $placement = factory.createPlacement(
            model.properties.size, onTableAddClick, onPlacementRemoveClick);
        $placement.data('model', model);
        $workspace.append($placement);
        model.tables.map(function(table) {
            self.addTable($placement, table);
        });
        return $placement;
    }

    this.removePlacement = function($placement) {
        if ($placement.hasClass('placement-container')) {
            return $placement.detach();
        } else {
            throw 'illegal argument';
        }
    }

    this.addTable = function($placement, model) {
        if (!$placement.hasClass('placement')) {
            $placement = $placement.children('.placement');
            if (!$placement.length) throw 'illegal argument';
        }
        model = model || clone(factory.Defaults.table);
        function onDrag(event, ui) {
            model.properties.position = ui.position;
        }
        var $table = factory.createTable(model.properties.size);
        $table.data('model', model);
        $table.draggable({
            containment : $placement,
            appendTo : $placement,
            drag : onDrag
        });
        $table.css(model.properties.position);
        $placement.append($table);
        return $table;
    }

    this.removeTable = function($table) {
        if ($table.hasClass('table')) {
            return $table.detach();
        } else {
            throw 'illegal argument';
        }
    }

    this.export = function() {
        var placements = [];
        $workspace.children().each(function() {
            $placement = $(this);
            var placement = $placement.data('model');
            $placement.find('.table').each(function() {
                placement.tables.push($(this).data('model'));
            });
            placements.push(placement);
        });
        return placements;
    }

    this.restore = function(placements) {
        self.clear();
        placements.map(function(placement) {
            self.addPlacement(placement);
        });
    }

    this.clear = function() {
        $workspace.empty();
    }

}


var PlacementFactory = {
    Defaults : {
        table : {
            name : 'Table',
            properties : {
                size : {
                    width : 64,
                    height : 64
                },
                position : {
                    top : 0,
                    left : 0
                }
            }
        },
        placement : {
            name : 'Placement',
            tables : [],
            properties : {
                size : {
                    width : 500,
                    height : 300
                }
            }
        }
    }
};

PlacementFactory.createTable = function(size) {
    var $table = $('<div class="table"/>')
        .css(size);
    return $table;
}

PlacementFactory.createPlacement = function(size, onTableAddClick, onRemoveClick) {
    var $container = $('<div class="placement-container"/>');
    var $toolbar = $('<div class="placement-toolbar"/>');

    var $addButton = $('<button>Add</button>');
    $addButton.on('click', function() {
        onTableAddClick($container);
    });
    $toolbar.append($addButton);
    
    var $widthInput = $('<input type="number"/>');
    $widthInput.val(size.width);
    $widthInput.on('change', function() {
        $container.data('model')
            .properties.size.width = this.value;
        $placement.css({
            width: this.value
        });
    });
    $toolbar.append($widthInput);
    
    var $heightInput = $('<input type="number"/>');
    $heightInput.val(size.height);
    $heightInput.on('change', function() {
        $container.data('model')
            .properties.size.height = this.value;
        $placement.css({
            height: this.value
        });
    });
    $toolbar.append($heightInput);

    var $removeButton = $('<button>Remove</button>');
    $removeButton.on('click', function() {
        onRemoveClick($container);
    });
    $toolbar.append($removeButton);   

    var $placement = $('<div class="placement"/>')
        .css(size);
    $container.append($toolbar).append($placement);
    return $container;
}