export interface IApproval {
	id: string;
	dateStart: Date;
	dateEnd: Date;
	price: number;
	cancelled: boolean;
	userId: string;
	modelNumber: string;
}
