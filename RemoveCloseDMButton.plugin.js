/**
 * @name RemoveCloseDMButton
 * @displayName RemoveCloseDMButton
 * @description Remove annoying close DM button from your Discord clients.
 * @author TestAccount666
 * @authorId 476368949651570688
 * @version 1.0.0
 * @invite N/A
 * @source https://github.com/TheBlackEntity/BetterDiscord-RemoveCloseDMButton
 * @updateUrl https://raw.githubusercontent.com/TheBlackEntity/BetterDiscord-RemoveCloseDMButton/master/RemoveCloseDMButton.plugin.js
 */
/*@cc_on
@if (@_jscript)

var shell = WScript.CreateObject("WScript.Shell");
shell.Popup("It looks like you've mistakenly tried to run me directly. That's not how you install plugins. \n(So don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);

@else@*/
class ButtonRemover {
    constructor() {
        this.observer = null;
    }

    removeElementsByClass(className) {
        const elements = document.querySelectorAll(`.${className}`);
        elements.forEach(element => element.remove());
    }

    startObserving() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.removeElementsByClass('closeButton__116c3');
                        }
                    });
                }
            });
        });

        this.observer.observe(document.body, { childList: true, subtree: true });
    }

    stopObserving() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
}



module.exports = (() => {
    const config = {
        info: {
            name: 'RemoveCloseDMButton',
            authors: [
                {
                    name: 'TestAccount666',
                    discord_id: '476368949651570688',
                    github_username: 'TheBlackEntity',
                },
            ],
            version: '1.0.0',
            description: 'Hide annoying close DM button from your Discord client.',
            github: 'N/A',
            github_raw: 'N/A',
        },
        changelog: [],
    };
    if (!global.ZeresPluginLibrary) {
        return class {
            constructor() { }
            load() {
                BdApi.showConfirmationModal(
                    'Library plugin is needed',
                    [`The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`],
                    {
                        confirmText: 'Download',
                        cancelText: 'Cancel',
                        onConfirm: () => {
                            require('request').get(
                                'https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js',
                                async (error, response, body) => {
                                    if (error) return require('electron').shell.openExternal('https://betterdiscord.app/Download?id=9');
                                    await new Promise((r) =>
                                        require('fs').writeFile(
                                            require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'),
                                            body,
                                            r,
                                        ),
                                    );
                                    window.location.reload();
                                },
                            );
                        },
                    },
                );
            }
            start() { }
            stop() { }
        };
    }
    return (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
            const {
                DiscordModules: { },
                Logger,
            } = Api;
            const {
                Webpack: { Filters, getModule },
            } = new BdApi(config.info.name);

            return class RemoveCloseDMButton extends Plugin {
                buttonRemover = new ButtonRemover();

                constructor() {
                    super();
                }

                removeButton() {
                    this.buttonRemover.removeElementsByClass('closeButton__116c3');
                }

                onStart() {
                    this.buttonRemover.startObserving();
                    this.removeButton();
                }

                onStop() {
                    this.buttonRemover.stopObserving();
                }
            };
        };
        return plugin(Plugin, Api);
    })(global.ZeresPluginLibrary.buildPlugin(config));
})();
/*@end@*/
