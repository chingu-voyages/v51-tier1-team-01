export const getGroupSummary = (group) => {
	const {groupName, membersArr, expenses} = group;

	const total = expenses.map(expense => expense.cost).reduce((total, num) => total + num);
	console.log(total)

	return `<div class="export-summary">
	<p class="total-group-expenses-title">Expenses statistics for the "${groupName}" group</p>
	<p class="total-group-expenses-members">Group members:
		<ol>
			${membersArr.map(member=>{return `
				<li>${member.name}</li>
			`}).join("")}
		</ol>
	</p>
	<p class="total-group-expenses">Total expenses: <span>${total}</span></p>
	<p class="total-group-paid">Paid: <span></span></p>
	<p class="total-group-unpaid">Unpaid: <span></span></p>
	<table>
		<tr>
			<th>Debtor</th>
			<th>Amount</th>
			<th>Payer</th>
		</tr>
		<tr>
			<td>Jessy Doe</td>
			<td>$100</td>
			<td>Jack</td>
		</tr>
		<tr>
			<td>Ben</td>
			<td>$150</td>
			<td>John</td>
		</tr>
		<tr>
			<td>Jack</td>
			<td>$50</td>
			<td>Jane Doe</td>
		</tr>
	</table>
	</div>`
}

