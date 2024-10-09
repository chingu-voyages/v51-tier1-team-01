export const getGroupSummary = (id) => {
	return `<div class="export-summary">
	<p class="total-group-expenses">Total expenses: <span>$1000</span></p>
	<p class="total-group-paid">Paid: <span>$700</span></p>
	<p class="total-group-unpaid">Unpaid: <span>$300</span></p>
	<table>
		<tr>
			<th>Debtor (owes)</th>
			<th>Amount</th>
			<th>Payer (gets)</th>
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

