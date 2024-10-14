export const totalOutstandingCalc = (group) => {
    let total = 0
    group.expenses.forEach(expense => { 
        let split = (expense.cost / expense.members.length)
        // console.log(split)
        total += split * (expense.members.length - 1 - expense.paid.length)
    });
    return total.toFixed(2)
}

export const totalCalc = (group) => {
    let total = 0
    group.expenses.forEach(expense => { 
        total += expense.cost
    });
    return total.toFixed(2)
}

//Individual overall total for group
export const memberTotal = (member, group) => {
    let total = 0
    group.expenses.forEach(expense => { 
        let split = (expense.cost / (expense.members.length))
        let expenseMembers = expense.members.map(value => value.name)
        total = expense.payer.name == member || expense.paid.includes(member) || !expenseMembers.includes(member) ? total : total + split;
    });
    return `${total.toFixed(2)}`
}

//Individual status for expense
export const memberStatus = (member, expense) => {
    let split = (expense.cost / expense.members.length)
    return  member.name == expense.payer.name ? "Paid the bill" :
            expense.paid.includes(member.name) ? "Paid" :
            `Owes $${split.toFixed(2)}`;
}