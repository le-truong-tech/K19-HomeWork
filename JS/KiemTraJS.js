const employees = [
    { id: 1, name: "Alice", age: 23, status: 'working' },
    { id: 3, name: "Bob", age: 25, status: 'working' },
    { id: 6, name: "John", age: 27, status: 'working' },
    { id: 8, name: "David", age: 23, status: 'quit_job' },
    { id: 10, name: "Eve", age: 20, status: 'working' },
];
const products = [
    { id: 1, name: "Phone", price: 1200 },
    { id: 2, name: "Laptop", price: 3000  },
    { id: 3, name: "Tab", price: 2000  },
    { id: 4, name: "PC", price: 800  },
    { id: 5, name: "Monitor", price: 1500  },
];
const orders = [
    { id: 1, employeeId: 1, productId: 4, quantity: 1 },
    { id: 2, employeeId: 3, productId: 2, quantity: 4 },
    { id: 3, employeeId: 1, productId: 5, quantity: 1 },
    { id: 4, employeeId: 6, productId: 1, quantity: 2 },
    { id: 5, employeeId: 3, productId: 5, quantity: 3 },
    { id: 6, employeeId: 8, productId: 1, quantity: 1 },
    { id: 7, employeeId: 10, productId: 3, quantity: 2 },
];
 // -----------------------------------------------------------
//---Products lookup table
const productsMap = new Map(products.map(p => [p.id, p]));

//---Employees lookup table
const employeesMap = new Map(employees.map(e => [e.id, e]));

//---Total quantity sold product
const totalSoldQuantityProductMap = (arr = []) => {
    if (!arr || arr.length === 0) return null;

    const salesLookup = new Map();
    for(const order of arr) {
        const currentQuantity = salesLookup.get(order.productId) || 0;
        salesLookup.set(order.productId, currentQuantity + order.quantity);
    }

    return salesLookup;
}

//---Total quantity sold product group employee
const totalSoldQuantityProductByEmployeeMap = (arr = []) => {
    if (!arr || arr.length === 0) return null;

    const salesLookup = new Map();
    for (const oder of arr) {
        const currentQuantity = salesLookup.get(oder.employeeId) || 0;
        salesLookup.set(oder.employeeId, currentQuantity + oder.quantity);
    }

    return salesLookup;
}

//Question 1: Get active working staff
const getWorkingEmployees = (arr = []) => arr.filter(e => e.status === "working");

//Question 2: Find the oldest staff
const getOdestEmployee = (arr = []) => arr.length ? arr.reduce((oldest, current) => oldest.age < current.age ? current : oldest) : null;

//Question 3: Find the cheapest item
const getCheapestProduct = (arr = []) => arr.length ? arr.reduce((cheapest, current) => cheapest.price > current.price ? current : cheapest) : null;

//Question 4:Find bestseller product
const getBestsellerProduct = (arr = []) => {
    if (!arr || arr.length === 0) return null;

    const salesLookup = totalSoldQuantityProductMap(orders);
    if (salesLookup === null) return null;

    let maxSold = -Infinity;
    let idBestsellerProduct = undefined;
    for (const [productId, quantity] of salesLookup) {
        if (maxSold < quantity) {
            if (productsMap.has(productId)) {
                maxSold = quantity
                idBestsellerProduct = productId
            }
        }
    }

    return {product: productsMap.get(idBestsellerProduct), maxSold};
}

//Question 5: Find top revenue product
const getTopRevenueProduct = (arr = []) => {
    if (!arr || arr.length === 0) return null;

    const salesLookup = totalSoldQuantityProductMap(orders);
    if (salesLookup === null) return null;

    let maxRevenue = -Infinity;
    let topRevenueProduct = null;
    for (const [productId, quantity] of salesLookup) {
        const revenueItem = productsMap.get(productId).price * quantity;
        if (maxRevenue < revenueItem) {
            maxRevenue = revenueItem;
            topRevenueProduct = productsMap.get(productId);
        }
    }

    return {topRevenueProduct, maxRevenue};
}

//Question 6: Find employee hightest sales item
const getTopSalesEmployee = (arr = []) => {
    if (!arr || arr.length === 0) return null;

    const salesLookup = new Map();
    for (const oder of arr) {
        const currentQuantity = salesLookup.get(oder.employeeId) || 0;
        salesLookup.set(oder.employeeId, currentQuantity + oder.quantity);
    }

    let maxSold = -Infinity;
    let topSaleEmployee = null;
    for (const [idEmployee, quantity] of salesLookup) {
        if (maxSold < quantity) {
            maxSold = quantity;
            topSaleEmployee = employeesMap.get(idEmployee);
        }
    }

    return  {topSaleEmployee, maxSold};
}

//Question 7: Find employee top revenue
const getTopRevenueEmployee = (arr = []) => {
    if (!arr || arr.length === 0) return null;

    const revenueEmployeesLookup = new Map();
    for (const order of arr) {
        currentRevenue = revenueEmployeesLookup.get(order.employeeId) || 0;
        revenueEmployeesLookup.set(order.employeeId, currentRevenue + order.quantity * productsMap.get(order.productId).price);
    }

    let maxRevenue = -Infinity;
    let topEmployee = null;
    for (const [idEmployee, revenue] of revenueEmployeesLookup) {
        if (maxRevenue < revenue) {
            maxRevenue = revenue;
            topEmployee = employeesMap.get(idEmployee);
        }
    }

    return {topEmployee, maxRevenue};
}

//Question 8: Find top revenue product for employee
const getTopProductEmployees = (arr = []) => {
    if (!arr || arr.length === 0) return null;

    const productsEmployeesLookup = new Map();
    for (const order of arr) {

        if (productsEmployeesLookup.has(order.employeeId)) {
            const currentProduct = productsEmployeesLookup.get(order.employeeId);
            console.log(currentProduct);
            const revenueProduct =  ((order.quantity || 0) * (productsMap.get(order.productId).price || 0));
            currentProduct[order.productId] = (currentProduct[order.productId] || 0 ) + revenueProduct;
            console.log("cuoi", currentProduct[order.productId]);
        }
        else {
            productsEmployeesLookup.set(order.employeeId, {[order.productId]: ((order.quantity || 0) * (productsMap.get(order.productId).price || 0))});
        }
    }
    console.log(productsEmployeesLookup);
    const topProductEmployees = new Map();
    for (const [idEmployee, product] of productsEmployeesLookup) {
        let maxRevenue = -Infinity;
        let idProduct = null;

        for (const [key, value] of Object.entries(product)) {
            if (maxRevenue < value) {
                maxRevenue = value;
                idProduct = key;
            }
        }

        const idNumberProduct= Number(idProduct);
        topProductEmployees.set(idEmployee, {nameEmployee: employeesMap.get(idEmployee).name, idProduct: idNumberProduct, nameProduct: productsMap.get(idNumberProduct), revenue: maxRevenue });
    }
    return topProductEmployees;
}

// -----------------------------------------------------------
console.log("Question 1: ", getOdestEmployee(employees));
console.log("Question 2: ", getWorkingEmployees(employees));
console.log("Question 3: ", getCheapestProduct(products));
console.log("Question 4: ", getBestsellerProduct(orders));
console.log("Question 5: ", getTopRevenueProduct(orders));
console.log("Question 6: ", getTopSalesEmployee(orders));
console.log("Question 7: ", getTopRevenueEmployee(orders));
console.log("Question 8: ", getTopProductEmployees(orders));