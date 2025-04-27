import {
	App,
	Editor,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";

import MomPluginLogic from "./plugin";
import DeleteModal from "delete-modal";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	rootFolder: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	rootFolder: "MOM",
};

export default class HelloWorldPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Greet",
			(evt: MouseEvent) => {
				// Called when the user clicks the icon.
				new Notice("Hello, World!");
			},
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000),
		);

		this.addCommand({
			id: "generate-mom",
			name: "Generate MOM for selected meetings",
			editorCallback: (editor: Editor) => {
				const selection = editor.getSelection();
				const tasks = selection.split("\n");
				const vault = this.app.vault;
				const rootFolder = this.settings.rootFolder;
				// check if folder exists
				const momFolder = vault.getFolderByPath(rootFolder);
				if (momFolder == null) {
					vault.createFolder(rootFolder);
				}

				for (const idx in tasks) {
					const fileName = MomPluginLogic.buildFileName(tasks[idx]);

					if (fileName == "") continue;
					const filePath = rootFolder + "/" + fileName;

					// check if file already exists or not
					const file = vault.getFileByPath(filePath);
					if (file == null) {
						vault.create(filePath, "");
					} else {
						console.warn("File already exists", filePath);
					}
				}
			},
		});

		this.addCommand({
			id: "delete-mom",
			name: "Delete MOM for a selected meeting",
			editorCallback: (editor: Editor) => {
				// get selected Text
				// check if only 1 meeting selected
				// check if title not empty
				// check if file exists
				// show popup with file path -> how to show popups
				// remove file -> how to remove files
				//
				const selection = editor.getSelection();
				const tasks = selection.split("\n");
				if (tasks.length != 1) {
					// show error
					new Notice(`Only one meeting can be selected for deletion`);
					console.warn(
						"Only one meeting can be selected for deletion",
					);
					return;
				}
				const fileName = MomPluginLogic.buildFileName(tasks[0]);
				if (fileName == "") return;
				const rootFolder = this.settings.rootFolder;
				const filePath = rootFolder + "/" + fileName;
				// check if file already exists or not
				const vault = this.app.vault;
				const file = vault.getFileByPath(filePath);
				if (file == null) {
					new Notice(`File ${filePath} doesn't exists`);
					console.warn(`File ${filePath} doesn't exists`);
					return;
				}

				new DeleteModal(this.app, filePath, (result) => {
					if (result) {
						vault.delete(file);
						new Notice(`Removed , ${filePath}!`);
					}
				}).open();
			},
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: HelloWorldPlugin;

	constructor(app: App, plugin: HelloWorldPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("root-folder-name")
			.setDesc("MOM root folder name")
			.addText((text) =>
				text
					.setPlaceholder("Enter folder name")
					.setValue(this.plugin.settings.rootFolder)
					.onChange(async (value) => {
						this.plugin.settings.rootFolder = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
