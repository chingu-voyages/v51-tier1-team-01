export const totalCalc = (group) => {
    let total = 0
    group.expenses.forEach(expense => { 
        let split = (expense.cost / (expense.friends.length - 1))
        console.log(`Member's split of ${expense.name} = $${split.toFixed(2)}`)
        total += split * (expense.friends.length - 1 - expense.paid.length)
    });

    return total.toFixed(2)
}