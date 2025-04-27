export default class MomPluginLogic {
	static cleanseTaskName(title: string): string {
		return title
			.replace("- [ ] ", "")
			.replace(/\[/gi, "")
			.replace(/\]/gi, "")
			.replace(/\//gi, "<slash>")
			.replace(/\\/gi, "<backslash>");
	}

	static todayDateString(): string {
		const today: Date = new Date();

		let month = (today.getMonth() + 1).toString();
		if (today.getMonth() + 1 < 10) {
			month = "0" + month;
		}

		let day = today.getDate().toString();
		if (today.getDate() < 10) {
			day = "0" + day;
		}

		return today.getFullYear() + "-" + month + "-" + day;
	}

	static buildFileName(taskTitle: string): string {
		const cleanTitle = this.cleanseTaskName(taskTitle);
		if (cleanTitle == "") return "";
		const dateString = this.todayDateString();
		return dateString + " " + cleanTitle + ".md";
	}
}
