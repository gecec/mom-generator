import { App, Modal, Setting, TFile, Vault } from "obsidian";

export default class DeleteModal extends Modal {
	constructor(
		app: App,
		filePath: string,
		onSubmit: (result: boolean) => void,
	) {
		super(app);
		this.setContent(
			"Are you sure that you want to delete file:" + filePath + "?",
		);

		new Setting(this.contentEl).addButton((btn) =>
			btn
				.setButtonText("Yes")
				.setCta()
				.onClick(() => {
					this.close();
					onSubmit(true);
				}),
		);

		new Setting(this.contentEl).addButton((btn) =>
			btn
				.setButtonText("No")
				.setCta()
				.onClick(() => {
					this.close();
					onSubmit(false);
				}),
		);
	}
}
