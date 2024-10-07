export const totalCalc = (group) => {
    let total = 0
    group.expenses.forEach(expense => { 
        let split = (expense.cost / (group.membersArr.length - 1)) 
        console.log(`Member's split of ${expense.name} = $${split.toFixed(2)}`)
        total += split * (group.membersArr.length - 1 - expense.paid.length)
    });

    return total.toFixed(2)
}

export const memberTotal = (member, group) => {
    let total = 0
    group.expenses.forEach(expense => { 
        let split = (expense.cost / (group.membersArr.length - 1))
        total = !expense.paid.contain(member) || !expense.payer.contain(member) ? total : total + split;
    });
    return total.toFixed(2)
}