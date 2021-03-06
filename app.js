var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percantage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percantage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percantage = -1;
        }
    }
    Expense.prototype.getPercentage = function() {
        return this.percantage;
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // private function
    var calculateTotal = function(type) {
        var summ = 0;

        data.allItems[type].forEach(function(current){
             summ += current.value;
        });
        data.totals[type] = summ;
    }

    var data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1 // so if it's no value, cannot be persentage (so it's doesn't exist at some point)
    };

    return {
        addItem: function (type, des, val) {

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

        deleteItem: function(type, id) {
            var ids;
            ids = data.allItems[type].map(function(current){
                return current.id;
            });
            index = ids.indexOf(id);

            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
            
        },

        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('income');
            calculateTotal('expense');
            // calculate the budget : income - expenses
            data.budget = data.totals.income - data.totals.expense;

            // calculate the percentage of income that we spent
            if(data.totals.income > 0) {
                data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
            } else {
                data.percentage = -1;
            }
            
        },

        calculatePercentages: function() {
            data.allItems.expense.forEach(function(cur){
                cur.calcPercentage(data.totals.income);
            });
        },
        getPercantages: function() {
            var allPerc = data.allItems.expense.map(function(cur){
                return cur.getPercentage();
            });

            return allPerc;
        },
        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.income,
                totalExp: data.totals.expense
            };
        },

        testing: function () {
            console.log(data);
        }
    }

})();



var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDesription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        expensesContainer: '.expenses__list',
        incomeContainer: '.income__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDesription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem: function (obj, type) {
            var html, element;
            // 1. HTML string with placeholder text
            if (type === 'income') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-' + obj.id + '" ><div class="item__description">' + obj.description + '</div><div class="right clearfix" ><div class="item__value">' + obj.value + '</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'expense') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="expense-' + obj.id + '"><div class="item__description">' + obj.description + '</div><div class="right clearfix"><div class="item__value">' + obj.value + '</div><div class="item__percentage"> 21 % </div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // 2. Replace the placeholder with actual data

            // 3. Insert HTML to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', html)

        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);
        },

        clearFields: function () {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDesription + ', ' + DOMstrings.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function (current) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = '+ ' + obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = '- ' + obj.totalExp;

            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        getDOMstrings: function () {
            return DOMstrings;
        }
    }

})();
/**
 * GLOBAL APP CONTROLLER
 */
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            if (event.which === 13) {
                ctrlAddItem();
            }

        });

        document.querySelector(DOM.container).addEventListener('click', crtlDeleteItem);

    };

    var updateBudget = function () {
        var budget;
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. return budget
        budget = budgetCtrl.getBudget();
        // 3. Display the budget in the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();
        // 2. Read percentages from budget controller
        var perc = budgetCtrl.getPercantages();
        // 3. Update the UI with new percentages
        console.log(perc);
    };

    var ctrlAddItem = function () {
        var newItem, input;
        // 1. Get the field input data
        input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
            // 4. Clear fields
            UICtrl.clearFields();
            // 5. Calculate and update the budget
            updateBudget();
            // 6. Calculate and update the percentages
            updatePercentages();
        }
        
    }

    var crtlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            // 2. Delete the item from UI
            UICtrl.deleteListItem(itemID);
            // 3. Update and show the new budget
            updateBudget();
            // 4. Calculate and update the percentages
            updatePercentages();

        }
    }

    return {
        init: function () {
            console.log('Application has started');
            setupEventListeners();
            UICtrl.displayBudget({
                budget: 0,
                percentage: 0,
                totalInc: 0,
                totalExp: 0
            });
        }
    }

})(budgetController, UIController);

controller.init();

