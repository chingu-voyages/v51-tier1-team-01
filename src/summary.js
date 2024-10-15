import { memberStatus, totalCalc } from "./calcs.js";

export const getGroupSummary = (group) => {

	const { expenses } = group;
	
	if(expenses.length){
	return `<div id="summary-overview-section">

	${expenses.map(expense => {

		const memberOwes = (expense.cost / expense.members.length).toFixed(2)
		const totalOwing = memberOwes * (expense.members.length - 1 - expense.paid.length).toFixed(2)

		return `

		<div id="expense-summary-title">
			<h2>${expense.name}</h2>
		</div>
		<div id="expense-details">		
		${expense.members.map(member => {

			const status = memberStatus(member, expense)
			const paidClass = status == "Paid the bill" ? 'payer' : status == "Paid" ? 'paid' : 'unpaid'

			return paidClass == 'paid' || paidClass == 'unpaid' ? `
				<div id="member-summary-line">
					<p>${member.name} <span class="badge badge-${paidClass}">${paidClass}</span></p>
					<p>$${memberOwes}</p>
				</div>
			` : ""}).join("")}
			<div id="Subtotal">
				<p>Cost: $${expense.cost}</p>
				<p>Owed to <b>${expense.payer.name}:</b> $${totalOwing}</p>
			</div>

	`}).join("")}

	<div id="Total">Total cost: $${totalCalc(group)}</div>
	</div>`
} else {
	return `
		<div id="expense-summary-title">
			<p>Group has no expenses yet</p>
		</div>
	`
}
}

