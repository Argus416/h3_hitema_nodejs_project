export function isDocumentValid(approvalStatuses) {
	let approvals = 0;
	let rejections = 0;

	for (let i = 0; i < approvalStatuses.length; i++) {
		if (approvalStatuses[i]) {
			approvals++;
		} else {
			rejections++;
		}
	}

	return approvals >= rejections;
}
