# budgetApp

var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        }
    };

    return {
        addItem: function(type, des, val) {

            var newItem, ID;
            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Create new item based on 'exp' or 'inc' type
            if (type === 'expense') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'income') {
                newItem = new Income(ID, des, val)
            }

            // Push it in our data structure
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;

        },
        testing: function() {
            console.log(data);
        }
    }
    
})();
                


var UIController = (function() {
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDesription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDesription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },
        addListItem: function(obj, type) {
            var html;
            // 1. HTML string with placeholder text
            if(type === 'income'){
                html = '<div class="item clearfix" id="income-0" ><div class="item__description"> Salary </div><div class="right clearfix" ><div class="item__value"> +2, 100.00 </div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if(type === 'expense'){
                html = '<div class="item clearfix" id = "expense-0"><div class="item__description"> Apartment rent </div><div class="right clearfix"><div class="item__value" > -900.00 </div><div class="item__percentage"> 21 % </div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // 2. Replace the placeholder with actual data

            // 3. Insert HTML to the DOM
            document.querySelector('.expenses__list').insertAdjacentHTML('beforebegin', html)

        },
        getDOMstrings: function() {
            return DOMstrings;
        }
    }

})();

var controller = (function(budgetCtrl, UICtrl ) {

    var setupEventListeners = function() {

    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){

        if(event.which === 13) {
            ctrlAddItem();
        }

    });

    };
    
    var ctrlAddItem = function () {
        var newItem, input;
        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller

        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        // 3. Add the item to the UI
        UIController.addListItem(newItem, input.type);
        // 4. Calculate the budget

        // 5. Display the budget in the UI
    }
    
    return {
        init: function() {
            console.log('Application has started');
            setupEventListeners();
        }
    }    

})(budgetController, UIController);

controller.init();

var arr = [
    {
        id: 0
    },
    {
        id: 1
    }
];

//console.log(arr);



    